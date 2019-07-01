<template>
    <div class="inviteConfirm" v-show="!isHide">
        <div class="confirm-container">
            <img :src="inviter.avatar" alt="" class="avatar">
            <!-- <img src="../../common/images/avatar_default.png" alt=""> -->
            <p class="name">{{inviter.nickname}}</p>
            <p class="desc">邀请你加入缘生源</p>
            <div class="form" v-if="!isLogin">
                <div>
                    <input type="tel" placeholder="请输入手机号码" v-model="mobile">
                </div>
                <div>
                    <input type="tel" placeholder="请输入验证码" v-model="captcha">
                    <div class="getcode" :class="canSendCode?'':'disabled'" @click="getcode">{{getCodeTxt}}</div>
                </div>
            </div>
            <div class="submit" @click="submit">接受邀请</div>
            <div class="desc">（老用户可用手机号登录）</div>
        </div>
    </div>
</template>
<script>
import Qs from 'qs'
import {validPhone} from '@/common/js/validated'
import {mapGetters} from 'vuex'
import webStorageCache from 'web-storage-cache'
export default {
    data(){
        return {
            inviter:'',
            userSn:'',
            canSendCode:true,
            mobile:'',
            getCodeTxt:'发送验证码',
            captcha:'',
            cansubmit:true,
            isLogin:true,
            hasInviter:'',
            isHide:true
        }
    },
    created() {
        
    },
    beforeMount() {
        const wsCache = new webStorageCache()
        if (this.userInfo.mobile) {
           if (this.userInfo.hasInviter) {
                window.location = global.serverHost + '#/index'
            } else {
                this.isLogin = false
                this.isHide = false
            }
        } else {
            if (global.token || wsCache.get('token')) {
                this.getUserInfo()
            } else {
                this.isHide = false
                this.isLogin = false
            }
        }
    },
    mounted(){
        this.userSn = this.$route.query.inviter
        this.getInviter(this.userSn)
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    methods:{
        getUserInfo() {
            console.log('get userinfo')
            this.$axios.post('/customer/service/get-customer-info').then((res)=>{
                if(res.data.code === 200) {
                    let flag = res.data.data.customerInfo.hasInviter
                    if (flag) {
                        window.location = global.serverHost + '#/index'
                    } else {
                        this.isHide = false
                        this.isLogin = true
                    }
                }
            })
        },
        slideUpKeyboard() {
            window.scrollTo(0,0)
        },
        // 获取邀请人信息
        getInviter(sn){
            let params = Qs.stringify({inviter:sn})
            this.$axios.post('/customer/service/get-inviter-info',params).then((res)=>{
                if(res.data.code === 200) {
                    this.inviter = res.data.data.inviterInfo
                }
            })
        },
        //发送验证码
        getcode() {
            if(!this.canSendCode) return false 
            if(!validPhone(this.mobile)) return false
            let params = Qs.stringify({mobile:this.mobile,type:8})
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code == 200) {
                    let wait_time = 60
                    let timer = setInterval(()=>{
                        if(wait_time>0) {
                            wait_time--
                            this.getCodeTxt = `${wait_time}s`
                            this.canSendCode = false
                        } else {
                            window.clearTimeout(timer)
                            this.canSendCode = true
                            this.getCodeTxt = `发送验证码`
                        }
                    },1000)
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
        },
        // 接受邀请
        // submit(){
        //     let params = Qs.stringify({inviter:this.userSn})
        //     this.$axios.post('/customer/service/confirm-inviter',params).then((res)=>{
        //         if(res.data.code === 200) {
        //             this.$vux.toast.show({
        //                 text:'接受邀请成功！',
        //                 type:'success'
        //             })
        //             let timer = setTimeout(()=>{
        //                 this.$router.push({path:'/login'})
        //             },1000) 
        //         } else if (res.data.code=== 1000008){
        //             this.$vux.toast.show({
        //                 text:res.data.message,
        //                 type:'warn'
        //             })
        //             let timer = setTimeout(()=>{
        //                 this.$router.push({path:'/'})
        //             },1000) 
        //         }
                
        //     })
        // },
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
            let params = Qs.stringify({
                mobile:this.mobile,
                captcha:this.captcha,
                type:8,
                inviter:this.userSn
            })
            if (!this.isLogin) {
                let valid = this.valid()
                if(!valid) return
                if (valid) {
                    if(this.cansubmit) {
                        this.cansubmit = false
                    } else {
                        return false
                    }   
                }
                this.$axios.post('/customer/login/mobile-captcha',params).then((res)=>{
                    if(res.headers && res.data.code === 200) {
                        let wechatBound = res.data.data.wechatBound
                        let url = window.location.href
                        let _url = global.serverHost + '#/index?sn='+ res.data.data.customerSn
                        window.location.href = global.serverHost + '/customer/wechat/get-user-info?url_before_login=' + encodeURIComponent(_url)
                    }  else {
                        this.cansubmit = true
                        this.$vux.toast.show({
                            text: res.data.message,
                            type: 'warn'
                        })
                    }
                })
            } else {
                this.$axios.post('/customer/service/confirm-inviter',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.$vux.toast.show({
                            text:'接受邀请成功',
                            type:'success',
                            time:1500
                        })
                        window.location = global.serverHost + '#/index'
                    } else {
                        this.$vux.toast.show({
                            text:res.data.message,
                            type:'warn'
                        })
                    }
                })
            }
            
        }
    }
}
</script>

<style lang="stylus" scoped>
 @import '../../common/stylus/variable.styl';
 .desc
    font-size 14px
    margin-top 10px
    text-align center
.form
    padding 0 15px
    &>div
        display flex
        margin 0 auto 10px
        border-radius 30px
        border 1px solid $line
        padding 0 15px
        height 50px
        line-height 50px
        input
            flex 1
            background transparent
            min-width 0
        .getcode
            color $green
            line-height 50px
            min-width 80px
            font-size 14px
        .disabled
            color $text-lll
.inviteConfirm
    padding-top 135px
.confirm-container
    margin 0 37px 0
    background #fff
    box-shadow 0px 4px 8px 0px rgba(0,0,0,0.15)
    border-radius 8px
    padding-bottom 20px
    img
        margin-top -35px
        border-radius 50%
        width 70px
        height 70px
    .name
        font-size 20px
        color $text-l
        margin-top 5px
        line-height 28px
    .desc
        font-size 16px
        color $text-ll
        margin-bottom 20px
    .submit
        border-radius 30px
        line-height 50px
        color #fff
        margin 20px 15px 0
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
</style>

