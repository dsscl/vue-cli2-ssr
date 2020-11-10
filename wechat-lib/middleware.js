const sha1 = require('sha1')
const getRawBody = require('raw-body')
const util = require('./util')

module.exports = (config, reply) => {
    // ctx 是 koa的应用上下文
    // next 是串联中间件的钩子函数
    return async (ctx, next) => {
        console.log('ctx.methods---', ctx.methods)
        console.log('ctx.query---', ctx.query)
        console.log('config---', config)
        const {
            signature,
            timestamp,
            nonce,
            echostr
        } = ctx.query
        const token = config.token
        let str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        console.log('sha---', sha)

        if(ctx.method === 'GET') {
            if(sha === signature) {
                ctx.body = echostr
            } else {
                ctx.body = 'wrong'
            }
        } else if (ctx.method === 'POST') {
            if(sha !== signature) {
                return ctx.body = 'failed'
            }

            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset,
            })

            console.log('getRawBody---', data)

            const content = await util.parseXML(data)
            console.log('content---', content)
            const message = util.formatMessage(content.xml)

            ctx.weixin = message
            await reply.apply(ctx, [ctx, next])

            const replyBody = ctx.body
            const msg = ctx.weixin
            const xml = util.tpl(replyBody, msg)

            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    }
}
const koa = require('koa')
