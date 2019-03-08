import webStorageCache from 'web-storage-cache'
export function checkToken () {
    let wsCache = new webStorageCache()
    global.token = wsCache.get('token')
    global.uuid = wsCache.get('uuid')
    if(!global.token&&!global.uuid) {
        return false
    } return true
}

export function saveToken(token){
    let wsCache = new webStorageCache()
    wsCache.set('token',token)
}

export function saveUUID(uuid){
    let wsCache = new webStorageCache()
    wsCache.set('uuid',uuid)
}