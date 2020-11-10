const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/wechat.config')
const reply = require('./wechat/reply')

// 生成服务器实例
const app = new Koa()

// 加载认证中间件
app.use(wechat(config.wechat, reply.reply))

app.listen(7070)

console.log('Listen: ' + 7070)