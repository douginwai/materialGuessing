/**
 * 狐狸的配料食堂 - 食谱链数据
 * 每个食谱通过 chain.parent + chain.added 关联形成衍生关系
 */
module.exports = {
  // ======== 食谱列表 ========
  recipes: [
    // ===== 链1: 牛角包家族 =====
    {
      id: 'croissant', name: '牛角包', icon: '🥐', starRating: 2,
      ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '酵母'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      sourceQuestionId: 'bakery_002',
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

    // ===== 链2: 薯片家族 =====
    {
      id: 'plainChips', name: '原味薯片', icon: '🥔', starRating: 2,
      ingredients: ['马铃薯', '植物油', '食用盐'],
      category: 'snack',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      sourceQuestionId: 'snack_001',
      price: 21,
    },
    {
      id: 'tomatoChips', name: '番茄味薯片', icon: '🍅', starRating: 3,
      ingredients: ['马铃薯', '植物油', '食用盐', '番茄', '白砂糖'],
      category: 'snack',
      chain: { isBase: false, parent: 'plainChips', added: ['番茄', '白砂糖'], depth: 1 },
      price: 29,
    },
    {
      id: 'truffleChips', name: '黑松露薯片', icon: '🍄', starRating: 4,
      ingredients: ['马铃薯', '植物油', '食用盐', '黑松露', '橄榄油'],
      category: 'snack',
      chain: { isBase: false, parent: 'plainChips', added: ['黑松露', '橄榄油'], depth: 1 },
      price: 37,
    },

    // ===== 链3: 巧克力家族 =====
    {
      id: 'pureChocolate', name: '纯巧克力', icon: '🍫', starRating: 2,
      ingredients: ['可可粉', '可可脂', '白砂糖'],
      category: 'snack',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      sourceQuestionId: 'snack_004',
      price: 21,
    },
    {
      id: 'nutChocolate', name: '坚果巧克力', icon: '🌰', starRating: 3,
      ingredients: ['可可粉', '可可脂', '白砂糖', '坚果'],
      category: 'snack',
      chain: { isBase: false, parent: 'pureChocolate', added: '坚果', depth: 1 },
      price: 29,
    },
    {
      id: 'liquorChocolate', name: '酒心巧克力', icon: '🍷', starRating: 4,
      ingredients: ['可可粉', '可可脂', '白砂糖', '淡奶油', '朗姆酒'],
      category: 'snack',
      chain: { isBase: false, parent: 'pureChocolate', added: ['淡奶油', '朗姆酒'], depth: 1 },
      price: 37,
    },

    // ===== 额外独立食谱（不参与链衍生，仅用于菜单多样性）=====
    {
      id: 'spongeCake', name: '海绵蛋糕', icon: '🎂', starRating: 2,
      ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '水'],
      category: 'bakery',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      sourceQuestionId: 'bakery_003',
      price: 21,
    },
    {
      id: 'iceCream', name: '冰淇淋', icon: '🍦', starRating: 2,
      ingredients: ['水', '白砂糖', '乳粉', '奶油', '蛋黄'],
      category: 'icecream',
      chain: { isBase: true, parent: null, added: null, depth: 0 },
      sourceQuestionId: 'icecream_003',
      price: 21,
    },
  ],

  // ======== 食材稀有度 ========
  // 用于探索概率和食谱价值计算
  ingredientRarity: {
    '小麦粉': 'common',
    '黄油': 'common',
    '白砂糖': 'common',
    '鸡蛋': 'common',
    '酵母': 'common',
    '水': 'common',
    '植物油': 'common',
    '食用盐': 'common',
    '马铃薯': 'common',
    '可可粉': 'common',
    '可可脂': 'common',
    '乳粉': 'common',
    '奶油': 'common',
    '蛋黄': 'common',
    '番茄': 'uncommon',
    '淡奶油': 'uncommon',
    '橄榄油': 'uncommon',
    '坚果': 'uncommon',
    '芝士片': 'uncommon',
    '黑松露': 'rare',
    '马苏里拉芝士': 'rare',
    '朗姆酒': 'rare',
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

  /** 获取食材稀有度分数（用于匹配优先级） */
  getIngredientScore: function (name) {
    var rarity = this.ingredientRarity[name] || 'common'
    var scores = { common: 1, uncommon: 2, rare: 3 }
    return scores[rarity] || 1
  },

  /** 计算一组食材的组合分数（稀有食材越多分越高） */
  calculateComboValue: function (ingredients) {
    var totalScore = 0
    for (var i = 0; i < ingredients.length; i++) {
      totalScore += this.getIngredientScore(ingredients[i])
    }
    return { score: totalScore, xp: Math.max(1, Math.floor(totalScore / 2)) }
  },
}
