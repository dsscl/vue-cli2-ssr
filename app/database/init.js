const mongoose = require('mongoose')
const { resolve } = require('path')
const glob = require('glob')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js'))
    .forEach(require)
}

exports.connect = (db) => {
    let maxConnectTimes = 0
    return new Promise(resolve => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
        mongoose.connect(db)
        mongoose.connection.on('disconnect', () => {
            maxConnectTimes++
            if(maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
        })
        mongoose.connection.on('error', err => {
            maxConnectTimes++
            if(maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error(err)
            }
        })
        mongoose.connection.on('open', () => {
            resolve()
            console.log('MongoDB connected')
        })
    })
}