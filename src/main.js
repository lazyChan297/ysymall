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
// import { AlertPlugin, AjaxPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import "./common/stylus/index.styl"
import {getOpenid} from '@/common/js/util'
import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
import VueLazyLoad from 'vue-lazyload'
import InfiniteScroll from 'vue-infinite-scroll'
// 调用微信jssdk
import { WechatPlugin, LoadingPlugin } from 'vux'
import { getUrlParms } from './common/js/util';
Vue.use(WechatPlugin)
// Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
// Vue.use(ConfirmPlugin)
// Vue.use(AlertPlugin)
// Vue.use(AjaxPlugin)
Vue.use(InfiniteScroll)
let vConsole = new VConsole()

// 判断是否请求过get-openid
if(!sessionStorage.getItem('alreadyOpen')&&!global.token&&getUrlParms('token')) {
  console.log("第一次点进浏览器")
  sessionStorage.setItem('alreadyOpen',1)
  global.ready = false
} else {
  global.ready = true
  // console.log(sessionStorage.getItem('alreadyOpen'))
}

// 服务器地址
if (process.env.NODE_ENV === 'development') {
  global.serverHost = ''
} else {
  // 生产服务器
  global.serverHost = "http://fappserver.caomeng.me"
  // 测服务器
  //  global.serverHost = "https://ceshi100.caomeng.me"
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
// let isBoundWechat = false
global.isBoundWechat = isBoundWechat
// axios
Vue.prototype.$axios = axios
const instance = axios.create()
instance.defaults.baseURL = ''
instance.defaults.timeout = 10000
instance.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.request.use(config => {
  Vue.$vux.loading.show({
    text: '加载中'
  })
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  Vue.$vux.loading.hide()
  // 登陆超时
  if(response.data.code === 1100003) {
    let url = window.location.href
    getOpenid(url,true)
  }
  return {data:response.data,headers:response.headers}
})
if(global.uuid || wsCache.get('uuid')) {
  axios.defaults.headers.common['Fecshop-Uuid'] = global.uuid || wsCache.get('uuid')
}
if(global.token || wsCache.get('token') ){
  axios.defaults.headers.common['Access-Token'] = global.token || wsCache.get('token')
  Vue.$vux.loading.show({
    text: '加载中'
  })
  // 获取用户信息
  Vue.prototype.$axios.post('/customer/service/get-customer-info').then((res)=>{
    if(res.data.code === 200) {
      let data = res.data.data
      store.commit('SAVE_USERINFO',data.customerInfo)
      Vue.$vux.loading.hide()
    }
  })
  // 获取购物车信息
  Vue.prototype.$axios.get('/checkout/cart/index').then((res)=>{
    if(res.data.code === 200) {
        let data = res.data.data
        if(data.cart_info) {
          store.commit('SAVE_CARTLEN',data.cart_info.products.length)
        }
    }
  })
}

// 白名单
const whiteList = ['index','cart','goodsDetail','login','inviteConfirm','rank','payment']
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
  if(isBoundWechat) {
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

router.onError((error) => {
  console.log('error')
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
   router.replace(targetPath);
  }
 });

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
