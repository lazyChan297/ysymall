import webStorageCache from 'web-storage-cache'
import urls from 'url'
import Vue from 'vue'

// 获取地址栏参数
export function getUrlParms(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}

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
    wsCache.set('token',token)
}

export function saveUUID(uuid){
    let wsCache = new webStorageCache()
    wsCache.set('uuid',uuid)
}

export function checkWxToken(url) {
    let wsCache = new webStorageCache()
    global.token = wsCache.get('token')
    let urlObj = urls.parse(url)
    let pageUrl = urlObj.protocol + '//' + urlObj.host + '/' + urlObj.hash
    // 如果token失效则重新获取
    setTimeout(() => {
        window.location.reload()
    }, 60 * 60 * 1000 * 2) 
    if (!global.token && !getUrlParms('token')) {
        console.log('token不存在')
        window.onload = function () {
        window.location.href = global.serverHost + '/customer/wechat/get-user-info?url_before_login=' + encodeURIComponent(url)
        console.log(global.serverHost)
        console.log(global.serverHost + '/wechat/getUserInfo?url_befor_login'+ encodeURIComponent(url))
        } 
    } else if (url != pageUrl && url != global.serverHost + '/newCart/pay/#/goods/payment/') {
        window.location.href = pageUrl
    }
    if (getUrlParms('token')) {
        wsCache.set('token', getUrlParms('token'), {exp : 60*60*2})
    }
}