const vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()
const fs = require('fs')

function createApp(url) {
    if(url=='/') {
        url='/index'
    }
    var json = fs.readFileSync(`json${url}.json`, 'utf-8')
    var template = fs.readFileSync(`template${url}.html`, 'utf-8')
    return new vue({
        template: template,
        data: JSON.parse(json).data
    })
}

server.get('*', function(req, res) {
    if(req.url != '/favicon.ico') {
        const app = createApp(req.url) // 每一个访问必须新建一个vue实例
        // 只会触发组件的beforeCreate和created钩子，所以需要客户端js
        // created vue实例创建完成
        // mounted vue实例已经挂载到页面上，可见
        renderer.renderToString(app, (err, html) => {
            res.end(html)
        })
    }
})
server.listen(7070)