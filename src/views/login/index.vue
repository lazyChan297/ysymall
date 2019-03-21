<template>
    <div class="login-wrapper">
        <div class="logo-container">
            <img src="../../common/images/logo.png" alt="" width="140">
        </div>
        <div class="article">
            <div class="row">
                <div class="iconbox"><div class="icon icon-mobile"></div></div>
                <input type="text" placeholder="请输入手机号码" v-model="mobile" @blur.prevent="slideUpKeyboard">
            </div>
            <div class="row">
                <div class="iconbox"><div class="icon icon-passwd"></div></div>
                <input type="text" placeholder="请输入验证码" v-model="captcha" @blur.prevent="slideUpKeyboard">
                <div class="getcode" @click="getcode" :class="{'disable':!canSendCode}">{{getCodeTxt}}</div>
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
import {saveToken, saveUUID, wxLogin} from '@/common/js/util'
import Qs from 'qs'
import urls from 'url'
// const WAIT_TIME = 10
const TYPE = 8
let afterLogin = undefined
export default {
    data() {
        return {
            canSendCode: true,
            getCodeTxt: '发送验证码',
            showDialog: false,
            mobile:null,
            captcha:null,
            redirect:''
        }
    },
    components: {
        XDialog
    },
    beforeRouteEnter(to, from, next){
        if(from) {afterLogin = from.path}
        next()
    },
    created(){
        this.redirect = this.$route.query.redirect
    },
    methods: {
        getcode() {
            if(!this.canSendCode) return false 
            if(!validPhone(this.mobile)) return false
            let params = Qs.stringify({mobile:this.mobile,type:TYPE})
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code == 200) {
                    let wait_time = 10
                    let timer = setInterval(()=>{
                        if(wait_time>0) {
                            wait_time--
                            this.getCodeTxt = `${wait_time}s`
                            this.canSendCode = false
                        } else {
                            clearTimeout(timer)
                            this.canSendCode = true
                            this.getCodeTxt = `发送验证码`
                        }
                    },1000)
                }
            })
        },
        // 收起键盘
        slideUpKeyboard() {
            window.scrollTo(0,0)
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
            this.$axios.post('/customer/login/mobile-captcha',params,{
                headers:{
                    'fecshop-uuid':'',
                    'access-token':''
                }
            }).then((res)=>{
                if(res.headers && res.data.code === 200) {
                    // saveToken(res.headers['access-token'])
                    // saveUUID(res.headers['fecshop-uuid'])
                    // let url = this.redirect
                    // wxLogin(url)
                    // if(res.data.)
                    // 没有绑定微信 引导用户微信授权
                    if(!res.data.data.wechatBound) {
                        let url = window.location.href
                        let urlObj = urls.parse(url)
                        let _url = urlObj.protocol + '//' + urlObj.host + '/#' + this.redirect
                        window.location.href = global.serverHost + '/customer/wechat/get-user-info?url_before_login=' + encodeURIComponent(_url)
                    }
                } else if (res.data.code === 1100103) {
                    this.$vux.toast.show({
                        text: '验证码已过期',
                        type: 'warn'
                    })
                } else if(res.data.code === 1100104) {
                    this.$vux.toast.show({
                        text: '验证码错误',
                        type: 'warn'
                    })
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
    box-sizing border-box
    width 100%
    .row
        display flex
        align-items center
        width 100%
        height 40px
        border-bottom 1px solid $line
        margin-bottom 28px
        .iconbox
            flex 0 0 20px
        input
            margin-left 10px
            flex 1
            min-width 0
        .getcode
            border-radius 8px
            background $green
            color #fff
            font-size 14px
            flex: 0 0 70px
            line-height 20px
            line-height 40px
            padding 0 10px
        .disable
            background $text-lll
.submit
    background:linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%);
    box-shadow:0px 4px 7px 0px rgba(41,206,166,0.47);
    border-radius:5px
    color #fff
    font-weight bold
    line-height 50px
    margin 0 15px

</style>