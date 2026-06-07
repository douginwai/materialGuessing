/**
 * 游戏主入口 - 页面管理 + 触摸交互
 */
var C = require('./config.js')
var Engine = require('./gameEngine.js')
var Renderer = require('./renderer.js')

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
