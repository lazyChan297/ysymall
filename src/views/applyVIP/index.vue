<template>
    <div class="applyVIP-wrapper">
        <div class="headers">
            <img src="../../common/images/vipbg.png" alt="" class="bg">
            <img src="../../common/images/viplogo.png" alt="" width="80" class="logo">
            <div class="userInfo">{{userInfo.nickname}} | {{getLevel(userInfo.level)}}</div>
            <div class="account">
                <p class="desc">申请VIP需要支付</p>
                <p class="accountNum"><span class="ti">￥</span><span class="num">500.00</span></p>
            </div>
        </div>
        <section>
            <img src="../../common/images/applyvip_c.png" alt="" class="vipContent">
            <div class="addrInfo" @click="chooseAddr">
                <div class="icon icon-location"></div>
                <div class="content" v-if="addr.id">
                    <p class="mobile">{{addr.reciever}},{{addr.mobile}}</p>
                    <p class="addr">{{addr.details}}</p>
                </div>
                <div class="content" v-else><p class="addr">请选择地址</p></div>
                <div class="icon icon-link"></div>
            </div>
        </section>
        <div class="submit" @click="submit">支付</div>
    </div>
</template>
<script>
import Qs from 'qs';
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            addr:''
        }
    },
    mounted(){
        this.getAddr()
    },
    methods:{
        getLevel(level){
            let text = ''
            switch(level) {
                case "member":
                    text = '普通会员'
                    break;
                case "vip":
                    text = "VIP"
                    break;
            }
            return text
        },
        getAddr(){
            this.$axios.get('/customer/service/get-addr-info').then((res)=>{
                if(res.data.code === 200) {
                    let addr = res.data.data.addr
                    this.addr = addr
                }
            })
        },
        chooseAddr() {
            let that = this
            this.$wechat.openAddress({
                success: res => {
                    let addrInfo = JSON.stringify({
                        userName: res.userName,
                        telNumber: res.telNumber,
                        provinceName: res.provinceName,
                        cityName: res.cityName,
                        countyName: res.countryName,
                        detail: res.detailInfo
                    })
                    let params = Qs.stringify({addrInfo})
                    that.$axios.post('/customer/service/save-addr', params).then(res => {
                        // alert(res.data.data)
                        if (res.data.code == 200) {
                            that.addr = res.data.data
                        }
                    })
                }
            })
        },
        submit(){
            this.$axios.post('/customer/level/upgrade-to-vip').then((res)=>{
                if(res.data.code === 200) {
                    if(res.data.data.needWechat) {
                        this.payment(res.data.data.paymentArgs)
                    }
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
        },
        payment(arg) {
            let that = this;
            this.$wechat.chooseWXPay({
                timestamp: arg.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: arg.nonceStr, // 支付签名随机串，不长于 32 位
                package: arg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: arg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: arg.paySign, // 支付签名

                success: function (res) {
                    // 支付成功后的回调函数
                    that.$vux.toast.show({
                        text: '支付成功',
                        type:'succes',
                        time:1000
                    })
                    let timer = setTimeout(() => {
                        window.location.href = global.serverHost+ '#/my'
                    }, 1000);
                }
            });
        }
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl';
.applyVIP-wrapper
    background #fff !important
.headers
    position relative
    .bg
        position absolute
        left 0
        width 100%
        z-index 0
    .logo
        position relative
        margin 18px auto 0
        z-index 1
    .userInfo
        position relative
        margin-top 10px
        margin-bottom 15px
        color #fff
        z-index 1
    .account
        position relative
        background #ffffff
        height 160px
        border-radius 8px
        margin 0 15px
        padding-top 34px
        box-sizing border-box
        box-shadow 0px 4px 12px 0px rgba(0,0,0,0.1)
        z-index 1
    .desc
        color $text-ll
    .accountNum
        line-height 70px
        .num
            font-size 50px
            font-weight bold
            color $text-l
            display inline-block
            vertical-align middle
        .ti
            font-size 30px
            color $text-l
            font-weight bold
            display inline-block
            vertical-align middle
section
    margin-top -15px
    padding 0 15px
    background #ffffff
    .vipContent
        display block
        width 100%
    .addrInfo
        display flex
        align-items center
        background #ffffff
        border-top 1px solid $line
        border-bottom 1px solid $line
        padding 10px 0
        .icon-location
            margin-right 15px
        .content
            flex 1
            text-align left
            .mobile
                color $text-l
                font-size 16px
            .addr
                color $text-lll
                font-size 14px
                margin-top 2px
.submit
    line-height 50px
    background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
    box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
    border-radius 5px
    color #fff
    font-weight bold
    margin 20px 15px
</style>

