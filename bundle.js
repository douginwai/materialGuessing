
// ========================
// wx API Polyfill for Web
// ========================
;(function() {
  var canvas = document.getElementById('gameCanvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'gameCanvas'
    canvas.width = 375
    canvas.height = 667
    document.body.appendChild(canvas)
  }

  // 缩放以适应屏幕
  function resizeCanvas() {
    var maxW = window.innerWidth
    var maxH = window.innerHeight
    var scale = Math.min(maxW / 375, maxH / 667)
    canvas.style.width = (375 * scale) + 'px'
    canvas.style.height = (667 * scale) + 'px'
    canvas.style.position = 'absolute'
    canvas.style.left = ((maxW - 375 * scale) / 2) + 'px'
    canvas.style.top = ((maxH - 667 * scale) / 2) + 'px'
    canvas.style.borderRadius = '12px'
    canvas.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // wx 全局对象
  window.wx = {
    createCanvas: function() {
      return canvas
    },
    getSystemInfoSync: function() {
      return {
        pixelRatio: window.devicePixelRatio || 1,
        screenWidth: canvas.width,
        screenHeight: canvas.height,
        windowWidth: canvas.width,
        windowHeight: canvas.height,
      }
    },
    onTouchStart: function(cb) {
      canvas.addEventListener('touchstart', function(e) {
        e.preventDefault()
        var rect = canvas.getBoundingClientRect()
        var scaleX = canvas.width / rect.width
        var scaleY = canvas.height / rect.height
        var touch = e.touches[0]
        cb({
          touches: [{
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
          }]
        })
      }, { passive: false })
      // Also support mouse for desktop testing
      canvas.addEventListener('mousedown', function(e) {
        var rect = canvas.getBoundingClientRect()
        var scaleX = canvas.width / rect.width
        var scaleY = canvas.height / rect.height
        window._touchData = {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        }
      })
    },
    onTouchEnd: function(cb) {
      canvas.addEventListener('touchend', function(e) {
        e.preventDefault()
        var rect = canvas.getBoundingClientRect()
        var scaleX = canvas.width / rect.width
        var scaleY = canvas.height / rect.height
        var touch = e.changedTouches[0]
        cb({
          changedTouches: [{
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
          }]
        })
      }, { passive: false })
      canvas.addEventListener('mouseup', function(e) {
        var rect = canvas.getBoundingClientRect()
        var scaleX = canvas.width / rect.width
        var scaleY = canvas.height / rect.height
        if (window._touchData) {
          cb({
            changedTouches: [{
              x: (e.clientX - rect.left) * scaleX,
              y: (e.clientY - rect.top) * scaleY,
            }]
          })
          window._touchData = null
        }
      })
    },
  }
})();


// ====== config.js ======
/**
 * 游戏全局配置
 */
window.GameConfig = {
  gameName: '配料猜猜猜',
  version: '1.0.0',

  quiz: {
    questionsPerRound: 10,
    timePerQuestion: 15,
    speedBonusThreshold1: 5,
    speedBonusThreshold2: 10,
    baseScore: 10,
    speedBonus1: 5,
    speedBonus2: 2,
    maxComboBonus: 5,
    maxLives: 3,
  },

  theme: {
    warmOrange: '#FF7A33',
    creamWhite: '#FFF8EE',
    grassGreen: '#4CAF50',
    tomatoRed: '#FF5252',
    eggYellow: '#FFD54F',
    darkText: '#3D3226',
    lightText: '#8B7E6F',
    cardBg: '#FFFFFF',
  },

  categories: [
    { id: 'beverage', name: '饮料区', icon: '🥤', difficulty: 1 },
    { id: 'snack', name: '零食区', icon: '🍪', difficulty: 2 },
    { id: 'instant', name: '速食区', icon: '🍜', difficulty: 2 },
    { id: 'condiment', name: '调味区', icon: '🧂', difficulty: 3 },
    { id: 'icecream', name: '冰淇淋区', icon: '🧊', difficulty: 1 },
    { id: 'bakery', name: '烘焙区', icon: '🍞', difficulty: 2 },
    { id: 'canned', name: '罐头区', icon: '🥫', difficulty: 3 },
  ],
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


// ====== gameEngine.js ======
/**
 * 游戏引擎 - 核心逻辑
 */
var C = window.GameConfig
var QB = window.QuestionBank

function GameEngine() {
  this.reset()
}

GameEngine.prototype.reset = function () {
  this.lives = C.quiz.maxLives
  this.score = 0
  this.combo = 0
  this.roundIndex = 0
  this.roundQuestions = []
  this.answeredCorrectly = 0
  this.answers = []
  this.gameOver = false
  this.roundComplete = false
}

/** 开始一轮游戏 */
GameEngine.prototype.startRound = function (categoryId) {
  this.reset()
  var pool = categoryId
    ? QB.filter(function (q) { return q.category === categoryId })
    : QB

  var shuffled = pool.slice().sort(function () { return Math.random() - 0.5 })
  this.roundQuestions = shuffled.slice(0, C.quiz.questionsPerRound)
  return this.roundQuestions
}

/** 当前题目 */
GameEngine.prototype.getCurrentQuestion = function () {
  if (this.roundIndex >= this.roundQuestions.length) {
    this.roundComplete = true
    return null
  }
  return this.roundQuestions[this.roundIndex]
}

/** 提交答案 */
GameEngine.prototype.submitAnswer = function (selectedIndex, timeUsed) {
  var q = this.getCurrentQuestion()
  if (!q) return null

  var isCorrect = selectedIndex === q.answer
  var points = 0

  if (isCorrect) {
    this.combo++
    this.answeredCorrectly++
    points = C.quiz.baseScore

    if (timeUsed <= C.quiz.speedBonusThreshold1) points += C.quiz.speedBonus1
    else if (timeUsed <= C.quiz.speedBonusThreshold2) points += C.quiz.speedBonus2

    points += Math.min(this.combo - 1, C.quiz.maxComboBonus)
    this.score += points
  } else {
    this.combo = 0
    this.lives--
    if (this.lives <= 0) this.gameOver = true
  }

  this.answers.push({ isCorrect: isCorrect, timeUsed: timeUsed, points: points })
  this.roundIndex++

  return {
    isCorrect: isCorrect, points: points, combo: this.combo,
    lives: this.lives, correctIndex: q.answer,
    foxComment: q.foxComment, knowledge: q.knowledge,
    gameOver: this.gameOver,
  }
}

/** 跳过 */
GameEngine.prototype.skipQuestion = function () {
  this.combo = 0
  var q = this.getCurrentQuestion()
  if (!q) return null

  this.answers.push({ isCorrect: false, timeUsed: 15, points: 0 })
  this.roundIndex++

  return {
    isCorrect: false, points: 0, combo: 0, lives: this.lives,
    correctIndex: q.answer,
    foxComment: '这题太难了？我允许你战略性撤退。',
    knowledge: q.knowledge, skipped: true,
  }
}

/** 最终评级 */
GameEngine.prototype.getFinalGrade = function () {
  var ratio = this.answeredCorrectly / this.roundQuestions.length
  if (ratio >= 0.9) return { grade: 'S', label: '配料大师', icon: '👑', color: '#FFD700' }
  if (ratio >= 0.7) return { grade: 'A', label: '美食侦探', icon: '🔍', color: '#4CAF50' }
  if (ratio >= 0.5) return { grade: 'B', label: '好奇食客', icon: '🍽️', color: '#2196F3' }
  if (ratio >= 0.3) return { grade: 'C', label: '迷糊吃货', icon: '😋', color: '#FF9800' }
  return { grade: 'D', label: '出厂设置', icon: '🍼', color: '#9E9E9E' }
}

/** 各分类题量统计 */
GameEngine.getQuestionStats = function () {
  var stats = {}
  C.categories.forEach(function (cat) {
    stats[cat.id] = QB.filter(function (q) { return q.category === cat.id }).length
  })
  return stats
}

window.GameEngine = GameEngine


// ====== renderer.js ======
/**
 * Canvas渲染工具
 */
var C = window.GameConfig

function Renderer(canvas) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.width = canvas.width
  this.height = canvas.height
}

/** 清除画布 */
Renderer.prototype.clear = function (color) {
  this.ctx.fillStyle = color || C.theme.creamWhite
  this.ctx.fillRect(0, 0, this.width, this.height)
}

/** 圆角矩形 */
Renderer.prototype.roundRect = function (x, y, w, h, r, fillColor, strokeColor, lineWidth) {
  var ctx = this.ctx
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
  if (fillColor) { ctx.fillStyle = fillColor; ctx.fill() }
  if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lineWidth || 1; ctx.stroke() }
}

/** 绘制文本（自动换行） */
Renderer.prototype.drawText = function (text, x, y, opts) {
  opts = opts || {}
  var ctx = this.ctx
  var fontSize = opts.fontSize || 14
  var color = opts.color || C.theme.darkText
  var align = opts.align || 'left'
  var bold = opts.bold || false
  var maxWidth = opts.maxWidth || 9999

  ctx.font = (bold ? 'bold ' : '') + fontSize + 'px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'top'

  var chars = String(text).split('')
  var lines = []
  var line = ''
  for (var i = 0; i < chars.length; i++) {
    var testLine = line + chars[i]
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      lines.push(line)
      line = chars[i]
      if (opts.maxLines && lines.length >= opts.maxLines) { lines.push('…'); break }
    } else { line = testLine }
  }
  if (line) lines.push(line)

  var lineH = fontSize * 1.4
  var startY = align === 'center' ? y - (lines.length - 1) * lineH / 2 : y
  for (var j = 0; j < lines.length; j++) {
    ctx.fillText(lines[j], align === 'center' ? x : x, startY + j * lineH)
  }
  return lines.length
}

/** 进度条 */
Renderer.prototype.drawProgress = function (cur, total, x, y, w, h) {
  this.roundRect(x, y, w, h, h / 2, '#E8DDD0')
  var fillW = Math.max(w * (cur / total), h)
  this.roundRect(x, y, fillW, h, h / 2, C.theme.warmOrange)
  this.drawText(cur + '/' + total, x + w / 2, y + (h - 14) / 2, {
    fontSize: 11, color: '#FFFFFF', bold: true, align: 'center',
  })
}

/** 计时条 */
Renderer.prototype.drawTimer = function (rem, max, x, y, w, h) {
  var ratio = rem / max
  var color = ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#FF9800' : '#FF5252'
  this.roundRect(x, y, w, h, h / 2, '#E8DDD0')
  this.roundRect(x, y, w * ratio, h, h / 2, color)
}

/** 生命值 */
Renderer.prototype.drawLives = function (lives, maxLives, x, y) {
  var s = ''
  for (var i = 0; i < maxLives; i++) s += i < lives ? '❤️' : '🖤'
  this.drawText(s, x, y, { fontSize: 14 })
}

/** 配料标签 */
Renderer.prototype.drawTag = function (text, x, y, w, h) {
  this.roundRect(x, y, w, h, 6, '#F5EDE0')
  this.drawText(text, x + w / 2, y + (h - 12) / 2, {
    fontSize: 11, color: C.theme.lightText, align: 'center', maxWidth: w - 10,
  })
}

/** 配料表卡片 */
Renderer.prototype.drawIngredientCard = function (ingredients, x, y, w, h) {
  this.roundRect(x, y, w, h, 12, '#FFFFFF', '#E8DDD0', 1)

  // 标题栏
  this.roundRect(x, y, w, 36, 12, C.theme.warmOrange)
  var ctx = this.ctx
  ctx.fillStyle = C.theme.warmOrange
  ctx.fillRect(x, y + 18, w, 18)
  this.drawText('📋 配料表', x + w / 2, y + 8, { fontSize: 14, color: '#FFFFFF', bold: true, align: 'center' })

  // 配料网格
  var tagW = (w - 40) / 3
  var tagH = 28
  var sx = x + 10
  var sy = y + 48

  for (var i = 0; i < ingredients.length; i++) {
    var col = i % 3
    var row = Math.floor(i / 3)
    var tx = sx + col * (tagW + 6)
    var ty = sy + row * (tagH + 6)
    if (ty + tagH > y + h - 10) {
      this.drawText('……还有更多', x + w / 2, ty, { fontSize: 12, color: C.theme.warmOrange, align: 'center' })
      return
    }
    this.drawTag(ingredients[i], tx, ty, tagW, tagH)
  }
}

/** 选项按钮 */
Renderer.prototype.drawOption = function (text, index, x, y, w, h, state) {
  var colors = {
    _default: { bg: '#FFFFFF', text: C.theme.darkText, border: '#E8DDD0' },
    selected: { bg: C.theme.warmOrange, text: '#FFFFFF', border: C.theme.warmOrange },
    correct:  { bg: C.theme.grassGreen, text: '#FFFFFF', border: C.theme.grassGreen },
    wrong:    { bg: C.theme.tomatoRed, text: '#FFFFFF', border: C.theme.tomatoRed },
    disabled: { bg: '#F5F5F5', text: '#BBBBBB', border: '#E0E0E0' },
  }
  var c = colors[state] || colors._default
  this.roundRect(x, y, w, h, 10, c.bg, c.border, 2)
  var labels = ['A.', 'B.', 'C.', 'D.']
  this.drawText(labels[index], x + 16, y + (h - 20) / 2, { fontSize: 16, color: c.text, bold: true })
  this.drawText(text, x + 48, y + (h - 20) / 2, { fontSize: 14, color: c.text, maxWidth: w - 60 })
}

/** 狐狸表情绘制 */
Renderer.prototype.drawFox = function (state, x, y, size) {
  var ctx = this.ctx
  var hs = size / 2

  // 身体
  ctx.beginPath(); ctx.arc(x, y + hs * 0.3, hs * 0.7, 0, Math.PI * 2)
  ctx.fillStyle = C.theme.warmOrange; ctx.fill()

  // 耳朵
  ctx.beginPath(); ctx.moveTo(x - hs * 0.5, y - hs * 0.1); ctx.lineTo(x - hs * 0.7, y - hs * 0.5); ctx.lineTo(x - hs * 0.2, y - hs * 0.1); ctx.fill()
  ctx.beginPath(); ctx.moveTo(x + hs * 0.5, y - hs * 0.1); ctx.lineTo(x + hs * 0.7, y - hs * 0.5); ctx.lineTo(x + hs * 0.2, y - hs * 0.1); ctx.fill()

  // 肚子
  ctx.beginPath(); ctx.ellipse(x, y + hs * 0.6, hs * 0.35, hs * 0.4, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'; ctx.fill()

  var eyeY = y - hs * 0.05
  var eyeSize = hs * 0.08

  switch (state) {
    case 'happy': case 'excited':
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(x - hs * 0.22, eyeY, hs * 0.1, Math.PI, 0); ctx.stroke()
      ctx.beginPath(); ctx.arc(x + hs * 0.22, eyeY, hs * 0.1, Math.PI, 0); ctx.stroke()
      ctx.beginPath(); ctx.arc(x, y + hs * 0.25, hs * 0.12, 0, Math.PI); ctx.stroke()
      break
    case 'sad': case 'defeated':
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY + hs * 0.05, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY + hs * 0.05, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#64B5F6'
      ctx.beginPath(); ctx.arc(x - hs * 0.25, eyeY + hs * 0.3, hs * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.25, eyeY + hs * 0.3, hs * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, y + hs * 0.4, hs * 0.12, Math.PI, 0); ctx.stroke()
      break
    case 'celebrate':
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, y + hs * 0.2, hs * 0.15, 0, Math.PI); ctx.stroke()
      this.drawText('⭐', x + hs * 0.5, y - hs * 0.2, { fontSize: hs * 0.3, align: 'center' })
      this.drawText('✨', x - hs * 0.6, y - hs * 0.1, { fontSize: hs * 0.25, align: 'center' })
      break
    default:
      ctx.fillStyle = C.theme.darkText
      ctx.beginPath(); ctx.arc(x - hs * 0.2, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + hs * 0.2, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C.theme.darkText; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, y + hs * 0.3, hs * 0.08, 0, Math.PI); ctx.stroke()
  }
}

/** 分数 */
Renderer.prototype.drawScore = function (score, x, y) {
  this.drawText('⭐ ' + score, x, y, { fontSize: 18, bold: true })
}

/** 连击 */
Renderer.prototype.drawCombo = function (combo, x, y) {
  if (combo < 2) return
  this.drawText('🔥 ' + combo + '连击!', x, y, { fontSize: 14, color: C.theme.tomatoRed, bold: true, align: 'right' })
}

window.Renderer = Renderer


// ====== main.js ======
/**
 * 游戏主入口 - 页面管理 + 触摸交互
 */
var C = window.GameConfig
var Engine = window.GameEngine
var Renderer = window.Renderer

var canvas = wx.createCanvas()
var renderer = new Renderer(canvas)
var engine = new Engine()

// 状态
var page = { name: 'index', data: {} }
var buttons = []
var touchX = 0, touchY = 0
var timerInterval = null

// ======== 页面渲染 ========

function renderIndex() {
  renderer.clear()
  var cx = canvas.width / 2, W = canvas.width, H = canvas.height

  renderer.drawText('配料猜猜猜', cx, 120, { fontSize: 36, bold: true, align: 'center' })
  renderer.drawText('看配料表 · 猜食品 · 涨知识', cx, 170, { fontSize: 14, color: C.theme.lightText, align: 'center' })
  renderer.drawFox('idle', cx, 280, 100)

  var btnY = 370
  renderer.roundRect(cx - 100, btnY, 200, 50, 25, C.theme.warmOrange)
  renderer.drawText('开始挑战 🎮', cx, btnY + 14, { fontSize: 16, color: '#FFFFFF', bold: true, align: 'center' })
  renderer.drawText('v' + C.version, 15, H - 30, { fontSize: 11, color: '#CCCCCC' })

  buttons = [{ x: cx - 100, y: btnY, w: 200, h: 50, action: 'gotoCategory' }]
}

function renderCategory() {
  renderer.clear()
  var cx = canvas.width / 2, W = canvas.width
  var stats = Engine.getQuestionStats()

  renderer.drawText('选择分类', cx, 50, { fontSize: 24, bold: true, align: 'center' })

  var startY = 110, itemH = 60, gap = 10
  buttons = []

  C.categories.forEach(function (cat, i) {
    var y = startY + i * (itemH + gap)
    renderer.roundRect(20, y, W - 40, itemH, 10, '#FFFFFF', '#E8DDD0', 1)
    renderer.drawText(cat.icon, 32, y + 14, { fontSize: 22 })
    renderer.drawText(cat.name, 72, y + 10, { fontSize: 16, bold: true, maxWidth: 120 })
    renderer.drawText('题目 ' + (stats[cat.id] || 0) + '道', W - 95, y + 20, {
      fontSize: 12, color: C.theme.lightText, align: 'center',
    })
    buttons.push({ x: 20, y: y, w: W - 40, h: itemH, action: 'start', cat: cat.id })
  })
}

function renderQuiz() {
  var q = engine.getCurrentQuestion()
  if (!q) { page.name = 'result'; renderResult(); return }

  renderer.clear()
  var W = canvas.width, H = canvas.height, pd = page.data

  // 顶部
  renderer.drawProgress(engine.roundIndex, C.quiz.questionsPerRound, 15, 15, W * 0.35, 18)
  renderer.drawScore(engine.score, W * 0.4, 12)
  if (engine.combo >= 2) renderer.drawCombo(engine.combo, W - 15, 12)
  renderer.drawLives(engine.lives, C.quiz.maxLives, W - 120, 36)

  // 计时条
  if (pd.timerRemaining !== undefined) {
    renderer.drawTimer(pd.timerRemaining, C.quiz.timePerQuestion, 15, 44, W - 30, 5)
  }

  // 配料表
  var cardX = 20, cardY = 62, cardW = W - 40, cardH = 220
  renderer.drawIngredientCard(q.ingredients, cardX, cardY, cardW, cardH)

  // 选项
  var optY = cardY + cardH + 15, optH = 48, optGap = 8
  buttons = []

  q.options.forEach(function (opt, i) {
    var y = optY + i * (optH + optGap)
    var state = '_default'
    if (pd.answered) {
      if (i === q.answer) state = 'correct'
      else if (i === pd.selected && pd.last && !pd.last.isCorrect) state = 'wrong'
      else state = 'disabled'
    }
    renderer.drawOption(opt, i, 20, y, cardW, optH, state)
    if (!pd.answered) buttons.push({ x: 20, y: y, w: cardW, h: optH, action: 'answer', index: i })
  })

  // 跳过
  if (!pd.answered) {
    renderer.drawText('跳过 ⏭️', W - 20, H - 30, { fontSize: 12, color: C.theme.lightText, align: 'right' })
    buttons.push({ x: W - 100, y: H - 40, w: 90, h: 30, action: 'skip' })
  }

  // 狐狸反馈
  if (pd.answered && pd.last) {
    var fy = cardY + cardH + 10, r = pd.last
    renderer.drawFox(r.isCorrect ? 'happy' : 'sad', 55, fy, 45)
    renderer.roundRect(95, fy - 3, W - 115, 65, 10, '#FFFFFF', C.theme.warmOrange, 1)
    renderer.drawText(r.isCorrect ? '✅ 答对了！' : '❌ 答错了！', 110, fy + 6, {
      fontSize: 14, color: r.isCorrect ? C.theme.grassGreen : C.theme.tomatoRed, bold: true,
    })
    renderer.drawText(r.foxComment, 110, fy + 28, { fontSize: 11, color: C.theme.lightText, maxWidth: W - 135 })
  }
}

function renderResult() {
  var grade = engine.getFinalGrade()
  var total = engine.roundQuestions.length
  var correct = engine.answeredCorrectly
  var cx = canvas.width / 2, H = canvas.height

  renderer.clear()
  renderer.drawText('🏆 鉴定结果', cx, 55, { fontSize: 24, bold: true, align: 'center' })

  // 评级
  var ctx = renderer.ctx
  ctx.beginPath(); ctx.arc(cx, 130, 50, 0, Math.PI * 2)
  ctx.fillStyle = grade.color + '22'; ctx.fill()
  ctx.strokeStyle = grade.color; ctx.lineWidth = 3; ctx.stroke()
  renderer.drawText(grade.icon, cx, 108, { fontSize: 28, align: 'center' })
  renderer.drawText(grade.grade, cx, 142, { fontSize: 26, color: grade.color, bold: true, align: 'center' })
  renderer.drawText(grade.label, cx, 82, { fontSize: 13, color: grade.color, bold: true, align: 'center' })

  renderer.drawText('得分: ' + engine.score, cx, 200, { fontSize: 18, bold: true, align: 'center' })
  renderer.drawText('正确: ' + correct + '/' + total, cx, 228, { fontSize: 14, color: C.theme.lightText, align: 'center' })
  renderer.drawFox(grade.grade === 'D' ? 'defeated' : 'celebrate', cx, 300, 90)

  var b1y = H - 120
  renderer.roundRect(cx - 100, b1y, 200, 44, 22, C.theme.warmOrange)
  renderer.drawText('再来一局 🔄', cx, b1y + 12, { fontSize: 15, color: '#FFFFFF', bold: true, align: 'center' })

  var b2y = H - 65
  renderer.roundRect(cx - 100, b2y, 200, 40, 20, '#FFFFFF', C.theme.warmOrange, 1)
  renderer.drawText('返回首页 🏠', cx, b2y + 11, { fontSize: 13, color: C.theme.warmOrange, align: 'center' })

  buttons = [
    { x: cx - 100, y: b1y, w: 200, h: 44, action: 'replay' },
    { x: cx - 100, y: b2y, w: 200, h: 40, action: 'home' },
  ]
}

// ======== 动作处理 ========

function handleAction(btn) {
  switch (btn.action) {
    case 'gotoCategory':
      page = { name: 'category', data: {} }; renderCategory(); break
    case 'start':
      page.data.cat = btn.cat; startQuiz(); break
    case 'answer':
      handleAnswer(btn.index); break
    case 'skip':
      handleSkip(); break
    case 'replay':
      startQuiz(); break
    case 'home':
      page = { name: 'index', data: {} }; buttons = []; renderIndex(); break
  }
}

function startQuiz() {
  clearInterval(timerInterval)
  engine.startRound(page.data.cat)
  page.data = { answered: false }
  page.name = 'quiz'
  buttons = []
  renderQuiz()
  startTimer()
}

function handleAnswer(index) {
  if (page.data.answered) return
  page.data.answered = true
  page.data.selected = index
  var timeUsed = C.quiz.timePerQuestion - (page.data.timerRemaining || 0)
  page.data.last = engine.submitAnswer(index, timeUsed)
  renderQuiz()
  setTimeout(advance, 2000)
}

function handleSkip() {
  if (page.data.answered) return
  page.data.answered = true
  page.data.last = engine.skipQuestion()
  renderQuiz()
  setTimeout(advance, 1500)
}

function handleTimeout() {
  if (page.data.answered) return
  page.data.answered = true
  page.data.last = engine.submitAnswer(-1, C.quiz.timePerQuestion)
  page.data.selected = -1
  renderQuiz()
  setTimeout(advance, 2000)
}

function advance() {
  if (page.data.last && page.data.last.gameOver) {
    page = { name: 'result', data: {} }; buttons = []; renderResult(); return
  }
  if (engine.roundComplete) {
    page = { name: 'result', data: {} }; buttons = []; renderResult(); return
  }
  page.data.answered = false
  page.data.last = null
  page.data.timerStart = Date.now()
  page.data.timerRemaining = C.quiz.timePerQuestion
  renderQuiz()
  startTimer()
}

function startTimer() {
  clearInterval(timerInterval)
  timerInterval = setInterval(function () {
    if (page.data.answered) return
    page.data.timerRemaining = Math.max(0, C.quiz.timePerQuestion - (Date.now() - page.data.timerStart) / 1000)
    renderQuiz()
    if (page.data.timerRemaining <= 0) { clearInterval(timerInterval); handleTimeout() }
  }, 100)
}

// ======== 触摸 ========
wx.onTouchStart(function (e) { touchX = e.touches[0].x; touchY = e.touches[0].y })
wx.onTouchEnd(function (e) {
  var ex = e.changedTouches[0].x, ey = e.changedTouches[0].y
  if (Math.abs(ex - touchX) > 15 || Math.abs(ey - touchY) > 15) return
  for (var i = 0; i < buttons.length; i++) {
    var b = buttons[i]
    if (ex >= b.x && ex <= b.x + b.w && ey >= b.y && ey <= b.y + b.h) { handleAction(b); return }
  }
})

// ======== 启动 ========
renderIndex()

