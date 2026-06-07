/**
 * Canvas渲染工具
 */
var C = require('./config.js')

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

module.exports = Renderer
