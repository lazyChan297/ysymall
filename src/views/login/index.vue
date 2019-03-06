<template>
    <div class="login-wrapper">
        <div class="logo-container">
            <img src="../../common/images/logo.png" alt="" width="140">
        </div>
        <div class="article">
            <div>
                <div class="icon icon-mobile"></div>
                <input type="text" placeholder="请输入手机号码">
            </div>
            <div>
                <div class="icon icon-passwd"></div>
                <input type="text" placeholder="请输入验证码">
                <div class="getcode" @click="getcode">{{getCodeTxt}}</div>
            </div>
        </div>
        <div class="submit" @click="showDialog = true">登陆</div>
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
// const WAIT_TIME = 10
export default {
    data() {
        return {
            canSendCode: true,
            getCodeTxt: '发送验证码',
            showDialog: false
        }
    },
    components: {
        XDialog
    },
    methods: {
        getcode() {
            if(!this.canSendCode) {
                return false
            }
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