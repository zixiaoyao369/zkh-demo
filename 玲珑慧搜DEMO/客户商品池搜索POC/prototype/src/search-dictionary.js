// Customer-specific aliases can be appended here without changing the search engine.
export const STOP_WORDS = new Set(["找", "找下", "我要", "需要", "采购", "一个", "一下", "帮我", "的", "和", "与", "产品", "商品", "物料", "请", "有没有", "给我"]);

export const DOMAIN_GROUPS = [
  { name: "紧固件", terms: ["螺丝", "螺钉", "螺栓", "螺杆", "紧固件"] },
  { name: "内六角", terms: ["内六角", "内六角螺丝", "六角孔"] },
  { name: "外六角", terms: ["外六角", "六角头", "六角螺栓"] },
  { name: "不锈钢", terms: ["不锈钢", "304", "316"] },
  { name: "气动件", terms: ["气动", "气缸", "气缸安装件", "气动元件"] },
  { name: "真空", terms: ["真空", "真空发生器", "吸盘", "真空元件"] },
  { name: "电气件", terms: ["断路器", "空开", "空气开关", "接触器", "继电器", "电气元件"] },
  { name: "劳保", terms: ["手套", "劳保手套", "防护手套", "安全帽", "劳保"] },
  { name: "FESTO", terms: ["festo", "费斯托"] },
  { name: "SMC", terms: ["smc", "日本smc"] },
  { name: "施耐德", terms: ["schneider", "施耐德"] },
];

// Category clusters are intentionally data/config driven: adding a customer-specific
// product family only requires another entry here, not a special search code path.
export const CATEGORY_CLUSTERS = [
  {
    id: "measuring-ruler",
    name: "尺类量具",
    terms: ["尺", "尺子", "直尺", "水平尺", "卷尺", "钢尺", "卡尺", "游标卡尺", "角尺", "测量尺"],
    excludeTerms: ["尺寸", "尺度"],
  },
];
