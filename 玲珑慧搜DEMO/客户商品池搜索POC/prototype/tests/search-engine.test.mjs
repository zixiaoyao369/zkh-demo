import assert from "node:assert/strict";
import test from "node:test";
import { createSearchIndex, deriveAliases, localSearch, searchIndex } from "../src/search-engine.js";

const makeProduct = (id, name, brand = "未填写品牌", model = "未填写型号", attributes = {}) => {
  const product = { id, name, brand, model, attributes };
  return { ...product, aliases: deriveAliases(product) };
};

const festo = makeProduct("festo", "FESTO/费斯托 双耳环安装件 SNC-63 174386", "未填写品牌", "未填写型号", { 库存编码: "174386", 分类: "气动元件", 材质: "碳钢" });
const vacuum = makeProduct("vacuum", "真空发生器模块 ZH10DS", "SMC", "ZH10DS", { 适用设备: "包装线真空吸取", 单位: "个" });
const screw = makeProduct("screw", "304 不锈钢内六角圆柱头螺钉", "通用", "M6×20", { 材质: "304不锈钢", 规格单位: "M6 x 20 mm" });
const ruler = makeProduct("ruler", "得力(deli)100cm不锈钢直尺与刻度尺子", "得力", "长度100cm", { 分类: "办公用品", 采购备注: "测量绘图尺子" });

test("cross-field brand and model fragments stay at the top", () => {
  const index = createSearchIndex([festo, vacuum, screw]);
  for (const query of ["festo", "费斯托", "snc", "festo snc", "snc 63", "SNC-63", "fetso snc"]) {
    const result = searchIndex(index, query);
    assert.equal(result.fallback, false, query);
    assert.equal(result.items[0].id, "festo", query);
  }
});

test("domain terms, custom attributes, units and full-width separators participate", () => {
  const index = createSearchIndex([festo, vacuum, screw]);
  for (const [query, expected] of [["采购真空吸取设备", "vacuum"], ["内六角螺丝 m6 20", "screw"], ["304螺钉", "screw"]]) {
    const result = searchIndex(index, query);
    assert.equal(result.fallback, false, query);
    assert.equal(result.items[0].id, expected, query);
  }
});

test("unrelated search returns a diversified top thirty fuzzy fallback", () => {
  const products = [festo, vacuum, screw, ...Array.from({ length: 45 }, (_, index) => makeProduct(`p${index}`, `通用工业物料 ${index}`, `品牌${index % 12}`, `X-${index}`, { 分类: index % 2 ? "电气元件" : "劳保用品" }))];
  const result = localSearch(products, "完全无关的检索词");
  assert.equal(result.fallback, true);
  assert.equal(result.items.length, 30);
  assert.ok(result.items.every((item) => item.confidence === "低"));
  assert.equal(new Set(result.items.map((item) => `${item.product.name}|${item.product.model}`)).size, result.items.length);
});

test("single Chinese characters and token pinyin recall the same product family", () => {
  const index = createSearchIndex([ruler, festo, vacuum, screw]);
  for (const query of ["尺", "尺子", "直尺", "chizi", "zhichi", "池子"]) {
    const result = searchIndex(index, query);
    assert.equal(result.fallback, false, query);
    assert.equal(result.items[0].id, "ruler", query);
  }
});

test("strong results are retained and the remainder is filled with related supplements", () => {
  const products = [ruler, ...Array.from({ length: 35 }, (_, index) => makeProduct(`extra-${index}`, `通用商品 ${index}`, `品牌${index}`, `A-${index}`, { 分类: index % 2 ? "办公用品" : "工业备件" }))];
  const result = localSearch(products, "池子");
  assert.equal(result.fallback, false);
  assert.equal(result.strongCount, 1);
  assert.equal(result.supplementCount, 29);
  assert.equal(result.items.length, 30);
  assert.equal(result.items[0].product.id, "ruler");
  assert.ok(result.items.slice(1).every((item) => item.confidence === "低" && item.supplement));
});

test("prebuilt index handles a ten-thousand-item POC pool and caps results", () => {
  const products = Array.from({ length: 10000 }, (_, index) => makeProduct(`bulk-${index}`, `工业备件 ${index}`, index === 7521 ? "FESTO" : `品牌${index % 50}`, index === 7521 ? "SNC-63" : `M${index % 24}-${index}`, { 规格: `${index % 12 + 1}mm`, 分类: index % 3 ? "紧固件" : "气动元件" }));
  const started = performance.now();
  const index = createSearchIndex(products);
  const result = searchIndex(index, "festo snc 63");
  assert.equal(result.items[0].id, "bulk-7521");
  assert.ok(result.items.length <= 30);
  assert.ok(performance.now() - started < 12000, "10k local index build/search should stay practical for a POC");
});
