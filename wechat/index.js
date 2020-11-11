const config = require('../config/wechat.config')
const Wechat = require('../wechat-lib')
const mongoose = require('mongoose')

const Token = mongoose.model('Token') // 拿到token模型

const wechatCfg = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: async() => {
            const res = await Token.getAccessToken() // 通过模型调用静态方法

            return res
        },
        saveAccessToken: async(data) => {
            const res = await Token.saveAccessToken(data)

            return res
        }
    }
}

exports.test = async () => {
    const client = new Wechat(wechatCfg.wechat)
    const data = await client.fetchAccessToken()

    console.log('data in db---', data)
}
