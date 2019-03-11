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
  // 前往登录页且没登录
  if(path==='/login'){
    // 判断是否登录
    console.log('前往登录页')
    if (!islogin) {
      console.log('没登录')
      next()
      return
    } else {
      console.log('登陆了')
      next({path:'/'})
    }
  } 
  if(!islogin) {
    console.log(islogin)
    console.log('不是去登录页,让她去登陆')
    next({path:'/login'})
  } else {
    console.log('//////')
    next()
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
