/**
 * 狐狸的烘焙坊 - 游戏引擎
 * 核心状态机：昼夜切换、存档、升级、食谱发现、顾客经营
 */
var C = require('./config.js')
var QB = require('./questionBank.js')
var RC = require('./recipeChain.js')

function GameEngine() {
  this.state = null
  this.chainIndex = null
  this.load()
}

// ======== 存档 ========

GameEngine.prototype.save = function () {
  try {
    wx.setStorageSync('foxLab_save', this.state)
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('foxLab_save', JSON.stringify(this.state))
    }
  }
}

GameEngine.prototype.load = function () {
  var saved = null
  try {
    saved = wx.getStorageSync('foxLab_save')
  } catch (e) {
    try {
      var raw = localStorage.getItem('foxLab_save')
      if (raw) saved = JSON.parse(raw)
    } catch (e2) {}
  }

  if (saved && saved.version === C.version) {
    this.state = saved
  } else {
    this.reset()
  }
  // 构建链索引
  this.chainIndex = RC.buildChainIndex()
}

GameEngine.prototype.reset = function () {
  // 初始食材
  var initInv = {}
  if (C.initialInventory) {
    for (var k in C.initialInventory) {
      initInv[k] = C.initialInventory[k]
    }
  }

  // 初始食谱
  var initRecipes = {}
  if (C.initialRecipes && C.initialRecipes.length > 0) {
    for (var i = 0; i < C.initialRecipes.length; i++) {
      initRecipes[C.initialRecipes[i]] = { count: 1, xp: 1, lastDiscovered: Date.now() }
    }
  }

  this.state = {
    version: C.version,
    gold: C.initialGold,
    totalEarned: 0,

    // 时间
    currentPeriod: 'day',
    periodStartTime: Date.now(),
    lastActive: Date.now(),

    // 等级
    shopLevel: 1,
    foxLevel: 1,

    // 食材仓库（初始自带一批烘焙基础食材）
    inventory: initInv,
    maxInventory: C.shopLevels[0].maxInventory,

    // 食谱系统（初始默认发现 3 道基础甜品）
    discoveredRecipes: initRecipes,

    // 顾客
    currentCustomers: [],
    servedToday: 0,
    totalServed: 0,

    // 菜单（初始上架默认食谱）
    menu: C.initialRecipes ? C.initialRecipes.slice() : this._getDefaultMenu(),
    maxMenuSlots: C.shopLevels[0].menuSlots,

    // 探索
    isExploring: false,
    exploreStartTime: 0,
    exploreResult: null,

    // 批发商
    wholesaleItems: [],

    // 统计
    stats: {
      dayCount: 0,
      totalCustomers: 0,
      totalRecipesDiscovered: C.initialRecipes ? C.initialRecipes.length : 0,
      totalExploreCount: 0,
    },
  }
  this.save()
}

GameEngine.prototype._getDefaultMenu = function () {
  // 初始菜单：从基础食谱里选 3 个
  var bases = []
  for (var i = 0; i < RC.recipes.length; i++) {
    if (RC.recipes[i].chain.isBase) bases.push(RC.recipes[i].id)
  }
  return bases.slice(0, 3)
}

// ======== 店铺系统 ========

GameEngine.prototype.getShopInfo = function () {
  var current = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  var next = C.shopLevels[this.state.shopLevel] || null
  return {
    level: this.state.shopLevel,
    maxLevel: C.shopLevels.length,
    current: current,
    next: next,
    isMax: this.state.shopLevel >= C.shopLevels.length,
  }
}

GameEngine.prototype.canUpgradeShop = function () {
  var info = this.getShopInfo()
  if (info.isMax) return false
  return this.state.gold >= info.next.upgradeCost
}

GameEngine.prototype.upgradeShop = function () {
  var info = this.getShopInfo()
  if (info.isMax) return { success: false, msg: '已达最高等级' }
  if (this.state.gold < info.next.upgradeCost) return { success: false, msg: '金币不足' }

  this.state.gold -= info.next.upgradeCost
  this.state.shopLevel++
  var newInfo = C.shopLevels[this.state.shopLevel - 1]
  this.state.maxMenuSlots = newInfo.menuSlots
  this.state.maxInventory = newInfo.maxInventory

  this.save()
  return { success: true, newLevel: this.state.shopLevel }
}

// ======== 狐狸系统 ========

GameEngine.prototype.getFoxInfo = function () {
  var current = C.foxLevels[this.state.foxLevel - 1] || C.foxLevels[0]
  var next = C.foxLevels[this.state.foxLevel] || null
  return {
    level: this.state.foxLevel,
    maxLevel: C.foxLevels.length,
    current: current,
    next: next,
    isMax: this.state.foxLevel >= C.foxLevels.length,
  }
}

GameEngine.prototype.canUpgradeFox = function () {
  var info = this.getFoxInfo()
  if (info.isMax) return false
  return this.state.gold >= info.next.upgradeCost
}

GameEngine.prototype.upgradeFox = function () {
  var info = this.getFoxInfo()
  if (info.isMax) return { success: false, msg: '已达最高等级' }
  if (this.state.gold < info.next.upgradeCost) return { success: false, msg: '金币不足' }

  this.state.gold -= info.next.upgradeCost
  this.state.foxLevel++
  this.save()
  return { success: true, newLevel: this.state.foxLevel }
}

// ======== 食材仓库 ========

GameEngine.prototype.getInventory = function () {
  return this.state.inventory
}

GameEngine.prototype.getInventoryTotal = function () {
  var total = 0
  for (var key in this.state.inventory) {
    total += this.state.inventory[key]
  }
  return total
}

GameEngine.prototype.addIngredient = function (name, qty) {
  var current = this.state.inventory[name] || 0
  var maxCap = this.state.maxInventory
  // 检查是否超上限
  var total = this.getInventoryTotal()
  var canAdd = Math.min(qty, maxCap - total)
  if (canAdd <= 0) return 0
  this.state.inventory[name] = current + canAdd
  this.save()
  return canAdd
}

GameEngine.prototype.removeIngredient = function (name, qty) {
  var current = this.state.inventory[name] || 0
  if (current < qty) return false
  this.state.inventory[name] = current - qty
  if (this.state.inventory[name] <= 0) delete this.state.inventory[name]
  this.save()
  return true
}

GameEngine.prototype.hasIngredients = function (names, qty) {
  for (var i = 0; i < names.length; i++) {
    if ((this.state.inventory[names[i]] || 0) < qty) return false
  }
  return true
}

// ======== 菜单系统 ========

GameEngine.prototype.getMenu = function () {
  return this.state.menu
}

GameEngine.prototype.setMenu = function (newMenu) {
  if (newMenu.length > this.state.maxMenuSlots) return false
  this.state.menu = newMenu.slice()
  this.save()
  return true
}

GameEngine.prototype.addToMenu = function (recipeId) {
  if (this.state.menu.length >= this.state.maxMenuSlots) return false
  if (this.state.menu.indexOf(recipeId) !== -1) return false
  this.state.menu.push(recipeId)
  this.save()
  return true
}

GameEngine.prototype.removeFromMenu = function (recipeId) {
  var idx = this.state.menu.indexOf(recipeId)
  if (idx === -1) return false
  this.state.menu.splice(idx, 1)
  this.save()
  return true
}

// ======== 昼夜切换 ========

GameEngine.prototype.switchToNight = function () {
  // 清理白天残留：未完成服务的顾客离开
  var customers = this.state.currentCustomers
  for (var i = customers.length - 1; i >= 0; i--) {
    customers.splice(i, 1)
  }

  // 召回探索中的狐狸
  if (this.state.isExploring) {
    this.state.isExploring = false
  }

  this.state.currentPeriod = 'night'
  this.state.periodStartTime = Date.now()
  this.save()
}

GameEngine.prototype.switchToDay = function () {
  this.state.currentPeriod = 'day'
  this.state.periodStartTime = Date.now()
  this.state.servedToday = 0
  this.state.stats.dayCount++
  this.state.currentCustomers = []
  this.save()
}

// ======== 顾客系统 ========

GameEngine.prototype.getMaxCustomers = function () {
  var info = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  return info.maxCustomers
}

GameEngine.prototype.generateCustomer = function () {
  var patience = C.customer.patienceMin + Math.random() * (C.customer.patienceMax - C.customer.patienceMin)
  var orderItem = null
  var menu = this.state.menu
  if (menu.length > 0) {
    // 优先选玩家已发现的食谱，但也会选菜单上未发现的
    var discovered = []
    var undiscovered = []
    for (var i = 0; i < menu.length; i++) {
      if (this.state.discoveredRecipes[menu[i]]) {
        discovered.push(menu[i])
      } else {
        undiscovered.push(menu[i])
      }
    }
    var pool = discovered.length > 0 ? discovered : undiscovered
    orderItem = pool[Math.floor(Math.random() * pool.length)]
  }

  return {
    id: '_c' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    patience: patience,
    patienceMax: patience,
    state: 'waiting',
    orderItem: orderItem,
    enterTime: Date.now(),
    serveCompleteTime: 0,
    eatCompleteTime: 0,
    leaveTime: 0,
  }
}

GameEngine.prototype.updateCustomer = function (c) {
  var now = Date.now()

  switch (c.state) {
    case 'waiting':
      c.patience -= C.customer.patienceTick
      if (c.patience <= 0) {
        c.state = 'leaving'
        c.leaveTime = now + C.serving.settleDelay
      }
      break

    case 'serving':
      if (now >= c.serveCompleteTime) {
        c.state = 'eating'
        c.eatCompleteTime = now + C.serving.eatTime
      }
      break

    case 'eating':
      if (now >= c.eatCompleteTime) {
        c.state = 'done'
        this.settleCustomer(c)
        c.leaveTime = now + C.serving.settleDelay
      }
      break

    case 'done':
      if (now >= c.leaveTime) {
        this.removeCustomer(c.id)
      }
      break
  }
}

GameEngine.prototype.settleCustomer = function (c) {
  var recipe = RC.getRecipeById(c.orderItem)
  if (!recipe) return

  var basePrice = recipe.starRating * C.pricing.basePerStar + C.pricing.baseOffset
  var foxInfo = this.getFoxInfo()
  var favorBonus = foxInfo.current.customerFavor

  // 熟练度加成
  var masteryInfo = this.state.discoveredRecipes[c.orderItem]
  var masteryBonus = 1
  if (masteryInfo) {
    masteryBonus = 1 + masteryInfo.xp * C.pricing.masteryBonus
  }

  var finalPrice = Math.floor(basePrice * favorBonus * masteryBonus)
  this.state.gold += finalPrice
  this.state.totalEarned += finalPrice
  this.state.servedToday++
  this.state.stats.totalCustomers++
  this.state.totalServed++

  this.save()
  return { price: finalPrice, recipe: recipe }
}

GameEngine.prototype.findCustomer = function (id) {
  for (var i = 0; i < this.state.currentCustomers.length; i++) {
    if (this.state.currentCustomers[i].id === id) return this.state.currentCustomers[i]
  }
  return null
}

GameEngine.prototype.removeCustomer = function (id) {
  for (var i = 0; i < this.state.currentCustomers.length; i++) {
    if (this.state.currentCustomers[i].id === id) {
      this.state.currentCustomers.splice(i, 1)
      return true
    }
  }
  return false
}

GameEngine.prototype.startServing = function (customerId, recipeId) {
  var c = this.findCustomer(customerId)
  if (!c) return { success: false, msg: '顾客不存在' }
  if (c.state !== 'waiting') return { success: false, msg: '顾客状态不对' }

  // 检查是否有这个食谱
  if (!this.state.discoveredRecipes[recipeId]) {
    return { success: false, msg: '你还不会做这个食谱' }
  }

  var foxInfo = this.getFoxInfo()
  var serveTime = C.serving.baseTime / foxInfo.current.serveSpeed

  c.state = 'serving'
  c.serveCompleteTime = Date.now() + serveTime
  c.orderItem = recipeId  // 确保顾客要的就是这个
  this.save()
  return { success: true, serveTime: serveTime }
}

// ======== 探索系统 ========

GameEngine.prototype.startExplore = function () {
  if (this.state.isExploring) return { success: false, msg: '狐狸正在探索中' }
  this.state.isExploring = true
  this.state.exploreStartTime = Date.now()
  this.save()
  return { success: true, duration: C.explore.duration }
}

GameEngine.prototype.completeExplore = function () {
  if (!this.state.isExploring) return null

  var foxInfo = this.getFoxInfo()
  var quality = foxInfo.current.exploreQuality

  // 随机 1~3 种食材
  var count = C.explore.baseIngredientCount + Math.floor(Math.random() * (C.explore.maxIngredientCount))
  count = Math.min(count, C.explore.maxIngredientCount)

  var results = []
  for (var i = 0; i < count; i++) {
    var ingredient = this._rollIngredient(quality)
    if (!ingredient) continue
    var qty = 1 + Math.floor(Math.random() * 3) // 1~3份
    results.push({ name: ingredient, quantity: qty })
    this.addIngredient(ingredient, qty)
  }

  this.state.isExploring = false
  this.state.exploreResult = { ingredients: results, timestamp: Date.now() }
  this.state.stats.totalExploreCount++
  this.save()
  return this.state.exploreResult
}

GameEngine.prototype._rollIngredient = function (quality) {
  // 根据探索品质随机食材
  var allIngredients = Object.keys(RC.getAllIngredients())
  if (allIngredients.length === 0) return null

  // 按稀有度加权: quality 越高, 稀有食材概率越大
  var allRarity = RC.getAllIngredients()
  var weights = []
  for (var i = 0; i < allIngredients.length; i++) {
    var rarity = allRarity[allIngredients[i]] || 'common'
    var w = rarity === 'common' ? 50 : rarity === 'uncommon' ? 30 : 20
    w = Math.floor(w * quality)
    weights.push(w)
  }
  var totalWeight = 0
  for (var i = 0; i < weights.length; i++) totalWeight += weights[i]
  if (totalWeight <= 0) return allIngredients[Math.floor(Math.random() * allIngredients.length)]

  var r = Math.random() * totalWeight
  for (var i = 0; i < allIngredients.length; i++) {
    r -= weights[i]
    if (r <= 0) return allIngredients[i]
  }
  return allIngredients[allIngredients.length - 1]
}

// ======== 食谱发现系统 ========

GameEngine.prototype.attemptDiscover = function (ingredientCombination) {
  // ingredientCombination: 玩家选择的食材名称数组 (2-5 种)

  // Step 1: 检查个数
  if (ingredientCombination.length < 2 || ingredientCombination.length > 5) {
    return { success: false, msg: '请选择 2-5 种食材' }
  }

  // Step 2: 双倍消耗检查
  if (!this.hasIngredients(ingredientCombination, 2)) {
    return { success: false, msg: '食材不足（需要双倍消耗）' }
  }

  // 扣食材
  for (var i = 0; i < ingredientCombination.length; i++) {
    this.removeIngredient(ingredientCombination[i], 2)
  }

  // Step 3: 计算组合价值
  var comboValue = RC.calculateComboValue(ingredientCombination)

  // Step 4: 链匹配优先
  var knownIds = Object.keys(this.state.discoveredRecipes)
  for (var k = 0; k < knownIds.length; k++) {
    var knownRecipe = RC.getRecipeById(knownIds[k])
    if (!knownRecipe) continue

    // 检查食材组合是否是已知食谱 + 额外食材
    var added = this._getAddedIngredients(ingredientCombination, knownRecipe.ingredients)
    if (added && added.length >= 1 && added.length <= 2) {
      // 检查是否有子食谱匹配
      var children = this.chainIndex[knownRecipe.id]
      if (children) {
        for (var c = 0; c < children.length; c++) {
          var childRecipe = RC.getRecipeById(children[c])
          if (!childRecipe) continue
          var childAdded = childRecipe.chain.added
          // childAdded 可能是字符串或数组
          var childAddedArr = typeof childAdded === 'string' ? [childAdded] : childAdded
          if (RC.arraysEqual(added, childAddedArr)) {
            // 链匹配成功
            if (!this.state.discoveredRecipes[childRecipe.id]) {
              // 发现新食谱！
              this.state.discoveredRecipes[childRecipe.id] = { count: 1, xp: 0, lastDiscovered: Date.now() }
              this.state.stats.totalRecipesDiscovered++
              this.save()
              return { success: true, result: 'discover', recipe: childRecipe, isNew: true }
            } else {
              // 已有，加熟练度
              this.state.discoveredRecipes[childRecipe.id].xp += comboValue.xp
              this.state.discoveredRecipes[childRecipe.id].count++
              this.save()
              return { success: true, result: 'mastery', recipe: childRecipe, isNew: false, xpGained: comboValue.xp }
            }
          }
        }
      }
    }
  }

  // Step 5: 全局匹配（按星级从高到低）
  var sortedRecipes = RC.recipes.slice().sort(function (a, b) {
    return b.starRating - a.starRating
  })
  for (var r = 0; r < sortedRecipes.length; r++) {
    var recipe = sortedRecipes[r]
    if (RC.isSuperset(ingredientCombination, recipe.ingredients)) {
      if (!this.state.discoveredRecipes[recipe.id]) {
        // 发现新食谱！
        this.state.discoveredRecipes[recipe.id] = { count: 1, xp: 0, lastDiscovered: Date.now() }
        this.state.stats.totalRecipesDiscovered++
        this.save()
        return { success: true, result: 'discover', recipe: recipe, isNew: true }
      } else {
        // 已有
        this.state.discoveredRecipes[recipe.id].xp += comboValue.xp
        this.state.discoveredRecipes[recipe.id].count++
        this.save()
        return { success: true, result: 'mastery', recipe: recipe, isNew: false, xpGained: comboValue.xp }
      }
    }
  }

  // Step 6: 什么都没匹配到，返还一半食材
  for (var j = 0; j < ingredientCombination.length; j++) {
    this.addIngredient(ingredientCombination[j], 1)
  }
  this.save()
  return { success: true, result: 'nothing', msg: '这组合做不出什么...返还了一半食材', comboValue: comboValue }
}

GameEngine.prototype._getAddedIngredients = function (fullCombo, baseIngredients) {
  // 返回 fullCombo 中比 baseIngredients 多出来的食材
  var added = []
  for (var i = 0; i < fullCombo.length; i++) {
    var ing = fullCombo[i]
    // 检查在 base 中的出现次数
    var inBase = 0
    for (var j = 0; j < baseIngredients.length; j++) {
      if (baseIngredients[j] === ing) inBase++
    }
    // 检查在 added 中的出现次数（已经添加到结果中的）
    var inAdded = 0
    for (var k = 0; k < added.length; k++) {
      if (added[k] === ing) inAdded++
    }
    // 如果 base 中已经包含了足够数量，从 added 中去除
    if (inBase + inAdded <= inBase) {
      // 还缺一个实例
      added.push(ing)
    }
  }
  // 确保 added 是 base 中不包含的新食材
  // 简化：直接判断食材是否在 base 中
  var pureAdded = []
  for (var i = 0; i < fullCombo.length; i++) {
    if (baseIngredients.indexOf(fullCombo[i]) === -1) {
      pureAdded.push(fullCombo[i])
    }
  }
  // 同时保留两者：如果玩家用了重复的基础食材
  return pureAdded
}

// ======== 批发商系统 ========

GameEngine.prototype.generateWholesaleItems = function () {
  var allIngredients = Object.keys(RC.ingredientRarity)
  var items = []
  var count = Math.min(C.wholesale.refreshCount, allIngredients.length)

  // 随机选 count 种
  var shuffled = allIngredients.slice().sort(function () { return Math.random() - 0.5 })
  for (var i = 0; i < count; i++) {
    var rarity = RC.ingredientRarity[shuffled[i]] || 'common'
    var priceMultiplier = rarity === 'common' ? 1 : rarity === 'uncommon' ? 2 : 4
    items.push({
      name: shuffled[i],
      price: C.wholesale.basePrice * priceMultiplier,
      quantity: 5 + Math.floor(Math.random() * 6), // 5~10份
      rarity: rarity,
    })
  }
  this.state.wholesaleItems = items
  return items
}

GameEngine.prototype.buyWholesaleItem = function (index) {
  var items = this.state.wholesaleItems
  if (index < 0 || index >= items.length) return { success: false, msg: '无效商品' }
  var item = items[index]
  var totalCost = item.price * item.quantity
  if (this.state.gold < totalCost) return { success: false, msg: '金币不足' }

  this.state.gold -= totalCost
  this.addIngredient(item.name, item.quantity)
  items.splice(index, 1)
  this.save()
  return { success: true, name: item.name, quantity: item.quantity, cost: totalCost }
}

GameEngine.prototype.refreshWholesale = function () {
  if (this.state.gold < C.wholesale.refreshCost) return { success: false, msg: '金币不足' }
  this.state.gold -= C.wholesale.refreshCost
  this.generateWholesaleItems()
  this.save()
  return { success: true }
}

// ======== 离线收益 ========

GameEngine.prototype.processOffline = function () {
  var now = Date.now()
  var elapsed = now - this.state.lastActive
  this.state.lastActive = now

  var shopInfo = C.shopLevels[this.state.shopLevel - 1] || C.shopLevels[0]
  var maxOfflineMs = shopInfo.maxOfflineHours * 60 * 60 * 1000
  var effectiveMs = Math.min(elapsed, maxOfflineMs)

  var goldPerMin = C.offline.baseGoldPerMin + this.state.shopLevel * C.offline.goldPerLevel
  var offlineGold = Math.floor(effectiveMs / 60000) * goldPerMin
  this.state.gold += offlineGold

  // 重置到白天
  this.state.currentPeriod = 'day'
  this.state.periodStartTime = now
  this.state.currentCustomers = []

  this.save()
  return { gold: offlineGold, elapsedMinutes: Math.floor(effectiveMs / 60000) }
}

// ======== 食谱查询 ========

GameEngine.prototype.getDiscoveredRecipes = function () {
  var result = []
  var ids = Object.keys(this.state.discoveredRecipes)
  for (var i = 0; i < ids.length; i++) {
    var recipe = RC.getRecipeById(ids[i])
    if (recipe) {
      result.push({
        recipe: recipe,
        data: this.state.discoveredRecipes[ids[i]],
      })
    }
  }
  return result
}

GameEngine.prototype.getUndiscoveredRecipes = function () {
  var result = []
  for (var i = 0; i < RC.recipes.length; i++) {
    if (!this.state.discoveredRecipes[RC.recipes[i].id]) {
      result.push(RC.recipes[i])
    }
  }
  return result
}

GameEngine.prototype.getRecipeById = function (id) {
  return RC.getRecipeById(id)
}

// ======== 统计 ========

GameEngine.prototype.getStats = function () {
  var shopInfo = this.getShopInfo()
  var foxInfo = this.getFoxInfo()
  return {
    gold: this.state.gold,
    totalEarned: this.state.totalEarned,
    shopLevel: this.state.shopLevel,
    shopName: shopInfo.current.name,
    foxLevel: this.state.foxLevel,
    foxName: foxInfo.current.name,
    totalServed: this.state.totalServed,
    totalCustomers: this.state.stats.totalCustomers,
    totalRecipesDiscovered: this.state.stats.totalRecipesDiscovered,
    totalExploreCount: this.state.stats.totalExploreCount,
    dayCount: this.state.stats.dayCount,
    currentPeriod: this.state.currentPeriod,
    customerCount: this.state.currentCustomers.length,
    maxCustomers: this.getMaxCustomers(),
    isExploring: this.state.isExploring,
    inventoryTotal: this.getInventoryTotal(),
    maxInventory: this.state.maxInventory,
    menuCount: this.state.menu.length,
    maxMenuSlots: this.state.maxMenuSlots,
    discoveredCount: Object.keys(this.state.discoveredRecipes).length,
    totalRecipes: RC.recipes.length,
  }
}

module.exports = GameEngine
