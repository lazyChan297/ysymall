<template>
    <div class="openDetail-wrapper" :class="level==='vip'?'vip':'agent'">
        <div class="userinfo">
            <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
            <div>
                <div class="name">用户名</div>
                <div class="date">绑定时间：2019-01-15 12:13:23</div>
            </div>
        </div>
        <div class="article">
            <div>
                <div class="label">手机号</div>
                <div class="content">18677182541</div>
            </div>
            <div>
                <div class="label">级别</div>
                <div class="content">普通用户</div>
            </div>
            <div>
                <div class="label">编号</div>
                <div class="content">18677182541</div>
            </div>
        </div>
        <div class="article">
            <div>
                <div class="label">开通金额</div>
                <div class="content">¥50.00</div>
            </div>
        </div>
        <div class="submit" @click="showDialog=true">{{level==='vip'?'开通VIP':'开通总代'}}</div>
        <x-dialog v-model="showDialog">
            <div class="dialog-window">
                <div class="title">请选择支付方式</div>
                <div class="optionContainer">
                    <div @click="showPaymentDialog">
                        <span>余额支付（¥300.00）</span>
                        <div class="icon icon-link"></div>
                    </div>
                    <div @click="showDialog = false">
                        <span>微信支付</span>
                        <div class="icon icon-link"></div>
                    </div>
                </div>
            </div>
        </x-dialog>
        <x-dialog v-model="paymentDialog" class="paymentDialog">
            <div class="title">余额支付</div>
            <div class="balance">¥50.00</div>
            <div class="inputbox">
                <div>
                    <div class="mobile">186****0000</div>
                    <div class="getcode">获取验证码</div>
                </div>
                <div>
                    <input type="text" placeholder="请输入验证码">
                </div>
            </div>
            <div class="submit">确认</div>
            <div class="cancel" @click="paymentDialog=false">取消</div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog} from 'vux'
import Qs from 'qs'
export default {
    data(){
        return {
            showDialog:false,
            paymentDialog:false,
            level:undefined,
            fees:'',
            useBalance:undefined //支付方式
        }
    },
    created(){
        this.level = this.$route.params.level
        if(this.level === 'vip') {
            document.title = '开通VIP'
        } else {
            document.title = '开通总代'
        }
        
    },
    components:{
        XDialog
    },
    methods:{
        // 使用余额支付
        showPaymentDialog(){
            this.showDialog = false
            this.paymentDialog = true
            this.useBalance = true
        },
        // 开通vip or 总代 获取订单信息
        getOrder() {
            let toLevel = $route.params.level
            let params = Qs.stringify({
                sn:'',
                toLevel:toLevel
            })
            this.$axios.post('/customer/level/upgrade-step-one',params).then((res)=>{
                if(res.data.code === 200) {
                    this.fees = res.data.data.fees
                    let params1 = Qs.stringify({
                        orderId:res.data.data.orderId,
                        useBalance:this.useBalance
                    })
                    this.upGrade(params1)
                }
            })
        },
        // 升级成vip或总代时需要支付的运费
        upGrade(params){
            this.$axios.post('/customer/level/upgrade-step-two',params).then((res)=>{
                if(res.data.code === 200) {
                    // 余额不足，剩余的需要微信支付
                    if(res.data.data.needWechat) {
                        this.wxPayment(res.data.data.paymentArgs)
                    }
                }
            })
        },
        wxPayment(arg) {
            this.$wechat.chooseWXPay({
                timestamp: arg.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: arg.nonceStr, // 支付签名随机串，不长于 32 位
                package: arg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: arg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: arg.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                }
            });
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
/* VIP */
.vip
    .submit
        background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
    .dialog-window
        .title
            background $green
    .paymentDialog
        .title
            background $green
        .balance
            background $green
        .submit
            background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
            box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)

/* 总代 */
.agent
    .submit
        background linear-gradient(180deg,rgba(255,167,178,1) 0%,rgba(255,106,124,1) 100%)
        box-shadow:0px 4px 7px 0px rgba(255,106,124,0.47)
    .dialog-window
        .title
            background $red
    .paymentDialog
        .title
            background $red
        .balance
            background $red
        .submit
            background linear-gradient(180deg,rgba(255,167,178,1) 0%,rgba(255,106,124,1) 100%)
            box-shadow:0px 4px 7px 0px rgba(255,106,124,0.47)
.userinfo
    display flex
    height 100px
    padding 0 15px
    align-items center
    background #fff
    img
        border-radius 50%
    &>div
        margin-left 10px
    .name
        color $text-l
        font-weight bold
        margin-bottom 10px
        font-size 18px
        text-align left
    .date
        text-align left
        color $text-lll
        font-size 14px
.article
    margin-top 10px
    background #fff
    padding 0 15px
    &>div
        display flex
        justify-content space-between
        line-height 50px
        border-bottom 1px solid #efefef
        .label
            color $text-l
        .content
            color $text-ll
.submit
    line-height 50px
    background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
    box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
    border-radius 5px
    color #fff
    font-weight bold
    margin 20px 15px 0
/* dialog */
.dialog-window
    border-radius 5px
    .title
        color #fff
        font-weight bold
        line-height 50px
    .optionContainer
        background #fff
        padding 0 15px
        &>div
            display flex
            height 80px
            border-bottom 1px solid #efefef
            justify-content space-between
            align-items center
/* 余额支付 */
.paymentDialog
    .title
        font-weight bold
        color #fff
        padding 23px 0 10px
        background $green
    .balance
        font-weight bold
        color #fff
        padding-bottom 17px
        background $green
        font-size 36px
    .inputbox
        padding 0 15px
        &>div
            display flex
            justify-content space-between
            align-items center
            height 50px
            border-bottom 1px solid #efefef
            .getcode
                color $text-l
                border-left 1px solid $text-l
                padding-left 10px
    .cancel
        color $text-lll
        line-height 50px
</style>