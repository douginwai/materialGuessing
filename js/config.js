/**
 * 游戏全局配置
 */
module.exports = {
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
