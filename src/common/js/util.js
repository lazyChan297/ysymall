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
    setTimeout(()=>{
        window.location.reload()
    },60 * 60 * 1000 * 2)
    // 没有登陆 or token已过期
    if(!global.token&&!getUrlParms('token')&&!global.uuid&&!getUrlParms("uuid")) {
        window.onload = function() {
            window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+window.location.href  
        }
    }
    // 登陆过且绑定了微信
    if(getUrlParms('token')&&getUrlParms('uuid')) {
        saveUUID(getUrlParms('uuid'))
        saveToken(getUrlParms('token'))
    }
}