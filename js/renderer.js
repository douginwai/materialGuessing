/**
 * 狐狸的烘焙坊 - Canvas渲染器
 * 白天场景、夜晚场景、弹窗、升级、统计
 */
var C = require('./config.js')

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

module.exports = Renderer
