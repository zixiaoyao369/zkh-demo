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
// `coreTerms` are high-confidence category signals; `synonyms` expand the family;
// `pinyinAliases` are word-level spellings only, never single-character homophones.
export const CATEGORY_CLUSTERS = [
  {
    id: "measuring-ruler",
    displayName: "尺类量具",
    priority: 88,
    coreTerms: ["尺子", "直尺", "水平尺", "卷尺", "钢尺", "卡尺", "游标卡尺", "角尺", "测量尺"],
    synonyms: ["尺", "量尺", "卷皮尺", "高度尺", "塞尺"],
    pinyinAliases: ["chizi", "zhichi", "shuipingchi", "juanchi", "gangchi", "kaichi"],
    excludeTerms: ["尺寸", "尺度"],
  },
  { id: "fasteners", displayName: "紧固件", priority: 84, coreTerms: ["螺丝", "螺钉", "螺栓", "螺母", "垫圈", "铆钉", "膨胀螺栓"], synonyms: ["紧固件", "螺杆", "自攻钉", "内六角螺丝", "六角螺栓", "平垫", "弹垫", "螺纹杆"], pinyinAliases: ["luosi", "luoding", "luoshuan", "luomu", "dianquan"], excludeTerms: [] },
  { id: "hand-tools", displayName: "手动工具", priority: 78, coreTerms: ["扳手", "钳子", "螺丝刀", "锤子", "套筒", "棘轮扳手"], synonyms: ["工具钳", "活扳手", "梅花扳手", "开口扳手", "起子", "改锥", "内六角扳手"], pinyinAliases: ["banshou", "qianzi", "luosidao", "chuizi"], excludeTerms: [] },
  { id: "cutting-tools", displayName: "切削工具", priority: 76, coreTerms: ["钻头", "铣刀", "丝锥", "板牙", "锯片", "砂轮"], synonyms: ["刀具", "麻花钻", "开孔器", "切割片", "磨片", "锉刀"], pinyinAliases: ["zuantou", "xidao", "sizhui", "jupian"], excludeTerms: [] },
  { id: "pneumatics", displayName: "气动件", priority: 86, coreTerms: ["气缸", "电磁阀", "气动阀", "气动接头", "气管", "气源处理器"], synonyms: ["气动元件", "气缸安装件", "气缸支架", "调压阀", "过滤减压阀", "快插接头"], pinyinAliases: ["qidong", "qigang", "diancifa", "qiguan"], excludeTerms: [] },
  { id: "vacuum", displayName: "真空件", priority: 86, coreTerms: ["真空发生器", "真空吸盘", "真空泵", "真空阀"], synonyms: ["真空元件", "吸盘", "真空过滤器", "负压发生器"], pinyinAliases: ["zhenkong", "zhenkongfashengqi", "xipan"], excludeTerms: [] },
  { id: "hydraulics", displayName: "液压件", priority: 84, coreTerms: ["液压缸", "液压阀", "液压泵", "液压油管", "液压接头"], synonyms: ["油缸", "油泵", "液压元件", "液压过滤器", "液压站"], pinyinAliases: ["yeya", "yougang", "yeyafa", "youbeng"], excludeTerms: [] },
  { id: "electrical-protection", displayName: "配电保护", priority: 85, coreTerms: ["断路器", "空气开关", "漏电保护器", "熔断器", "隔离开关"], synonyms: ["空开", "微型断路器", "塑壳断路器", "断路器附件"], pinyinAliases: ["duanluqi", "kongkai", "loudianbaohuqi"], excludeTerms: [] },
  { id: "electrical-control", displayName: "电气控制", priority: 85, coreTerms: ["接触器", "继电器", "按钮", "指示灯", "开关电源"], synonyms: ["中间继电器", "时间继电器", "按钮开关", "控制按钮", "接触器附件"], pinyinAliases: ["jiechuuqi", "jidianqi", "anniu", "zhishideng"], excludeTerms: [] },
  { id: "automation-sensing", displayName: "自动化与传感", priority: 84, coreTerms: ["PLC", "传感器", "变频器", "伺服电机", "编码器"], synonyms: ["可编程控制器", "接近开关", "光电传感器", "温度传感器", "伺服驱动器", "人机界面"], pinyinAliases: ["chuanganqi", "bianpinqi", "sifu", "jiejinkai guan"], excludeTerms: [] },
  { id: "electronic-connection", displayName: "电子连接", priority: 80, coreTerms: ["电池", "线缆", "端子", "连接器", "插头", "插座"], synonyms: ["蓄电池", "电缆", "接线端子", "航空插头", "接插件", "线束"], pinyinAliases: ["dianchi", "xianlan", "duanzi", "lianjieqi"], excludeTerms: [] },
  { id: "bearings", displayName: "轴承", priority: 83, coreTerms: ["轴承", "滚珠轴承", "滚针轴承", "带座轴承"], synonyms: ["深沟球轴承", "调心轴承", "轴承座", "关节轴承"], pinyinAliases: ["zhoucheng", "gunzhuzhoucheng"], excludeTerms: [] },
  { id: "power-transmission", displayName: "传动件", priority: 80, coreTerms: ["皮带", "链条", "齿轮", "联轴器", "减速机"], synonyms: ["同步带", "三角带", "链轮", "传动链", "皮带轮", "涨紧轮"], pinyinAliases: ["pidai", "liantiao", "chilun", "lianzhouqi"], excludeTerms: [] },
  { id: "linear-motion", displayName: "直线运动件", priority: 80, coreTerms: ["滑轨", "导轨", "丝杆", "滑块", "直线轴承"], synonyms: ["线性导轨", "滚珠丝杆", "导轨滑块", "直线模组"], pinyinAliases: ["huagui", "daogui", "sigang", "huakuai"], excludeTerms: [] },
  { id: "valves-piping", displayName: "管路阀门", priority: 79, coreTerms: ["阀门", "法兰", "管件", "软管", "密封件"], synonyms: ["球阀", "蝶阀", "截止阀", "止回阀", "弯头", "三通", "管箍", "密封圈", "O型圈"], pinyinAliases: ["famen", "falan", "guanjian", "mifengjian"], excludeTerms: [] },
  { id: "safety-ppe", displayName: "劳保安全", priority: 75, coreTerms: ["手套", "口罩", "安全帽", "防护鞋", "护目镜", "消防器材"], synonyms: ["劳保手套", "防切割手套", "安全带", "耳塞", "灭火器", "防护服"], pinyinAliases: ["shoutao", "kouzhao", "anquanmao", "humu jing"], excludeTerms: [] },
  { id: "packaging", displayName: "包装耗材", priority: 70, coreTerms: ["胶带", "标签", "包装膜", "纸箱", "缠绕膜"], synonyms: ["封箱胶带", "不干胶标签", "气泡膜", "打包带", "收缩膜"], pinyinAliases: ["jiaodai", "biaoqian", "baozhuangmo"], excludeTerms: [] },
  { id: "cleaning", displayName: "清洁用品", priority: 68, coreTerms: ["清洁剂", "抹布", "拖把", "垃圾袋", "洗手液"], synonyms: ["除油剂", "消毒液", "擦拭纸", "工业擦拭布", "清洗剂"], pinyinAliases: ["qingjieji", "mobu", "tuoba"], excludeTerms: [] },
  { id: "warehouse-handling", displayName: "仓储搬运与起重设备", priority: 82, coreTerms: ["手动液压搬运车", "电动搬运车", "堆高车", "叉车", "平台车", "脚轮", "手拉葫芦", "托盘", "货架"], synonyms: ["托盘搬运车", "液压托盘车", "电动托盘车", "堆垛车", "平板推车", "万向轮", "工业脚轮", "倒链", "链条葫芦", "起重设备", "吊装带"], pinyinAliases: ["diniu", "banyunche", "duigaoche", "chache", "pingtaiche", "jiaolun", "shoulahulu"], excludeTerms: [] },
  { id: "office-supplies", displayName: "办公文具", priority: 65, coreTerms: ["打印纸", "笔", "文件夹", "订书机", "计算器"], synonyms: ["复印纸", "签字笔", "中性笔", "便签", "办公用品"], pinyinAliases: ["dayinzhi", "wenjianjia", "ding shu ji"], excludeTerms: [] },
];

// Strict equivalents only. Product-family relations stay in CATEGORY_CLUSTERS,
// so an adjacent item (for example a bolt versus a nut) is never promoted as a synonym.
export const SYNONYM_GROUPS = [
  { id: "screwdriver", canonical: "螺丝刀", aliases: ["改锥", "起子", "改刀"], english: ["screwdriver"], pinyinAliases: ["luosidao", "gaizhui", "qizi"], clusterId: "hand-tools" },
  { id: "wrench", canonical: "扳手", aliases: ["扳子", "板手"], english: ["wrench", "spanner"], pinyinAliases: ["banshou", "banzi"], clusterId: "hand-tools" },
  { id: "pliers", canonical: "钳子", aliases: ["工具钳", "钳"], english: ["pliers"], pinyinAliases: ["qianzi"], clusterId: "hand-tools" },
  { id: "tape-measure", canonical: "卷尺", aliases: ["皮尺", "卷皮尺", "软尺"], english: ["tape measure"], pinyinAliases: ["juanchi", "pichi"], clusterId: "measuring-ruler" },
  { id: "screw", canonical: "螺钉", aliases: ["螺丝", "螺丝钉"], english: ["screw"], pinyinAliases: ["luoding", "luosi"], clusterId: "fasteners" },
  { id: "oil-cylinder", canonical: "液压缸", aliases: ["油缸", "液压油缸"], english: ["hydraulic cylinder"], pinyinAliases: ["yeyagang", "yougang"], clusterId: "hydraulics" },
  { id: "vacuum-cup", canonical: "真空吸盘", aliases: ["吸盘", "真空杯"], english: ["vacuum cup", "suction cup"], pinyinAliases: ["zhenkongxipan", "xipan"], clusterId: "vacuum" },
  { id: "quick-connector", canonical: "快插接头", aliases: ["快插", "快速接头"], english: ["quick connector"], pinyinAliases: ["kuaicha", "kuaisujietou"], clusterId: "pneumatics" },
  { id: "breaker", canonical: "小型断路器", aliases: ["空开", "空气开关", "微型断路器"], english: ["MCB", "circuit breaker"], pinyinAliases: ["kongkai", "duanluqi"], clusterId: "electrical-protection" },
  { id: "contactor", canonical: "交流接触器", aliases: ["接触器"], english: ["contactor"], pinyinAliases: ["jiechuuqi"], clusterId: "electrical-control" },
  { id: "relay", canonical: "继电器", aliases: ["中间继电器", "控制继电器"], english: ["relay"], pinyinAliases: ["jidianqi"], clusterId: "electrical-control" },
  { id: "proximity-sensor", canonical: "接近传感器", aliases: ["接近开关", "接近感应器"], english: ["proximity sensor"], pinyinAliases: ["jiejinkaiguan", "jiejinchuanganqi"], clusterId: "automation-sensing" },
  { id: "plc", canonical: "可编程控制器", aliases: ["PLC", "可编程逻辑控制器"], english: ["programmable logic controller"], pinyinAliases: ["plc"], clusterId: "automation-sensing" },
  { id: "cable", canonical: "线缆", aliases: ["电缆", "电线"], english: ["cable", "wire"], pinyinAliases: ["xianlan", "dianlan"], clusterId: "electronic-connection" },
  { id: "terminal", canonical: "接线端子", aliases: ["端子", "压线端子"], english: ["terminal block", "terminal"], pinyinAliases: ["jiexian duanzi", "duanzi"], clusterId: "electronic-connection" },
  { id: "connector", canonical: "连接器", aliases: ["接插件", "插接件", "插头"], english: ["connector"], pinyinAliases: ["lianjieqi", "jiejian"], clusterId: "electronic-connection" },
  { id: "bearing-housing", canonical: "带座轴承", aliases: ["轴承座", "轴承座组件"], english: ["pillow block bearing"], pinyinAliases: ["daizuozhoucheng", "zhouchengzuo"], clusterId: "bearings" },
  { id: "linear-block", canonical: "导轨滑块", aliases: ["滑块", "滑轨块"], english: ["linear guide block"], pinyinAliases: ["daoguihuakuai", "huakuai"], clusterId: "linear-motion" },
  { id: "ball-screw", canonical: "滚珠丝杆", aliases: ["丝杠", "丝杆"], english: ["ball screw"], pinyinAliases: ["gunzhusigang", "sigang", "sigang"], clusterId: "linear-motion" },
  { id: "o-ring", canonical: "O型圈", aliases: ["密封圈", "O圈"], english: ["O-ring", "oring"], pinyinAliases: ["mifengquan", "oquan"], clusterId: "valves-piping" },
  { id: "ball-valve", canonical: "球阀", aliases: ["球形阀"], english: ["ball valve"], pinyinAliases: ["qiufa"], clusterId: "valves-piping" },
  { id: "cut-resistant-glove", canonical: "防切割手套", aliases: ["防割手套", "防割手套"], english: ["cut resistant glove"], pinyinAliases: ["fangqiegeshoutao", "fanggeshoutao"], clusterId: "safety-ppe" },
  { id: "carton-tape", canonical: "封箱胶带", aliases: ["胶带", "打包胶带"], english: ["packing tape", "carton sealing tape"], pinyinAliases: ["fengxiangjiaodai", "jiaodai"], clusterId: "packaging" },
  { id: "degreaser", canonical: "除油剂", aliases: ["脱脂剂", "除油清洁剂"], english: ["degreaser"], pinyinAliases: ["chuyouji", "tuozhiji"], clusterId: "cleaning" },
  // Warehouse equipment shares a category but not a meaning. `strict` prevents a
  // search for 地牛 from promoting stackers or forklifts into strong matches.
  { id: "manual-pallet-jack", canonical: "手动液压搬运车", aliases: ["地牛", "手动托盘搬运车", "液压托盘车", "手动搬运车", "手动地牛"], english: ["manual pallet jack", "hand pallet truck"], pinyinAliases: ["diniu", "shoudongyeyabanyunche", "shoudongtuopanbanyunche", "yeyatuopanche"], clusterId: "warehouse-handling", strict: true },
  { id: "electric-pallet-jack", canonical: "电动搬运车", aliases: ["电动地牛", "电动托盘搬运车", "电动托盘车", "电动搬运叉车"], english: ["electric pallet jack", "electric pallet truck"], pinyinAliases: ["diandongdiniu", "diandongbanyunche", "diandongtuopanche"], clusterId: "warehouse-handling", strict: true },
  { id: "stacker", canonical: "堆高车", aliases: ["堆垛车", "手动堆高车", "电动堆高车"], english: ["stacker", "pallet stacker"], pinyinAliases: ["duigaoche", "duoduoche"], clusterId: "warehouse-handling", strict: true },
  { id: "forklift", canonical: "叉车", aliases: ["工业叉车", "平衡重叉车", "电动叉车"], english: ["forklift"], pinyinAliases: ["chache", "diandongchache"], clusterId: "warehouse-handling", strict: true },
  { id: "platform-cart", canonical: "平台车", aliases: ["平板推车", "手推平台车"], english: ["platform trolley", "platform cart"], pinyinAliases: ["pingtaiche", "pingbantuiche"], clusterId: "warehouse-handling", strict: true },
  { id: "caster", canonical: "脚轮", aliases: ["万向轮", "万向脚轮", "工业脚轮"], english: ["caster", "castor"], pinyinAliases: ["jiaolun", "wanxianglun"], clusterId: "warehouse-handling", strict: true },
  { id: "chain-hoist", canonical: "手拉葫芦", aliases: ["倒链", "链条葫芦"], english: ["chain hoist", "manual chain hoist"], pinyinAliases: ["shoulahulu", "daolian", "liantiaohulu"], clusterId: "warehouse-handling", strict: true },
  { id: "copy-paper", canonical: "复印纸", aliases: ["打印纸", "A4纸"], english: ["copy paper", "printing paper"], pinyinAliases: ["fuyinzhi", "dayinzhi"], clusterId: "office-supplies" },
];
