import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { deriveAliases, normalize } from "./search-engine.js";
import { useLocalSearch } from "./use-local-search.js";
import {
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  FileArrowUp,
  FileXls,
  FunnelSimple,
  ImageSquare,
  MagnifyingGlass,
  Plus,
  Sparkle,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

const assetUrl = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
const templateUrl = assetUrl("客户商品池导入模板.xlsx");
const FIELD_ALIASES = {
  name: ["商品名称", "品名", "物料名称", "物料描述", "商品描述", "名称", "产品名称", "物品名称"],
  brand: ["品牌", "厂家", "制造商", "厂牌", "供应商品牌"],
  model: ["型号", "规格", "型号规格", "规格型号", "物料编码", "编码", "料号", "part number"],
  image: ["图片", "商品图片", "图", "image"],
};

function resolveColumn(headers, aliases) {
  return headers.findIndex((header) => aliases.some((alias) => normalize(header) === normalize(alias) || normalize(header).includes(normalize(alias))));
}

function findHeaderRow(matrix) {
  let best = { index: -1, score: -1 };
  matrix.slice(0, 30).forEach((row, index) => {
    const headers = row.map((cell) => String(cell || "").trim()).filter(Boolean);
    if (!headers.length) return;
    const recognized = Object.values(FIELD_ALIASES).reduce((sum, aliases) => sum + (headers.some((header) => aliases.some((alias) => normalize(header) === normalize(alias))) ? 1 : 0), 0);
    const score = recognized * 100 + Math.min(headers.length, 20);
    if (score > best.score) best = { index, score };
  });
  return best.index;
}

function dataUrlFromZip(zip, filePath) {
  const file = zip.file(filePath);
  if (!file) return null;
  return file.async("base64").then((base64) => {
    const ext = filePath.split(".").pop().toLowerCase();
    const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "gif" ? "image/gif" : "image/png";
    return `data:${mime};base64,${base64}`;
  });
}

async function extractEmbeddedImages(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const drawings = Object.keys(zip.files).filter((name) => /^xl\/drawings\/drawing\d+\.xml$/.test(name));
  const pairs = await Promise.all(drawings.map(async (drawingPath) => {
    const xml = await zip.file(drawingPath).async("text");
    const relPath = drawingPath.replace("xl/drawings/", "xl/drawings/_rels/") + ".rels";
    const relXml = zip.file(relPath) ? await zip.file(relPath).async("text") : "";
    const targets = {};
    for (const rel of relXml.matchAll(/<Relationship\b[^>]*>/g)) {
      const relationId = rel[0].match(/\bId="([^"]+)"/)?.[1];
      const target = rel[0].match(/\bTarget="([^"]+)"/)?.[1];
      if (!relationId || !target) continue;
      targets[relationId] = target.startsWith("/") ? target.slice(1) : `xl/drawings/${target}`.replace(/\/[^/]+\/\.\.\//g, "/").replace("xl/drawings/../", "xl/");
    }
    const result = [];
    for (const anchor of xml.matchAll(/<xdr:(?:twoCellAnchor|oneCellAnchor)[\s\S]*?<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g)) {
      const row = anchor[0].match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/)?.[1];
      const relationId = anchor[0].match(/r:embed="([^"]+)"/)?.[1];
      if (row !== undefined && relationId && targets[relationId]) result.push([Number(row), targets[relationId]]);
    }
    return result;
  }));
  const imageMap = new Map();
  for (const [row, path] of pairs.flat()) imageMap.set(row, await dataUrlFromZip(zip, path));
  return imageMap;
}

async function parseWorkbook(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // Preserve physical worksheet row numbers so drawing anchors resolve to the correct item row.
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", blankrows: true });
  const headerRowIndex = findHeaderRow(matrix);
  if (headerRowIndex < 0) throw new Error("未识别到表头。请确认第一张工作表至少包含一行字段名称。");
  const headers = matrix[headerRowIndex].map((cell) => String(cell).trim());
  const indexes = Object.fromEntries(Object.entries(FIELD_ALIASES).map(([key, aliases]) => [key, resolveColumn(headers, aliases)]));
  const fallbackNameIndex = indexes.name >= 0 ? indexes.name : headers.findIndex((header, index) => header && index !== indexes.image);
  if (fallbackNameIndex < 0) throw new Error("未识别到可用于检索的文本列。请在第一张工作表中保留至少一列商品描述。");
  const images = await extractEmbeddedImages(arrayBuffer).catch((error) => {
    console.warn("Embedded image extraction failed", error);
    return new Map();
  });
  const seen = new Set();
  let duplicates = 0;
  const products = matrix.slice(headerRowIndex + 1).map((row, offset) => {
    const attributes = Object.fromEntries(headers.map((header, index) => [header, String(row[index] || "").trim()]).filter(([header, value], index) => header && value && ![indexes.name, indexes.brand, indexes.model, indexes.image].includes(index)));
    const name = String(row[indexes.name >= 0 ? indexes.name : fallbackNameIndex] || "").trim();
    const brand = indexes.brand >= 0 ? String(row[indexes.brand] || "").trim() : "";
    const model = indexes.model >= 0 ? String(row[indexes.model] || "").trim() : "";
    const key = normalize(`${name}${brand}${model}${Object.values(attributes).join("")}`);
    if (!name && !brand && !model && !Object.keys(attributes).length) return null;
    if (seen.has(key)) { duplicates += 1; return null; }
    seen.add(key);
    const excelRow = headerRowIndex + 1 + offset;
    const product = { id: `${key}-${offset}`, name: name || Object.values(attributes)[0] || "未命名商品", brand: brand || "未填写品牌", model: model || "未填写型号", attributes, image: images.get(excelRow) || null };
    return { ...product, aliases: deriveAliases(product) };
  }).filter(Boolean);
  if (!products.length) throw new Error("文件中没有可导入的商品行。请至少填写商品名称、品牌或型号。");
  const schema = { name: indexes.name >= 0 ? headers[indexes.name] : `${headers[fallbackNameIndex]}（自动识别）`, brand: indexes.brand >= 0 ? headers[indexes.brand] : "未提供", model: indexes.model >= 0 ? headers[indexes.model] : "未提供", extra: Object.keys(products[0]?.attributes || {}) };
  return { products, duplicates, imageCount: products.filter((item) => item.image).length, schema };
}

function ProductImage({ src, name }) {
  return <div className="product-image">{src ? <img src={src} alt={name} /> : <ImageSquare size={28} weight="duotone" aria-label="未提供商品图片" />}</div>;
}

export function App() {
  const [screen, setScreen] = useState("home");
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [detail, setDetail] = useState(null);
  const fileInput = useRef(null);
  const searchState = useLocalSearch(products, query);
  const results = searchState.items;
  const interpretation = searchState.parsed.tokens.slice(0, 5);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".xlsx")) { setNotice({ type: "error", text: "仅支持 .xlsx 文件；旧版 .xls 无法可靠读取内嵌图片。" }); return; }
    setIsImporting(true); setNotice(null);
    try {
      const imported = await parseWorkbook(file);
      setProducts(imported.products); setImportSummary({ ...imported, fileName: file.name }); setQuery(""); setScreen("pool");
      setNotice({ type: "success", text: `已导入 ${imported.products.length} 条商品，正在本地构建多字段检索索引${imported.duplicates ? `，并自动跳过 ${imported.duplicates} 条重复数据` : ""}。` });
    } catch (error) { setNotice({ type: "error", text: error.message || "文件解析失败，请检查模板内容后重试。" }); }
    finally { setIsImporting(false); if (fileInput.current) fileInput.current.value = ""; }
  };

  const uploadProps = {
    onDragOver: (event) => { event.preventDefault(); setIsDragging(true); },
    onDragLeave: () => setIsDragging(false),
    onDrop: (event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0]); },
    onClick: () => !isImporting && fileInput.current?.click(),
  };

  const header = <header className="app-header"><button className="brand" onClick={() => setScreen("home")}><img src={assetUrl("linglong-icon.png")} alt="玲珑慧搜" /><span>客户商品池</span></button><nav><button className={screen === "home" ? "active" : ""} onClick={() => setScreen("home")}>首页</button><button className={screen === "pool" ? "active" : ""} onClick={() => products.length && setScreen("pool")}>商品检索</button></nav><div className="header-right"><span className="poc-chip"><Sparkle size={14} weight="fill" /> 本地检索 POC</span><span className="avatar">L</span><span className="user-name">采购运营</span></div></header>;

  return <div className="app-shell">
    {header}
    <input ref={fileInput} className="visually-hidden" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => handleFile(event.target.files?.[0])} />
    {notice && <div className={`toast ${notice.type}`} role="status">{notice.type === "success" ? <CheckCircle size={19} weight="fill" /> : <WarningCircle size={19} weight="fill" />}<span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="关闭提示"><X size={16} /></button></div>}
    {screen === "home" ? <main className="home-page">
      <section className="home-intro"><p className="eyebrow"><Sparkle size={15} weight="fill" /> 客户专属商品资产</p><h1>让客户商品，<br /><em>随时可被找到</em></h1><p>导入客户商品清单，建立可解释的本地商品池。即使输入谐音、错别字或采购描述，也能更快定位目标商品。</p></section>
      <section className="onboarding-grid" aria-label="商品池导入">
        <div className={`upload-zone ${isDragging ? "dragging" : ""}`} {...uploadProps} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && fileInput.current?.click()}>
          <div className="upload-illustration"><FileXls size={54} weight="duotone" /><span><UploadSimple size={18} weight="bold" /></span></div>
          <h2>{isImporting ? "正在解析商品文件…" : "拖拽 Excel 文件到这里，或点击选择"}</h2><p>仅支持 .xlsx，图片请直接嵌入“图片”列对应商品行</p><button className="primary-button" type="button" onClick={(event) => { event.stopPropagation(); fileInput.current?.click(); }} disabled={isImporting}><Plus size={18} weight="bold" /> 选择 Excel 文件</button><small>文件仅在当前浏览器处理，不会上传至服务器</small>
        </div>
        <aside className="template-panel"><div className="template-icon"><FileXls size={31} weight="duotone" /></div><div><p className="section-label">开始前</p><h2>下载 Excel 模板</h2><p>模板已预置字段与内嵌图片示例，按行填入即可导入。</p></div><div className="template-fields"><span>商品名称</span><span>品牌</span><span>型号</span><span>图片</span></div><a className="secondary-button" href={templateUrl} download><DownloadSimple size={18} weight="bold" /> 下载模板文件</a><small>支持商品名称、品牌、型号和内嵌图片</small></aside>
      </section>
      <section className="capability-line"><MagnifyingGlass size={21} weight="duotone" /><span><strong>导入后即可智能检索：</strong>谐音、错别字和采购意图描述，都能找到更相关的商品。</span></section>
    </main> : <main className="pool-page">
      <section className="success-strip"><div><CheckCircle size={30} weight="fill" /><span><strong>商品池已就绪</strong><small>{importSummary?.fileName} · 已导入 {products.length} 条商品，其中 {importSummary?.imageCount || 0} 条含内嵌图片</small></span></div><div className="strip-actions"><button className="subtle-button" onClick={() => fileInput.current?.click()}><UploadSimple size={16} weight="bold" /> 继续导入</button><a className="subtle-button" href={templateUrl} download><DownloadSimple size={16} weight="bold" /> 下载模板</a></div></section>
      <section className="search-section"><div className="search-box"><MagnifyingGlass size={25} weight="bold" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品名称、品牌、型号、规格或任意导入字段" /><button aria-label="清除搜索" className={query ? "clear visible" : "clear"} onClick={() => setQuery("")}><X size={18} /></button><button className="search-button"><MagnifyingGlass size={17} weight="bold" /> 搜索</button></div><p className="search-helper"><Sparkle size={15} weight="fill" /> 支持多词组合、型号片段、拼音、错别字、规格单位和任意导入字段。试试：<button onClick={() => setQuery("festo snc")}>festo snc</button><button onClick={() => setQuery("内六角螺丝")}>内六角螺丝</button></p>{query && <div className="interpretation"><span>已解析</span>{interpretation.length ? interpretation.map((term) => <b key={term}>{term}</b>) : <b>按全部导入字段综合匹配</b>}<small>{searchState.ready ? `本地多路索引 · ${searchState.elapsed || 0}ms` : "正在构建本地检索索引…"}</small></div>}</section>
      <section className="results-section"><div className="results-head"><div><span>{searchState.loading ? "本地索引" : searchState.fallback ? "模糊推荐" : "商品池"}</span><strong>{searchState.loading ? "正在生成可检索商品索引…" : searchState.fallback ? `未找到强匹配，推荐 ${results.length} 条相似商品` : query ? `找到 ${results.length} 条强匹配结果` : `展示前 ${results.length} 条商品`}</strong></div><button className="filter-button"><FunnelSimple size={17} /> 筛选</button></div>{searchState.fallback && <div className="fallback-note"><Sparkle size={16} weight="fill" /> 未命中可靠的强匹配，以下按名称、别名、拼音、型号片段与字符相似度排序，最多展示 30 条；请确认品牌、型号或规格。</div>}{searchState.loading ? <div className="index-loading"><Sparkle size={24} weight="fill" /><strong>正在为 {products.length} 条商品建立本地索引</strong><span>索引完成后即可使用精确、容错与模糊检索。</span></div> : results.length ? <div className="product-table" role="table"><div className="table-head" role="row"><span>商品</span><span>品牌</span><span>型号 / 规格</span><span>匹配方式</span><span>操作</span></div>{results.map(({ product, reason, confidence }) => <div className="table-row" role="row" key={product.id}><div className="product-cell"><ProductImage src={product.image} name={product.name} /><span><strong>{product.name}</strong><small>{product.model}</small></span></div><span>{product.brand}</span><span>{product.model}</span><span><i className={`match-tag ${confidence === "高" ? "exact" : ""} ${confidence === "低" ? "weak" : ""}`}>{reason}</i></span><button className="detail-link" onClick={() => setDetail(product)}>查看详情 <ArrowRight size={15} /></button></div>)}</div> : <div className="empty-results"><MagnifyingGlass size={36} weight="duotone" /><h2>商品池为空</h2><p>请先上传商品材料，系统会自动识别可检索字段。</p><button className="subtle-button" onClick={() => setScreen("home")}>返回上传</button></div>}</section>
    </main>}
    {detail && <div className="modal-backdrop" onMouseDown={() => setDetail(null)}><section className="detail-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDetail(null)} aria-label="关闭详情"><X size={18} /></button><ProductImage src={detail.image} name={detail.name} /><div><p className="section-label">客户商品详情</p><h2>{detail.name}</h2><dl><div><dt>品牌</dt><dd>{detail.brand}</dd></div><div><dt>型号 / 规格</dt><dd>{detail.model}</dd></div><div><dt>检索状态</dt><dd>已纳入当前客户商品池</dd></div></dl></div></section></div>}
  </div>;
}
