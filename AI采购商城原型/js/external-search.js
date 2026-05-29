/**
 * 外部商城协同寻源 - 交互逻辑
 */
(function () {
  'use strict';

  // ========== 预设多渠道数据 ==========
  const MULTI_RESULTS = {
    zkh: [
      {
        id: 'zkh_001',
        name: 'M12六角螺栓 8.8级 镇锤',
        price: 1.20, delivery: '次日达', stock: '库存充足', emoji: '🔩',
        img: 'images/bolt.png',
        cat: '紧固件 › 螺栓', brand: '震坤行',
        source: 'zkh', sourceName: 'ZKH震坤行',
        sourceBadge: { text: 'ZKH自营', color: '#1a6fc4' },
        spec: 'M12×50mm，8.8级，镇锤', minQty: '50个',
        suppliers: [
          { name: 'ZKH震坤行', price: 1.20, delivery: '次日达', stock: '库存充足', tags: ['ZKH', '最优价'] },
          { name: '嘉兴标准件厂', price: 1.05, delivery: '3日达', stock: '库存充足', tags: ['制造商'] },
          { name: '中原紧固商城', price: 1.18, delivery: '2日达', stock: '库存充足', tags: [] }
        ]
      },
      {
        id: 'zkh_002',
        name: 'M10内六角螺钉 304不锈锤',
        price: 0.85, delivery: '次日达', stock: '库存充足', emoji: '🔩',
        img: 'images/inner_hex.png',
        cat: '紧固件 › 螺钉', brand: '氦工',
        source: 'zkh', sourceName: 'ZKH震坤行',
        sourceBadge: { text: 'ZKH自营', color: '#1a6fc4' },
        spec: 'M10×30mm，304不锈锤', minQty: '100个',
        suppliers: [
          { name: 'ZKH震坤行',    price: 0.85, delivery: '次日达',    stock: '库存充足', tags: ['ZKH', '最优价'] },
          { name: '沦工旗舰店',    price: 0.92, delivery: '3日达',    stock: '库存充足', tags: ['制造商'] }
        ]
      },
      {
        id: 'zkh_003',
        name: '标准六角螺栓套装 M8 碳锤镇锤',
        price: 0.45, delivery: '次日达', stock: '库存充足', emoji: '🔩',
        img: 'images/washer.png',
        cat: '紧固件 › 螺栓', brand: '震坤行',
        source: 'zkh', sourceName: 'ZKH震坤行',
        sourceBadge: { text: 'ZKH自营', color: '#1a6fc4' },
        spec: 'M8×20mm，碳锤，镇锌', minQty: '200个',
        suppliers: [
          { name: 'ZKH震坤行',    price: 0.45, delivery: '次日达',    stock: '库存充足', tags: ['ZKH', '最优价'] },
          { name: '汇邑标准件厂', price: 0.39, delivery: '3日达',    stock: '大量现货', tags: ['制造商'] }
        ]
      }
    ],
    jd: [
      {
        id: 'jd_001', name: 'M12六角螺栓 10.9级 镇锤', brand: '旭升紧固', spec: 'M12×60mm，10.9级，镇锤',
        img: 'images/bolt.png',
        price: 1.85, source: 'jd', sourceName: '京东工业',
        sourceBadge: { text: '京东自营', color: '#e77917' },
        delivery: '次日达', minQty: '50个', stock: '库存充足', emoji: '🔩',
        cat: '紧固件 › 螺栓',
        suppliers: [
          { name: '旭升紧固官方店', price: 1.85, delivery: '次日达', stock: '库存充足', tags: ['最优价'] },
          { name: '鑫展旺五金', price: 1.68, delivery: '3日达', stock: '库存充足', tags: ['制造商'] }
        ]
      },
      {
        id: 'jd_002', name: 'M12平垫圈 碳锤 镇锤', brand: '旭升紧固', spec: 'M12，碳锤，镇锤',
        img: 'images/washer.png',
        price: 0.12, source: 'jd', sourceName: '京东工业',
        sourceBadge: { text: '京东工业', color: '#e77917' },
        delivery: '次日达', minQty: '100个', stock: '库存充足', emoji: '🔩',
        cat: '紧固件 › 垫圈',
        suppliers: [
          { name: '旭升紧固官方店', price: 0.12, delivery: '次日达', stock: '库存充足', tags: ['最优价'] }
        ]
      },
      {
        id: 'jd_003', name: '正泰漏电断路器 NL1-63 2P 40A', brand: '正泰', spec: '2P，40A，30mA',
        img: 'images/breaker.png',
        price: 68, source: 'jd', sourceName: '京东工业',
        sourceBadge: { text: '京东工业', color: '#e77917' },
        delivery: '次日达', minQty: '1个', stock: '库存充足', emoji: '⚡',
        cat: '电气电工 › 开关电器',
        suppliers: [
          { name: '正泰电气旗舰店', price: 68, delivery: '次日达', stock: '库存充足', tags: ['最优价'] },
          { name: '华南电气配件', price: 65, delivery: '2日达', stock: '库存充足', tags: [] }
        ]
      }
    ],
    xiyu: [
      {
        id: 'xy_001', name: 'M8不锈锤内六角螺钉 304', brand: '氦工', spec: 'M8×25mm，304不锈锤',
        img: 'images/inner_hex.png',
        price: 0.45, source: 'xiyu', sourceName: '西域',
        sourceBadge: { text: '西域', color: '#7c3aed' },
        delivery: '2日达', minQty: '50个', stock: '库存充足', emoji: '🔫',
        cat: '紧固件 › 螺钉',
        suppliers: [
          { name: '西域自营', price: 0.45, delivery: '2日达', stock: '库存充足', tags: ['最优价'] },
          { name: '汇邑标准件', price: 0.40, delivery: '3日达', stock: '库存充足', tags: ['制造商'] }
        ]
      },
      {
        id: 'xy_002', name: 'Honeywell防护手套 2232 L', brand: 'Honeywell', spec: '丁腹涂层，L码',
        img: 'images/gloves.png',
        price: 12.5, source: 'xiyu', sourceName: '西域',
        sourceBadge: { text: '西域', color: '#7c3aed' },
        delivery: '3日达', minQty: '12双', stock: '有货', emoji: '🧤',
        cat: '劳保防护 › 手部防护',
        suppliers: [
          { name: '西域自营', price: 12.5, delivery: '3日达', stock: '有货', tags: ['最优价'] }
        ]
      }
    ],
    ali1688: [
      {
        id: 'ali_001', name: 'M10六角螺母 碳锤 8级', brand: '汇邑', spec: 'M10，碳锤，8级，镇锤',
        img: 'images/oring.png',
        price: 0.15, source: 'ali1688', sourceName: '1688',
        sourceBadge: { text: '1688', color: '#ff6a00' },
        delivery: '3-5日', minQty: '1000个', stock: '大量现货', emoji: '🔩',
        cat: '紧固件 › 螺母',
        suppliers: [
          { name: '汇邑标准件厂', price: 0.15, delivery: '3-5日', stock: '大量现货', tags: ['最优价'] },
          { name: '恒大紧固件', price: 0.13, delivery: '5-7日', stock: '现货', tags: [] }
        ]
      },
      {
        id: 'ali_002', name: 'M12内六角螺栓 12.9级 发黑', brand: '恒大', spec: 'M12×45mm，12.9级，发黑',
        img: 'images/bolt.png',
        price: 0.68, source: 'ali1688', sourceName: '1688',
        sourceBadge: { text: '1688', color: '#ff6a00' },
        delivery: '3-5日', minQty: '500个', stock: '大量现货', emoji: '🔮',
        cat: '紧固件 › 螺栓',
        suppliers: [
          { name: '恒大紧固件', price: 0.68, delivery: '3-5日', stock: '大量现货', tags: ['最优价'] },
          { name: '龙进标准件厂', price: 0.62, delivery: '5-7日', stock: '现货', tags: ['制造商'] }
        ]
      }
    ]
  };
  
  // 当前选中的渠道
  let currentSource = 'zkh';

  // 搜索结果缓存
  let cachedResults = {};
  let lastSearchKeyword = '';

  // ========== 类目树数据 ==========
  const CAT_TREE = [
    { name: '紧固件', children: [
      { name: '螺栓', children: ['六角螺栓', '内六角螺栓', '法兰面螺栓'] },
      { name: '螺钉', children: ['内六角螺钉', '十字螺钉', '自攻螺钉'] },
      { name: '螺母', children: ['六角螺母', '锁紧螺母', '法兰螺母'] },
      { name: '垫圈', children: ['平垫圈', '弹垫圈'] }
    ]},
    { name: '电气电工', children: [
      { name: '绝缘材料', children: ['绝缘胶带', '热缩管'] },
      { name: '开关电器', children: ['断路器', '接触器', '继电器'] },
      { name: '电线电缆', children: ['电力电缆', '布电线', '控制电缆'] }
    ]},
    { name: '劳保防护', children: [
      { name: '手部防护', children: ['防静电手套', '耐化学品手套', '焊接手套'] },
      { name: '面部防护', children: ['焊接面罩', '护目镜'] },
      { name: '呼吸防护', children: ['颗粒物防护口罩', '防毒面具'] }
    ]},
    { name: '五金工具', children: [
      { name: '扳手类', children: ['液压力矩扳手', '活动扳手', '棘轮扳手'] },
      { name: '钳子类', children: ['尖嘴钳', '管钳'] },
      { name: '锤子类', children: ['橡胶锤', '球头锤'] }
    ]},
    { name: '密封件', children: [
      { name: '密封圈', children: ['丁腈橡胶O型圈', '氟橡胶O型圈'] }
    ]},
    { name: '管阀', children: [
      { name: '管材管件', children: ['PPR管', 'PVC-U排水管', '镀锌管'] },
      { name: '法兰',    children: ['板式平焊法兰', '带颈对焊法兰', '盲板法兰'] },
      { name: '阀门',    children: ['不锈钢球阀', '明杆闸阀', '蝶阀'] }
    ]},
    { name: '润滑油脂', children: [
      { name: '润滑油', children: ['液压油'] },
      { name: '清洗剂', children: ['工业清洗剂'] }
    ]},
    { name: '清洁用品', children: [
      { name: '清洗剂', children: ['工业清洗剂'] }
    ]},
    { name: '仪器仪表', children: [
      { name: '流量计', children: ['电磁流量计', '涡街流量计'] },
      { name: '液位计', children: ['磁翻板液位计', '超声波液位计'] }
    ]},
    { name: '化工原料', children: [
      { name: '润滑油', children: ['液压油'] },
      { name: '清洗剂', children: ['工业清洗剂'] }
    ]}
  ];

  const BATCH_DATA = [
    { no: 1,  name: '离心泵',       spec: 'IH50-32-160',           qty: '2台',   status: 'found',     statusText: '已找到',    price: '¥2,850.00', supplier: '震坤行' },
    { no: 2,  name: '变频器',       spec: 'FR-E740-3.7K',          qty: '5台',   status: 'found',     statusText: '已找到',    price: '¥3,680.00', supplier: '震坤行' },
    { no: 3,  name: '钢板',         spec: 'Q235B 10mm',            qty: '20吨',  status: 'searching', statusText: '寻源中-48h', price: '-',          supplier: '-' },
    { no: 4,  name: '轴承',         spec: '6208-2RS',              qty: '50个',  status: 'found',     statusText: '已找到',    price: '¥45.00',    supplier: '震坤行' },
    { no: 5,  name: '特种陶瓷管',   spec: 'DN100 耐磨',             qty: '10根',  status: 'notfound',  statusText: '未找到',    price: '-',          supplier: '-' },
    { no: 6,  name: '液压油缸',     spec: 'HOB63/35-200',          qty: '3台',   status: 'found',     statusText: '已找到',    price: '¥1,250.00', supplier: '震坤行' },
    { no: 7,  name: '不锈钢法兰',   spec: 'DN80 PN16 304',         qty: '20片',  status: 'found',     statusText: '已找到',    price: '¥86.00',    supplier: '震坤行' },
    { no: 8,  name: '高温密封垫片', spec: 'DN150 石墨缠绕',         qty: '100片', status: 'searching', statusText: '寻源中-48h', price: '-',          supplier: '-' },
    { no: 9,  name: '防爆电机',     spec: 'YBX3-132M-4 7.5KW',    qty: '2台',   status: 'found',     statusText: '已找到',    price: '¥4,580.00', supplier: '震坤行' },
    { no: 10, name: '气动蝶阀',     spec: 'D671X-16 DN200',        qty: '8台',   status: 'found',     statusText: '已找到',    price: '¥920.00',   supplier: '震坤行' },
    { no: 11, name: '钛合金焊丝',   spec: 'ERTi-2 Φ2.0',          qty: '30kg',  status: 'notfound',  statusText: '未找到',    price: '-',          supplier: '-' },
    { no: 12, name: '耐酸碱泵',     spec: 'IHF50-32-160 氟塑料',   qty: '1台',   status: 'found',     statusText: '已找到',    price: '¥5,200.00', supplier: '震坤行' },
    { no: 13, name: '工业PLC',      spec: 'S7-1200 CPU1214C',      qty: '3套',   status: 'found',     statusText: '已找到',    price: '¥2,380.00', supplier: '震坤行' },
    { no: 14, name: '特种合金钢管', spec: 'Inconel625 DN50',        qty: '50米',  status: 'searching', statusText: '寻源中-48h', price: '-',          supplier: '-' },
    { no: 15, name: '温度传感器',   spec: 'PT100 L=200mm',         qty: '20支',  status: 'found',     statusText: '已找到',    price: '¥128.00',   supplier: '震坤行' },
  ];

  // ========== DOM 引用 ==========
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let currentTab = 'search';
  let currentKeyword = '';

  // ========== URL 参数处理 ==========
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      keyword: params.get('keyword') || '',
      mode: params.get('mode') || ''
    };
  }

  // ========== 初始化 ==========
  function init() {
    const { keyword, mode } = getUrlParams();

    // 填入关键词
    if (keyword) {
      $('#searchInput').value = keyword;
      currentKeyword = keyword;
    }

    // Tab 切换
    if (mode === 'batch') {
      switchTab('batch');
    }

    // 自动搜索
    if (keyword && mode === 'search') {
      setTimeout(() => doSearch(), 300);
    }

    // 绑定事件
    bindEvents();
  }

  function bindEvents() {
    // Tab 切换
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        switchTab(this.dataset.tab);
      });
    });

    // 搜索按钮
    $('#searchBtn').addEventListener('click', doSearch);

    // 搜索框回车
    $('#searchInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();
    });

    // 类目树按钮
    $('#catTreeBtn').addEventListener('click', function () {
      toggleCatTree();
    });

    // 类目树关闭按钮
    $('#catTreeClose').addEventListener('click', function () {
      closeCatTree();
    });

    // 类目树内搜索框
    $('#catTreeSearch').addEventListener('input', function () {
      filterCatTree(this.value.trim());
    });

    // 上传区域点击
    $('#uploadArea').addEventListener('click', simulateUpload);

    // 拖拽效果
    const uploadArea = $('#uploadArea');
    uploadArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', function () {
      this.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', function (e) {
      e.preventDefault();
      this.classList.remove('dragover');
      simulateUpload();
    });

    // 提交寻源需求
    $('#submitSourceBtn').addEventListener('click', submitSourcing);

    // 批量：底部操作按钮
    $('#addAllBtn').addEventListener('click', function () {
      var count = getCheckedCount();
      showToast('✓ 已将 ' + count + ' 件商品加入采购单');
    });

    $('#exportBtn').addEventListener('click', function () {
      showToast('📊 寻源结果已导出为Excel文件');
    });

    $('#batchListBtn').addEventListener('click', batchApplyListing);

    $('#submitNotfoundBtn').addEventListener('click', function () {
      var notfound = BATCH_DATA.filter(function (i) { return i.status === 'notfound'; }).length;
      showToast('🔍 已将 ' + notfound + ' 项未找到商品提交线下寻源，预计48小时内反馈');
    });

    // 统计卡片筛选
    $$('.stat-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var filter = this.dataset.filter;
        applyFilter(filter);
        $$('.stat-card').forEach(function (c) { c.classList.remove('active'); });
        $('#statAllBtn').classList.remove('active');
        this.classList.add('active');
      });
    });

    $('#statAllBtn').addEventListener('click', function () {
      applyFilter('all');
      $$('.stat-card').forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
    });

    // 全选复选框
    $('#checkAll').addEventListener('change', function () {
      var checked = this.checked;
      $$('#batchTableBody input[type="checkbox"]:not(:disabled)').forEach(function (cb) {
        cb.checked = checked;
      });
      updateSelectionUI();
    });
  }

  // ========== Tab 切换 ==========
  function switchTab(tab) {
    currentTab = tab;
    $$('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    $$('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === 'tab-' + tab);
    });
  }

  // ========== 搜索逻辑 ==========
  function doSearch() {
    const keyword = $('#searchInput').value.trim();
    if (!keyword) {
      showToast('请输入搜索关键词');
      return;
    }
    currentKeyword = keyword;
    lastSearchKeyword = keyword;

    // 显示 loading（一次性搜索所有渠道）
    showLoading();

    // 1.2 秒后一次性计算所有渠道结果并缓存
    setTimeout(() => {
      hideLoading();

      const kw = keyword.toLowerCase();
      const SOURCES = ['zkh', 'jd', 'xiyu', 'ali1688'];

      // 一次性计算所有渠道结果，存入缓存
      cachedResults = {};
      let totalAll = 0;
      SOURCES.forEach(src => {
        const items = (MULTI_RESULTS[src] || []).filter(item =>
          (item.name && item.name.toLowerCase().includes(kw)) ||
          (item.brand && item.brand.toLowerCase().includes(kw)) ||
          (item.spec && item.spec.toLowerCase().includes(kw))
        );
        cachedResults[src] = items;
        totalAll += items.length;
      });

      // 更新所有 Tab 上的数量标注
      updateTabCounts();

      if (totalAll === 0) {
        // 全渠道无结果：显示 sourceTabBar + allEmptyHint
        $('#sourceTabBar').style.display = 'block';
        $('#successBanner').innerHTML = '';
        $('#productGrid').innerHTML = '';
        $('#allEmptyHint').style.display = 'block';
        $('#resultsSection').classList.add('active');
        $('#noResultsPanel').classList.remove('active');
      } else {
        // 至少有一个渠道有结果
        $('#allEmptyHint').style.display = 'none';
        // 如果当前渠道无结果，切换到第一个有结果的渠道
        if (!cachedResults[currentSource] || cachedResults[currentSource].length === 0) {
          const firstWithResult = SOURCES.find(src => cachedResults[src] && cachedResults[src].length > 0);
          if (firstWithResult) currentSource = firstWithResult;
        }
        // 高亮当前渠道 Tab
        highlightTab(currentSource);
        // 直接渲染当前渠道结果（无需再次 loading）
        renderSourceResults(currentSource);
      }
    }, 1200);
  }

  // ========== 渲染指定渠道的缓存结果 ==========
  function renderSourceResults(src) {
    const items = cachedResults[src] || [];
    // 确保结果区可见、loading 已隐藏
    hideLoading();
    $('#sourceTabBar').style.display = 'block';
    $('#allEmptyHint').style.display = items.length === 0 ? 'block' : 'none';
    $('#resultsSection').classList.add('active');
    $('#noResultsPanel').classList.remove('active');
    // 渲染商品卡片
    showResults(lastSearchKeyword, items);
  }

  // ========== 更新所有渠道 Tab 数量标注 ==========
  function updateTabCounts() {
    const srcNames = { zkh: '震坤行', jd: '京东工业', xiyu: '西域', ali1688: '1688' };
    document.querySelectorAll('.src-tab').forEach(btn => {
      const src = btn.dataset.src;
      const cnt = (cachedResults[src] || []).length;
      btn.textContent = srcNames[src] + (cnt > 0 ? '(' + cnt + ')' : '');
    });
  }

  // ========== 高亮指定渠道 Tab ==========
  function highlightTab(src) {
    document.querySelectorAll('.src-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-src') === src);
    });
  }

  // ========== Loading ==========
  function showLoading() {
    $('#loadingSection').classList.add('active');
    $('#resultsSection').classList.remove('active');
    $('#noResultsPanel').classList.remove('active');
    $('#sourceTabBar').style.display = 'none';
    $('#allEmptyHint').style.display = 'none';
    // 更新 loading 文字：一次性搜索所有渠道
    const loadingTextEl = document.querySelector('.loading-text');
    if (loadingTextEl) loadingTextEl.textContent = '正在搜索多渠道商城...';
  }

  function hideLoading() {
    $('#loadingSection').classList.remove('active');
  }

  // ========== 有结果 ==========
  function showResults(keyword, results) {
    const section = $('#resultsSection');
    section.classList.add('active');
  
    // 显示渠道 Tab杠
    $('#sourceTabBar').style.display = 'block';
    $('#noResultsPanel').classList.remove('active');
  
    const srcDisplayNames = { zkh: 'ZKH 震坤行在线商城', jd: '京东工业', xiyu: '西域商城', ali1688: '1688工业品' };
    const srcName = srcDisplayNames[currentSource] || currentSource;

    if (results.length > 0) {
      $('#successBanner').style.cssText = '';
      $('#successBanner').innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        已从「${srcName}」为您找到 <strong>${results.length}</strong> 件相关商品（用时 1.2s）
        <span class="source-badge">${srcName}</span>
      `;
    } else {
      $('#successBanner').style.cssText = 'background:#fffbe6;border:1px solid #ffe58f;color:#ad6800;';
      $('#successBanner').innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ad6800" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        「${srcName}」暂未找到「${keyword}」相关商品，请切换其他渠道查看
      `;
    }

    $('#productGrid').innerHTML = results.map((item, idx) => {
      const supplierCount = item.suppliers ? item.suppliers.length : 1;
      const suppliersHtml = item.suppliers ? renderSupplierTable(item.suppliers, idx) : '';
      const brandTag = item.brand ? `<span class="card-brand-tag">${item.brand}</span>` : '';
      const catPath = item.cat ? `<div class="card-cat-path">${item.cat}</div>` : '';
      const srcLabel = item.sourceBadge
        ? `<span class="card-source" style="background:${item.sourceBadge.color}">${item.sourceBadge.text}</span>`
        : `<span class="card-source">${(item.sourceName || currentSource).toUpperCase()}</span>`;
      const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
      return `
      <div class="product-card">
        <div class="card-img">
          ${srcLabel}
          <span class="multi-supplier-badge">一品${supplierCount}商</span>
          ${item.img
            ? `<img src="${item.img}" style="width:100%;height:160px;object-fit:cover;background:#f5f5f5;display:block;" onerror="this.style.display='none'">`
            : (item.emoji || '📦')
          }
        </div>
        <div class="card-info">
          ${catPath}
          <div class="card-name">${brandTag}${item.name}</div>
          <div class="card-price">¥${item.price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
          <div class="card-meta">
            <span>📦 ${item.delivery}</span>
            ${item.minQty ? '<span>最小购: ' + item.minQty + '</span>' : ''}
          </div>
          <div class="card-stock">✓ ${item.stock}</div>
        </div>
        <div style="padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid #f0f0f0;">
          <button onclick="window._addToCart('${item.name.substring(0,10).replace(/'/g, String.fromCharCode(92)+String.fromCharCode(39))}')" style="flex:1;min-width:0;padding:6px 8px;background:#c0392b;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;white-space:nowrap;">加入采购单</button>
          <button onclick="applyListing(document.getElementById('item-data-${idx}').dataset.item)" style="flex:1;min-width:0;padding:6px 8px;background:#52c41a;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;white-space:nowrap;">申请上架</button>
          <input type="hidden" id="item-data-${idx}" data-item="${itemJson}">
        </div>
        ${suppliersHtml}
        <button class="expand-btn" data-idx="${idx}" onclick="window._toggleExpand(this, ${idx})">展开比价 ▼</button>
      </div>`;
    }).join('');
  }

  // ========== 渲染供应商比价表 ==========
  function renderSupplierTable(suppliers, idx) {
    const rows = suppliers.map((s, si) => {
      const isBest = s.tags && s.tags.includes('最优价');
      const tagsHtml = s.tags.map(t => {
        if (t === 'ZKH') return `<span class="supplier-tag supplier-tag-zkh">ZKH</span>`;
        if (t === '最优价') return `<span class="supplier-tag supplier-tag-best">最优价</span>`;
        if (t === '制造商') return `<span class="supplier-tag supplier-tag-mfr">制造商</span>`;
        return '';
      }).join('');
      const rowClass = isBest ? ' class="best-row"' : '';
      return `<tr${rowClass}>
        <td>${s.name}${tagsHtml}</td>
        <td class="supplier-price">¥${s.price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
        <td>${s.delivery}</td>
        <td>${s.stock}</td>
        <td><button class="supplier-add-btn" onclick="window._addToCart('${s.name.substring(0, 10)}')">采购</button></td>
      </tr>`;
    }).join('');

    return `<div class="supplier-expand" id="supplier-expand-${idx}" style="overflow-x:auto;">
      <table class="supplier-table" style="width:100%;table-layout:fixed;font-size:12px;">
        <colgroup><col style="width:34%"><col style="width:14%"><col style="width:14%"><col style="width:14%"><col style="width:24%"></colgroup>
        <thead><tr><th>供应商</th><th>单价</th><th>货期</th><th>库存</th><th>操作</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  // ========== 无结果 ==========
  function showNoResults(keyword) {
    const panel = $('#noResultsPanel');
    panel.classList.add('active');

    // 提示
    $('#noResultsHint').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ad6800" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      震坤行在线商城暂未找到「${keyword}」相关商品
    `;

    // 表单预填关键词
    $('#formDesc').value = keyword;

    // 重置表单状态
    $('#sourcingForm').style.display = '';
    $('#submitSuccess').classList.remove('active');
  }

  // ========== 提交寻源需求 ==========
  function submitSourcing() {
    const desc = $('#formDesc').value.trim();
    if (!desc) {
      showToast('请填写商品描述');
      return;
    }

    // 隐藏表单，显示成功状态
    $('#sourcingForm').style.display = 'none';
    const successEl = $('#submitSuccess');
    successEl.classList.add('active');

    // 生成需求编号
    const now = new Date();
    const dateStr = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    $('#successNo').textContent = '需求编号：XY-' + dateStr + '-001';
  }

  // ========== Excel 上传模拟 ==========
  function simulateUpload() {
    // 隐藏上传区
    $('#uploadArea').style.display = 'none';
    $('#downloadTemplate').style.display = 'none';

    // 显示进度条
    var progressWrap = $('#batchProgressWrap');
    var progressFill = $('#batchProgressFill');
    var progressText = $('#batchProgressText');
    progressWrap.classList.add('active');

    var total = BATCH_DATA.length;
    var processed = 0;
    var steps = 15; // 每次递增1项
    var intervalMs = 200; // 每0.2秒更新

    var timer = setInterval(function () {
      processed = Math.min(processed + 1, total);
      var pct = Math.round((processed / total) * 100);
      progressFill.style.width = pct + '%';
      progressText.textContent = '已处理 ' + processed + ' / ' + total + ' 项';

      if (processed >= total) {
        clearInterval(timer);
        // 延迟200ms后隐藏进度条，显示结果
        setTimeout(function () {
          progressWrap.classList.remove('active');
          renderBatchResults();
        }, 200);
      }
    }, intervalMs);
  }

  // ========== 渲染批量结果 ==========
  function renderBatchResults() {
    var batchResults = $('#batchResults');
    batchResults.classList.add('active');

    // 更新统计卡片数字
    var found = BATCH_DATA.filter(function (i) { return i.status === 'found'; }).length;
    var searching = BATCH_DATA.filter(function (i) { return i.status === 'searching'; }).length;
    var notfound = BATCH_DATA.filter(function (i) { return i.status === 'notfound'; }).length;

    $('#statFoundNum').textContent = found;
    $('#statSearchingNum').textContent = searching;
    $('#statNotfoundNum').textContent = notfound;

    // 未找到项按钮是否显示
    if (notfound === 0) {
      $('#submitNotfoundBtn').classList.add('hidden');
    } else {
      $('#submitNotfoundBtn').classList.remove('hidden');
    }

    // 渲染表格
    renderTableRows(BATCH_DATA);

    // 绑定行复选框事件（使用事件委托）
    $('#batchTableBody').addEventListener('change', function (e) {
      if (e.target.type === 'checkbox') {
        updateSelectionUI();
      }
    });

    // 初始更新统计
    updateSelectionUI();

    // 默认"全部"按钮高亮
    $('#statAllBtn').classList.add('active');
  }

  // ========== 渲染表格行 ==========
  function renderTableRows(data) {
    $('#batchTableBody').innerHTML = data.map(function (item) {
      var statusClass = 'status-found';
      if (item.status === 'searching') statusClass = 'status-searching';
      if (item.status === 'notfound') statusClass = 'status-notfound';

      var isFound = item.status === 'found';
      var rowClass = isFound ? '' : ' class="row-disabled"';
      var cbDisabled = isFound ? '' : ' disabled';
      var cbChecked = isFound ? ' checked' : '';

      return '<tr data-status="' + item.status + '"' + rowClass + '>' +
        '<td class="col-check"><input type="checkbox" data-no="' + item.no + '"' + cbChecked + cbDisabled + '></td>' +
        '<td>' + item.no + '</td>' +
        '<td><strong>' + item.name + '</strong></td>' +
        '<td>' + item.spec + '</td>' +
        '<td>' + item.qty + '</td>' +
        '<td class="col-price">' + item.price + '</td>' +
        '<td class="col-supplier">' + item.supplier + '</td>' +
        '<td><span class="status-tag ' + statusClass + '">' + item.statusText + '</span></td>' +
        '<td class="col-action">' + (isFound
          ? '<button class="btn-apply-listing" onclick="applyListingFromBatch(' +
            JSON.stringify(item.name) + ',' +
            JSON.stringify(item.spec) + ',' +
            JSON.stringify(item.price) + ',' +
            JSON.stringify(item.supplier) + ')">申请上架</button>'
          : '<span class="col-action-empty">-</span>') + '</td>' +
        '</tr>';
    }).join('');
  }

  // ========== 筛选表格行 ==========
  function applyFilter(filter) {
    var data = filter === 'all' ? BATCH_DATA : BATCH_DATA.filter(function (i) { return i.status === filter; });
    renderTableRows(data);
    // 重新绑定change事件（重新渲染后需要）
    updateSelectionUI();
  }

  // ========== 获取已选数量 ==========
  function getCheckedCount() {
    return $$('#batchTableBody input[type="checkbox"]:checked').length;
  }

  // ========== 更新已选统计UI ==========
  function updateSelectionUI() {
    var count = getCheckedCount();
    var selectedCountEl = $('#selectedCount');
    var addBtnCountEl = $('#addBtnCount');
    if (selectedCountEl) selectedCountEl.textContent = count;
    if (addBtnCountEl) addBtnCountEl.textContent = count;

    // 同步全选复选框状态
    var allEnabled = $$('#batchTableBody input[type="checkbox"]:not(:disabled)');
    var allChecked = $$('#batchTableBody input[type="checkbox"]:not(:disabled):checked');
    var checkAll = $('#checkAll');
    if (checkAll) {
      checkAll.indeterminate = allChecked.length > 0 && allChecked.length < allEnabled.length;
      checkAll.checked = allEnabled.length > 0 && allChecked.length === allEnabled.length;
    }
  }

  // ========== Toast ==========
  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // ========== 批量表格申请上架 ==========

  // 类目推断
  function inferCat(name) {
    if (/泵|阀|管/.test(name)) return '泵阀管件';
    if (/螺栓|螺钉|螺母/.test(name)) return '紧固件';
    if (/电|变频|开关|断路/.test(name)) return '电气电工';
    if (/轴承|齿轮|传动/.test(name)) return '传动件';
    if (/油缸|液压/.test(name)) return '液压气动';
    return '工业品';
  }

  // 图片映射
  function inferImg(name) {
    if (/离心泵|耐酸碱泵/.test(name)) return 'images/pump.jpg';
    if (/变频/.test(name)) return 'images/inverter.jpg';
    if (/轴承/.test(name)) return 'images/bearing.jpg';
    if (/液压油缸|油缸/.test(name)) return 'images/hydraulic.jpg';
    return 'images/default-product.jpg';
  }

  // 单个申请上架（批量导入行按钮）
  window.applyListingFromBatch = function (name, spec, price, supplier) {
    var params = new URLSearchParams({
      name: name,
      spec: spec,
      price: price,
      source: 'batch-import',
      sourceName: supplier
    });
    location.href = 'product-review.html?' + params.toString();
  };

  // 批量申请上架（底部按钮）
  function batchApplyListing() {
    // 获取所有勾选且状态为 found 的行
    var checkedNos = [];
    $$('#batchTableBody input[type="checkbox"]:checked').forEach(function (cb) {
      checkedNos.push(parseInt(cb.dataset.no, 10));
    });
    var targets = BATCH_DATA.filter(function (i) {
      return i.status === 'found' && checkedNos.indexOf(i.no) !== -1;
    });
    if (targets.length === 0) {
      showToast('请先勾选已找到的商品');
      return;
    }

    // 读取已有数据，合并写入
    var existing = [];
    try { existing = JSON.parse(localStorage.getItem('listedProducts') || '[]'); } catch (e) {}
    var now = Date.now();
    var newItems = targets.map(function (item, idx) {
      var priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return {
        id: now + idx,
        name: item.name,
        cat: inferCat(item.name),
        brand: '',
        spec: item.spec,
        price: priceNum,
        img: inferImg(item.name),
        badge: '已标准化',
        isNew: true,
        source: 'batch-import',
        supplier: item.supplier,
        listedAt: new Date().toISOString()
      };
    });
    localStorage.setItem('listedProducts', JSON.stringify(existing.concat(newItems)));

    showToast('✓ 已批量上架 ' + targets.length + ' 件商品，即将跳转商城...');
    setTimeout(function () {
      location.href = 'mall.html?newproduct=1';
    }, 3000);
  }

  // ========== 全局暴露 ==========
  window._addToCart = function (name) {
    showToast('\u2713 已加入采购单：' + name);
  };
  
  // 展开/收起比价表
  window._toggleExpand = function (btn, idx) {
    var panel = document.getElementById('supplier-expand-' + idx);
    if (!panel) return;
    var isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? '展开比价 ▼' : '收起比价 ▲';
  };
  
  // 切换渠道 Tab（直接从缓存渲染，无 loading）
  window.switchSourceTab = function (src, el) {
    currentSource = src;
    // 高亮当前 Tab
    document.querySelectorAll('.src-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    // 直接从缓存渲染，无需重新搜索
    if (lastSearchKeyword) {
      renderSourceResults(src);
    }
  };
  
  // 申请上架
  window.applyListing = function (itemData) {
    var item = typeof itemData === 'string' ? JSON.parse(itemData.replace(/&quot;/g, '"')) : itemData;
    var params = new URLSearchParams({
      source: item.source || 'zkh',
      sourceName: item.sourceName || 'ZKH震坤行',
      name: item.name || '',
      brand: item.brand || '',
      spec: item.spec || '',
      price: item.price || '',
      img: item.img || ''
    });
    location.href = 'product-review.html?' + params.toString();
  };
  
  // 跳转需求单页
  window.goDemandForm = function () {
    var kw = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
    location.href = 'demand-form.html?keyword=' + encodeURIComponent(kw);
  };

  // ========== 类目树 ==========
  let catTreeActiveL1 = 0;

  function renderCatTree(filterText) {
    var body = $('#catTreeBody');
    var q = (filterText || '').toLowerCase();

    // 构建一级列表
    var l1Html = CAT_TREE.map(function (l1, i) {
      // 统计叶子数
      var count = l1.children.reduce(function (n, l2) { return n + l2.children.length; }, 0);
      var isActive = (!q && i === catTreeActiveL1);
      // 搜索时：若此一级下有匹配项，也高亮
      var hasMatch = q && l1.children.some(function (l2) {
        return l2.name.toLowerCase().includes(q) || l2.children.some(function (l3) { return l3.toLowerCase().includes(q); });
      });
      var cls = 'cat-l1-item' + (isActive || hasMatch ? ' active' : '');
      return '<div class="' + cls + '" data-l1="' + i + '" onclick="window._catL1Click(' + i + ')">' +
        '<span>' + l1.name + '</span>' +
        '<span class="cat-badge">' + count + '</span>' +
        '</div>';
    }).join('');

    // 构建右侧二三级
    var activeL1Data = CAT_TREE[catTreeActiveL1];
    var l2l3Html = '';
    if (activeL1Data) {
      l2l3Html = activeL1Data.children.map(function (l2, j) {
        var l2Match = !q || l2.name.toLowerCase().includes(q);
        var matchL3s = q
          ? l2.children.filter(function (l3) { return l3.toLowerCase().includes(q) || l2.name.toLowerCase().includes(q); })
          : l2.children;
        if (q && matchL3s.length === 0) return '';
        var isOpen = !q || matchL3s.length > 0; // 搜索时自动展开
        var l3Tags = matchL3s.map(function (l3) {
          var hl = q && l3.toLowerCase().includes(q) ? ' highlight' : '';
          return '<span class="cat-l3-tag' + hl + '" onclick="window._catL3Click(\'' + l3.replace(/'/g, "\\'") + '\')">' + l3 + '</span>';
        }).join('');
        return '<div class="cat-l2-block">' +
          '<div class="cat-l2-header' + (isOpen ? ' open' : '') + '" onclick="window._catL2Toggle(this)">' +
          '<span class="cat-l2-arrow">▶</span>' + l2.name +
          '<span class="cat-badge" style="margin-left:auto">' + l2.children.length + '</span>' +
          '</div>' +
          '<div class="cat-l3-list' + (isOpen ? ' open' : '') + '">' + l3Tags + '</div>' +
          '</div>';
      }).join('');
    }

    body.innerHTML = '<div class="cat-l1-list" id="catL1List">' + l1Html + '</div>' +
      '<div class="cat-l2l3-area" id="catL2L3Area">' + l2l3Html + '</div>';
  }

  window._catL1Click = function (idx) {
    catTreeActiveL1 = idx;
    var q = $('#catTreeSearch').value.trim();
    renderCatTree(q);
  };

  window._catL2Toggle = function (header) {
    header.classList.toggle('open');
    var list = header.nextElementSibling;
    if (list) list.classList.toggle('open');
  };

  window._catL3Click = function (name) {
    $('#searchInput').value = name;
    closeCatTree();
    doSearch();
  };

  function toggleCatTree() {
    var panel = $('#catTreePanel');
    var btn = $('#catTreeBtn');
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeCatTree();
    } else {
      panel.classList.add('open');
      btn.classList.add('active');
      $('#catTreeSearch').value = '';
      renderCatTree('');
    }
  }

  function closeCatTree() {
    $('#catTreePanel').classList.remove('open');
    $('#catTreeBtn').classList.remove('active');
  }

  function filterCatTree(q) {
    // 搜索时：找到第一个有匹配的一级并激活
    if (q) {
      var found = CAT_TREE.findIndex(function (l1) {
        return l1.children.some(function (l2) {
          return l2.name.toLowerCase().includes(q) ||
            l2.children.some(function (l3) { return l3.toLowerCase().includes(q); });
        });
      });
      if (found >= 0) catTreeActiveL1 = found;
    }
    renderCatTree(q);
  }

  // ========== 启动 ==========
  document.addEventListener('DOMContentLoaded', init);
})();
