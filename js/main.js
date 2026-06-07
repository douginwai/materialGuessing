/**
 * 狐狸的烘焙坊 - 游戏主入口
 * 昼夜循环、触摸交互、页面流转
 */
var C = require('./config.js')
var Engine = require('./gameEngine.js')
var Renderer = require('./renderer.js')
var RC = require('./recipeChain.js')

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
