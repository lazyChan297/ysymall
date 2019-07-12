// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import fastClick from 'fastclick'
import store from './store/index'
import Qs from 'qs'
import webStorageCache from 'web-storage-cache'
import urls from 'url'
// import { AlertPlugin, AjaxPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import "./common/stylus/index.styl"
import {getOpenid} from '@/common/js/util'
import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
import VueLazyLoad from 'vue-lazyload'
// 调用微信jssdk
import { WechatPlugin, LoadingPlugin,ToastPlugin,AlertPlugin, AjaxPlugin,ConfirmPlugin} from 'vux'
import { getUrlParms } from './common/js/util';
Vue.use(WechatPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
global.ready = true
// 服务器地址
if (process.env.NODE_ENV === 'development') {
  let vConsole = new VConsole()
  global.serverHost = ''
} else {
  // 生产服务器
  global.serverHost = "https://appserver.ysyysy.com"
  // 测服务器
    // global.serverHost = "http://fappserver.caomeng.me"
   
}

// 图片懒加载
Vue.use(VueLazyLoad, {
  loading: require('@/common/images/default_pic.jpg')
})

// 从缓存中获取token和uuid
const wsCache = new webStorageCache()
global.token = wsCache.get('token')
global.uuid = wsCache.get('uuid')

// 获取openid 通过返回的token和uuid判断用户是否登陆和绑定微信
let url = window.location.href
let isBoundWechat = getOpenid(url)
global.isBoundWechat = isBoundWechat
// axios
Vue.prototype.$axios = axios
const instance = axios.create()
instance.defaults.baseURL = ''
instance.defaults.timeout = 10000
instance.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.interceptors.request.use(config => {
  Vue.$vux.loading.show({
    text: '加载中'
  })
  return config
}, err => {
  return Promise.reject(err)
})
if(global.uuid || wsCache.get('uuid')) {
  axios.defaults.headers.common['Fecshop-Uuid'] = global.uuid || wsCache.get('uuid')
}
if(global.token || wsCache.get('token') ){
  axios.defaults.headers.common['Access-Token'] = global.token || wsCache.get('token')
  // Vue.$vux.loading.show({
  //   text: '加载中'
  // })
}

axios.interceptors.response.use(response => {
  Vue.$vux.loading.hide()
  // 登陆超时
  if(response.data.code === 1100003) {
    global.token = ''
    wsCache.set('token','')
    let url = window.location.href
    let urlObj = urls.parse(url)
     url = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
     window.location.href = url
    // Vue.$vux.loading.show({
    //   text:'登录中…'
    // })
  }
  return {data:response.data,headers:response.headers}
})
if(global.token || wsCache.get('token') ){
  // 获取用户信息
  Vue.prototype.$axios.post('/customer/service/get-customer-info').then((res)=>{
    if(res.data.code === 200) {
      let data = res.data.data
      store.commit('SAVE_USERINFO',data.customerInfo)
      global.hasInviter = data.customerInfo.hasInviter
      // 获取购物车信息
      Vue.prototype.$axios.get('/checkout/cart/index').then((res)=>{
        if(res.data.code === 200) {
            let data = res.data.data
            if(data.cart_info) {
              store.commit('SAVE_CARTLEN',data.cart_info.products.length)
            }
            Vue.$vux.loading.hide()
        }
      })
      
    }
  })
}


// 白名单
const whiteList = ['index','cart','goodsDetail','login','inviteConfirm','rank','payment','inviterConfirmLogin']
// router
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  let origin_path = from.path
  let path = to.path
  let params = Qs.stringify({url: encodeURI(location.href.split('#')[0])})
  // 获取微信jssdk配置项
  Vue.prototype.$axios.post('/customer/wechat/js-sdk-config', params).then(res => {
    if(res.data.code === 200) {
      Vue.wechat.config(res.data.data)
    }
  })
  if(to.path!=='/index') {
    Vue.wechat.ready(() => {
      Vue.wechat.hideMenuItems({
          menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
      });
  })
  }
  console.log(global.isBoundWechat)

  if(global.isBoundWechat) {
    // 已经登陆但是要前往登陆页,拦截
    if(path === '/login') {
      next({path:'/'})
    } else {
      next()
    }
  } else {
    if(whiteList.indexOf(to.name) !== -1) {
      next()
    } else {
      // "没登陆，让它去登陆"
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to,from) => {
  NProgress.done()
})



fastClick.attach(document.body)
Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
