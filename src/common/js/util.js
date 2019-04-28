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
    alert('重启了项目')
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
    console.log(urlObj)  
    // alert('！！！！！！！！！！')
    //  payment要做特别处理
    let ispayment = false
    let paymentUrl = ''
    // console.log("href",urlObj.href)
    // console.log("拼接的字符串",urlObj.protocol+'//'+urlObj.host+'/checkout/onepage/pay/#/checkout/onepage/pay/')
    if(urlObj.href === urlObj.protocol+'//'+urlObj.host+'/checkout/onepage/pay/#/checkout/onepage/pay/') {
        paymentUrl = urlObj.protocol+'//'+urlObj.host+'/checkout/onepage/pay/#/checkout/onepage/pay/'
        ispayment = true
    }
    // console.log("paymentUrl",paymentUrl)
    // console.log("url:",url)
    // console.log("pageURL:",pageUrl)
    // console.log("payment:",global.serverHost + '/checkout/onepage/pay/#/checkout/onepage/pay/')
    // 获取openid 判断是否绑定微信号 绑定后会自动进行微信登陆
    if((!global.token&&!getUrlParms('token')&&!getUrlParms('uuid'))||flag) {
        // alert("第一次进来,没有token")
        console.log(url)
        //window.location.href = global.serverHost + '/customer/wechat/get-openid?url_before_login='+encodeURIComponent(url) 
    } else if(!global.token&&!getUrlParms('token')&&getUrlParms('uuid')) {
        // 未绑定微信 请求了openid 但是没有绑定微信不能自动登陆 需要手机+验证码 手动登陆
        return false
    } else if (url != pageUrl && url != global.serverHost + '/checkout/onepage/pay/#/checkout/onepage/pay/') {
        // alert("获得了返回token的url,修改url")
        window.location.href = pageUrl
        if(ispayment) {
            console.log("是支付页,url不会")
            window.location.href = urlObj.href
        } else {
            window.location.href = pageUrl
        }   
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