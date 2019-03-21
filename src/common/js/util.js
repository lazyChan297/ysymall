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
    wsCache.set('token',token,{exp : 60*60*2})
}

export function saveUUID(uuid){
    let wsCache = new webStorageCache()
    wsCache.set('uuid',uuid,{exp: 60*60*2})
}

// export function wxLogin(url) {
//     let wsCache = new webStorageCache()
//     global.token = wsCache.get('token')
//     global.uuid = wsCache.get('uuid')
//     let urlObj = urls.parse(url)
//     let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
//     // 如果token失效则重新获取
//     setTimeout(() => {
//         window.location.reload()
//     }, 60 * 60 * 1000 * 2)
//     if (!global.token && !getUrlParms('token') && !global.uuid && !getUrlParms('uuid')) {
//         // token uuid均不存在
//         window.onload = function () {
//          window.location.href = global.serverHost + '/customer/wechat/get-user-info?url_before_login=' + encodeURIComponent(url)
//         } 
//     } else if (url != pageUrl && url != global.serverHost + '/checkout/onepage/pay/#/payment/') {
//         // http://fappserver.caomeng.me/checkout/onepage/pay/#/payment/
//         window.location.href = pageUrl
//     }
//     if (getUrlParms('token')) {
//         wsCache.set('token', getUrlParms('token'), {exp : 60*60*2})
//         wsCache.set('uuid', getUrlParms('uuid'), {exp : 60*60*2})
//     }
// }

export function wxLogin(url){
    window.onload = function() {
        window.location.href = global.serverHost + '/customer/wechat/get-user-info?url_before_login=' + encodeURIComponent(url)
    }
    if(getUrlParms('token')) {
        saveUUID(getUrlParms('uuid'))
        saveToken(getUrlParms('token'))
    }
}

export function getOpenid(){
    console.log("getopenid")
    setTimeout(()=>{
        window.location.reload()
    },60 * 60 * 1000 * 2)
    // 没有登陆 or token已过期
    if(!global.token&&!getUrlParms('token')&&!global.uuid&&!getUrlParms("uuid")) {
        window.onload = function() {
            window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+window.location.href  
        }
    }
    console.log('.....')
    console.log(getUrlParms('token'))
    // 登陆过且绑定了微信
    if(getUrlParms('token')&&getUrlParms('uuid')) {
        saveUUID(getUrlParms('uuid'))
        saveToken(getUrlParms('token'))
    }
}