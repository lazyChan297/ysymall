import webStorageCache from 'web-storage-cache'
import urls from 'url'
import Vue from 'vue'

// 获取地址栏参数
export function getUrlParms(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}

// 只判断token和uuid是否存在
export function checkToken () {
    let wsCache = new webStorageCache()
    global.token = wsCache.get('token')
    global.uuid = wsCache.get('uuid')
    if(!global.token&&!global.uuid) {
        return false
    } 
    return true
}

export function saveToken(token){
    let wsCache = new webStorageCache()
    wsCache.set('token',token,{exp : 30*60*1})
}

export function saveUUID(uuid){
    let wsCache = new webStorageCache()
    wsCache.set('uuid',uuid,{exp: 30*60*1})
}

export function getOpenid(url){
    console.log('执行了get-openid')
    setTimeout(() => {
        window.location.reload()
     }, 30 *60 * 1000 )
    let urlObj = urls.parse(url)
    let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
    // 登陆过且绑定了微信
    if(getUrlParms('token')){
        saveToken(getUrlParms('token'))
    }
    if(getUrlParms('uuid')) {
        saveUUID(getUrlParms('uuid'))
    }
    // 获取openid 判断是否绑定微信号 绑定后会自动进行微信登陆
    if(!global.token&&!getUrlParms('token')&&!getUrlParms('uuid')) {
        window.onload = function() {
            window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+encodeURIComponent(url) 
        }
    } else if(!global.token&&!getUrlParms('token')&&getUrlParms('uuid')) {
        
        // 请求了openid 但是没有绑定微信不能自动登陆 需要手机+验证码 手动登陆
        return false
    } else if (url != pageUrl && url != global.serverHost + '/checkout/onepage/pay/#/payment/') {
        // 重置url 不能将token和uuid放在url
		window.location.href = pageUrl
    }
    console.log(global.token)
    return true
}
// 节流函数，防止input时频繁触发请求
export function debounce(func, delay) {
    let timer
    return function(...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }