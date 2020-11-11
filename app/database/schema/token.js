// schema 数据库的模型骨架，不能操作数据库
// model 由schema生成的模型，如用户模型可以操作用户模型、订单模型可以操作订单数据
// entity 实体，模型传入具体的实例生成具体的数据，可以和数据库交互，可增删改查

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
    name: String, // accessToken
    token: String,
    expires_in: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

TokenSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

TokenSchema.statics = {
    async getAccessToken() {
        const token = await this.findOne({
            name: 'access_token'
        })

        if(token && token.token) {
            token.access_token = token.token
        }

        return token
    },
    
    async saveAccessToken(data) {
        let token = await this.findOne({
            name: 'access_token'
        })

        if(token) {
            token.token = data.access_token
            token.expires_in = data.expires_in
        } else {
            token = new Token({
                name: 'access_token',
                token: data.access_token,
                expires_in: data.expires_in
            })
        }

        await token.save()

        return data
    }
}

const Token = mongoose.model('Token', TokenSchema)
