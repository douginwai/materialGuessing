/**
 * 游戏引擎 - 核心逻辑
 */
var C = require('./config.js')
var QB = require('./questionBank.js')

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

module.exports = GameEngine
