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
import webStorageCache from 'web-storage-cache'
import { AlertPlugin, AjaxPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import 'swiper/dist/css/swiper.css'
import "./common/stylus/index.styl"
import {checkToken} from '@/common/js/util'
import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
let vConsole = new VConsole()
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
  global.serverHost = "http://fappserver.caomeng.me"
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
axios.interceptors.response.use(response => {
  Vue.$vux.loading.hide()
  // 登陆超时
  if(response.data.code === 1100003) {
    // islogin = false
    router.push({path:'/login'})
    // let url = window.location.href
    // wxLogin(url)
  }
  return {data:response.data,headers:response.headers}
})
if(global.uuid&&global.token){
  axios.defaults.headers.common['Fecshop-Uuid'] = global.uuid
  axios.defaults.headers.common['Access-Token'] = global.token
  // 获取购物车信息
  Vue.prototype.$axios.get('/checkout/cart/index').then((res)=>{
    if(res.data.code === 200) {
        let data = res.data.data
        // this.saveCartLen(data.cart_info.products.length)  
        if(data.cart_info.products.length) {
          store.commit('SAVE_CARTLEN',data.cart_info.products.length)
        }
    }
  })
}

// router
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  let origin_path = from.path
  let path = to.path
  // 获取微信jssdk配置项
  let params = Qs.stringify({url: encodeURI(location.href.split('#')[0])})
  Vue.prototype.$axios.post('/customer/wechat/js-sdk-config', params).then(res => {
    if(res.data.code === 200) {
      Vue.wechat.config(res.data.data)
      console.log(res.data.data)
    }
  })
  // 前往登录页且没登录
  if(path==='/login'){
    // 判断是否登录
    console.log('前往登录页')
    if (!islogin) {
      console.log('没登录')
      next({params:{id:1}})
      return
    } else {
      // console.log('登陆了')
      next({path:'/'})
    }
  } 
  if(!islogin) {
    console.log('不是去登录页,让她去登陆')
    next({path:'/login'})
  } else {
    next()
  }
  next()
})

router.afterEach((to,from) => {
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
