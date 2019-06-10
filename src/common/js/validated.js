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

export function validPhone(phone) {
    let reg = /^1[345789][0-9]{9}$/
    if(!phone) {
      Vue.$vux.toast.show({
        text: '请输入手机号码',
        type: 'warn'
      })
      return false
    }
    if (!reg.test(phone)) {
      Vue.$vux.toast.show({
        text: '请输入正确的手机号码',
        type: 'warn'
      })
      return false
    }
    return true
}

export function validNum(num){
  let reg = /^[0-9]*$/
  if(!num) {
    Vue.$vux.toast.show({
      text: '请输入验证码',
      type: 'warn'
    })
    return false
  }
  if(!reg.test(num)){
    Vue.$vux.toast.show({
      text: '验证码必须为数字',
      type: 'warn'
    })
    return false
  }
  return true
}