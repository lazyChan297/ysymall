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

export function getOpenid(url,flag){
    setTimeout(() => {
        window.location.reload()
     }, 30 *60 * 1000 )
    let urlObj = urls.parse(url)
    let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
    let paymentUrl = ''
    if(urlObj.hash == '#/checkout/onepage/pay/') {
        paymentUrl = urlObj.protocol +'//' + urlObj.host + urlObj.pathname + urlObj.hash
    }
    if(urlObj.hash == '#/applyVip/') {
        paymentUrl = urlObj.protocol +'//' + urlObj.host + urlObj.pathname + urlObj.hash
    }
    if(urlObj.hash == '#/applyAgent/') {
        paymentUrl = urlObj.protocol +'//' + urlObj.host + urlObj.pathname + urlObj.hash
    }
    if(getUrlParms('token')){
        saveToken(getUrlParms('token'))
    }
    if(getUrlParms('uuid')) {
        saveUUID(getUrlParms('uuid'))
    }
    // 不是支付页
    let ispaypage = paymentUrl==''?false:true
    // 获取openid 判断是否绑定微信号 绑定后会自动进行微信登陆 
    // 当前url没有携带token且缓存中没有token
    if((!global.token&&!getUrlParms('token')&&!getUrlParms('uuid')) || flag) {
        window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+encodeURIComponent(url) 
    } else if(!global.token&&!getUrlParms('token')&&getUrlParms('uuid')) {
        // 未绑定微信 请求了openid 但是没有绑定微信不能自动登陆 需要手机+验证码 手动登陆
        // http://192.168.3.198:8090/#/http://192.168.3.198:8090/checkout/onepage/pay/?sn=4acTWX&token=uWrlHoSNDfCx6xlLLFxC_6TRGvwzlisf&uuid=b9db74a8-75fb-11e9-aac7-00163e08edb8
        if(ispaypage) {
            window.location.href = '#/login?redirect='+urlObj.pathname + urlObj.hash
        }
        return false
    } else if (url != pageUrl && !ispaypage) {
        // 登陆过且绑定了微信
        window.location.href = pageUrl
    } else if(url != paymentUrl && ispaypage) {
        console.log("here!!!!!!!!!!!!!!!!!")
        window.location.href = paymentUrl
    }
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