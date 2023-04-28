// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser') //引用 body-parser
const methodOverride = require('method-override') // 載入 method-override
const session = require('express-session') //載入express-session
const usePassport = require('./config/passport')// 載入設定檔，要寫在 express-session 以後
const flash = require('connect-flash')

const routes = require('./routes')// 引用路由器
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

usePassport(app)// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use(routes)// 將 request 導入路由器

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})