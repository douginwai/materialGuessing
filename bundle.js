
;(function() {
  var canvas = document.getElementById('gameCanvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'gameCanvas'
    canvas.width = 375; canvas.height = 667
    document.body.appendChild(canvas)
  }
  function resize() {
    var maxW = window.innerWidth, maxH = window.innerHeight
    var scale = Math.min(maxW / 375, maxH / 667)
    canvas.style.width = (375 * scale) + 'px'
    canvas.style.height = (667 * scale) + 'px'
    canvas.style.position = 'absolute'
    canvas.style.left = ((maxW - 375 * scale) / 2) + 'px'
    canvas.style.top = ((maxH - 667 * scale) / 2) + 'px'
    canvas.style.borderRadius = '12px'
    canvas.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
  }
  resize(); window.addEventListener('resize', resize)

  window.wx = {
    createCanvas: function() { return canvas },
    getSystemInfoSync: function() { return { pixelRatio: window.devicePixelRatio||1, screenWidth: 375, screenHeight: 667 } },
    setStorageSync: function(k,v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) {} },
    getStorageSync: function(k) { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return null } },
    onTouchStart: function(cb) {
      canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height; var t = e.touches[0]
        cb({ touches: [{ x: (t.clientX-r.left)*sx, y: (t.clientY-r.top)*sy }] })
      }, { passive: false })
      canvas.addEventListener('mousedown', function(e) {
        var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height
        window._touchD = { x: (e.clientX-r.left)*sx, y: (e.clientY-r.top)*sy }
      })
    },
    onTouchEnd: function(cb) {
      canvas.addEventListener('touchend', function(e) {
        e.preventDefault(); var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height; var t = e.changedTouches[0]
        cb({ changedTouches: [{ x: (t.clientX-r.left)*sx, y: (t.clientY-r.top)*sy }] })
      }, { passive: false })
      canvas.addEventListener('mouseup', function(e) {
        var r = canvas.getBoundingClientRect(); var sx = 375/r.width, sy = 667/r.height
        if (window._touchD) { cb({ changedTouches: [{ x: (e.clientX-r.left)*sx, y: (e.clientY-r.top)*sy }] }); window._touchD = null }
      })
    },
  }
})();

// ====== config.js ======
/**
 * 狐狸的烘焙坊 - 游戏配置
 */
window.GameConfig = {
  gameName: '🦊 狐狸的烘焙坊',
  version: '2.0.0',

  // 初始状态
  initialGold: 200,

  // 开局默认仓库食材
  initialInventory: {
    '小麦粉': 10, '黄油': 8, '白砂糖': 10, '鸡蛋': 8,
    '水': 5, '植物油': 5, '食用盐': 3, '酵母': 3,
    '牛奶': 5, '淡奶油': 3, '奶油': 3, '香草精': 3,
    '可可粉': 3, '巧克力': 2, '坚果': 2, '杏仁粉': 2,
  },

  // 开局默认发现的食谱
  initialRecipes: ['butterCookie', 'spongeCake', 'eggTart'],

  // 昼夜周期（毫秒）
  dayDuration: 3 * 60 * 1000,    // 3分钟
  nightDuration: 1 * 60 * 1000,  // 1分钟

  // 店铺等级
  shopLevels: [
    { level: 1, name: '烘焙小摊', upgradeCost: 0, maxCustomers: 2, menuSlots: 3, maxInventory: 30, maxOfflineHours: 2 },
    { level: 2, name: '面包小铺', upgradeCost: 200, maxCustomers: 3, menuSlots: 4, maxInventory: 40, maxOfflineHours: 4 },
    { level: 3, name: '甜品屋', upgradeCost: 500, maxCustomers: 4, menuSlots: 5, maxInventory: 50, maxOfflineHours: 6 },
    { level: 4, name: '人气烘焙坊', upgradeCost: 1200, maxCustomers: 5, menuSlots: 6, maxInventory: 60, maxOfflineHours: 8 },
    { level: 5, name: '米其林甜品殿堂', upgradeCost: 3000, maxCustomers: 6, menuSlots: 8, maxInventory: 80, maxOfflineHours: 12 },
  ],

  // 狐狸等级
  foxLevels: [
    { level: 1, name: '实习面点狐', icon: '🐣', serveSpeed: 1.0, exploreQuality: 1.0, customerFavor: 1.0, upgradeCost: 0 },
    { level: 2, name: '初级烘焙狐', icon: '🦊', serveSpeed: 1.2, exploreQuality: 1.0, customerFavor: 1.0, upgradeCost: 100 },
    { level: 3, name: '熟练甜点师', icon: '🥼', serveSpeed: 1.4, exploreQuality: 1.2, customerFavor: 1.1, upgradeCost: 300 },
    { level: 4, name: '金牌主厨狐', icon: '🔬', serveSpeed: 1.6, exploreQuality: 1.3, customerFavor: 1.2, upgradeCost: 800 },
    { level: 5, name: '烘焙食神', icon: '👑', serveSpeed: 2.0, exploreQuality: 1.5, customerFavor: 1.3, upgradeCost: 2000 },
  ],

  // 探索配置
  explore: {
    duration: 30 * 1000,  // 30秒
    baseIngredientCount: 1,
    maxIngredientCount: 3,
    spawnInterval: 25000,  // 顾客生成间隔（毫秒）
  },

  // 出餐配置
  serving: {
    baseTime: 5000,      // 基础制作时间 5秒
    eatTime: 3000,       // 顾客吃的时间 3秒
    settleDelay: 1000,   // 完成后延迟离开
  },

  // 顾客
  customer: {
    patienceMin: 20000,  // 最小耐心 20秒
    patienceMax: 35000,  // 最大耐心 35秒
    patienceTick: 500,   // 每 tick 减少量
    generateChance: 0.02, // 每 tick 生成概率
    baseTip: 1.0,
  },

  // 离线收益配置
  offline: {
    baseGoldPerMin: 10,
    goldPerLevel: 5,
  },

  // 食谱价格公式
  pricing: {
    basePerStar: 8,
    baseOffset: 5,
    masteryBonus: 0.05,  // 每级熟练度+5%
  },

  // 批发商
  wholesale: {
    basePrice: 3,       // 基础单价
    refreshCount: 5,    // 每次刷新5种
    refreshCost: 20,    // 刷新费用
  },

  // 主题色（烘焙暖色系）
  theme: {
    warmOrange: '#FF7A33',
    creamWhite: '#FFF8EE',
    grassGreen: '#4CAF50',
    tomatoRed: '#FF5252',
    eggYellow: '#FFD54F',
    darkText: '#3D3226',
    lightText: '#8B7E6F',
    cardBg: '#FFFFFF',
    labBlue: '#4FC3F7',
    tooltipBg: '#333333',
    nightBg: '#1a1a2e',
    nightCard: '#16213e',
    starGold: '#FFD700',
  },
}


// ====== questionBank.js ======
/**
 * 题库数据 - 50道题目
 */
window.QuestionBank = [
  // ========== 饮料区 (10题) ==========
  {
    id: 'beverage_001', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '果葡糖浆', '二氧化碳', '焦糖色', '磷酸', '咖啡因', '食用香精'],
    options: ['百事可乐', '可口可乐', '雪碧', '芬达'], answer: 1,
    foxComment: '可乐的区别？配方99%一样，剩下1%是两家公司的倔强。',
    knowledge: '一罐330ml可乐含糖约35g，接近WHO建议的每日糖摄入上限。'
  },
  {
    id: 'beverage_002', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '果葡糖浆', '柠檬酸', '食用香精', '柠檬酸钠', '维生素C', 'β-胡萝卜素'],
    options: ['鲜榨橙汁', '橙味汽水', '果粒橙', '柠檬茶'], answer: 1,
    foxComment: '鲜榨橙汁哪有这么多添加剂，你当橙子不要面子啊？',
    knowledge: '果葡糖浆是饮料中最常见的甜味剂，成本只有蔗糖的60%。'
  },
  {
    id: 'beverage_003', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '椰浆', '酪蛋白酸钠', '单硬脂酸甘油酯', '食用香精'],
    options: ['椰子水', '椰树牌椰汁', '旺仔牛奶', '豆奶'], answer: 1,
    foxComment: '白色液体不一定是牛奶，也可能是椰汁加了乳化剂。',
    knowledge: '酪蛋白酸钠是一种乳化剂，让椰浆和水不分离。'
  },
  {
    id: 'beverage_004', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '红茶', '柠檬酸', '柠檬酸钠', '维生素C', '食用香精'],
    options: ['奶茶', '冰红茶', '乌龙茶', '柠檬水'], answer: 1,
    foxComment: '冰红茶里的茶含量…你猜？反正够它叫"茶"就行。',
    knowledge: '冰红茶中的茶多酚含量远低于泡茶，主要甜味来自白砂糖。'
  },
  {
    id: 'beverage_005', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '柠檬酸', '柠檬酸钠', '氯化钠', '氯化钾', '维生素C', '维生素B6'],
    options: ['矿泉水', '运动饮料', '气泡水', '蜂蜜水'], answer: 1,
    foxComment: '喝完运动饮料才去运动？那你就白运动了。',
    knowledge: '运动饮料含电解质和糖，适合大量出汗后补充。'
  },
  {
    id: 'beverage_006', category: 'beverage', difficulty: 1,
    ingredients: ['水', '二氧化碳', '白砂糖', '柠檬酸', '食用香精'],
    options: ['苏打水', '雪碧', '可乐', '巴黎水'], answer: 1,
    foxComment: '透明气泡水+糖+香精=雪碧，和"天然"没有半毛关系。',
    knowledge: '无糖版用代糖替代白砂糖，但柠檬酸和香精依然存在。'
  },
  {
    id: 'beverage_007', category: 'beverage', difficulty: 1,
    ingredients: ['水', '浓缩苹果汁', '果葡糖浆', '柠檬酸', '维生素C'],
    options: ['纯苹果汁', '苹果味饮料', '苹果醋', '鲜榨苹果汁'], answer: 1,
    foxComment: '"浓缩苹果汁"≠苹果汁，就像"浓缩咖啡"≠咖啡豆。',
    knowledge: '浓缩果汁经脱水再加水还原，维生素C大量流失。'
  },
  {
    id: 'beverage_008', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '全脂奶粉', '红茶', '乳化剂', '稳定剂', '食用香精'],
    options: ['纯牛奶', '瓶装奶茶', '拿铁咖啡', '豆浆'], answer: 1,
    foxComment: '瓶装奶茶的奶不是现挤的，茶不是现泡的，但糖是现加的。',
    knowledge: '瓶装奶茶含糖量约50g/瓶，一杯即可超出每日推荐摄入量。'
  },
  {
    id: 'beverage_009', category: 'beverage', difficulty: 1,
    ingredients: ['水', '乳粉', '白砂糖', '乳酸', '柠檬酸钠', '食用香精', '果胶'],
    options: ['纯酸奶', '乳酸菌饮料', '鲜牛奶', '奶酪'], answer: 1,
    foxComment: '乳酸菌饮料不是酸奶！就像黄瓜不是水果。',
    knowledge: '乳酸菌饮料蛋白质含量远低于酸奶，主要成分是水和糖。'
  },
  {
    id: 'beverage_010', category: 'beverage', difficulty: 1,
    ingredients: ['水', '速溶咖啡', '白砂糖', '植脂末', '食用香精', '酪蛋白酸钠'],
    options: ['美式咖啡', '三合一速溶咖啡', '拿铁', '卡布奇诺'], answer: 1,
    foxComment: '植脂末里可能有反式脂肪酸，你喝的不是咖啡，是化学课。',
    knowledge: '植脂末含氢化植物油，可能含反式脂肪酸。'
  },

  // ========== 零食区 (12题) ==========
  {
    id: 'snack_001', category: 'snack', difficulty: 2,
    ingredients: ['马铃薯', '植物油', '白砂糖', '食用盐', '谷氨酸钠', '食用香精'],
    options: ['薯片', '薯条', '虾条', '洋葱圈'], answer: 0,
    foxComment: '薯片的油含量≈你上个月的体重增长曲线。',
    knowledge: '薯片的脂肪含量高达30%-40%。'
  },
  {
    id: 'snack_002', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '棕榈油', '可可粉', '乳清粉', '磷脂', '膨松剂'],
    options: ['威化饼干', '黑巧克力', '夹心曲奇', '司康'], answer: 0,
    foxComment: '威化饼干的层数=你吃它时内疚的层数。',
    knowledge: '威化饼干的糖和棕榈油含量极高。'
  },
  {
    id: 'snack_003', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '辣椒', '花椒', '食用盐', '白砂糖', '谷氨酸钠'],
    options: ['辣条', '薯条', '方便面', '饼干'], answer: 0,
    foxComment: '辣条的包装袋上印的是"调味面制品"，不敢叫食品。',
    knowledge: '辣条高油高盐高辣，一包钠含量可达每日推荐量的60%。'
  },
  {
    id: 'snack_004', category: 'snack', difficulty: 2,
    ingredients: ['白砂糖', '葡萄糖浆', '氢化植物油', '乳清粉', '可可脂', '磷脂'],
    options: ['黑巧克力', '代可可脂巧克力', '生巧', '巧克力酱'], answer: 1,
    foxComment: '代可可脂≈假巧克力，和人造奶油是亲兄弟。',
    knowledge: '代可可脂由氢化植物油制成，可能含反式脂肪酸。'
  },
  {
    id: 'snack_005', category: 'snack', difficulty: 2,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '果胶', '柠檬酸', '柠檬酸钠', '食用香精', '色素'],
    options: ['果冻', '软糖', '布丁', '水果冻干'], answer: 0,
    foxComment: '果冻里没有水果，有的是果胶+色素+香精的化学组合。',
    knowledge: '果冻的主要成分是水和糖，果胶来自植物提取。'
  },
  {
    id: 'snack_006', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '食用盐', '谷氨酸钠', '洋葱粉', '酸水解植物蛋白'],
    options: ['洋葱圈', '薯片', '虾片', '玉米脆'], answer: 0,
    foxComment: '洋葱圈里没有洋葱，就像老婆饼里没有老婆。',
    knowledge: '洋葱圈用洋葱粉调味，主要成分是面粉和油。'
  },
  {
    id: 'snack_007', category: 'snack', difficulty: 2,
    ingredients: ['玉米', '植物油', '食用盐', '白砂糖', '葡萄糖', '芝士粉'],
    options: ['玉米片', '薯片', '爆米花', '米饼'], answer: 0,
    foxComment: '玉米片≠健康粗粮，油和盐的分量让你怀疑人生。',
    knowledge: '玉米片经过油炸，脂肪含量和薯片不相上下。'
  },
  {
    id: 'snack_008', category: 'snack', difficulty: 2,
    ingredients: ['白砂糖', '葡萄糖浆', '改性淀粉', '明胶', '柠檬酸', '食用香精', '色素'],
    options: ['棉花糖', '软糖', '果冻', '奶糖'], answer: 1,
    foxComment: '软糖的主要成分是糖+胶，和营养价值无关。',
    knowledge: '软糖的明胶来自动物皮骨。'
  },
  {
    id: 'snack_009', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '起酥油', '奶油', '食用盐', '膨松剂'],
    options: ['牛角包', '苏打饼干', '蛋挞皮', '桃酥'], answer: 3,
    foxComment: '桃酥咬一口掉一地渣，咬两口血糖往上蹿。',
    knowledge: '桃酥的油脂含量可高达30%。'
  },
  {
    id: 'snack_010', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '白砂糖', '麦芽糖', '芝麻', '食用盐'],
    options: ['麻花', '油条', '饼干', '面包'], answer: 0,
    foxComment: '麻花的热量=一根就够你跑步半小时。',
    knowledge: '麻花经油炸制成，外裹糖，糖油混合物是热量炸弹。'
  },
  {
    id: 'snack_011', category: 'snack', difficulty: 2,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '乳粉', '可可脂', '磷脂', '食用盐'],
    options: ['炼乳', '巧克力酱', '花生酱', '芝麻酱'], answer: 1,
    foxComment: '巧克力酱的第一成分是糖，巧克力只是配角。',
    knowledge: '市售巧克力酱含糖量超过50%。'
  },
  {
    id: 'snack_012', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '棕榈油', '麦芽提取物', '乳清粉', '食用盐', '色素'],
    options: ['全麦饼干', '奶油夹心饼干', '消化饼', '苏打饼'], answer: 1,
    foxComment: '奶油夹心的"奶油"≈油脂+糖+香精，不是你想的那个奶油。',
    knowledge: '夹心饼干的夹心是糖粉和油脂混合。'
  },

  // ========== 速食区 (8题) ==========
  {
    id: 'instant_001', category: 'instant', difficulty: 2,
    ingredients: ['小麦粉', '棕榈油', '食用盐', '谷氨酸钠', '碳酸钾', '瓜尔胶'],
    options: ['挂面', '方便面', '米粉', '意大利面'], answer: 1,
    foxComment: '方便面可以天天吃吗？可以的，只要你愿意天天去医院。',
    knowledge: '一包方便面钠含量约2300mg，已达每日推荐摄入量。'
  },
  {
    id: 'instant_002', category: 'instant', difficulty: 2,
    ingredients: ['鸡肉', '水', '淀粉', '白砂糖', '食用盐', '谷氨酸钠', '香辛料', '色素'],
    options: ['鸡胸肉', '火腿肠', '鸡排', '鸡肉丸'], answer: 1,
    foxComment: '火腿肠的淀粉含量高到可以当馒头吃。',
    knowledge: '火腿肠的肉含量仅30%-60%。'
  },
  {
    id: 'instant_003', category: 'instant', difficulty: 2,
    ingredients: ['牛肉', '水', '白砂糖', '食用盐', '大豆蛋白', '香辛料', '亚硝酸钠'],
    options: ['鲜牛肉', '牛肉干', '午餐肉', '牛肉丸'], answer: 2,
    foxComment: '午餐肉的第一配料可能是猪肉或鸡肉，牛肉只是个名字。',
    knowledge: '午餐肉常添加亚硝酸钠作为防腐剂和发色剂。'
  },
  {
    id: 'instant_004', category: 'instant', difficulty: 2,
    ingredients: ['糯米', '猪肉', '水', '白砂糖', '食用盐', '酱油', '香辛料'],
    options: ['粽子', '烧卖', '糯米鸡', '肉丸'], answer: 0,
    foxComment: '粽子的热量≈你划龙舟半小时消耗的热量。',
    knowledge: '一个肉粽含油约10-15g，热量约400-500大卡。'
  },
  {
    id: 'instant_005', category: 'instant', difficulty: 2,
    ingredients: ['水', '白砂糖', '果葡糖浆', '柠檬酸', '维生素C', '食用盐'],
    options: ['果汁', '果味固体饮料', '蜂蜜', '糖浆'], answer: 1,
    foxComment: '固体饮料≈糖粉+香精，泡水喝等于喝糖水。',
    knowledge: '固体饮料冲调后营养成分极低。'
  },
  {
    id: 'instant_006', category: 'instant', difficulty: 2,
    ingredients: ['面粉', '水', '猪肉', '白菜', '食用盐', '白砂糖', '谷氨酸钠'],
    options: ['饺子', '馄饨', '烧卖', '包子'], answer: 0,
    foxComment: '速冻饺子和妈妈包的饺子，差别比你和爱因斯坦还大。',
    knowledge: '速冻饺子的肉含量通常在30%左右。'
  },
  {
    id: 'instant_007', category: 'instant', difficulty: 2,
    ingredients: ['大米', '植物油', '食用盐', '白砂糖', '谷氨酸钠', '香辛料'],
    options: ['米饭', '自热米饭', '米粉', '米线'], answer: 1,
    foxComment: '自热米饭的米是"重组米"，和你家的米不是一个物种。',
    knowledge: '自热米饭使用重组米（大米粉碎后加添加剂重新造粒）。'
  },
  {
    id: 'instant_008', category: 'instant', difficulty: 2,
    ingredients: ['小麦粉', '猪油', '食用盐', '白砂糖', '香葱', '谷氨酸钠'],
    options: ['苏打饼干', '葱油拌面酱', '肉松饼', '桃酥'], answer: 1,
    foxComment: '猪油+香葱+味精=三大灵魂，但加起来也是三大健康杀手。',
    knowledge: '葱油酱包中猪油含量极高。'
  },

  // ========== 调味区 (6题) ==========
  {
    id: 'condiment_001', category: 'condiment', difficulty: 3,
    ingredients: ['番茄', '白砂糖', '酿造醋', '食用盐', '洋葱粉'],
    options: ['番茄酱', '番茄沙司', '番茄膏', '意面酱'], answer: 1,
    foxComment: '番茄酱和番茄沙司的区别？糖的含量差了三条街。',
    knowledge: '番茄沙司比番茄酱含糖量高很多。'
  },
  {
    id: 'condiment_002', category: 'condiment', difficulty: 3,
    ingredients: ['白砂糖', '酿造酱油', '水', '食用盐', '小麦粉', '谷氨酸钠', '焦糖色'],
    options: ['老抽', '生抽', '蚝油', '甜面酱'], answer: 2,
    foxComment: '蚝油里真的有蚝吗？有——蚝汁提取物，排在第五位之后。',
    knowledge: '蚝油的主要成分是糖、盐和增味剂。'
  },
  {
    id: 'condiment_003', category: 'condiment', difficulty: 3,
    ingredients: ['水', '大豆', '小麦', '食用盐', '白砂糖', '酒精', '谷氨酸钠'],
    options: ['老抽', '生抽', '酱油膏', '蒸鱼豉油'], answer: 1,
    foxComment: '生抽用来调味，老抽用来上色。',
    knowledge: '生抽颜色浅、咸味重，适合炒菜调味。'
  },
  {
    id: 'condiment_004', category: 'condiment', difficulty: 3,
    ingredients: ['水', '白砂糖', '食用盐', '酸水解植物蛋白', '谷氨酸钠', '焦糖色'],
    options: ['蚝油', '味极鲜', '鱼露', '虾酱'], answer: 1,
    foxComment: '味极鲜的美味来自味精（谷氨酸钠），不是手艺。',
    knowledge: '味极鲜就是加了大量增鲜剂的酱油。'
  },
  {
    id: 'condiment_005', category: 'condiment', difficulty: 3,
    ingredients: ['辣椒', '水', '食用盐', '白砂糖', '大蒜', '谷氨酸钠', '柠檬酸'],
    options: ['辣椒酱', '剁辣椒', '辣椒油', '老干妈'], answer: 3,
    foxComment: '老干妈征服世界的秘诀？油+盐+辣椒+味精。朴实无华。',
    knowledge: '老干妈的成分非常简单。'
  },
  {
    id: 'condiment_006', category: 'condiment', difficulty: 3,
    ingredients: ['水', '白砂糖', '番茄', '食用盐', '洋葱', '柠檬酸', '香辛料'],
    options: ['番茄酱', '番茄膏', '番茄沙司', '意式番茄酱'], answer: 3,
    foxComment: '意式番茄酱≈番茄+香料+糖。',
    knowledge: '意式番茄酱更多香料，适合做西式料理。'
  },

  // ========== 冰淇淋区 (6题) ==========
  {
    id: 'icecream_001', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '棕榈油', '葡萄糖浆', '乳化剂', '稳定剂'],
    options: ['冰淇淋', '冰棍', '雪糕', '刨冰'], answer: 2,
    foxComment: '雪糕和冰淇淋的区别？看乳粉含量，雪糕更"水"。',
    knowledge: '国标规定，冰淇淋的乳脂含量需≥5%。'
  },
  {
    id: 'icecream_002', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '柠檬酸', '食用香精', '色素'],
    options: ['雪糕', '冰淇淋', '冰棍', '奶昔'], answer: 2,
    foxComment: '冰棍≈冻起来的糖水，连奶都不加。',
    knowledge: '冰棍不含乳制品。'
  },
  {
    id: 'icecream_003', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '奶油', '蛋黄', '食用香精'],
    options: ['冰淇淋', '冰棍', '布丁', '双皮奶'], answer: 0,
    foxComment: '加了蛋黄的冰淇淋才是正经冰淇淋。',
    knowledge: '蛋黄中的卵磷脂是天然乳化剂。'
  },
  {
    id: 'icecream_004', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '绿豆', '淀粉'],
    options: ['绿豆汤', '绿豆冰棍', '绿豆糕', '绿豆沙'], answer: 1,
    foxComment: '绿豆冰棍的绿豆含量≈你在泳池里加的盐。',
    knowledge: '市售绿豆冰棍用绿豆汤+淀粉勾芡。'
  },
  {
    id: 'icecream_005', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '棕榈油', '麦芽糖', '可可粉', '乳化剂'],
    options: ['巧克力冰淇淋', '巧克力雪糕', '巧克力冰棍', '热巧克力'], answer: 1,
    foxComment: '巧克力雪糕的"巧克力"大概率是代可可脂。',
    knowledge: '很多巧克力雪糕用代可可脂替代可可脂。'
  },
  {
    id: 'icecream_006', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '西瓜汁', '葡萄糖浆', '柠檬酸', '色素'],
    options: ['鲜榨西瓜汁', '西瓜冰棍', '西瓜雪糕', '西瓜冰淇淋'], answer: 1,
    foxComment: '西瓜味冰棍的颜色比你昨天吃的西瓜还红——靠的是色素。',
    knowledge: '加工食品的红色常用诱惑红或甜菜红。'
  },

  // ========== 烘焙区 (4题) ==========
  {
    id: 'bakery_001', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '食用盐', '香草精'],
    options: ['曲奇饼干', '面包', '蛋糕', '松饼'], answer: 0,
    foxComment: '曲奇的黄油含量高到可以作为健身增肌的神器——玩笑。',
    knowledge: '正宗曲奇的黄油含量可达40%。'
  },
  {
    id: 'bakery_002', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '水', '白砂糖', '黄油', '鸡蛋', '酵母'],
    options: ['牛角包', '吐司面包', '法棍', '贝果'], answer: 0,
    foxComment: '牛角包用了大量黄油分层，咬一口掉渣。',
    knowledge: '牛角包使用起酥工艺，黄油层数可达几十层。'
  },
  {
    id: 'bakery_003', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '水', '膨松剂'],
    options: ['海绵蛋糕', '戚风蛋糕', '鸡蛋仔', '华夫饼'], answer: 0,
    foxComment: '海绵蛋糕的膨松靠打发的鸡蛋，不是靠泡打粉。',
    knowledge: '海绵蛋糕靠蛋液打发裹入空气。'
  },
  {
    id: 'bakery_004', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '猪油', '水', '白砂糖', '食用盐'],
    options: ['老婆饼', '蛋黄酥', '蛋挞', '桃酥'], answer: 0,
    foxComment: '老婆饼里没有老婆，但有猪油——多了也不行。',
    knowledge: '传统老婆饼用猪油起酥。'
  },

  // ========== 罐头区 (4题) ==========
  {
    id: 'canned_001', category: 'canned', difficulty: 3,
    ingredients: ['猪肉', '水', '淀粉', '食用盐', '白砂糖', '亚硝酸钠', '三聚磷酸钠'],
    options: ['午餐肉', '红烧肉罐头', '肉酱罐头', '腊肉'], answer: 0,
    foxComment: '午餐肉发明于大萧条时期，现在进化成了淀粉盛宴。',
    knowledge: '亚硝酸钠在午餐肉中起防腐和发色作用。'
  },
  {
    id: 'canned_002', category: 'canned', difficulty: 3,
    ingredients: ['鲮鱼', '植物油', '豆豉', '食用盐', '白砂糖'],
    options: ['油浸金枪鱼', '豆豉鲮鱼', '沙丁鱼罐头', '鱼子酱'], answer: 1,
    foxComment: '豆豉鲮鱼简直是广东人的"下饭神器"。',
    knowledge: '豆豉鲮鱼罐头是广东特色，鲮鱼先炸后腌。'
  },
  {
    id: 'canned_003', category: 'canned', difficulty: 3,
    ingredients: ['黄桃', '水', '白砂糖', '柠檬酸', '维生素C'],
    options: ['新鲜黄桃', '黄桃罐头', '桃汁', '黄桃果酱'], answer: 1,
    foxComment: '黄桃罐头泡在糖水里，比新鲜好吃但比新鲜胖人。',
    knowledge: '罐头水果经过高温杀菌，维生素C有所损失。'
  },
  {
    id: 'canned_004', category: 'canned', difficulty: 3,
    ingredients: ['竹笋', '水', '食用盐', '柠檬酸', '山梨酸钾'],
    options: ['酸笋', '竹笋罐头', '笋干', '泡椒竹笋'], answer: 1,
    foxComment: '竹笋罐头开盖即食，但别期待脆爽。',
    knowledge: '山梨酸钾是罐头中常用的防腐剂。'
  },
]


// ====== recipeChain.js ======
/**
 * 狐狸的烘焙坊 - 食谱链数据
 * 只包含面包、蛋糕、甜品、小吃品类
 * 每个食谱通过 chain.parent + chain.added 关联形成衍生关系
 */
window.RecipeChain = {
  // ======== 食谱列表 ========
  recipes: [
    // ===== 链1: 曲奇饼干家族 =====
    {
      id: 'butterCookie', name: '黄油曲奇', icon: '🍪', starRating: 2,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'chocoCookie', name: '巧克力曲奇', icon: '🍪', starRating: 3,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '巧克力'],
      category: 'bakery',
      chain: { isBase: false, parent: 'butterCookie', added: '巧克力', depth: 1 },
      price: 29,
    },
    {
      id: 'nutCookie', name: '坚果脆曲奇', icon: '🥜', starRating: 4,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '巧克力', '坚果'],
      category: 'bakery',
      chain: { isBase: false, parent: 'chocoCookie', added: '坚果', depth: 2 },
      price: 37,
    },

    // ===== 链2: 蛋糕家族 =====
    {
      id: 'spongeCake', name: '海绵蛋糕', icon: '🎂', starRating: 2,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '水'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'creamCake', name: '奶油蛋糕', icon: '🍰', starRating: 3,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '淡奶油', '水'],
      category: 'bakery',
      chain: { isBase: false, parent: 'spongeCake', added: '淡奶油', depth: 1 },
      price: 29,
    },
    {
      id: 'blackForest', name: '黑森林蛋糕', icon: '🍫', starRating: 4,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '淡奶油', '水', '巧克力', '可可粉'],
      category: 'bakery',
      chain: { isBase: false, parent: 'creamCake', added: ['巧克力', '可可粉'], depth: 2 },
      price: 37,
    },

    // ===== 链3: 牛角包家族 =====
    {
      id: 'croissant', name: '牛角包', icon: '🥐', starRating: 2,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '酵母'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'creamCroissant', name: '奶油牛角包', icon: '🥐', starRating: 3,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '酵母', '淡奶油'],
      category: 'bakery',
      chain: { isBase: false, parent: 'croissant', added: '淡奶油', depth: 1 },
      price: 29,
    },
    {
      id: 'cheeseLavaCroissant', name: '芝士熔岩牛角包', icon: '🧀', starRating: 4,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '酵母', '淡奶油', '马苏里拉芝士', '芝士片'],
      category: 'bakery',
      chain: { isBase: false, parent: 'creamCroissant', added: ['马苏里拉芝士', '芝士片'], depth: 2 },
      price: 37,
    },

    // ===== 独立甜品食谱 =====
    {
      id: 'eggTart', name: '蛋挞', icon: '🥧', starRating: 2,
      ingredients: ['小麦粉', '黄油', '鸡蛋', '白砂糖', '淡奶油', '牛奶'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'pudding', name: '焦糖布丁', icon: '🍮', starRating: 2,
      ingredients: ['鸡蛋', '牛奶', '白砂糖', '香草精'],
      category: 'dessert',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'iceCream', name: '香草冰淇淋', icon: '🍦', starRating: 2,
      ingredients: ['牛奶', '白砂糖', '奶油', '蛋黄', '香草精'],
      category: 'icecream',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'waffle', name: '华夫饼', icon: '🧇', starRating: 2,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '黄油', '牛奶'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 23,
    },
    {
      id: 'donut', name: '甜甜圈', icon: '🍩', starRating: 2,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '黄油', '植物油', '牛奶'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 21,
    },
    {
      id: 'swissRoll', name: '瑞士卷', icon: '🫔', starRating: 3,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '淡奶油', '牛奶'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 29,
    },
    {
      id: 'macaron', name: '马卡龙', icon: '🟣', starRating: 3,
      ingredients: ['杏仁粉', '白砂糖', '鸡蛋', '奶油', '食用色素'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 31,
    },
    {
      id: 'mooncake', name: '冰皮月饼', icon: '🥮', starRating: 3,
      ingredients: ['小麦粉', '糯米粉', '白砂糖', '牛奶', '红豆沙'],
      category: 'dessert',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 29,
    },
    {
      id: 'tiramisu', name: '提拉米苏', icon: '☕', starRating: 4,
      ingredients: ['鸡蛋', '奶油', '白砂糖', '可可粉', '咖啡', '淡奶油'],
      category: 'dessert',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 37,
    },
    {
      id: 'matchaIce', name: '抹茶冰淇淋', icon: '🍵', starRating: 3,
      ingredients: ['牛奶', '白砂糖', '奶油', '蛋黄', '抹茶粉'],
      category: 'icecream',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      price: 27,
    },
  ],

  // ======== 食材稀有度 ========
  ingredientRarity: {
    '小麦粉': 'common',
    '黄油': 'common',
    '白砂糖': 'common',
    '鸡蛋': 'common',
    '酵母': 'common',
    '水': 'common',
    '植物油': 'common',
    '食用盐': 'common',
    '牛奶': 'common',
    '奶油': 'common',
    '蛋黄': 'common',
    '香草精': 'common',
    '红豆沙': 'common',
    '糯米粉': 'common',
    '淡奶油': 'uncommon',
    '巧克力': 'uncommon',
    '可可粉': 'uncommon',
    '坚果': 'uncommon',
    '芝士片': 'uncommon',
    '抹茶粉': 'uncommon',
    '杏仁粉': 'uncommon',
    '咖啡': 'uncommon',
    '马苏里拉芝士': 'rare',
    '食用色素': 'rare',
  },

  // ======== 辅助函数 ========

  /** 通过 ID 获取食谱 */
  getRecipeById: function (id) {
    for (var i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].id === id) return this.recipes[i]
    }
    return null
  },

  /** 构建运行时 children 索引 */
  buildChainIndex: function () {
    var index = {}
    for (var i = 0; i < this.recipes.length; i++) {
      var r = this.recipes[i]
      if (r.chain.parent) {
        if (!index[r.chain.parent]) index[r.chain.parent] = []
        index[r.chain.parent].push(r.id)
      }
    }
    return index
  },

  /** 获取食谱链上的所有父级（从基础到当前） */
  getChainPath: function (recipeId) {
    var path = []
    var current = this.getRecipeById(recipeId)
    while (current) {
      path.unshift(current.id)
      if (current.chain.parent) {
        current = this.getRecipeById(current.chain.parent)
      } else {
        current = null
      }
    }
    return path
  },

  /** 检查 ingredientSet 是否是 recipe.ingredients 的超集 */
  isSuperset: function (ingredientSet, recipeIngredients) {
    for (var i = 0; i < recipeIngredients.length; i++) {
      if (ingredientSet.indexOf(recipeIngredients[i]) === -1) return false
    }
    return true
  },

  /** 检查两组食材是否完全一致（无序） */
  arraysEqual: function (a, b) {
    if (!a || !b) return false
    if (a.length !== b.length) return false
    var sortedA = a.slice().sort()
    var sortedB = b.slice().sort()
    for (var i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false
    }
    return true
  },

  /** 获取食材稀有度分数 */
  getIngredientScore: function (name) {
    var rarity = this.ingredientRarity[name] || 'common'
    var scores = { common: 1, uncommon: 2, rare: 3 }
    return scores[rarity] || 1
  },

  /** 计算一组食材的组合分数 */
  calculateComboValue: function (ingredients) {
    var totalScore = 0
    for (var i = 0; i < ingredients.length; i++) {
      totalScore += this.getIngredientScore(ingredients[i])
    }
    return { score: totalScore, xp: Math.max(1, Math.floor(totalScore / 2)) }
  },

  /** 新增食材（不在任何食谱中，仅用于探索） */
  extraIngredients: {
    '草莓': 'uncommon',
    '蓝莓': 'uncommon',
    '芒果': 'uncommon',
    '蜂蜜': 'common',
    '柠檬汁': 'common',
    '椰子粉': 'common',
    '杏仁片': 'uncommon',
    '芝麻': 'common',
    '肉桂粉': 'common',
    '吉利丁': 'common',
  },

  /** 获取所有可探索食材（含 extra） */
  getAllIngredients: function () {
    var all = {}
    for (var k in this.ingredientRarity) all[k] = this.ingredientRarity[k]
    for (var k in this.extraIngredients) all[k] = this.extraIngredients[k]
    return all
  },
}


// ====== gameEngine.js ======
/**
 * 狐狸的烘焙坊 - 游戏引擎
 * 核心状态机：昼夜切换、存档、升级、食谱发现、顾客经营
 */
var C = window.GameConfig
var QB = window.QuestionBank
var RC = window.RecipeChain

function GameEngine() {
  this.state = null
  this.chainIndex = null
  this.load()
}

// ======== 存档 ========

GameEngine.prototype.save = function () {
  try {
    wx.setStorageSync('foxLab_save', this.state)
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('foxLab_save', JSON.stringify(this.state))
    }
  }
}

GameEngine.prototype.load = function () {
  var saved = null
  try {
    saved = wx.getStorageSync('foxLab_save')
  } catch (e) {
    try {
      var raw = localStorage.getItem('foxLab_save')
      if (raw) saved = JSON.parse(raw)
    } catch (e2) {}
  }

  if (saved && saved.version === C.version) {
    this.state = saved
  } else {
    this.reset()
  }
  // 构建链索引
  this.chainIndex = RC.buildChainIndex()
}

GameEngine.prototype.reset = function () {
  // 初始食材
  var initInv = {}
  if (C.initialInventory) {
    for (var k in C.initialInventory) {
      initInv[k] = C.initialInventory[k]
    }
  }

  // 初始食谱
  var initRecipes = {}
  if (C.initialRecipes && C.initialRecipes.length > 0) {
    for (var i = 0; i < C.initialRecipes.length; i++) {
      initRecipes[C.initialRecipes[i]] = { count: 1, xp: 1, lastDiscovered: Date.now() }
    }
  }

  this.state = {
    version: C.version,
    gold: C.initialGold,
    totalEarned: 0,

    // 时间
    currentPeriod: 'day',
    periodStartTime: Date.now(),
    lastActive: Date.now(),

    // 等级
    shopLevel: 1,
    foxLevel: 1,

    // 食材仓库（初始自带一批烘焙基础食材）
    inventory: initInv,
    maxInventory: C.shopLevels[0].maxInventory,

    // 食谱系统（初始默认发现 3 道基础甜品）
    discoveredRecipes: initRecipes,

    // 顾客
    currentCustomers: [],
    servedToday: 0,
    totalServed: 0,

    // 菜单（初始上架默认食谱）
    menu: C.initialRecipes ? C.initialRecipes.slice() : this._getDefaultMenu(),
    maxMenuSlots: C.shopLevels[0].menuSlots,

    // 探索
    isExploring: false,
    exploreStartTime: 0,
    exploreResult: null,

    // 批发商
    wholesaleItems: [],

    // 统计
    stats: {
      dayCount: 0,
      totalCustomers: 0,
      totalRecipesDiscovered: C.initialRecipes ? C.initialRecipes.length : 0,
      totalExploreCount: 0,
    },
  }
  this.save()
}

GameEngine.prototype._getDefaultMenu = function () {
  // 初始菜单：从基础食谱里选 3 个
  var bases = []
  for (var i = 0; i < RC.recipes.length; i++) {
    if (RC.recipes[i].chain.isBase) bases.push(RC.recipes[i].id)
  }
  return bases.slice(0, 3)
}

// ======== 店铺系统 ========

GameEngine.prototype.getShopInfo = function () {
  var current = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  var next = C.shopLevels[this.state.shopLevel] || null
  return {
    level: this.state.shopLevel,
    maxLevel: C.shopLevels.length,
    current: current,
    next: next,
    isMax: this.state.shopLevel >= C.shopLevels.length,
  }
}

GameEngine.prototype.canUpgradeShop = function () {
  var info = this.getShopInfo()
  if (info.isMax) return false
  return this.state.gold >= info.next.upgradeCost
}

GameEngine.prototype.upgradeShop = function () {
  var info = this.getShopInfo()
  if (info.isMax) return { success: false, msg: '已达最高等级' }
  if (this.state.gold < info.next.upgradeCost) return { success: false, msg: '金币不足' }

  this.state.gold -= info.next.upgradeCost
  this.state.shopLevel++
  var newInfo = C.shopLevels[this.state.shopLevel - 1]
  this.state.maxMenuSlots = newInfo.menuSlots
  this.state.maxInventory = newInfo.maxInventory

  this.save()
  return { success: true, newLevel: this.state.shopLevel }
}

// ======== 狐狸系统 ========

GameEngine.prototype.getFoxInfo = function () {
  var current = C.foxLevels[this.state.foxLevel - 1] || C.foxLevels[0]
  var next = C.foxLevels[this.state.foxLevel] || null
  return {
    level: this.state.foxLevel,
    maxLevel: C.foxLevels.length,
    current: current,
    next: next,
    isMax: this.state.foxLevel >= C.foxLevels.length,
  }
}

GameEngine.prototype.canUpgradeFox = function () {
  var info = this.getFoxInfo()
  if (info.isMax) return false
  return this.state.gold >= info.next.upgradeCost
}

GameEngine.prototype.upgradeFox = function () {
  var info = this.getFoxInfo()
  if (info.isMax) return { success: false, msg: '已达最高等级' }
  if (this.state.gold < info.next.upgradeCost) return { success: false, msg: '金币不足' }

  this.state.gold -= info.next.upgradeCost
  this.state.foxLevel++
  this.save()
  return { success: true, newLevel: this.state.foxLevel }
}

// ======== 食材仓库 ========

GameEngine.prototype.getInventory = function () {
  return this.state.inventory
}

GameEngine.prototype.getInventoryTotal = function () {
  var total = 0
  for (var key in this.state.inventory) {
    total += this.state.inventory[key]
  }
  return total
}

GameEngine.prototype.addIngredient = function (name, qty) {
  var current = this.state.inventory[name] || 0
  var maxCap = this.state.maxInventory
  // 检查是否超上限
  var total = this.getInventoryTotal()
  var canAdd = Math.min(qty, maxCap - total)
  if (canAdd <= 0) return 0
  this.state.inventory[name] = current + canAdd
  this.save()
  return canAdd
}

GameEngine.prototype.removeIngredient = function (name, qty) {
  var current = this.state.inventory[name] || 0
  if (current < qty) return false
  this.state.inventory[name] = current - qty
  if (this.state.inventory[name] <= 0) delete this.state.inventory[name]
  this.save()
  return true
}

GameEngine.prototype.hasIngredients = function (names, qty) {
  for (var i = 0; i < names.length; i++) {
    if ((this.state.inventory[names[i]] || 0) < qty) return false
  }
  return true
}

// ======== 菜单系统 ========

GameEngine.prototype.getMenu = function () {
  return this.state.menu
}

GameEngine.prototype.setMenu = function (newMenu) {
  if (newMenu.length > this.state.maxMenuSlots) return false
  this.state.menu = newMenu.slice()
  this.save()
  return true
}

GameEngine.prototype.addToMenu = function (recipeId) {
  if (this.state.menu.length >= this.state.maxMenuSlots) return false
  if (this.state.menu.indexOf(recipeId) !== -1) return false
  this.state.menu.push(recipeId)
  this.save()
  return true
}

GameEngine.prototype.removeFromMenu = function (recipeId) {
  var idx = this.state.menu.indexOf(recipeId)
  if (idx === -1) return false
  this.state.menu.splice(idx, 1)
  this.save()
  return true
}

// ======== 昼夜切换 ========

GameEngine.prototype.switchToNight = function () {
  // 清理白天残留：未完成服务的顾客离开
  var customers = this.state.currentCustomers
  for (var i = customers.length - 1; i >= 0; i--) {
    customers.splice(i, 1)
  }

  // 召回探索中的狐狸
  if (this.state.isExploring) {
    this.state.isExploring = false
  }

  this.state.currentPeriod = 'night'
  this.state.periodStartTime = Date.now()
  this.save()
}

GameEngine.prototype.switchToDay = function () {
  this.state.currentPeriod = 'day'
  this.state.periodStartTime = Date.now()
  this.state.servedToday = 0
  this.state.stats.dayCount++
  this.state.currentCustomers = []
  this.save()
}

// ======== 顾客系统 ========

GameEngine.prototype.getMaxCustomers = function () {
  var info = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  return info.maxCustomers
}

GameEngine.prototype.generateCustomer = function () {
  var patience = C.customer.patienceMin + Math.random() * (C.customer.patienceMax - C.customer.patienceMin)
  var orderItem = null
  var menu = this.state.menu
  if (menu.length > 0) {
    // 优先选玩家已发现的食谱，但也会选菜单上未发现的
    var discovered = []
    var undiscovered = []
    for (var i = 0; i < menu.length; i++) {
      if (this.state.discoveredRecipes[menu[i]]) {
        discovered.push(menu[i])
      } else {
        undiscovered.push(menu[i])
      }
    }
    var pool = discovered.length > 0 ? discovered : undiscovered
    orderItem = pool[Math.floor(Math.random() * pool.length)]
  }

  return {
    id: '_c' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    patience: patience,
    patienceMax: patience,
    state: 'waiting',
    orderItem: orderItem,
    enterTime: Date.now(),
    serveCompleteTime: 0,
    eatCompleteTime: 0,
    leaveTime: 0,
  }
}

GameEngine.prototype.updateCustomer = function (c) {
  var now = Date.now()

  switch (c.state) {
    case 'waiting':
      c.patience -= C.customer.patienceTick
      if (c.patience <= 0) {
        c.state = 'leaving'
        c.leaveTime = now + C.serving.settleDelay
      }
      break

    case 'serving':
      if (now >= c.serveCompleteTime) {
        c.state = 'eating'
        c.eatCompleteTime = now + C.serving.eatTime
      }
      break

    case 'eating':
      if (now >= c.eatCompleteTime) {
        c.state = 'done'
        this.settleCustomer(c)
        c.leaveTime = now + C.serving.settleDelay
      }
      break

    case 'done':
      if (now >= c.leaveTime) {
        this.removeCustomer(c.id)
      }
      break
  }
}

GameEngine.prototype.settleCustomer = function (c) {
  var recipe = RC.getRecipeById(c.orderItem)
  if (!recipe) return

  var basePrice = recipe.starRating * C.pricing.basePerStar + C.pricing.baseOffset
  var foxInfo = this.getFoxInfo()
  var favorBonus = foxInfo.current.customerFavor

  // 熟练度加成
  var masteryInfo = this.state.discoveredRecipes[c.orderItem]
  var masteryBonus = 1
  if (masteryInfo) {
    masteryBonus = 1 + masteryInfo.xp * C.pricing.masteryBonus
  }

  var finalPrice = Math.floor(basePrice * favorBonus * masteryBonus)
  this.state.gold += finalPrice
  this.state.totalEarned += finalPrice
  this.state.servedToday++
  this.state.stats.totalCustomers++
  this.state.totalServed++

  this.save()
  return { price: finalPrice, recipe: recipe }
}

GameEngine.prototype.findCustomer = function (id) {
  for (var i = 0; i < this.state.currentCustomers.length; i++) {
    if (this.state.currentCustomers[i].id === id) return this.state.currentCustomers[i]
  }
  return null
}

GameEngine.prototype.removeCustomer = function (id) {
  for (var i = 0; i < this.state.currentCustomers.length; i++) {
    if (this.state.currentCustomers[i].id === id) {
      this.state.currentCustomers.splice(i, 1)
      return true
    }
  }
  return false
}

GameEngine.prototype.startServing = function (customerId, recipeId) {
  var c = this.findCustomer(customerId)
  if (!c) return { success: false, msg: '顾客不存在' }
  if (c.state !== 'waiting') return { success: false, msg: '顾客状态不对' }

  // 检查是否有这个食谱
  if (!this.state.discoveredRecipes[recipeId]) {
    return { success: false, msg: '你还不会做这个食谱' }
  }

  var foxInfo = this.getFoxInfo()
  var serveTime = C.serving.baseTime / foxInfo.current.serveSpeed

  c.state = 'serving'
  c.serveCompleteTime = Date.now() + serveTime
  c.orderItem = recipeId  // 确保顾客要的就是这个
  this.save()
  return { success: true, serveTime: serveTime }
}

// ======== 探索系统 ========

GameEngine.prototype.startExplore = function () {
  if (this.state.isExploring) return { success: false, msg: '狐狸正在探索中' }
  this.state.isExploring = true
  this.state.exploreStartTime = Date.now()
  this.save()
  return { success: true, duration: C.explore.duration }
}

GameEngine.prototype.completeExplore = function () {
  if (!this.state.isExploring) return null

  var foxInfo = this.getFoxInfo()
  var quality = foxInfo.current.exploreQuality

  // 随机 1~3 种食材
  var count = C.explore.baseIngredientCount + Math.floor(Math.random() * (C.explore.maxIngredientCount))
  count = Math.min(count, C.explore.maxIngredientCount)

  var results = []
  for (var i = 0; i < count; i++) {
    var ingredient = this._rollIngredient(quality)
    if (!ingredient) continue
    var qty = 1 + Math.floor(Math.random() * 3) // 1~3份
    results.push({ name: ingredient, quantity: qty })
    this.addIngredient(ingredient, qty)
  }

  this.state.isExploring = false
  this.state.exploreResult = { ingredients: results, timestamp: Date.now() }
  this.state.stats.totalExploreCount++
  this.save()
  return this.state.exploreResult
}

GameEngine.prototype._rollIngredient = function (quality) {
  // 根据探索品质随机食材
  var allIngredients = Object.keys(RC.getAllIngredients())
  if (allIngredients.length === 0) return null

  // 按稀有度加权: quality 越高, 稀有食材概率越大
  var allRarity = RC.getAllIngredients()
  var weights = []
  for (var i = 0; i < allIngredients.length; i++) {
    var rarity = allRarity[allIngredients[i]] || 'common'
    var w = rarity === 'common' ? 50 : rarity === 'uncommon' ? 30 : 20
    w = Math.floor(w * quality)
    weights.push(w)
  }
  var totalWeight = 0
  for (var i = 0; i < weights.length; i++) totalWeight += weights[i]
  if (totalWeight <= 0) return allIngredients[Math.floor(Math.random() * allIngredients.length)]

  var r = Math.random() * totalWeight
  for (var i = 0; i < allIngredients.length; i++) {
    r -= weights[i]
    if (r <= 0) return allIngredients[i]
  }
  return allIngredients[allIngredients.length - 1]
}

// ======== 食谱发现系统 ========

GameEngine.prototype.attemptDiscover = function (ingredientCombination) {
  // ingredientCombination: 玩家选择的食材名称数组 (2-5 种)

  // Step 1: 检查个数
  if (ingredientCombination.length < 2 || ingredientCombination.length > 5) {
    return { success: false, msg: '请选择 2-5 种食材' }
  }

  // Step 2: 双倍消耗检查
  if (!this.hasIngredients(ingredientCombination, 2)) {
    return { success: false, msg: '食材不足（需要双倍消耗）' }
  }

  // 扣食材
  for (var i = 0; i < ingredientCombination.length; i++) {
    this.removeIngredient(ingredientCombination[i], 2)
  }

  // Step 3: 计算组合价值
  var comboValue = RC.calculateComboValue(ingredientCombination)

  // Step 4: 链匹配优先
  var knownIds = Object.keys(this.state.discoveredRecipes)
  for (var k = 0; k < knownIds.length; k++) {
    var knownRecipe = RC.getRecipeById(knownIds[k])
    if (!knownRecipe) continue

    // 检查食材组合是否是已知食谱 + 额外食材
    var added = this._getAddedIngredients(ingredientCombination, knownRecipe.ingredients)
    if (added && added.length >= 1 && added.length <= 2) {
      // 检查是否有子食谱匹配
      var children = this.chainIndex[knownRecipe.id]
      if (children) {
        for (var c = 0; c < children.length; c++) {
          var childRecipe = RC.getRecipeById(children[c])
          if (!childRecipe) continue
          var childAdded = childRecipe.chain.added
          // childAdded 可能是字符串或数组
          var childAddedArr = typeof childAdded === 'string' ? [childAdded] : childAdded
          if (RC.arraysEqual(added, childAddedArr)) {
            // 链匹配成功
            if (!this.state.discoveredRecipes[childRecipe.id]) {
              // 发现新食谱！
              this.state.discoveredRecipes[childRecipe.id] = { count: 1, xp: 0, lastDiscovered: Date.now() }
              this.state.stats.totalRecipesDiscovered++
              this.save()
              return { success: true, result: 'discover', recipe: childRecipe, isNew: true }
            } else {
              // 已有，加熟练度
              this.state.discoveredRecipes[childRecipe.id].xp += comboValue.xp
              this.state.discoveredRecipes[childRecipe.id].count++
              this.save()
              return { success: true, result: 'mastery', recipe: childRecipe, isNew: false, xpGained: comboValue.xp }
            }
          }
        }
      }
    }
  }

  // Step 5: 全局匹配（按星级从高到低）
  var sortedRecipes = RC.recipes.slice().sort(function (a, b) {
    return b.starRating - a.starRating
  })
  for (var r = 0; r < sortedRecipes.length; r++) {
    var recipe = sortedRecipes[r]
    if (RC.isSuperset(ingredientCombination, recipe.ingredients)) {
      if (!this.state.discoveredRecipes[recipe.id]) {
        // 发现新食谱！
        this.state.discoveredRecipes[recipe.id] = { count: 1, xp: 0, lastDiscovered: Date.now() }
        this.state.stats.totalRecipesDiscovered++
        this.save()
        return { success: true, result: 'discover', recipe: recipe, isNew: true }
      } else {
        // 已有
        this.state.discoveredRecipes[recipe.id].xp += comboValue.xp
        this.state.discoveredRecipes[recipe.id].count++
        this.save()
        return { success: true, result: 'mastery', recipe: recipe, isNew: false, xpGained: comboValue.xp }
      }
    }
  }

  // Step 6: 什么都没匹配到，返还一半食材
  for (var j = 0; j < ingredientCombination.length; j++) {
    this.addIngredient(ingredientCombination[j], 1)
  }
  this.save()
  return { success: true, result: 'nothing', msg: '这组合做不出什么...返还了一半食材', comboValue: comboValue }
}

GameEngine.prototype._getAddedIngredients = function (fullCombo, baseIngredients) {
  // 返回 fullCombo 中比 baseIngredients 多出来的食材
  var added = []
  for (var i = 0; i < fullCombo.length; i++) {
    var ing = fullCombo[i]
    // 检查在 base 中的出现次数
    var inBase = 0
    for (var j = 0; j < baseIngredients.length; j++) {
      if (baseIngredients[j] === ing) inBase++
    }
    // 检查在 added 中的出现次数（已经添加到结果中的）
    var inAdded = 0
    for (var k = 0; k < added.length; k++) {
      if (added[k] === ing) inAdded++
    }
    // 如果 base 中已经包含了足够数量，从 added 中去除
    if (inBase + inAdded <= inBase) {
      // 还缺一个实例
      added.push(ing)
    }
  }
  // 确保 added 是 base 中不包含的新食材
  // 简化：直接判断食材是否在 base 中
  var pureAdded = []
  for (var i = 0; i < fullCombo.length; i++) {
    if (baseIngredients.indexOf(fullCombo[i]) === -1) {
      pureAdded.push(fullCombo[i])
    }
  }
  // 同时保留两者：如果玩家用了重复的基础食材
  return pureAdded
}

// ======== 批发商系统 ========

GameEngine.prototype.generateWholesaleItems = function () {
  var allIngredients = Object.keys(RC.ingredientRarity)
  var items = []
  var count = Math.min(C.wholesale.refreshCount, allIngredients.length)

  // 随机选 count 种
  var shuffled = allIngredients.slice().sort(function () { return Math.random() - 0.5 })
  for (var i = 0; i < count; i++) {
    var rarity = RC.ingredientRarity[shuffled[i]] || 'common'
    var priceMultiplier = rarity === 'common' ? 1 : rarity === 'uncommon' ? 2 : 4
    items.push({
      name: shuffled[i],
      price: C.wholesale.basePrice * priceMultiplier,
      quantity: 5 + Math.floor(Math.random() * 6), // 5~10份
      rarity: rarity,
    })
  }
  this.state.wholesaleItems = items
  return items
}

GameEngine.prototype.buyWholesaleItem = function (index) {
  var items = this.state.wholesaleItems
  if (index < 0 || index >= items.length) return { success: false, msg: '无效商品' }
  var item = items[index]
  var totalCost = item.price * item.quantity
  if (this.state.gold < totalCost) return { success: false, msg: '金币不足' }

  this.state.gold -= totalCost
  this.addIngredient(item.name, item.quantity)
  items.splice(index, 1)
  this.save()
  return { success: true, name: item.name, quantity: item.quantity, cost: totalCost }
}

GameEngine.prototype.refreshWholesale = function () {
  if (this.state.gold < C.wholesale.refreshCost) return { success: false, msg: '金币不足' }
  this.state.gold -= C.wholesale.refreshCost
  this.generateWholesaleItems()
  this.save()
  return { success: true }
}

// ======== 离线收益 ========

GameEngine.prototype.processOffline = function () {
  var now = Date.now()
  var elapsed = now - this.state.lastActive
  this.state.lastActive = now

  var shopInfo = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  var maxOfflineMs = shopInfo.maxOfflineHours * 60 * 60 * 1000
  var effectiveMs = Math.min(elapsed, maxOfflineMs)

  var goldPerMin = C.offline.baseGoldPerMin + this.state.shopLevel * C.offline.goldPerLevel
  var offlineGold = Math.floor(effectiveMs / 60000) * goldPerMin
  this.state.gold += offlineGold

  // 重置到白天
  this.state.currentPeriod = 'day'
  this.state.periodStartTime = now
  this.state.currentCustomers = []

  this.save()
  return { gold: offlineGold, elapsedMinutes: Math.floor(effectiveMs / 60000) }
}

// ======== 食谱查询 ========

GameEngine.prototype.getDiscoveredRecipes = function () {
  var result = []
  var ids = Object.keys(this.state.discoveredRecipes)
  for (var i = 0; i < ids.length; i++) {
    var recipe = RC.getRecipeById(ids[i])
    if (recipe) {
      result.push({
        recipe: recipe,
        data: this.state.discoveredRecipes[ids[i]],
      })
    }
  }
  return result
}

GameEngine.prototype.getUndiscoveredRecipes = function () {
  var result = []
  for (var i = 0; i < RC.recipes.length; i++) {
    if (!this.state.discoveredRecipes[RC.recipes[i].id]) {
      result.push(RC.recipes[i])
    }
  }
  return result
}

GameEngine.prototype.getRecipeById = function (id) {
  return RC.getRecipeById(id)
}

// ======== 统计 ========

GameEngine.prototype.getStats = function () {
  var shopInfo = this.getShopInfo()
  var foxInfo = this.getFoxInfo()
  return {
    gold: this.state.gold,
    totalEarned: this.state.totalEarned,
    shopLevel: this.state.shopLevel,
    shopName: shopInfo.current.name,
    foxLevel: this.state.foxLevel,
    foxName: foxInfo.current.name,
    totalServed: this.state.totalServed,
    totalCustomers: this.state.stats.totalCustomers,
    totalRecipesDiscovered: this.state.stats.totalRecipesDiscovered,
    totalExploreCount: this.state.stats.totalExploreCount,
    dayCount: this.state.stats.dayCount,
    currentPeriod: this.state.currentPeriod,
    customerCount: this.state.currentCustomers.length,
    maxCustomers: this.getMaxCustomers(),
    isExploring: this.state.isExploring,
    inventoryTotal: this.getInventoryTotal(),
    maxInventory: this.state.maxInventory,
    menuCount: this.state.menu.length,
    maxMenuSlots: this.state.maxMenuSlots,
    discoveredCount: Object.keys(this.state.discoveredRecipes).length,
    totalRecipes: RC.recipes.length,
  }
}

window.GameEngine = GameEngine


// ====== renderer.js ======
/**
 * 狐狸的烘焙坊 - Canvas渲染器
 * 白天场景、夜晚场景、弹窗、升级、统计
 */
var C = window.GameConfig

function Renderer(canvas) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.width = canvas.width
  this.height = canvas.height

  // 设计基准 375x667
  this.scaleX = this.width / 375
  this.scaleY = this.height / 667
}

// ======== 基础绘制 ========

Renderer.prototype.clear = function (color) {
  this.ctx.fillStyle = color || C.theme.creamWhite
  this.ctx.fillRect(0, 0, this.width, this.height)
}

Renderer.prototype.rr = function (x, y, w, h, r, fill, stroke, lw) {
  var ctx = this.ctx
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath()
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke() }
}

Renderer.prototype.text = function (txt, x, y, opts) {
  opts = opts || {}
  var ctx = this.ctx
  var fs = opts.fontSize || 14
  ctx.font = (opts.bold ? 'bold ' : '') + fs + 'px "PingFang SC","Microsoft YaHei",sans-serif'
  ctx.fillStyle = opts.color || C.theme.darkText
  ctx.textAlign = opts.align || 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(txt, x, y)
}

Renderer.prototype.drawFox = function (mood, x, y, size) {
  var ctx = this.ctx
  var hs = size / 2
  var baseY = y

  // 身体
  ctx.beginPath(); ctx.arc(x, baseY + hs * 0.3, hs * 0.7, 0, Math.PI * 2)
  ctx.fillStyle = C.theme.warmOrange; ctx.fill()

  // 耳朵
  ctx.beginPath(); ctx.moveTo(x - hs * 0.5, baseY - hs * 0.1)
  ctx.lineTo(x - hs * 0.7, baseY - hs * 0.5); ctx.lineTo(x - hs * 0.2, baseY - hs * 0.1); ctx.fill()
  ctx.beginPath(); ctx.moveTo(x + hs * 0.5, baseY - hs * 0.1)
  ctx.lineTo(x + hs * 0.7, baseY - hs * 0.5); ctx.lineTo(x + hs * 0.2, baseY - hs * 0.1); ctx.fill()

  // 肚子
  ctx.beginPath(); ctx.ellipse(x, baseY + hs * 0.6, hs * 0.35, hs * 0.4, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'; ctx.fill()

  var eyeY = baseY - hs * 0.05

  switch (mood) {
    case 'happy':
    case 'excited':
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(x - hs * 0.22, eyeY, hs * 0.1, Math.PI, 0); ctx.stroke()
      ctx.beginPath(); ctx.arc(x + hs * 0.22, eyeY, hs * 0.1, Math.PI, 0); ctx.stroke()
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.25, hs * 0.12, 0, Math.PI); ctx.stroke()
      this.text('⭐', x + hs * 0.7, baseY - hs * 0.3, { fontSize: hs * 0.25 })
      break
    case 'sad':
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY + hs * 0.05, hs * 0.08, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY + hs * 0.05, hs * 0.08, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#64B5F6'
      ctx.beginPath(); ctx.arc(x - hs * 0.25, eyeY + hs * 0.3, hs * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.25, eyeY + hs * 0.3, hs * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.4, hs * 0.12, Math.PI, 0); ctx.stroke()
      break
    case 'working':
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, hs * 0.12, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, hs * 0.12, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x - hs * 0.08, eyeY); ctx.lineTo(x + hs * 0.08, eyeY); ctx.stroke()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.3, hs * 0.06, 0, Math.PI); ctx.stroke()
      break
    case 'exploring':
      // 奔跑状态
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.3, hs * 0.08, 0, Math.PI); ctx.stroke()
      this.text('💨', x + hs * 0.8, baseY - hs * 0.2, { fontSize: hs * 0.3 })
      break
    case 'surprised':
      ctx.fillStyle = '#FFF'; ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, hs * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, hs * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.25, hs * 0.08, 0, Math.PI * 2); ctx.fillStyle = C.theme.darkText; ctx.fill()
      break
    default:
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, hs * 0.07, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, baseY + hs * 0.3, hs * 0.08, 0, Math.PI); ctx.stroke()
  }
}

Renderer.prototype.drawButton = function (x, y, w, h, text, opts) {
  opts = opts || {}
  var bg = opts.bg || C.theme.warmOrange
  var tc = opts.textColor || '#FFF'
  var fs = opts.fontSize || 14
  var r = opts.radius || (h / 2)
  this.rr(x, y, w, h, r, bg)
  this.text(text, x + w / 2, y + h / 2 - fs / 2, { fontSize: fs, color: tc, bold: true, align: 'center' })
}

// ======== 顶部状态栏 ========

Renderer.prototype.drawTopBar = function (stats) {
  var w = this.width

  this.rr(0, 0, w, 50, 0, C.theme.warmOrange)

  // 周期标签
  var periodText = stats.currentPeriod === 'day' ? '☀️ 白天' : '🌙 夜晚'
  this.text(periodText, 14, 8, { fontSize: 13, color: '#FFF', bold: true })

  // 等级
  this.text('🏠 Lv.' + stats.shopLevel, 14, 28, { fontSize: 11, color: 'rgba(255,255,255,0.8)' })

  // 金币
  var goldX = w - 120
  this.rr(goldX, 8, 110, 34, 15, 'rgba(255,255,255,0.2)')
  this.text('💰 ' + stats.gold, goldX + 10, 15, { fontSize: 14, color: '#FFF', bold: true })
  this.text('🦊 Lv.' + stats.foxLevel, goldX + 10, 31, { fontSize: 10, color: 'rgba(255,255,255,0.8)' })
}

// ======== 白天场景 ========

Renderer.prototype.drawDayScene = function (stats, customers) {
  var w = this.width, h = this.height

  // 背景
  this.clear(C.theme.creamWhite)

  // 顶部状态栏
  this.drawTopBar(stats)

  // 餐厅背景
  var bgY = 50
  this.rr(0, bgY, w, h - bgY, 0, C.theme.creamWhite)

  // 地板
  var floorY = h - 30
  this.rr(0, floorY, w, 30, 0, '#E8DDD0')
  this.ctx.fillStyle = '#DDD0C0'
  this.ctx.fillRect(0, floorY, w, 2)

  // 桌子（装饰）
  var tableX = w / 2 - 40
  var tableY = h - 120
  this.rr(tableX, tableY, 80, 15, 4, '#D2B48C')

  // 画顾客
  this.drawCustomers(customers)

  // 狐狸角色
  var foxY = tableY - 50
  if (stats.isExploring) {
    this.drawFox('exploring', w / 2, foxY, 60)
    this.text('🔍 探索中...', w / 2, foxY - 40, { fontSize: 12, color: C.theme.warmOrange, bold: true, align: 'center' })
  } else {
    this.drawFox('idle', w / 2, foxY, 60)
  }

  // 周期倒计时
  var periodElapsed = 0
  // (在 main.js 计算后通过额外参数传入)
  if (stats.periodRemaining) {
    var secs = Math.ceil(stats.periodRemaining / 1000)
    var min = Math.floor(secs / 60)
    var sec = secs % 60
    this.text('⏱ ' + min + ':' + (sec < 10 ? '0' : '') + sec, w / 2, bgY + 8, { fontSize: 11, color: C.theme.lightText, align: 'center' })
  }

  // 底部按钮
  var bY = h - 44
  var btnW = Math.floor((w - 55) / 4)
  var btnH = 36

  this.drawButton(10, bY, btnW, btnH, '🔍 探索', { fontSize: 12 })
  this.drawButton(15 + btnW, bY, btnW, btnH, '📋 菜单', { bg: '#E8DDD0', textColor: C.theme.darkText, fontSize: 12 })
  this.drawButton(20 + btnW * 2, bY, btnW, btnH, '⬆ 升级', { bg: '#E8DDD0', textColor: C.theme.darkText, fontSize: 12 })
  this.drawButton(25 + btnW * 3, bY, btnW, btnH, '📊 统计', { bg: '#E8DDD0', textColor: C.theme.darkText, fontSize: 12 })
}

Renderer.prototype.drawCustomers = function (customers) {
  var w = this.width
  for (var i = 0; i < customers.length; i++) {
    var c = customers[i]
    var cx = 30 + i * (w - 60) / Math.max(3, customers.length)
    var cy = 70 + (i % 2) * 60

    // 顾客身体
    this.rr(cx - 18, cy, 36, 50, 8, '#E0E0E0', '#BBB', 1)

    // 脸
    this.ctx.beginPath()
    this.ctx.arc(cx, cy + 10, 14, 0, Math.PI * 2)
    this.ctx.fillStyle = '#FFE0BD'
    this.ctx.fill()

    // 眼睛
    if (c.state === 'leaving') {
      this.text('😡', cx, cy, { fontSize: 12 })
    } else if (c.state === 'eating') {
      this.text('😋', cx, cy, { fontSize: 12 })
    } else if (c.state === 'serving') {
      this.text('😊', cx, cy, { fontSize: 12 })
    } else {
      this.text('😐', cx, cy, { fontSize: 12 })
    }

    // 头顶气泡（显示点的食谱）
    if (c.orderItem && c.state === 'waiting') {
      var bubbleX = cx - 14
      var bubbleY = cy - 22
      this.rr(bubbleX, bubbleY, 28, 18, 9, '#FFF', C.theme.warmOrange, 1)
      this.text('🍽', bubbleX + 14, bubbleY + 1, { fontSize: 10, align: 'center' })
    }

    // 耐心条
    if (c.state === 'waiting') {
      var barW = 36
      var barH = 4
      var barX = cx - barW / 2
      var barY = cy + 35
      this.rr(barX, barY, barW, barH, 2, '#E8DDD0')
      var pct = Math.max(0, c.patience / c.patienceMax)
      var barColor = pct > 0.5 ? C.theme.grassGreen : pct > 0.25 ? C.theme.eggYellow : C.theme.tomatoRed
      this.rr(barX, barY, barW * pct, barH, 2, barColor)
    }
  }
}

// ======== 白天弹窗 ========

Renderer.prototype.drawRecipeChoiceDialog = function (customerId, discoveredRecipes) {
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, W, H)

  var dW = 320, dH = 350
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, '#FFF')
  this.text('🍽 选择出餐食谱', W / 2, dY + 20, { fontSize: 18, bold: true, align: 'center' })

  var listY = dY + 50
  for (var i = 0; i < discoveredRecipes.length; i++) {
    var r = discoveredRecipes[i]
    var ry = listY + i * 44
    if (ry + 40 > dY + dH - 50) break

    this.rr(dX + 12, ry, dW - 24, 38, 8, C.theme.creamWhite, C.theme.warmOrange, 1)
    this.text(r.recipe.icon + ' ' + r.recipe.name, dX + 24, ry + 8, { fontSize: 14, bold: true })
    this.text('⭐' + r.recipe.starRating + '  💰' + r.recipe.price, dX + dW - 60, ry + 8, { fontSize: 11, color: C.theme.lightText })
  }

  if (discoveredRecipes.length === 0) {
    this.text('还没有发现食谱！去夜晚研发吧', W / 2, dY + 120, { fontSize: 13, color: C.theme.lightText, align: 'center' })
  }

  // 取消
  this.rr(dX + 12, dY + dH - 42, dW - 24, 34, 17, '#E8DDD0')
  this.text('取消', W / 2, dY + dH - 34, { fontSize: 14, color: C.theme.lightText, align: 'center' })
}

Renderer.prototype.drawExploreResult = function (result) {
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, W, H)

  var dW = 300, dH = 280
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, '#FFF')
  this.rr(dX, dY, dW, 40, 16, C.theme.grassGreen)
  this.rr(dX, dY + 24, dW, 16, 0, C.theme.grassGreen)
  this.text('🎒 探索收获！', W / 2, dY + 10, { fontSize: 16, color: '#FFF', bold: true, align: 'center' })

  var listY = dY + 60
  for (var i = 0; i < result.ingredients.length; i++) {
    var ing = result.ingredients[i]
    var iy = listY + i * 40
    this.rr(dX + 20, iy, dW - 40, 32, 8, C.theme.creamWhite)
    this.text('🧺 ' + ing.name + ' ×' + ing.quantity, dX + 30, iy + 7, { fontSize: 14, bold: true })
  }

  // 确认
  this.drawButton(W / 2 - 60, dY + dH - 55, 120, 38, '太棒了！', { fontSize: 14 })
}

// ======== 夜晚场景 ========

Renderer.prototype.drawNightScene = function (stats, inventory, wholesaleCount) {
  var w = this.width, h = this.height

  // 深色背景
  var ctx = this.ctx
  ctx.fillStyle = C.theme.nightBg
  ctx.fillRect(0, 0, w, h)

  // 星星
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  for (var i = 0; i < 20; i++) {
    var sx = (i * 37 + 13) % w
    var sy = (i * 53 + 7) % 60 + 55
    ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill()
  }

  // 顶部状态栏（夜晚版本）
  this.rr(0, 0, w, 50, 0, C.theme.nightCard)
  this.text('🌙 夜晚研发', 14, 8, { fontSize: 13, color: '#FFF', bold: true })
  this.text('🏠 Lv.' + stats.shopLevel, 14, 28, { fontSize: 11, color: 'rgba(255,255,255,0.6)' })

  var goldX = w - 120
  this.rr(goldX, 8, 110, 34, 15, 'rgba(255,255,255,0.1)')
  this.text('💰 ' + stats.gold, goldX + 10, 15, { fontSize: 14, color: C.theme.starGold, bold: true })
  this.text('📦 ' + stats.inventoryTotal + '/' + stats.maxInventory, goldX + 10, 31, { fontSize: 10, color: 'rgba(255,255,255,0.6)' })

  // 狐狸（夜晚坐姿）
  this.drawFox('idle', w / 2, 130, 50)

  // 操作卡片
  var cardY = 170
  var cardH = 80
  var gap = 8
  var cardW = w - 30

  // 卡片1: 食材研发
  this.rr(15, cardY, cardW, cardH, 12, C.theme.nightCard)
  this.text('🧪 食材研发', 30, cardY + 12, { fontSize: 15, bold: true, color: '#FFF' })
  this.text('选择 2-5 种食材进行组合，尝试发现新食谱', 30, cardY + 36, { fontSize: 11, color: 'rgba(255,255,255,0.6)' })
  this.text('📦 库存: ' + stats.inventoryTotal + '/' + stats.maxInventory, 30, cardY + 56, { fontSize: 11, color: C.theme.lightText })
  this.drawButton(cardW - 80, cardY + 18, 65, 40, '开始', { fontSize: 13 })

  // 卡片2: 菜单管理
  var card2Y = cardY + cardH + gap
  this.rr(15, card2Y, cardW, cardH, 12, C.theme.nightCard)
  this.text('📋 菜单管理', 30, card2Y + 12, { fontSize: 15, bold: true, color: '#FFF' })
  this.text('当前菜单位: ' + stats.menuCount + '/' + stats.maxMenuSlots, 30, card2Y + 36, { fontSize: 11, color: 'rgba(255,255,255,0.6)' })
  this.drawButton(cardW - 80, card2Y + 18, 65, 40, '管理', { fontSize: 13, bg: C.theme.labBlue })

  // 卡片3: 批发商
  var card3Y = card2Y + cardH + gap
  this.rr(15, card3Y, cardW, cardH, 12, C.theme.nightCard)
  this.text('🏪 批发商', 30, card3Y + 12, { fontSize: 15, bold: true, color: '#FFF' })
  this.text('可购买食材: ' + wholesaleCount + ' 种', 30, card3Y + 36, { fontSize: 11, color: 'rgba(255,255,255,0.6)' })
  this.drawButton(cardW - 80, card3Y + 18, 65, 40, '逛逛', { fontSize: 13, bg: C.theme.eggYellow, textColor: C.theme.darkText })

  // 周期倒计时
  if (stats.periodRemaining) {
    var secs = Math.ceil(stats.periodRemaining / 1000)
    this.text('⏱ 剩余 ' + secs + '秒', w / 2, h - 12, { fontSize: 11, color: 'rgba(255,255,255,0.4)', align: 'center' })
  }
}

// ======== 食材选择面板 ========

Renderer.prototype.drawIngredientSelector = function (inventory, selected) {
  selected = selected || []
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, W, H)

  var dW = 340, dH = 440
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, C.theme.nightCard)
  this.text('🧪 选择研发食材', W / 2, dY + 18, { fontSize: 17, bold: true, color: '#FFF', align: 'center' })
  var selectedText = '已选 ' + selected.length + '/5 种'
  this.text(selectedText, W / 2, dY + 42, { fontSize: 11, color: selected.length >= 2 ? C.theme.grassGreen : 'rgba(255,255,255,0.5)', align: 'center' })

  // 食材列表
  var names = Object.keys(inventory)
  var listY = dY + 60
  var cellH = 32
  var cols = 2
  var cellW = (dW - 40) / cols

  for (var i = 0; i < Math.min(names.length, 20); i++) {
    var col = i % cols
    var row = Math.floor(i / cols)
    var ix = dX + 15 + col * cellW
    var iy = listY + row * (cellH + 4)

    var isSelected = selected.indexOf(names[i]) !== -1
    var bgColor = isSelected ? '#2a5a3a' : '#1a2a45'
    var borderColor = isSelected ? C.theme.grassGreen : '#3a5a8a'
    this.rr(ix, iy, cellW - 10, cellH, 6, bgColor, borderColor, isSelected ? 2 : 1)
    this.text((isSelected ? '✅ ' : '') + names[i], ix + 8, iy + 7, { fontSize: 12, color: isSelected ? '#FFF' : '#CCC' })
    this.text('×' + inventory[names[i]], ix + cellW - 30, iy + 7, { fontSize: 11, color: C.theme.lightText })
  }

  if (names.length === 0) {
    this.text('仓库空空如也... 去探索或批发吧', W / 2, dY + 160, { fontSize: 13, color: 'rgba(255,255,255,0.5)', align: 'center' })
  }

  // 研发按钮
  this.drawButton(dX + 15, dY + dH - 55, dW - 30, 38, '🔥 研发！', { fontSize: 14, bg: C.theme.tomatoRed })

  // 取消
  this.drawButton(dX + 15, dY + dH - 100, dW - 30, 34, '取消', { fontSize: 13, bg: '#3a5a8a', textColor: '#CCC' })
}

// ======== 研发结果弹窗 ========

Renderer.prototype.drawDiscoverResult = function (result) {
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(0, 0, W, H)

  var dW = 320, dH = 360
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, '#FFF')

  if (result.result === 'discover') {
    // 发现新食谱
    this.rr(dX, dY, dW, 45, 16, C.theme.grassGreen)
    this.rr(dX, dY + 29, dW, 16, 0, C.theme.grassGreen)
    this.text('🎉 发现新食谱！', W / 2, dY + 12, { fontSize: 17, color: '#FFF', bold: true, align: 'center' })

    var r = result.recipe
    this.text(r.icon + ' ' + r.name, W / 2, dY + 60, { fontSize: 20, bold: true, align: 'center' })
    this.text('⭐' + r.starRating + '  💰' + r.price, W / 2, dY + 88, { fontSize: 13, color: C.theme.warmOrange, bold: true, align: 'center' })

    // 配料
    this.text('📋 配料:', dX + 20, dY + 115, { fontSize: 11, color: C.theme.lightText, bold: true })
    var ingStr = r.ingredients.join(' · ')
    this.text(ingStr, dX + 20, dY + 135, { fontSize: 10, color: C.theme.darkText })
  } else if (result.result === 'mastery') {
    this.rr(dX, dY, dW, 45, 16, C.theme.labBlue)
    this.rr(dX, dY + 29, dW, 16, 0, C.theme.labBlue)
    this.text('🔁 熟练度提升！', W / 2, dY + 12, { fontSize: 17, color: '#FFF', bold: true, align: 'center' })

    var r = result.recipe
    this.text(r.icon + ' ' + r.name, W / 2, dY + 60, { fontSize: 20, bold: true, align: 'center' })
    this.text('熟练度 +' + result.xpGained, W / 2, dY + 95, { fontSize: 14, color: C.theme.warmOrange, bold: true, align: 'center' })
  } else {
    this.rr(dX, dY, dW, 45, 16, C.theme.lightText)
    this.rr(dX, dY + 29, dW, 16, 0, C.theme.lightText)
    this.text('😅 这组合做不出什么...', W / 2, dY + 12, { fontSize: 16, color: '#FFF', bold: true, align: 'center' })

    this.text(result.msg || '返还了一半食材', W / 2, dY + 80, { fontSize: 13, color: C.theme.lightText, align: 'center' })
  }

  // 狐狸反应
  this.drawFox(result.result === 'discover' ? 'excited' : 'happy', W / 2, dY + 155, 50)

  // 确认
  this.drawButton(dX + 20, dY + dH - 55, dW - 40, 40, '确认', { fontSize: 15 })
}

// ======== 菜单管理界面 ========

Renderer.prototype.drawMenuManagement = function (menu, maxSlots, allRecipes, discoveredMap) {
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(0, 0, W, H)

  var dW = 340, dH = 480
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, '#FFF')
  this.text('📋 菜单管理', W / 2, dY + 16, { fontSize: 17, bold: true, align: 'center' })
  this.text('已用 ' + menu.length + '/' + maxSlots + ' 个菜单位', W / 2, dY + 40, { fontSize: 11, color: C.theme.lightText, align: 'center' })

  // 当前菜单
  var listY = dY + 55
  this.text('— 当前菜单 —', W / 2, listY, { fontSize: 12, color: C.theme.warmOrange, align: 'center' })

  for (var i = 0; i < menu.length; i++) {
    var recipe = null
    for (var j = 0; j < allRecipes.length; j++) {
      if (allRecipes[j].id === menu[i]) { recipe = allRecipes[j]; break }
    }
    if (!recipe) continue

    var ry = listY + 20 + i * 34
    this.rr(dX + 15, ry, dW - 60, 28, 6, C.theme.creamWhite)
    this.text(recipe.icon + ' ' + recipe.name, dX + 24, ry + 5, { fontSize: 12, bold: true })
    var onMenu = menu.indexOf(recipe.id) !== -1
    this.text(onMenu ? '✅' : '⬜', dX + dW - 35, ry + 3, { fontSize: 14 })
  }

  // 所有已发现的可添加食谱
  var addListY = listY + 20 + menu.length * 34 + 10
  this.text('— 可添加的食谱 —', W / 2, addListY, { fontSize: 12, color: C.theme.grassGreen, align: 'center' })

  var addedCount = 0
  for (var k = 0; k < allRecipes.length; k++) {
    var r = allRecipes[k]
    if (menu.indexOf(r.id) !== -1) continue
    if (!discoveredMap[r.id]) continue
    if (addedCount >= 8) break

    var ay = addListY + 20 + addedCount * 34
    this.rr(dX + 15, ay, dW - 30, 28, 6, '#F5EDE0', '#CCC', 1)
    this.text(r.icon + ' ' + r.name, dX + 24, ay + 5, { fontSize: 12 })
    addedCount++
  }

  if (addedCount === 0) {
    this.text('(没有可添加的食谱)', W / 2, addListY + 30, { fontSize: 11, color: C.theme.lightText, align: 'center' })
  }

  // 返回
  this.drawButton(dX + 15, dY + dH - 40, dW - 30, 32, '返回', { fontSize: 13, bg: '#E8DDD0', textColor: C.theme.darkText })
}

// ======== 批发商界面 ========

Renderer.prototype.drawWholesaleDialog = function (items, gold) {
  var ctx = this.ctx
  var W = this.width, H = this.height

  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(0, 0, W, H)

  var dW = 340, dH = 420
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  this.rr(dX, dY, dW, dH, 16, '#FFF')
  this.text('🏪 批发商', W / 2, dY + 16, { fontSize: 17, bold: true, align: 'center' })
  this.text('💰 ' + gold, W / 2, dY + 38, { fontSize: 12, color: C.theme.warmOrange, bold: true, align: 'center' })

  if (items.length === 0) {
    this.text('今日商品已售罄', W / 2, dY + 100, { fontSize: 14, color: C.theme.lightText, align: 'center' })
  }

  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var iy = dY + 55 + i * 50
    var rarityColor = item.rarity === 'common' ? '#4CAF50' : item.rarity === 'uncommon' ? '#2196F3' : '#FF9800'

    this.rr(dX + 12, iy, dW - 24, 42, 8, '#F5EDE0', rarityColor, 1)
    this.text(item.name, dX + 24, iy + 6, { fontSize: 13, bold: true })
    this.text('×' + item.quantity, dX + 140, iy + 6, { fontSize: 11, color: C.theme.lightText })
    this.text('💰 ' + (item.price * item.quantity), dX + dW - 80, iy + 6, { fontSize: 12, color: C.theme.warmOrange, bold: true })
    this.text('💎 ' + item.rarity, dX + dW - 80, iy + 24, { fontSize: 10, color: rarityColor })
  }

  // 刷新按钮
  this.drawButton(dX + 15, dY + dH - 85, (dW - 45) / 2, 32, '🔄 刷新 (' + C.wholesale.refreshCost + ')', { fontSize: 11, bg: C.theme.labBlue })
  // 返回
  this.drawButton(dX + (dW - 45) / 2 + 30, dY + dH - 85, (dW - 45) / 2, 32, '返回', { fontSize: 12, bg: '#E8DDD0', textColor: C.theme.darkText })
}

// ======== 升级界面 ========

Renderer.prototype.drawUpgradeScreen = function (shopInfo, foxInfo, gold) {
  var W = this.width, H = this.height

  this.clear()
  this.text('⬆ 升级', W / 2, 16, { fontSize: 18, bold: true, align: 'center' })

  // 店铺升级面板
  var panelY = 50
  this.rr(12, panelY, W - 24, 100, 12, '#FFF', C.theme.warmOrange, 1)
  this.text('🏠 店铺 Lv.' + shopInfo.level, 24, panelY + 10, { fontSize: 14, bold: true })
  this.text(shopInfo.current.name, 24, panelY + 32, { fontSize: 12, color: C.theme.lightText })

  var attrStr = '👥 ' + shopInfo.current.maxCustomers + '  📋 ' + shopInfo.current.menuSlots +
                '  📦 ' + shopInfo.current.maxInventory
  this.text(attrStr, 24, panelY + 52, { fontSize: 12, color: C.theme.lightText })

  if (shopInfo.next) {
    var canUpShop = gold >= shopInfo.next.upgradeCost
    this.drawButton(W - 100, panelY + 16, 80, 32, canUpShop ? '升级' : '💰不足', {
      bg: canUpShop ? C.theme.warmOrange : '#CCC', fontSize: 12,
    })
    this.text('下一级: ' + shopInfo.next.upgradeCost + '💰', W - 100, panelY + 55, { fontSize: 10, color: C.theme.lightText, align: 'center' })
  } else {
    this.text('🏆 满级！', W - 80, panelY + 30, { fontSize: 14, color: C.theme.eggYellow, bold: true, align: 'center' })
  }

  // 狐狸升级面板
  var foxPanelY = panelY + 115
  this.rr(12, foxPanelY, W - 24, 100, 12, '#FFF', C.theme.warmOrange, 1)
  this.drawFox(foxInfo.isMax ? 'happy' : 'idle', 56, foxPanelY + 32, 50)
  this.text('🦊 狐狸 Lv.' + foxInfo.level, 90, foxPanelY + 10, { fontSize: 14, bold: true })
  this.text(foxInfo.current.icon + ' ' + foxInfo.current.name, 90, foxPanelY + 32, { fontSize: 12, color: C.theme.lightText })

  var foxAttr = '⚡ ' + foxInfo.current.serveSpeed + 'x  🔍 ' + foxInfo.current.exploreQuality + 'x  ❤ ' + foxInfo.current.customerFavor + 'x'
  this.text(foxAttr, 90, foxPanelY + 54, { fontSize: 11, color: C.theme.lightText })

  if (foxInfo.next) {
    var canUpFox = gold >= foxInfo.next.upgradeCost
    this.drawButton(W - 100, foxPanelY + 16, 80, 32, canUpFox ? '升级' : '💰不足', {
      bg: canUpFox ? C.theme.warmOrange : '#CCC', fontSize: 12,
    })
    this.text('下一级: ' + foxInfo.next.upgradeCost + '💰', W - 100, foxPanelY + 55, { fontSize: 10, color: C.theme.lightText, align: 'center' })
  } else {
    this.text('🏆 满级！', W - 80, foxPanelY + 30, { fontSize: 14, color: C.theme.eggYellow, bold: true, align: 'center' })
  }

  // 返回
  this.drawButton(W / 2 - 60, H - 45, 120, 34, '← 返回', { bg: '#E8DDD0', textColor: C.theme.darkText, fontSize: 12 })
}

// ======== 统计界面 ========

Renderer.prototype.drawStatsScreen = function (stats, discoveredRecipes) {
  var W = this.width, H = this.height

  this.clear()
  this.text('📊 经营统计', W / 2, 14, { fontSize: 18, bold: true, align: 'center' })

  var listY = 45
  var statsData = [
    { label: '已过天数', value: stats.dayCount + ' 天' },
    { label: '总收入', value: '💰 ' + stats.totalEarned },
    { label: '服务顾客', value: '👥 ' + stats.totalServed },
    { label: '发现食谱', value: '📖 ' + stats.discoveredCount + '/' + stats.totalRecipes },
    { label: '探索次数', value: '🔍 ' + stats.totalExploreCount },
    { label: '店铺等级', value: '🏠 Lv.' + stats.shopLevel + ' ' + stats.shopName },
    { label: '狐狸等级', value: '🦊 Lv.' + stats.foxLevel + ' ' + stats.foxName },
  ]

  for (var i = 0; i < statsData.length; i++) {
    var sy = listY + i * 36
    this.rr(15, sy, W - 30, 30, 8, '#FFF', '#E8DDD0', 1)
    this.text(statsData[i].label, 24, sy + 7, { fontSize: 12 })
    this.text(statsData[i].value, W - 24, sy + 7, { fontSize: 12, color: C.theme.warmOrange, bold: true, align: 'right' })
  }

  // 食谱图鉴
  var recipeY = listY + statsData.length * 36 + 10
  this.text('📖 已发现食谱', W / 2, recipeY, { fontSize: 14, bold: true, align: 'center' })

  for (var j = 0; j < discoveredRecipes.length; j++) {
    var r = discoveredRecipes[j]
    var ry = recipeY + 24 + j * 30
    if (ry > H - 50) break
    this.rr(15, ry, W - 15, 26, 6, '#FFF', '#E8DDD0', 1)
    this.text(r.recipe.icon + ' ' + r.recipe.name, 24, ry + 5, { fontSize: 11, bold: true })
    this.text('⭐' + r.recipe.starRating + '  🫸' + r.data.xp, W - 24, ry + 5, { fontSize: 10, color: C.theme.lightText, align: 'right' })
  }

  if (discoveredRecipes.length === 0) {
    this.text('还没有发现任何食谱', W / 2, recipeY + 30, { fontSize: 12, color: C.theme.lightText, align: 'center' })
  }

  // 返回
  this.drawButton(W / 2 - 50, H - 38, 100, 30, '← 返回', { bg: '#E8DDD0', textColor: C.theme.darkText, fontSize: 11 })
}

window.Renderer = Renderer


// ====== main.js ======
/**
 * 狐狸的烘焙坊 - 游戏主入口
 * 昼夜循环、触摸交互、页面流转
 */
var C = window.GameConfig
var Engine = window.GameEngine
var Renderer = window.Renderer
var RC = window.RecipeChain

var canvas = wx.createCanvas()
var renderer = new Renderer(canvas)
var engine = new Engine()

var W = canvas.width
var H = canvas.height

// 页面状态
var page = { name: 'dayScene', data: {} }
var buttons = []
var touchX = 0, touchY = 0
var tickInterval = null
var foxMood = 'idle'

// 选中的食材（研发用）
var selectedIngredients = []

// 探索计时器
var exploreTimer = null

// ======== 离线处理 ========

var offlineResult = engine.processOffline()

// ======== 获取渲染用的 stats（含 periodRemaining） ========

function getStats() {
  var stats = engine.getStats()
  var now = Date.now()
  var elapsed = now - engine.state.periodStartTime
  var duration = engine.state.currentPeriod === 'day' ? C.dayDuration : C.nightDuration
  stats.periodRemaining = Math.max(0, duration - elapsed)
  return stats
}

// ======== 白天场景绘制 ========

function renderDayScene() {
  var stats = getStats()
  var customers = engine.state.currentCustomers

  renderer.drawDayScene(stats, customers)
  buttons = buildDayButtons(stats)
}

function buildDayButtons(stats) {
  var btns = []
  var w = W, h = H
  var bY = h - 44
  var btnW = Math.floor((w - 55) / 4)
  var btnH = 36

  // 探索按钮
  btns.push({ x: 10, y: bY, w: btnW, h: btnH, action: 'startExplore' })
  // 菜单按钮（白天打开菜单管理）
  btns.push({ x: 15 + btnW, y: bY, w: btnW, h: btnH, action: 'menuManage' })
  // 升级按钮
  btns.push({ x: 20 + btnW * 2, y: bY, w: btnW, h: btnH, action: 'upgrade' })
  // 统计按钮
  btns.push({ x: 25 + btnW * 3, y: bY, w: btnW, h: btnH, action: 'stats' })

  // 顾客点击
  var customers = engine.state.currentCustomers
  for (var i = 0; i < customers.length; i++) {
    var c = customers[i]
    var cx = 30 + i * (w - 60) / Math.max(3, customers.length)
    var cy = 70 + (i % 2) * 60
    if (c.state === 'waiting') {
      btns.push({ x: cx - 20, y: cy - 12, w: 40, h: 60, action: 'customerTap', customerId: c.id })
    }
  }

  return btns
}

// ======== 夜晚场景绘制 ========

function renderNightScene() {
  var stats = getStats()
  var inventory = engine.getInventory()
  var wholesaleItems = engine.state.wholesaleItems

  renderer.drawNightScene(stats, inventory, wholesaleItems.length)
  buttons = buildNightButtons(stats)
}

function buildNightButtons(stats) {
  var btns = []
  var w = W, h = H
  var cardY = 170
  var cardH = 80
  var gap = 8
  var cardW = w - 30

  // 卡片1: 食材研发
  btns.push({ x: cardW - 80, y: cardY + 18, w: 65, h: 40, action: 'openIngredientSelector' })

  // 卡片2: 菜单管理
  btns.push({ x: cardW - 80, y: cardY + cardH + gap + 18, w: 65, h: 40, action: 'menuManage' })

  // 卡片3: 批发商
  btns.push({ x: cardW - 80, y: cardY + (cardH + gap) * 2 + 18, w: 65, h: 40, action: 'wholesale' })

  return btns
}

// ======== 食材选择面板 ========

function renderIngredientSelector() {
  var inventory = engine.getInventory()
  renderer.drawIngredientSelector(inventory, selectedIngredients)

  var W2 = W, H2 = H
  var dW = 340, dH = 440
  var dX = (W2 - dW) / 2, dY = (H2 - dH) / 2

  buttons = []

  // 食材格子
  var names = Object.keys(inventory)
  var cellH = 32
  var cols = 2
  var cellW = (dW - 40) / cols
  var listY = dY + 60

  for (var i = 0; i < Math.min(names.length, 20); i++) {
    var col = i % cols
    var row = Math.floor(i / cols)
    var ix = dX + 15 + col * cellW
    var iy = listY + row * (cellH + 4)
    buttons.push({ x: ix, y: iy, w: cellW - 10, h: cellH, action: 'toggleIngredient', ingredient: names[i] })
  }

  // 研发按钮
  buttons.push({ x: dX + 15, y: dY + dH - 55, w: dW - 30, h: 38, action: 'doDiscover' })

  // 取消
  buttons.push({ x: dX + 15, y: dY + dH - 100, w: dW - 30, h: 34, action: 'closeDialog' })
}

// ======== 食谱选择弹窗（白天出餐用） ========

function renderRecipeChoice(customerId) {
  var discovered = engine.getDiscoveredRecipes()
  renderer.drawRecipeChoiceDialog(customerId, discovered)

  var dW = 320, dH = 350
  var dX = (W - dW) / 2, dY = (H - dH) / 2
  var listY = dY + 50

  buttons = []
  for (var i = 0; i < discovered.length; i++) {
    var ry = listY + i * 44
    if (ry + 40 > dY + dH - 50) break
    buttons.push({
      x: dX + 12, y: ry, w: dW - 24, h: 38,
      action: 'serveCustomer', customerId: customerId, recipeId: discovered[i].recipe.id,
    })
  }

  // 取消
  buttons.push({ x: dX + 12, y: dY + dH - 42, w: dW - 24, h: 34, action: 'closeDialog' })
}

// ======== 结果弹窗 ========

function renderExploreResult() {
  var result = engine.state.exploreResult
  if (!result) { page.name = 'dayScene'; renderDayScene(); return }

  renderer.drawExploreResult(result)

  buttons = [{ x: W / 2 - 60, y: 300, w: 120, h: 38, action: 'closeDialog' }]
}

function renderDiscoverResult() {
  var result = page.data.discoverResult
  if (!result) { page.name = 'nightScene'; renderNightScene(); return }

  renderer.drawDiscoverResult(result)

  var dW = 320
  var dX = (W - dW) / 2
  buttons = [{ x: dX + 20, y: 390, w: dW - 40, h: 40, action: 'closeDialog' }]
}

// ======== 菜单管理界面 ========

function renderMenuManage() {
  // 收集已发现的食谱ID和所有食谱
  var discoveredMap = engine.state.discoveredRecipes
  var allRecipes = RC.recipes
  var menu = engine.getMenu()

  renderer.drawMenuManagement(menu, engine.state.maxMenuSlots, allRecipes, discoveredMap)

  var dW = 340, dH = 480
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  buttons = []

  // 当前菜单 - 点击移除
  var listY = dY + 75
  for (var i = 0; i < menu.length; i++) {
    var ry = listY + i * 34
    buttons.push({ x: dX + dW - 45, y: ry, w: 30, h: 28, action: 'removeFromMenu', recipeId: menu[i] })
  }

  // 可添加的食谱 - 点击添加
  var addListY = listY + menu.length * 34 + 30
  var addedCount = 0
  for (var k = 0; k < allRecipes.length; k++) {
    var r = allRecipes[k]
    if (menu.indexOf(r.id) !== -1) continue
    if (!discoveredMap[r.id]) continue
    if (addedCount >= 8) break
    var ay = addListY + 20 + addedCount * 34
    buttons.push({ x: dX + 15, y: ay, w: dW - 30, h: 28, action: 'addToMenu', recipeId: r.id })
    addedCount++
  }

  // 返回
  buttons.push({ x: dX + 15, y: dY + dH - 40, w: dW - 30, h: 32, action: 'closeDialog' })
}

// ======== 批发商界面 ========

function renderWholesale() {
  var items = engine.state.wholesaleItems
  if (items.length === 0) {
    engine.generateWholesaleItems()
    items = engine.state.wholesaleItems
  }

  renderer.drawWholesaleDialog(items, engine.state.gold)

  var dW = 340, dH = 420
  var dX = (W - dW) / 2, dY = (H - dH) / 2

  buttons = []

  // 商品点击购买
  for (var i = 0; i < items.length; i++) {
    var iy = dY + 55 + i * 50
    buttons.push({ x: dX + 12, y: iy, w: dW - 24, h: 42, action: 'buyWholesale', index: i })
  }

  // 刷新
  buttons.push({ x: dX + 15, y: dY + dH - 85, w: (dW - 45) / 2, h: 32, action: 'refreshWholesale' })
  // 返回
  buttons.push({ x: dX + (dW - 45) / 2 + 30, y: dY + dH - 85, w: (dW - 45) / 2, h: 32, action: 'closeDialog' })
}

// ======== 升级界面 ========

function renderUpgrade() {
  var shopInfo = engine.getShopInfo()
  var foxInfo = engine.getFoxInfo()
  var gold = engine.state.gold

  renderer.drawUpgradeScreen(shopInfo, foxInfo, gold)

  var W2 = W, H2 = H

  buttons = []

  // 店铺升级按钮
  var panelY = 50
  if (shopInfo.next) {
    buttons.push({ x: W2 - 100, y: panelY + 16, w: 80, h: 32, action: 'upgradeShop' })
  }

  // 狐狸升级按钮
  var foxPanelY = panelY + 115
  if (foxInfo.next) {
    buttons.push({ x: W2 - 100, y: foxPanelY + 16, w: 80, h: 32, action: 'upgradeFox' })
  }

  // 返回
  buttons.push({ x: W2 / 2 - 60, y: H2 - 45, w: 120, h: 34, action: 'closeDialog' })
}

// ======== 统计界面 ========

function renderStats() {
  var stats = getStats()
  var discovered = engine.getDiscoveredRecipes()

  renderer.drawStatsScreen(stats, discovered)

  buttons = [{ x: W / 2 - 50, y: H - 38, w: 100, h: 30, action: 'closeDialog' }]
}

// ======== 动作处理 ========

function handleAction(btn) {
  switch (btn.action) {
    case 'startExplore':
      handleStartExplore()
      break
    case 'customerTap':
      handleCustomerTap(btn.customerId)
      break
    case 'serveCustomer':
      handleServeCustomer(btn.customerId, btn.recipeId)
      break
    case 'menuManage':
      page = { name: 'menuManage', data: {} }
      renderMenuManage()
      break
    case 'addToMenu':
      handleAddToMenu(btn.recipeId)
      break
    case 'removeFromMenu':
      handleRemoveFromMenu(btn.recipeId)
      break
    case 'openIngredientSelector':
      page = { name: 'ingredientSelector', data: {} }
      selectedIngredients = []
      renderIngredientSelector()
      break
    case 'toggleIngredient':
      handleToggleIngredient(btn.ingredient)
      break
    case 'doDiscover':
      handleDiscover()
      break
    case 'wholesale':
      page = { name: 'wholesale', data: {} }
      renderWholesale()
      break
    case 'buyWholesale':
      handleBuyWholesale(btn.index)
      break
    case 'refreshWholesale':
      handleRefreshWholesale()
      break
    case 'upgrade':
      page = { name: 'upgrade', data: {} }
      renderUpgrade()
      break
    case 'upgradeShop':
      handleUpgradeShop()
      break
    case 'upgradeFox':
      handleUpgradeFox()
      break
    case 'stats':
      page = { name: 'stats', data: {} }
      renderStats()
      break
    case 'closeDialog':
      if (engine.state.currentPeriod === 'day') {
        page = { name: 'dayScene', data: {} }
        renderDayScene()
      } else {
        page = { name: 'nightScene', data: {} }
        renderNightScene()
      }
      break
  }
}

// ======== 操作实现 ========

function handleStartExplore() {
  var result = engine.startExplore()
  if (result.success) {
    foxMood = 'exploring'

    // 30秒后探索完成
    if (exploreTimer) clearTimeout(exploreTimer)
    exploreTimer = setTimeout(function () {
      var res = engine.completeExplore()
      if (res) {
        page = { name: 'exploreResult', data: {} }
        renderExploreResult()
      }
    }, engine.state.exploreDuration)

    renderDayScene()
  } else {
    foxMood = 'sad'
    renderDayScene()
    // 简单提示
    renderer.text('❌ ' + result.msg, W / 2, H / 2, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
  }
}

function handleCustomerTap(customerId) {
  var c = engine.findCustomer(customerId)
  if (!c) return
  if (c.state !== 'waiting') return

  // 如果顾客已经指定了菜单且玩家已发现该食谱，直接出餐
  if (c.orderItem && engine.state.discoveredRecipes[c.orderItem]) {
    var result = engine.startServing(customerId, c.orderItem)
    if (result.success) {
      foxMood = 'working'
      renderDayScene()
      return
    }
  }

  // 否则打开食谱选择
  page = { name: 'recipeChoice', data: { customerId: customerId } }
  renderRecipeChoice(customerId)
}

function handleServeCustomer(customerId, recipeId) {
  var result = engine.startServing(customerId, recipeId)
  if (result.success) {
    foxMood = 'working'
    page = { name: 'dayScene', data: {} }
    renderDayScene()
  } else {
    foxMood = 'sad'
    renderRecipeChoice(customerId)
    renderer.text('❌ ' + result.msg, W / 2, 380, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
  }
}

function handleToggleIngredient(name) {
  var idx = selectedIngredients.indexOf(name)
  if (idx !== -1) {
    selectedIngredients.splice(idx, 1)
  } else {
    if (selectedIngredients.length >= 5) return
    selectedIngredients.push(name)
  }
  renderIngredientSelector()
  // 显示已选数量
  if (selectedIngredients.length > 0) {
    renderer.text('✅ 已选 ' + selectedIngredients.length + ' 种', W / 2, 30, { fontSize: 14, color: C.theme.grassGreen, bold: true, align: 'center' })
  }
}

function handleDiscover() {
  if (selectedIngredients.length < 2) {
    renderIngredientSelector()
    renderer.text('❌ 至少选 2 种食材', W / 2, 60, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
    return
  }

  // 去重
  var uniqueIngs = []
  for (var i = 0; i < selectedIngredients.length; i++) {
    if (uniqueIngs.indexOf(selectedIngredients[i]) === -1) uniqueIngs.push(selectedIngredients[i])
  }

  var result = engine.attemptDiscover(uniqueIngs)
  if (result.success) {
    page = { name: 'discoverResult', data: { discoverResult: result } }
    renderDiscoverResult()
  } else {
    renderIngredientSelector()
    renderer.text('❌ ' + result.msg, W / 2, 60, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
  }
}

function handleAddToMenu(recipeId) {
  engine.addToMenu(recipeId)
  renderMenuManage()
}

function handleRemoveFromMenu(recipeId) {
  engine.removeFromMenu(recipeId)
  renderMenuManage()
}

function handleBuyWholesale(index) {
  var result = engine.buyWholesaleItem(index)
  if (result.success) {
    renderWholesale()
    renderer.text('✅ 购买 ' + result.name + ' ×' + result.quantity, W / 2, 30, { fontSize: 13, color: C.theme.grassGreen, bold: true, align: 'center' })
  } else {
    renderWholesale()
    renderer.text('❌ ' + result.msg, W / 2, 30, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
  }
}

function handleRefreshWholesale() {
  var result = engine.refreshWholesale()
  if (result.success) {
    renderWholesale()
  } else {
    renderWholesale()
    renderer.text('❌ ' + result.msg, W / 2, 30, { fontSize: 13, color: C.theme.tomatoRed, bold: true, align: 'center' })
  }
}

function handleUpgradeShop() {
  var result = engine.upgradeShop()
  if (result.success) {
    foxMood = 'excited'
    renderUpgrade()
    renderer.text('🎉 店铺升级！Lv.' + result.newLevel, W / 2, 180, { fontSize: 16, color: C.theme.eggYellow, bold: true, align: 'center' })
  } else {
    foxMood = 'sad'
    renderUpgrade()
  }
}

function handleUpgradeFox() {
  var result = engine.upgradeFox()
  if (result.success) {
    foxMood = 'excited'
    renderUpgrade()
    renderer.text('🎉 狐狸升级！Lv.' + result.newLevel, W / 2, 280, { fontSize: 16, color: C.theme.eggYellow, bold: true, align: 'center' })
  } else {
    foxMood = 'sad'
    renderUpgrade()
  }
}

// ======== 定时更新 ========

function tick() {
  var now = Date.now()
  var elapsed = now - engine.state.periodStartTime

  // 昼夜切换检查
  if (engine.state.currentPeriod === 'day') {
      if (elapsed >= C.dayDuration) {
        // 清除探索计时器
        if (exploreTimer) { clearTimeout(exploreTimer); exploreTimer = null }
        engine.switchToNight()
      page = { name: 'nightScene', data: {} }
      renderNightScene()
      return
    }
    // 白天逻辑
    updateDay(now)
  } else if (engine.state.currentPeriod === 'night') {
    if (elapsed >= C.nightDuration) {
      engine.switchToDay()
      page = { name: 'dayScene', data: {} }
      renderDayScene()
      return
    }
    // 夜晚只更新倒计时
  }

  // 刷新当前页面
  refreshCurrentPage()
}

function updateDay(now) {
  // 顾客生成
  var maxCustomers = engine.getMaxCustomers()
  if (engine.state.currentCustomers.length < maxCustomers) {
    // 随机概率生成
    if (Math.random() < C.customer.generateChance) {
      // 避免生成太密集，检查上一个顾客生成时间
      var lastCustomer = engine.state.currentCustomers[engine.state.currentCustomers.length - 1]
      if (!lastCustomer || (now - lastCustomer.enterTime) > 2000) {
        var customer = engine.generateCustomer()
        engine.state.currentCustomers.push(customer)
      }
    }
  }

  // 更新所有顾客
  var customers = engine.state.currentCustomers
  for (var i = customers.length - 1; i >= 0; i--) {
    engine.updateCustomer(customers[i])
  }
}

function refreshCurrentPage() {
  switch (page.name) {
    case 'dayScene':
      renderDayScene()
      break
    case 'nightScene':
      renderNightScene()
      break
    case 'recipeChoice':
      renderRecipeChoice(page.data.customerId)
      break
    case 'upgrade':
      renderUpgrade()
      break
    case 'stats':
      renderStats()
      break
    case 'menuManage':
      renderMenuManage()
      break
    // 弹窗不自动刷新
  }
}

// ======== 触摸 ========

wx.onTouchStart(function (e) {
  touchX = e.touches[0].x
  touchY = e.touches[0].y
})

wx.onTouchEnd(function (e) {
  var ex = e.changedTouches[0].x
  var ey = e.changedTouches[0].y
  if (Math.abs(ex - touchX) > 15 || Math.abs(ey - touchY) > 15) return

  for (var i = 0; i < buttons.length; i++) {
    var b = buttons[i]
    if (ex >= b.x && ex <= b.x + b.w && ey >= b.y && ey <= b.y + b.h) {
      handleAction(b)
      return
    }
  }
})

// ======== 启动 ========

// 如果离线有收益，弹出提示
if (offlineResult && offlineResult.gold > 0) {
  setTimeout(function () {
    alert('🎉 离线收益: +' + offlineResult.gold + ' 金币 (' + offlineResult.elapsedMinutes + '分钟)')
  }, 500)
}

// 切换到首场景
if (engine.state.currentPeriod === 'day') {
  page = { name: 'dayScene', data: {} }
  renderDayScene()
} else {
  page = { name: 'nightScene', data: {} }
  renderNightScene()
}

// 定时刷新
tickInterval = setInterval(tick, 500)

