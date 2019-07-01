const path = require('path')
const webpack = require('webpack')
module.exports = {
    entry: {
        vendeo: ['vux']
    },
    output: {
        path:path.join(__dirname,'dist'),
        filename: '[name].dll.js',
        library: '[name]-[hash]'
    }
}