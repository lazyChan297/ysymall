<template>
    <div class="login-wrapper">
        <div class="logo-container">
            <img src="../../common/images/logo.png" alt="" width="140">
        </div>
        <div class="article">
            <div>
                <div class="icon icon-mobile"></div>
                <input type="text" placeholder="请输入手机号码" v-model="mobile">
            </div>
            <div>
                <div class="icon icon-passwd"></div>
                <input type="text" placeholder="请输入验证码" v-model="captcha">
                <div class="getcode" @click="getcode">{{getCodeTxt}}</div>
            </div>
        </div>
        <div class="submit" @click="submit">登陆</div>
        <x-dialog v-model="showDialog">
            <div class="dialog-container">
                <div class="content">验证码无效</div>
                <div class="buttonGroup" @click="showDialog = false">确认</div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog} from 'vux'
import {validPhone} from '@/common/js/validated'
import {saveToken,saveUUID} from '@/common/js/util'
import Qs from 'qs'
// const WAIT_TIME = 10
const TYPE = 8
export default {
    data() {
        return {
            canSendCode: true,
            getCodeTxt: '发送验证码',
            showDialog: false,
            mobile:null,
            captcha:null
        }
    },
    components: {
        XDialog
    },
    methods: {
        getcode() {
            if(!this.canSendCode) return false 
            if(!validPhone(this.mobile)) return false
            let params = Qs.stringify({mobile:this.mobile,type:TYPE})
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.code == 200) {
                    let wait_time = 10
                    let timer = setInterval(()=>{
                        if(wait_time>0) {
                            wait_time--
                            this.getCodeTxt = `${wait_time}s`
                            this.canSendCode = false
                        } else {
                            clearTimeout(timer)
                            this.canSendCode = true
                            this.getCodeTxt = `重新发送验证码`
                        }
                    },1000)
                }
            })
        },
        valid(){
            if(!validPhone(this.mobile)){
                return false
            }
            if(!this.captcha) {
                this.$vux.toast.show({
                    text:`请输入验证码`,
                    type: 'warn'
                })
                return false
            }
            return true
        },
        submit(){
            let valid = this.valid()
            if(!valid) return
            let params = Qs.stringify({
                mobile:this.mobile,
                captcha:this.captcha,
                type:TYPE
            })
            this.$axios.post('/customer/login/mobile-captcha',params).then((res)=>{
                console.log(res)
                if(res.headers) {
                    // console.log(res.headers['access-token'])
                    saveToken(res.headers['access-token'])
                    saveUUID(res.headers['fecshop-uuid'])
                    location.reload()
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/stylus/dialog.styl";
.login-wrapper
    background #ffffff !important
    height 100%
.logo-container
    /* padding-top 35px */
    img
        margin 35px auto 55px
.article
    padding 0 30px
    background #fff
    &>div
        display flex
        align-items center
        height 40px
        border-bottom 1px solid $line
        margin-bottom 28px
        input
            flex 1
            margin-left 10px
        .getcode 
            border-radius 8px
            background $green
            width 120px
            color #fff
            line-height 40px
.submit
    background:linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%);
    box-shadow:0px 4px 7px 0px rgba(41,206,166,0.47);
    border-radius:5px
    color #fff
    font-weight bold
    line-height 50px
    margin 0 15px

</style>