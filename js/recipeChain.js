/**
 * 狐狸的烘焙坊 - 食谱链数据
 * 只包含面包、蛋糕、甜品、小吃品类
 * 每个食谱通过 chain.parent + chain.added 关联形成衍生关系
 */
module.exports = {
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
