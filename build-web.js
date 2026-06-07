/**
 * 构建脚本：将微信小游戏转换为浏览器可运行版本
 */
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, 'js')
const DEST_DIR = path.join(__dirname, 'web')

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true })

const modules = ['config.js', 'questionBank.js', 'recipeChain.js', 'gameEngine.js', 'renderer.js', 'main.js']

const wxPolyfill = `
;(function() {
  var canvas = document.getElementById('gameCanvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'gameCanvas'
    canvas.width = 375; canvas.height = 667
    document.body.appendChild(canvas)
  }
  function resize() {
    var maxW = window.innerWidth, maxH = window.innerHeight
    var scale = Math.min(maxW / 375, maxH / 667)
    canvas.style.width = (375 * scale) + 'px'
    canvas.style.height = (667 * scale) + 'px'
    canvas.style.position = 'absolute'
    canvas.style.left = ((maxW - 375 * scale) / 2) + 'px'
    canvas.style.top = ((maxH - 667 * scale) / 2) + 'px'
    canvas.style.borderRadius = '12px'
    canvas.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
  }
  resize(); window.addEventListener('resize', resize)

  window.wx = {
    createCanvas: function() { return canvas },
    getSystemInfoSync: function() { return { pixelRatio: window.devicePixelRatio||1, screenWidth: 375, screenHeight: 667 } },
    setStorageSync: function(k,v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) {} },
    getStorageSync: function(k) { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return null } },
    onTouchStart: function(cb) {
      canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height; var t = e.touches[0]
        cb({ touches: [{ x: (t.clientX-r.left)*sx, y: (t.clientY-r.top)*sy }] })
      }, { passive: false })
      canvas.addEventListener('mousedown', function(e) {
        var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height
        window._touchD = { x: (e.clientX-r.left)*sx, y: (e.clientY-r.top)*sy }
      })
    },
    onTouchEnd: function(cb) {
      canvas.addEventListener('touchend', function(e) {
        e.preventDefault(); var r = canvas.getBoundingClientRect()
        var sx = 375/r.width, sy = 667/r.height; var t = e.changedTouches[0]
        cb({ changedTouches: [{ x: (t.clientX-r.left)*sx, y: (t.clientY-r.top)*sy }] })
      }, { passive: false })
      canvas.addEventListener('mouseup', function(e) {
        var r = canvas.getBoundingClientRect(); var sx = 375/r.width, sy = 667/r.height
        if (window._touchD) { cb({ changedTouches: [{ x: (e.clientX-r.left)*sx, y: (e.clientY-r.top)*sy }] }); window._touchD = null }
      })
    },
  }
})();
`

function convertModule(filename) {
  var content = fs.readFileSync(path.join(SRC_DIR, filename), 'utf-8')
  content = content.replace(/var (\w+) = require\(['"].\/config\.js['"]\)/g, 'var $1 = window.GameConfig')
  content = content.replace(/var (\w+) = require\(['"].\/questionBank\.js['"]\)/g, 'var $1 = window.QuestionBank')
  content = content.replace(/var (\w+) = require\(['"].\/recipeChain\.js['"]\)/g, 'var $1 = window.RecipeChain')
  content = content.replace(/var (\w+) = require\(['"].\/gameEngine\.js['"]\)/g, 'var $1 = window.GameEngine')
  content = content.replace(/var (\w+) = require\(['"].\/renderer\.js['"]\)/g, 'var $1 = window.Renderer')

  // 文件特定的 module.exports 转换
  if (filename === 'config.js') {
    content = content.replace(/module\.exports\s*=\s*\{/g, 'window.GameConfig = {')
  } else if (filename === 'recipeChain.js') {
    content = content.replace(/module\.exports\s*=\s*\{/g, 'window.RecipeChain = {')
  } else if (filename === 'questionBank.js') {
    content = content.replace(/module\.exports\s*=\s*\[/g, 'window.QuestionBank = [')
  } else {
    content = content.replace(/module\.exports\s*=\s*(\w+)/g, 'window.$1 = $1')
  }
  return content
}

var bundle = wxPolyfill
modules.forEach(function(f) {
  bundle += '\n// ====== ' + f + ' ======\n' + convertModule(f) + '\n'
})

fs.writeFileSync(path.join(DEST_DIR, 'bundle.js'), bundle)
console.log('✅ web/bundle.js 已生成 (' + Math.round(bundle.length/1024) + 'KB)')

var version = Date.now().toString(36)
var html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><meta name="apple-mobile-web-app-capable" content="yes"><title>狐狸的配料食堂 🦊</title><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:#1a1a1a;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}#loading{position:fixed;inset:0;z-index:100;background:#FFF8EE;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .5s}#loading.hidden{opacity:0;pointer-events:none}#loading .icon{font-size:60px;animation:bounce 1s infinite}#loading .t1{font-size:22px;color:#3D3226;font-weight:bold;margin-top:16px}#loading .t2{font-size:13px;color:#8B7E6F;margin-top:8px}#loading .spinner{margin-top:24px;width:32px;height:32px;border:3px solid #E8DDD0;border-top-color:#FF7A33;border-radius:50%;animation:spin .8s linear infinite}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-color-scheme:dark){#loading{background:#222}#loading .t1{color:#eee}#loading .t2{color:#999}}#gameCanvas{display:block}</style></head><body><div id="loading"><div class="icon">🦊</div><div class="t1">狐狸的配料食堂</div><div class="t2">白天经营 · 夜晚研发 · 食谱收集</div><div class="spinner"></div></div><canvas id="gameCanvas" width="375" height="667"></canvas><script src="bundle.js?v=' + version + '"></script><script>window.addEventListener("load",function(){setTimeout(function(){document.getElementById("loading").classList.add("hidden")},600)});setTimeout(function(){var e=document.getElementById("loading");if(e&&!e.classList.contains("hidden"))e.classList.add("hidden")},5000)</script></body></html>'

fs.writeFileSync(path.join(DEST_DIR, 'index.html'), html)
console.log('✅ web/index.html 已生成')
console.log('部署方式: 将 web/ 目录下内容部署到静态服务器')
