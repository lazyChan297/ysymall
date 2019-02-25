import Vue from 'vue'
import {Toast} from 'vux'
export function validAccount (account) {
    let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
    if (!reg.test(account)) {
        Vue.$vux.toast.show({
            text: '请输入正确的金额',
            type: 'warn'
          })
          return false
    }
    if (account <= 0) {
        Vue.$vux.toast.show({
            text: '金额不能小于0',
            type: 'warn'
          })
          return false
    }
    return true
}