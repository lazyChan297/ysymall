// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import fastClick from 'fastclick'
import store from './store/index'
import Qs from 'qs'
import { AlertPlugin, AjaxPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import 'swiper/dist/css/swiper.css'
import "./common/stylus/index.styl"
import {checkToken} from '@/common/js/util'

// 调用微信jssdk
import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(AjaxPlugin)

// 是否登陆
let islogin = checkToken()

// 服务器地址
if (process.env.NODE_ENV === 'development') {
  global.serverHost = ''
} else {
  // 生产服务器
  global.serverHost = "https://sy.caomeng.me"
  // 测服务器
  //  global.serverHost = "https://ceshi100.caomeng.me"
}

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
axios.interceptors.response.use( response => {
  Vue.$vux.loading.hide()
  return {data:response.data,headers:response.headers}
})
if(islogin){
  axios.defaults.headers.common['fecshop-uuid'] = global.uuid
  axios.defaults.headers.common['access-token'] = global.token
}

// router
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  let path = to.path
  if(path === '/login') {
    next()
    return
  }
  if(islogin){
    NProgress.start()
    next()
  } else {
    next({
      path: '/login'
    })
  }
  // // 获取微信jssdk配置项
  // let params = Qs.stringify({url: encodeURI(location.href.split('#')[0])})
  // // Vue.prototype.$axios.post('/jsconfig', params).then(res => {
  // //   if (res.status == 1) {
  // //     Vue.wechat.config(res.data.jsConfig)
  // //   }
  // // })
})

router.afterEach(() => {
  NProgress.done()
})

if(islogin) {
  // 获取购物车信息
  // store.dispatch('SAVE_USERINFO',)
  Vue.prototype.$axios.get('/checkout/cart/index').then((res)=>{
    if(res.data.code === 200) {
      // console.log(res.data.data.cart_info.products.length)
      store.dispatch('saveCartInfo',res.data.data.cart_info)
    }
})
}

Vue.use(VueAwesomeSwiper)
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
