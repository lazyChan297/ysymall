import webStorageCache from 'web-storage-cache'
import urls from 'url'
import Vue from 'vue'

// 获取地址栏参数
export function getUrlParms(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}
function getUrlParms1(url,name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}
let str = 'http://fappserver.caomeng.me/?token=t_QwxI1_5GjRc71-blUkT6UtBHIIPviS&uuid=c14f9a52-77bd-11e9-86ad-00163e08edb8&token=Z1uWqD3Z3VI0EksUsZuk58c5c1ueR_W8&uuid=c29a58f2-77bd-11e9-8136-00163e08edb8#/'
console.log(getUrlParms1(str,'token'))
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
    let wsCache = new webStorageCache()
    setTimeout(() => {
        window.location.reload()
     }, 30 *60 * 1000 )
    let urlObj = urls.parse(url)
    console.log(urlObj)
    let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
    let paymentUrl = ''
    if(urlObj.path.split('?')[0] == '/checkout/onepage/pay/') {
        paymentUrl = urlObj.protocol +'//' + urlObj.host + urlObj.pathname + urlObj.hash.split('?')[0]
    }
    if(getUrlParms('token')){
        saveToken(getUrlParms('token'))
    }
    if(getUrlParms('uuid')) {
        saveUUID(getUrlParms('uuid'))
    }
    // 判断是否是支付页
    let ispaypage = paymentUrl==''?false:true
    // 缓存中没有token或token过期
    if((!global.token&&!getUrlParms('token')&&!getUrlParms('uuid')) || flag) {
        if(flag) {
            wsCache.set('uuid','')
            wsCache.set('token','')
        }
        window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+encodeURIComponent(url) 
    } else if(!global.token&&!getUrlParms('token')&&getUrlParms('uuid')) {
        // 如果是支付页必须先登陆
        if(ispaypage) {
            window.location.href = '#/login?redirect='+urlObj.pathname + urlObj.hash
        }
        return false
    } else if (url != pageUrl && !ispaypage) {
        // alert(3)
        // alert(url)
        // alert(pageUrl)
        // 登陆过且绑定了微信
        window.location.href = pageUrl
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