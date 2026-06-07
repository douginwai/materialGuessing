/**
 * 狐狸的烘焙坊 - 游戏配置
 */
module.exports = {
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

  // 昼夜周期（毫秒）- 测试阶段缩短方便体验
  dayDuration: 30 * 1000,    // 30秒白天（正式版 3分钟）
  nightDuration: 15 * 1000,  // 15秒夜晚（正式版 1分钟）

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
    duration: 10 * 1000,  // 10秒（测试用）
    baseIngredientCount: 1,
    maxIngredientCount: 3,
    spawnInterval: 10000,  // 顾客生成间隔
  },

  // 出餐配置
  serving: {
    baseTime: 5000,      // 基础制作时间 5秒
    eatTime: 3000,       // 顾客吃的时间 3秒
    settleDelay: 1000,   // 完成后延迟离开
  },

  // 顾客
  customer: {
    patienceMin: 15000,  // 最小耐心 15秒
    patienceMax: 25000,  // 最大耐心 25秒
    patienceTick: 500,   // 每 tick 减少量
    generateChance: 0.05, // 每 tick 生成概率（约每 10 秒一个）
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
