const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const assetsDir = 'static'
const resolve = dir => path.join(__dirname, dir)
// posix兼容方式处理路径
const posixJoin = _path => path.posix.join(assetsDir, _path)

const lastVersion = new Date().getTime()
const isProd = process.env.NODE_ENV === 'production'

// cdn开关
const OPENCDN = true
const webpackHtmlOptions = {
  // dns预加载，优化接口请求
  dnsPrefetch: [
    'http://fimg.caomeng.me'
  ],
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex'
  },
  cdn: {
    // 生产环境
    build: {
    //   css: [
    //     'https://cdn.jsdelivr.net/npm/vant@1.5/lib/index.css'
    //   ],
      js: [
        'https://cdn.jsdelivr.net/npm/vue@2.5.22/dist/vue.js',
        'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
        'https://unpkg.com/vuex@3.0.1/dist/vuex.min.js',
      ]
    }
  }
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir,
  productionSourceMap: false, // 关闭生成环境sourceMap
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 3900
  },
  css: {
    // 增加版本号
    extract: !isProd ? false : {
      filename: posixJoin(`css/${lastVersion}-[name].[contenthash:8].css`),
      chunkFilename: posixJoin(`css/${lastVersion}-[name].[contenthash:8].css`)
    }
  },
  configureWebpack: config => {
    config.resolve.extensions = ['.js', '.vue', '.json']
    if (isProd) {
      // 生成环境执行task任务，写入版本号
      const task = require('./task')
      task.run(lastVersion)
      config.plugins.push(
        // 启用gzip
      	new CompressionWebpackPlugin({
      	  test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      	  threshold: 10240,
      	  minRatio: 0.8
      	})
      )
      // 开启cdn状态：externals不进入webpack打包
      if (OPENCDN) {
        config.externals = webpackHtmlOptions.externals
      }
    }
  },
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
    // 清除警告
    config.performance
      .set('hints', false)
    	// 将版本号写入环境变量
    	config
    	  .plugin('define')
    	  .tap(args => {
    	    args[0]['app_build_version'] = lastVersion
    	    return args
    	  })
    config
      .when(isProd, config =>
        // 生产环境js增加版本号
        config.output
          .set('filename', posixJoin(`js/${lastVersion}-[name].[chunkhash].js`))
          .set('chunkFilename', posixJoin(`js/${lastVersion}-[id].[chunkhash].js`))
      )
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 修改 public/index.html
     */
    config.plugin('html').tap(args => {
      // 生产环境将cdn写入webpackHtmlOptions，在public/index.html应用
      if (isProd && OPENCDN) {
        args[0].cdn = webpackHtmlOptions.cdn.build
      }
      // dns预加载
      args[0].dnsPrefetch = webpackHtmlOptions.dnsPrefetch
      return args
    })
  }
}