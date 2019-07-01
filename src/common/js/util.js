import webStorageCache from 'web-storage-cache'
import urls from 'url'
import Vue from 'vue'

// 获取地址栏参数
export function getUrlParms(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}


export function saveToken(token){
    let wsCache = new webStorageCache()
    wsCache.set('token',token,{exp : 30*60*1})
    global.token = token
}

export function saveUUID(uuid){
    let wsCache = new webStorageCache()
    wsCache.set('uuid',uuid,{exp: 30*60*1})
    global.uuid = uuid
}

export function getOpenid(url,flag){
    let wsCache = new webStorageCache()
    setTimeout(() => {
        window.location.reload()
     }, 30 *60 * 1000 )
    let urlObj = urls.parse(url)
    let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
    let paymentUrl = ''
    if(urlObj.path.split('?')[0] == '/checkout/onepage/pay/') {
        paymentUrl = urlObj.protocol +'//' + urlObj.host + urlObj.pathname + urlObj.hash.split('?')[0]
    }
    if(getUrlParms('token')){
        saveToken(getUrlParms('token'))
    }
    if(getUrlParms('uuid')&&!getUrlParms('sn')) {
        saveUUID(getUrlParms('uuid'))
    }
 
    // 判断是否是支付页
    let ispaypage = paymentUrl==''?false:true
    // 缓存中没有token或token过期
    console.log(global.token)
    if((!global.token&&!getUrlParms('token')&&!getUrlParms('uuid')) || flag) {
        window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+encodeURIComponent(url) 
    } else if(!global.token&&!getUrlParms('token')&&getUrlParms('uuid')) {
        // 如果是支付页必须先登陆
        if(ispaypage) {
            window.location.href = '#/login?redirect='+urlObj.pathname + urlObj.hash
        }
        
        return false
    } else if (url != pageUrl && !ispaypage) {
        // 登陆过且绑定了微信
            window.location.href = url
    } else if(url != paymentUrl && ispaypage) {
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