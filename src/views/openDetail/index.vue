<template>
    <div class="openDetail-wrapper" :class="level==='vip'?'vip':'generalAgent'">
        <div class="userinfo">
            <img v-lazy="current_customer.avatar" alt="">
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
        </div>
        <div class="submit" @click="showOpenGradeOne">{{level==='vip'?'开通VIP':'开通总代'}}</div>
        <x-dialog v-model="showDialog">
            <div class="dialog-window">
                <div class="titlebox">
                    <div class="desc">支付运费</div>
                    <div class="title">￥{{fees}}元</div>
                </div>
                <div class="optionContainer">
                    <div @click="showPaymentDialog">
                        <span :class="balance<=fees?'disabled':''">余额支付（¥{{balance|| 0}}）</span>
                        <div class="icon icon-link"></div>
                    </div>
                    <div @click="wxPrepayment">
                        <span>微信支付</span>
                        <div class="icon icon-link"></div>
                    </div>
                </div>
                <div @click="showDialog=false" class="cancel">取消</div>
            </div>
            
        </x-dialog>
        <x-dialog v-model="paymentDialog" class="paymentDialog">
            <div class="title">余额支付</div>
            <div class="balance">¥{{fees}}</div>
            <div class="submit" @click="upGrade(false)">确认</div>
            <div class="cancel" @click="paymentDialog=false">取消</div>
        </x-dialog>
        <!-- 第一次跳出的弹框 -->
        
        <x-dialog v-model="upGradeOne" class="paymentDialog upGradeOne">
            
            <div class="title">开通{{level=='vip'?'vip':'总代'}}</div>
            <div class="inputbox">
                <div>
                    <div class="mobile">{{userInfo.mobile}}</div>
                    <div class="getcode" @click="sendCode">{{codeTxt}}</div>
                </div>
                <div>
                    <input type="tel" placeholder="请输入验证码" v-model="code" @blur="scrolltoTop">
                </div>
            </div>
            <div class="submit" @click.prevent="getOrder">确认</div>
            <div class="cancel" @click.prevent="hideUpGradeOne">取消</div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog} from 'vux'
import Qs from 'qs'
import {mapGetters} from 'vuex'
import {validNum} from '@/common/js/validated'
import { TransferDomDirective as TransferDom } from 'vux'
import { setTimeout } from 'timers';
export default {
    data(){
        return {
            current_customer:'',
            isScroll:false,
            showDialog:false,
            paymentDialog:false,
            level:undefined,
            fees:'',
            useBalance:undefined, //支付方式
            balance:'',//用户余额
            canSendCode:true,
            codeTxt:'获取验证码',
            code:'',
            upGradeOne:false
        }
    },
    directives: {
        TransferDom
    },
    created(){
        this.level = this.$route.params.level
        if(this.level === 'vip') {
            document.title = '开通VIP'
        } else {
            document.title = '开通总代'
        }
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    components:{
        XDialog
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    mounted(){
        this.current_customer = JSON.parse(decodeURI(this.getCookie('customer')))
        if(!this.current_customer || !this.current_customer.sn) {
            this.$vux.toast.show({
                text:'用户信息获取失败，请重新获取!',
                type:'warn'
            })
            let timer = setTimeout(()=>{
                this.$router.go(-1)
            },1000)
        }
},
    methods:{
        scrolltoTop(){
             window.scrollTo(0, 0);
        },
        hideUpGradeOne() {
            this.upGradeOne = false
        },
        getCookie(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return arr[2];
            else
            return null;
        },
        // 使用余额支付
        showPaymentDialog(){
            if(this.balance<=this.fees){
                this.$vux.toast.show({
                    text:'余额不足,请使用微信支付',
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
                type:this.upGrade?11:9,
                mobile:this.userInfo.mobile
            })
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'验证码发送成功',
                        type:'success'
                    })
                    let reset = 60
                    let timer = setInterval(()=>{
                        reset--;
                        this.canSendCode = false
                        this.codeTxt = `${reset}秒后重新发送`
                        if(reset==0){
                            window.clearTimeout(timer)
                            this.canSendCode = true
                            this.codeTxt = '获取验证码'
                        }
                    },1000)
                } else {
                    this.$vux.toast.show({
                        text:'验证码发送失败,请稍后再试！',
                        type:'warn'
                    })
                }
            })
            
        },
        showOpenGradeOne() {
            this.upGradeOne = true
        },
        // 开通vip or 总代 获取订单信息
        getOrder() {
            if(!this.code) {
                this.$vux.toast.show({
                    text:"请输入验证码",
                    type:'warn'
                })
                return false
            }
            let toLevel = this.$route.params.level
            let customer = this.current_customer
            let params = Qs.stringify({
                sn:customer.sn,
                toLevel:customer.level,
                captcha: this.code
            })
            
            this.$axios.post('/customer/level/upgrade-step-one',params).then((res)=>{
                if(res.data.code === 200) {
                    // 如果需要支付的费用为0 升级到此结束
                    if(res.data.data.fees === 0) {
                        this.$vux.toast.show({
                            text:"升级成功",
                            type:'success'
                        })
                        this.upGradeOne = false
                        return false;
                        
                    }  else {
                        this.showDialog = true
                        this.upGradeOne = false
                        this.code = ''
                        this.fees = res.data.data.fees
                        this.balance = res.data.data.balance
                        this.orderId = res.data.data.orderId
                    }
                    
                } else if (res.data.code === 1100120) {
                    // 数据错误or该会员不需要升级
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                    // let timer = setTimeout(()=>{
                    //     this.$router.go(-1)
                    // },2000)
                } else if (res.data.code === 1100104){
                        
                         this.$vux.toast.show({
                            text:"验证码错误",
                            type:'warn',
                            time:1000
                        })
                        return false
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
            // if(flag){
            //     let valid = validNum(this.code)
            //     if (!valid) return false
            // }
            let params = Qs.stringify({
                orderId:this.orderId,
                useBalance:1
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
            let that = this
            this.$wechat.chooseWXPay({
                timestamp: arg.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: arg.nonceStr, // 支付签名随机串，不长于 32 位
                package: arg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: arg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: arg.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    that.$router.go(-1)
                }
            });
        },
        // 微信预支付
        wxPrepayment(){
            this.showDialog = false;
            let params = Qs.stringify({
                orderId:this.orderId,
                useBalance:0
            })
            this.$axios.post('/customer/level/upgrade-step-two',params).then((res)=>{
                if(res.data.code === 200) {
                    // 余额不足，剩余的需要微信支付
                    this.wxPayment(res.data.data.paymentArgs)
                    // if(res.data.data.needWechat) {
                    //     this.wxPayment(res.data.data.paymentArgs)
                    // } else {
                    //     this.$vux.toast.show({
                    //         text:'处理成功',
                    //         type:'success'
                    //     })
                    //     this.paymentDialog = false
                    //     this.$router.go(-1)
                    // }
                    console.log(res)
                    
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                    this.code = null
                    this.paymentDialog = false
                }
            })
            // this.upGrade(false)
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.paymentDialog.upGradeOne .title
    line-height 50px
    padding 0
.openDetail-wrapper
    height 100%
.icon-close
    width 24px
    height 24px
    margin 10px 0
/* VIP */
.vip,.generalAgent
    .submit
        background:linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%);
        box-shadow:0px 4px 7px 0px rgba(0,132,255,0.3)
    .dialog-window
        background transparent
        .titlebox
            height 103px
            background $green
            padding-top 20px
            box-sizing border-box
            padding-bottom 10px
        .title
            background $green
        .desc
            background $green
            color #fff
            font-weight bold
        .cancel
            height 50px
            line-height 50px
            color $text-l
            border 1px solid $line
            margin 20px 15px
            border-radius 5px
            font-weight bold
    .paymentDialog
        // position fixed
        // width 80%
        // max-width 300px
        // margin auto
        // transform translateX(-50%)
        // left 50%
        // top 50%
        // transform translate(-50%,-50%)
        // background #fff
        .title
            background $green
        .balance
            background $green
        .submit
            background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
            box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
        .cancel
            height 50px
            line-height 50px
            border 1px solid $line
            margin 20px 15px
            border-radius 5px
            font-weight bold
            color $text-l

/* 总代 */
// .generalAgent
//     .submit
//         background:linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%);
//         box-shadow:0px 4px 7px 0px rgba(0,132,255,0.3)
//     .dialog-window
//         background transparent
//     .titlebox
//         height 103px
//         background $green
//         padding-top 20px
//         box-sizing border-box
//         padding-bottom 10px
//     .title
//         background $green
//     .desc
//         background $green
//         color #fff
//         font-weight bold
//     .title
//         background $green
//     .desc
//         line-height 30px
//         color $text-lll
//         font-size 14px
//     .paymentDialog
//         .title
//             background $green
//         .balance
//             background $green
//         .submit
//             background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
//             box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
//         .cancel
//             height 50px
//             line-height 50px
//             border 1px solid $line
//             margin 20px 15px
//             border-radius 5px
//             font-weight bold
//             color $text-luminosity
.userinfo
    display flex
    height 100px
    padding 0 15px
    align-items center
    background #fff
    img
        border-radius 50%
        width 54px
        height 54px
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
        input
            height 100%
            flex 1
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