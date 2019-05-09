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
import {validAccount} from '@/common/js/validated';
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
        account(val){
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
    },
    methods: {
        showDialog() {
            this.isShowDialog = true
        },
        hideDialog() {
            this.isShowDialog = false
            this.$router.go(-1);
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
                }
            })
        },
        submit() {
            let valid = validAccount(this.amount)&&!this.disable
            if (!valid) return false
            let params = Qs.stringify({amount:this.amount})
            this.$axios.post('/finance/expenditure/withdraw',params).then((res)=>{
                if(res.data.code === 200) {
                    this.dialog.text = res.data.message
                    this.isShowDialog = true
                }
            })
        },
        confirm() {
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
                color #FF6659
        .submit
            color #fff
            background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%);
            box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47);
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