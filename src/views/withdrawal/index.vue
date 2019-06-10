<template>
    <div class="withdrawal-wrapper">
        <p class="title">提现金额</p>
        <div class="input-container">
            <span class="bold">¥</span>
            <input type='tel' v-model="amount">
        </div>
        <div class="desc">当前余额 ￥{{balance}}</div>
        <div class="large-green-button" @click="submit" :class="cansubmit?'':'disabled'">提现</div>
        <span class="tip">提现请注意： </span>
        <span class="tip">每日最多提现10次； </span>
        <span class="tip">每笔金额≥￥1.00并且≤￥500.00元； </span>
        <span class="tip">每日提现总金额≤￥5,000.00元。</span>
        <x-dialog v-model="isShowDialog" hide-on-blur>
            <p class="text" v-html="dialog.text"></p>
            <div class="submit" @click="confirm">确认</div>
            <div class="cancel" @click="hideDialog">取消</div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog} from 'vux'
// import {validAccount} from '@/common/js/validated';
import Qs from 'qs';
export default {
    data() {
        return {
            isShowDialog: false,
            dialog: {
                text: '暂时不能提现'
            },
            amount: '',
            cansubmit:false,
            balance:'',
            disable:false
        }
    },
    components: {
        XDialog
    },
    watch:{
        amount(val){
            if(this.disable) {
                this.cansubmit = false;
                return false;
            }
            if(val>0){
                this.cansubmit = true
            } else {
                this.cansubmit = false
            }
        }
    },
    mounted() {
        this.getWithDrawal()
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    methods: {
        showDialog() {
            this.isShowDialog = true
        },
        hideDialog() {
            this.isShowDialog = false
            // this.$router.go(-1);
        },
        validAccount(account) {
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
            if(account > 500) {
                Vue.$vux.toast.show({
                    text: '金额不能大于500',
                    type: 'warn'
                })
                return false
            }
            return true
        },
        getWithDrawal() {
            this.$axios.post('/finance/expenditure/withdraw').then((res)=>{
                if(res.data.code !== 200) {
                   this.$vux.toast.show({
                       text:res.data.message,
                       type:'warn',
                       time:3000
                   })
                   this.disable = true
                } else {
                    this.balance = res.data.data.balance
                    this.disable = false
                }
            })
        },
        submit() {
            let valid = this.validAccount(this.amount)&&!this.disable
            if (!valid) return false
            this.isShowDialog = true
            this.dialog.text = `确认提现<span style="color:#FF6A7C">${this.amount}</span>元到微信零钱吗?`
            
        },
        confirm() {
            let params = Qs.stringify({amount:this.amount})
            this.$axios.post('/finance/expenditure/withdraw',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'success'
                    })
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
            this.hideDialog()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl';
/* 弹框 */
.vux-x-dialog
    .weui-dialog
        height 200px
        .text
            margin 40px auto
            font-size 14px
            .green
                color $green
            .red
                color $red
        .submit
            color #fff
            background linear-gradient(360deg,rgba(0,172,252,1) 0%,rgba(64,124,230,1) 100%)
            box-shadow 0px 7px 10px -5px rgba(113,171,253,1)
            line-height 45px
            border-radius 5px
            margin 0 35px
        div.cancel
            color $text-lll
            background #fff
            box-shadow none
            line-height 45px
</style>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.title
    line-height 40px
    padding-left 15px
    background #fff
    text-align left
.input-container
    display flex
    align-items center
    height 80px
    padding 0 15px
    background #fff
    border-top 1px solid $line
    border-bottom 1px solid $line
    span
        font-size 36px
        display block
        height 43px
        line-height 43px
    input
        font-size 36px
        margin-left 10px
        color $text-l
        font-weight bold
        min-width 0
.desc
    color $text-lll
    line-height 40px
    padding-left 15px
    background #fff
    text-align left
.tip
    display block
    font-size 14px
    margin-left 15px
    color $text-lll
    line-height 20px
    text-align left
.disabled
    background $text-lll
    box-shadow 0px 4px 7px 0px $text-lll
</style>