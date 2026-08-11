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
const level = makeProduct("level", "高精度水平尺", "保联", "R200", { 分类: "量具" });
const tape = makeProduct("tape", "自动锁定卷尺", "得力", "5m", { 分类: "量具" });
const caliper = makeProduct("caliper", "不锈钢游标卡尺", "上工", "0-150mm", { 分类: "量具" });
const battery = makeProduct("battery", "蓄电池", "超威", "6-DZF-12", { 分类: "电气元件" });
const sizeLabel = makeProduct("size-label", "设备尺寸标签", "通用", "100mm", { 分类: "标识" });
const mroClusterProducts = [
  makeProduct("fastener", "内六角螺栓", "通用", "M8×30"),
  makeProduct("tool", "铬钒钢活动扳手", "世达", "12寸"),
  makeProduct("cutting", "高速钢麻花钻头", "上工", "6mm"),
  makeProduct("pneumatic", "标准气缸", "SMC", "C95-32"),
  makeProduct("vacuum-part", "真空吸盘", "FESTO", "VAD-20"),
  makeProduct("hydraulic", "液压油缸", "力士乐", "HSG-80"),
  makeProduct("protection", "小型断路器", "施耐德", "iC65N"),
  makeProduct("control", "交流接触器", "施耐德", "LC1D"),
  makeProduct("automation", "光电传感器", "欧姆龙", "E3Z"),
  makeProduct("connection", "冷压接线端子", "魏德米勒", "OT-2.5"),
  makeProduct("bearing", "深沟球轴承", "SKF", "6204"),
  makeProduct("transmission", "同步带轮", "盖茨", "HTD-5M"),
  makeProduct("linear", "滚珠丝杆", "上银", "R20-5"),
  makeProduct("piping", "不锈钢球阀", "埃美柯", "DN25"),
  makeProduct("ppe", "防切割劳保手套", "安思尔", "8级"),
  makeProduct("packaging", "封箱胶带", "3M", "48mm"),
  makeProduct("cleaning", "工业除油清洁剂", "WD-40", "500ml"),
  makeProduct("office", "A4复印打印纸", "得力", "70g"),
];

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

test("category clusters rank measuring tools before homophone and descriptive noise", () => {
  const index = createSearchIndex([battery, sizeLabel, level, ruler, tape, caliper, festo]);
  const measuringIds = new Set(["level", "ruler", "tape", "caliper"]);
  for (const query of ["尺", "尺子", "chizi", "zhichi"]) {
    const result = searchIndex(index, query);
    const strong = result.items.filter((item) => !item.supplement);
    assert.equal(result.fallback, false, query);
    assert.ok(strong.length >= 4, query);
    assert.ok(strong.slice(0, 4).every((item) => measuringIds.has(item.id)), query);
    assert.ok(!strong.some((item) => item.id === "battery"), `${query} must not treat 电池 as a 尺类 strong match`);
    assert.ok(result.parsed.categoryClusters.some((cluster) => cluster.id === "measuring-ruler"), query);
  }
});

test("common industrial MRO clusters recall their product family with Chinese and pinyin queries", () => {
  const index = createSearchIndex([...mroClusterProducts, battery, sizeLabel, level, ruler, tape, caliper]);
  const cases = [
    ["螺丝", "fastener", "fasteners"], ["扳手", "tool", "hand-tools"], ["钻头", "cutting", "cutting-tools"],
    ["qigang", "pneumatic", "pneumatics"], ["真空", "vacuum-part", "vacuum"], ["油缸", "hydraulic", "hydraulics"],
    ["duanluqi", "protection", "electrical-protection"], ["接触器", "control", "electrical-control"], ["传感器", "automation", "automation-sensing"],
    ["端子", "connection", "electronic-connection"], ["zhoucheng", "bearing", "bearings"], ["皮带", "transmission", "power-transmission"],
    ["丝杆", "linear", "linear-motion"], ["球阀", "piping", "valves-piping"], ["手套", "ppe", "safety-ppe"],
    ["胶带", "packaging", "packaging"], ["清洁剂", "cleaning", "cleaning"], ["打印纸", "office", "office-supplies"],
  ];
  for (const [query, expectedId, clusterId] of cases) {
    const result = searchIndex(index, query);
    assert.equal(result.fallback, false, query);
    assert.equal(result.items[0].id, expectedId, query);
    assert.ok(result.parsed.categoryClusters.some((cluster) => cluster.id === clusterId), query);
  }
});

test("exact model and brand matches rank ahead of category-only expansion", () => {
  const exact = makeProduct("exact", "通用紧固件", "FESTO", "SNC-63", { 分类: "气动元件" });
  const related = makeProduct("related", "FESTO气缸安装支架", "FESTO", "C95", { 分类: "气动元件" });
  const result = searchIndex(createSearchIndex([related, exact, ...mroClusterProducts]), "festo snc 63");
  assert.equal(result.items[0].id, "exact");
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
