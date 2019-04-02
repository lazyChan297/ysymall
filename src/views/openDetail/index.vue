<template>
    <div class="openDetail-wrapper" :class="level==='vip'?'vip':'generalAgent'">
        <div class="userinfo">
            <img v-lazy="current_customer.avatar" alt="" width="54" height="54">
            <div>
                <div class="name">{{current_customer.nickname}}</div>
                <div class="date">绑定时间：{{current_customer.registeredAt}}</div>
            </div>
        </div>
        <div class="article">
            <div>
                <div class="label">手机号</div>
                <div class="content">{{current_customer.mobile}}</div>
            </div>
            <div>
                <div class="label">级别</div>
                <div class="content">{{getLevel(current_customer.level)}}</div>
            </div>
            <!-- <div>
                <div class="label">编号</div>
                <div class="content">18677182541</div>
            </div> -->
        </div>
        <!-- <div class="article">
            <div>
                <div class="label">开通金额</div>
                <div class="content">¥{{fees|| 0}}</div>
            </div>
        </div> -->
        <div class="submit" @click="getOrder">{{level==='vip'?'开通VIP':'开通总代'}}</div>
        <x-dialog v-model="showDialog">
            <div class="dialog-window">
                <div class="title">请选择支付方式</div>
                <div class="optionContainer">
                    <div @click="showPaymentDialog">
                        <span :class="balance<=0?'disabled':''">余额支付（¥{{balance|| 0}}）</span>
                        <div class="icon icon-link"></div>
                    </div>
                    <div @click="wxPrepayment">
                        <span>微信支付</span>
                        <div class="icon icon-link"></div>
                    </div>
                </div>
            </div>
        </x-dialog>
        <x-dialog v-model="paymentDialog" class="paymentDialog">
            <div class="title">余额支付</div>
            <div class="balance">¥{{fees}}</div>
            <div class="inputbox">
                <div>
                    <div class="mobile">{{userInfo.mobile}}</div>
                    <div class="getcode" @click="sendCode">{{codeTxt}}</div>
                </div>
                <div>
                    <input type="text" placeholder="请输入验证码" v-model="code">
                </div>
            </div>
            <div class="submit" @click="upGrade">确认</div>
            <div class="cancel" @click="paymentDialog=false">取消</div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog} from 'vux'
import Qs from 'qs'
import {mapGetters} from 'vuex'
import {validNum} from '@/common/js/validated'
export default {
    data(){
        return {
            showDialog:false,
            paymentDialog:false,
            level:undefined,
            fees:'',
            useBalance:undefined, //支付方式
            balance:'',//用户余额
            canSendCode:true,
            codeTxt:'获取验证码',
            code:''
        }
    },
    created(){
        if(!this.current_customer){
            this.$router.go(-1)
        }
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
    computed:{
        ...mapGetters([
            'current_customer',
            'userInfo'
        ])
    },
    mounted(){
    },
    methods:{
        // 使用余额支付
        showPaymentDialog(){
            if(this.balance<=0){
                this.$vux.toast.show({
                    text:'余额为0,请使用微信支付',
                    type:'warn'
                })
                return false
            }
            this.showDialog = false
            this.paymentDialog = true
            this.useBalance = true
            
        },
        sendCode(){
            if(!this.canSendCode) return false
            let params = Qs.stringify({
                type:9
            })
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'验证码发送成功',
                        type:'success'
                    })
                }
            })
            let reset = 60
            let timer = setInterval(()=>{
                reset--;
                this.canSendCode = false
                this.codeTxt = `${reset}秒后重新发送`
                if(reset<=0){
                    clearTimeout(timer)
                    this.canSendCode = true
                    this.codeTxt = '获取验证码'
                }
            },1000)
        },
        // 开通vip or 总代 获取订单信息
        getOrder() {
            // this.showDialog = true
            let toLevel = this.$route.params.level
            let params = Qs.stringify({
                sn:this.current_customer.sn,
                toLevel:toLevel
            })
            this.$axios.post('/customer/level/upgrade-step-one',params).then((res)=>{
                if(res.data.code === 200) {
                    // 如果需要支付的费用为0 升级到此结束
                    if(res.data.data.fees === 0) {
                        this.$vux.toast.show({
                            text:"升级成功",
                            type:'success'
                        })
                        return false;
                    }
                    this.fees = res.data.data.fees
                    this.orderId = res.data.data.orderId
                } else if (res.data.code === 1100120) {
                    // 数据错误or该会员不需要升级
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                    let timer = setTimeout(()=>{
                        this.$router.go(-1)
                    },2000)
                }
            })
        },
        // 格式化级别
        getLevel(level){
            switch(level){
                case('member'): 
                    return "会员";
                    break;
                case('vip'):
                    return "vip";
                    break;
                case("generalAgent"):
                    return "总代";
                    break;
            }
        },
        // 升级成vip或总代时需要支付的运费
        upGrade(flag){
            let valid = validNum(this.code)
            if(flag){
                if (!valid) return false
            }
            let params = Qs.stringify({
                orderId: this.orderId,
                useBalance:flag,
                captcha:this.code
            })
            this.$axios.post('/customer/level/upgrade-step-two',params).then((res)=>{
                if(res.data.code === 200) {
                    // 余额不足，剩余的需要微信支付
                    if(res.data.data.needWechat) {
                        this.wxPayment(res.data.data.paymentArgs)
                    } else {
                        this.$vux.toast.show({
                            text:'处理成功',
                            type:'success'
                        })
                        this.paymentDialog = false
                    }
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                    this.code = null
                    this.paymentDialog = false
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
        },
        // 微信预支付
        wxPrepayment(){
            this.showDialog = false;
            this.upGrade(false)
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
.generalAgent
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
        .disabled
            color $text-lll
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