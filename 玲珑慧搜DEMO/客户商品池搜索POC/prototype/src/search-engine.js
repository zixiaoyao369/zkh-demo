import { pinyin } from "pinyin-pro";
import { DOMAIN_GROUPS, STOP_WORDS } from "./search-dictionary.js";

export const DISPLAY_LIMIT = 30;
export const normalize = (value = "") => String(value).normalize("NFKC").toLowerCase()
  .replace(/[\s\-_/.，。；;：:、()（）【】\[\]{}*×]/g, "");
export const toPinyin = (value = "") => pinyin(String(value), { toneType: "none", type: "array" }).join("").replace(/\s/g, "").toLowerCase();

const FIELD_WEIGHTS = { name: 36, brand: 66, model: 64, alias: 52, attribute: 28, code: 60, spec: 48 };
const MODEL_RE = /[A-Za-z]{1,10}(?:[-_/\s]*\d+[A-Za-z\d]*)+(?:[-_/\s]*[A-Za-z\d]+)*/g;
const VALUE_RE = /[A-Za-z]+(?:[-_/\s]*\d+[A-Za-z\d]*)*|\d+(?:\.\d+)?(?:mm|cm|m|kg|g|v|kv|a|ma|w|kw|mpa|bar|n|l|ml)?|[\u4e00-\u9fff]{2,}/gi;

function editDistance(left, right) {
  if (Math.abs(left.length - right.length) > 2) return 99;
  const rows = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let previous = rows[0]; rows[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const current = rows[j];
      rows[j] = Math.min(rows[j] + 1, rows[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return rows[right.length];
}

function ngrams(value, size = 2) {
  const text = normalize(value);
  if (!text) return [];
  if (text.length <= size) return [text];
  return Array.from({ length: text.length - size + 1 }, (_, index) => text.slice(index, index + size));
}

function dice(left, right) {
  const a = new Set(ngrams(left)); const b = new Set(ngrams(right));
  if (!a.size || !b.size) return 0;
  let overlap = 0; a.forEach((part) => { if (b.has(part)) overlap += 1; });
  return (2 * overlap) / (a.size + b.size);
}

function addVariant(target, value) {
  const text = String(value || "").trim();
  if (!text) return;
  target.add(text);
  const compact = normalize(text);
  if (compact.length > 1) target.add(compact);
  for (const part of text.match(VALUE_RE) || []) {
    if (normalize(part).length > 1) { target.add(part); target.add(normalize(part)); }
  }
  for (const part of text.match(MODEL_RE) || []) target.add(normalize(part));
}

function fieldType(key) {
  const text = normalize(key);
  if (/品牌|厂家|制造商|厂牌|brand/.test(text)) return "brand";
  if (/型号|规格|料号|编码|partnumber|sku/.test(text)) return /编码|料号|sku/.test(text) ? "code" : "spec";
  return "attribute";
}

export function deriveAliases({ name = "", brand = "", model = "", attributes = {} }) {
  const aliases = new Set();
  [brand, model, name, ...Object.values(attributes)].forEach((value) => addVariant(aliases, value));
  const allText = [name, brand, model, ...Object.values(attributes)].filter(Boolean).join(" ");
  for (const part of allText.split(/[\/／|｜]/)) {
    const latin = part.trim().match(/^[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})?/);
    const chinese = part.trim().match(/^[\u4e00-\u9fff]{2,8}/);
    if (latin) addVariant(aliases, latin[0]);
    if (chinese) addVariant(aliases, chinese[0]);
  }
  for (const group of DOMAIN_GROUPS) {
    if (group.terms.some((term) => normalize(allText).includes(normalize(term)))) group.terms.forEach((term) => aliases.add(term));
  }
  return [...aliases].filter((item) => normalize(item).length > 1);
}

function splitChinese(value) {
  const terms = new Set([value]);
  if (value.length > 2) for (let i = 0; i < value.length - 1; i += 1) terms.add(value.slice(i, i + 2));
  return [...terms];
}

export function parseQuery(query) {
  const raw = String(query || "").trim();
  const tokens = new Set();
  const intent = { raw, normalized: normalize(raw), tokens: [], expanded: [], categories: [] };
  for (const token of raw.toLowerCase().match(VALUE_RE) || []) {
    const cleaned = token.trim();
    if (!cleaned || STOP_WORDS.has(cleaned) || STOP_WORDS.has(normalize(cleaned))) continue;
    (/[\u4e00-\u9fff]/.test(cleaned) ? splitChinese(cleaned) : [cleaned]).forEach((part) => addVariant(tokens, part));
  }
  for (const group of DOMAIN_GROUPS) {
    if (group.terms.some((term) => intent.normalized.includes(normalize(term)))) {
      group.terms.forEach((term) => tokens.add(term));
      intent.categories.push(group.name);
    }
  }
  intent.tokens = [...tokens].filter((token) => normalize(token).length > 1);
  intent.expanded = intent.tokens.filter((token) => !intent.normalized.includes(normalize(token)));
  return intent;
}

function productFields(product) {
  return [
    { key: "品牌", type: "brand", value: product.brand },
    { key: "型号 / 规格", type: "model", value: product.model },
    { key: "商品名称", type: "name", value: product.name },
    ...Object.entries(product.attributes || {}).map(([key, value]) => ({ key, type: fieldType(key), value })),
    ...(product.aliases || []).map((value) => ({ key: "自动识别词", type: "alias", value })),
  ].filter((field) => field.value && !String(field.value).startsWith("未填写"));
}

function addPosting(postings, token, index) {
  const key = normalize(token);
  if (key.length < 2) return;
  if (!postings.has(key)) postings.set(key, new Set());
  postings.get(key).add(index);
}

export function createSearchIndex(products) {
  const lexical = new Map(); const phonetic = new Map(); const grams = new Map();
  const docs = products.map((product, index) => {
    const fields = productFields(product).map((field) => ({ ...field, compact: normalize(field.value), phonetic: toPinyin(field.value) }));
    const corpus = fields.map((field) => field.compact).join(" ");
    fields.forEach((field) => {
      addPosting(lexical, field.compact, index);
      for (const part of String(field.value).match(VALUE_RE) || []) addPosting(lexical, part, index);
      for (const part of String(field.value).match(MODEL_RE) || []) addPosting(lexical, part, index);
      addPosting(phonetic, field.phonetic, index);
      ngrams(field.compact).forEach((gram) => addPosting(grams, gram, index));
    });
    return { id: product.id, fields, corpus, phonetic: toPinyin(corpus), fingerprint: normalize(`${product.name}|${product.brand}|${product.model}`) };
  });
  return { docs, lexical, phonetic, grams, size: docs.length };
}

function candidateIndexes(index, parsed) {
  const candidates = new Set();
  parsed.tokens.forEach((token) => {
    const compact = normalize(token);
    [index.lexical.get(compact), index.phonetic.get(toPinyin(token))].forEach((set) => set?.forEach((id) => candidates.add(id)));
    ngrams(compact).forEach((gram) => index.grams.get(gram)?.forEach((id) => candidates.add(id)));
  });
  return candidates.size ? [...candidates] : index.docs.map((_, id) => id);
}

function matchToken(token, fields) {
  const wanted = normalize(token); const wantedPinyin = toPinyin(token); let best = null;
  for (const field of fields) {
    const base = FIELD_WEIGHTS[field.type] || 20; let score = 0; let reason = "";
    if (field.compact === wanted) { score = base + 90; reason = "精确命中"; }
    else if (field.compact.includes(wanted)) { score = base + (field.type === "model" || field.type === "brand" || field.type === "code" ? 64 : 42); reason = field.type === "model" || field.type === "code" ? "型号/编码命中" : "字段命中"; }
    else if (wanted.length >= 3 && field.compact.startsWith(wanted)) { score = base + 48; reason = "前缀命中"; }
    else if (wantedPinyin.length >= 3 && field.phonetic.includes(wantedPinyin)) { score = base + 29; reason = "拼音/谐音命中"; }
    else if (wanted.length >= 4 && field.compact.length <= wanted.length + 3 && editDistance(wanted, field.compact) <= 2) { score = base + 19; reason = "错别字容错"; }
    if (score && (!best || score > best.score)) best = { score, reason, field: field.key, token };
  }
  return best;
}

function fallbackScore(doc, parsed) {
  const literal = dice(parsed.normalized, doc.corpus);
  const phonetic = dice(toPinyin(parsed.raw), doc.phonetic);
  const overlap = parsed.tokens.reduce((sum, token) => sum + (doc.corpus.includes(normalize(token)) ? 0.16 : 0), 0);
  return literal * 60 + phonetic * 35 + overlap * 100;
}

function diversify(items, limit) {
  const picked = []; const fingerprints = new Set(); const primaryFamilies = new Set();
  for (const item of items) {
    const family = item.doc.fields.find((field) => field.type === "brand")?.compact || item.doc.fields.find((field) => field.type === "model")?.compact?.slice(0, 6) || "";
    if (fingerprints.has(item.doc.fingerprint)) continue;
    if (picked.length < Math.ceil(limit * 0.65) && family && primaryFamilies.has(family)) continue;
    picked.push(item); fingerprints.add(item.doc.fingerprint); if (family) primaryFamilies.add(family);
    if (picked.length === limit) break;
  }
  if (picked.length < limit) for (const item of items) if (!picked.includes(item) && !fingerprints.has(item.doc.fingerprint)) { picked.push(item); if (picked.length === limit) break; }
  return picked;
}

export function searchIndex(index, query, limit = DISPLAY_LIMIT) {
  const parsed = parseQuery(query); const displayLimit = Math.min(DISPLAY_LIMIT, Math.max(1, limit));
  if (!parsed.raw) return { items: index.docs.slice(0, displayLimit).map((doc) => ({ id: doc.id, confidence: "浏览", reason: "全部商品", score: 0, matches: [] })), fallback: false, parsed };
  const required = [...new Map(parsed.tokens.filter((token) => !parsed.expanded.includes(token)).map((token) => [normalize(token), token])).values()];
  const strong = candidateIndexes(index, parsed).map((docIndex) => {
    const doc = index.docs[docIndex]; const matches = parsed.tokens.map((token) => matchToken(token, doc.fields)).filter(Boolean);
    const coverage = required.length ? new Set(matches.filter((match) => required.some((token) => normalize(token) === normalize(match.token))).map((match) => normalize(match.token))).size / required.length : 0;
    return { doc, matches, coverage, score: matches.reduce((sum, match) => sum + match.score, 0) + coverage * 100 };
  }).filter((item) => {
    const minimumCoverage = required.length <= 2 ? 0.99 : parsed.categories.length ? 0.2 : 0.45;
    return item.matches.length && item.coverage >= minimumCoverage;
  }).sort((a, b) => b.score - a.score);
  if (strong.length) return { items: diversify(strong, displayLimit).map((item) => ({ id: item.doc.id, score: item.score, matches: item.matches, confidence: item.matches.some((match) => match.reason === "精确命中" || match.reason === "型号/编码命中") ? "高" : "中", reason: item.matches.map((match) => `${match.field}：${match.reason}`).filter((value, i, all) => all.indexOf(value) === i).slice(0, 2).join("；") })), fallback: false, parsed };
  const fuzzy = index.docs.map((doc) => ({ doc, score: fallbackScore(doc, parsed) })).sort((a, b) => b.score - a.score);
  return { items: diversify(fuzzy, Math.min(displayLimit, index.size)).map((item) => ({ id: item.doc.id, score: item.score, confidence: "低", reason: item.score > 9 ? "名称、别名或拼音相似" : "模糊推荐", matches: [] })), fallback: true, parsed };
}

export function localSearch(products, query, limit = DISPLAY_LIMIT) {
  const index = createSearchIndex(products); const outcome = searchIndex(index, query, limit);
  const productById = new Map(products.map((product) => [product.id, product]));
  return { ...outcome, items: outcome.items.map((item) => ({ ...item, product: productById.get(item.id) })) };
}

export const searchAdapter = { local: localSearch, remote: null };
