<template>
    <div class="payment-wrapper">
        <div class="userInfo" @click="chooseAddr">
            <div class="icon icon-location"></div>
            <div class="text" v-if="addr.id">
                <p class="user">
                    {{addr.reciever}},{{addr.mobile}}
                </p>
                <p class="addr">
                    {{addr.details}}
                </p>
            </div>
            <div v-else class="text">请选择地址</div>
            <div class="icon icon-link"></div>
        </div>
        <section>
            <div class="cell"><label>商城</label></div>
            <div class="goods-container">
                <div class="goods" v-for="(item,index) in goodslist" :key="index">
                    <img :src="item.imgUrl" width="80" height="80" alt="">
                    <div class="text">
                        <p>
                            <span class="name bold">{{item.name}}</span>
                            <span class="price">¥{{item.product_price}}</span>
                        </p>
                        <p>
                            <span class="desc">{{getOptionName(item.custom_option_info)}}</span>
                            <span class="quantity bold">x{{item.qty}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="cell">
                <label for="">总计</label>
                <span>¥{{cart_info.product_total}}</span>
            </div>
            <!-- <div class="cell">
                <label for="">运费</label>
                <span>¥0</span>
            </div> -->
            <div class="cell">
                <label for="">实付款</label>
                <span>¥{{cart_info.product_total}}</span>
            </div>
        </section>
        <div class="textbox"><textarea name="" placeholder="选填：订单备注信息（50字以内）" id="" cols="30" rows="10" font-size="150%"></textarea></div>
        <div class="large-green-button" @click="prePayment">去支付</div>
    </div>
</template>
<script>
import Qs from 'qs'
import {mapMutations} from 'vuex';
export default {
    data(){
        return {
            addr:{},
            goodslist:[],
            cart_info:{},
            custom_option_names:null,
            option_txt_arr:[]
        }
    },
    created(){
        this.getOrder()
    },
    methods: {
        getOptionName(option){
            let str = '',custom_option_names = this.custom_option_names,
                option_txt_arr = this.option_txt_arr
            for(let goodsOpt in option) {
                for(let k in custom_option_names) {
                   if(goodsOpt.toLowerCase() == k) {
                       str += custom_option_names[k]+":"
                       for(let v in custom_option_names) {
                            if(v===option[goodsOpt]){
                                str += custom_option_names[v]+";"
                            } else if(option_txt_arr.indexOf(option[goodsOpt])==-1){
                                str += option[goodsOpt] + ";"
                                break;
                           }
                       } 
                       break;
                   }
                } 
            }
            return str
        },
        getOrder(){
            this.$axios.get('/checkout/onepage/index ').then((res)=>{
                if(res.data.code===200){
                    let data = res.data.data
                    this.addr = data.addr
                    this.goodslist = data.cart_info.products
                    this.cart_info = data.cart_info
                    this.custom_option_names = data.cart_info.custom_option_names
                    // 保存可以转换为汉字的规格属性值
                    let attr = []
                    for(let i in this.cart_info.custom_option_names) {
                        attr.push(i)
                    }
                    this.option_txt_arr = attr
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
        prePayment(){
          if(!this.addr.id) {
              this.$vux.toast.show({
                  text:'请选择地址',
                  type:'warn'
              })
              return false
          }
          let params = Qs.stringify({shipping_method:'free_shipping',
                                     payment_method:'wechatpay_standard',
                                     address_id:this.addr.id})
          this.$axios.post('/checkout/onepage/submitorder',params).then((res)=>{
              if(res.data.code === 200) {
                  console.log(res.data.data)
                  this.payment(res.data.data)
              } else {
                  this.$vux.toast.show({
                      text:res.data.message,
                      type: 'warn'
                  })
              }
          })
        },
        payment(arg) {
            let that = this
            this.$wechat.chooseWXPay({
                timestamp: arg.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: arg.nonceStr, // 支付签名随机串，不长于 32 位
                package: arg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: arg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: arg.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    console.log(res)
                    that.$vux.toast.show({
                        text: '支付成功',
                        type:'succes',
                        time:1000
                    })
                    that.saveCartLen(0)
                    let timer = setTimeout(() => {
                        that.$router.push('/my')
                    }, 1000);
                }
            });
        },
        ...mapMutations({
            saveCartLen: 'SAVE_CARTLEN'
        })
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.payment-wrapper
    padding-bottom 10px
    .userInfo
        display flex
        align-items center
        padding 10px 15px
        background #fff
        margin-bottom 10px
        text-align left
        .text 
            flex 1
            margin 0 10px
            .name
                line-height 22px
            .addr
                color $text-lll
                font-size 14px
                margin-top 5px
                line-height 20px
    .cell
        display flex
        justify-content space-between
        line-height 40px
        padding 0 15px
        background #fff
        border-bottom 1px solid $line
        &:last-child
            border none
        &>span
            color $red
    .goods
        display flex
        padding 15px 10px
        background #fff
        text-align left
        &:last-child
            border-bottom 1px solid $line
        .text 
            flex 1
            margin-left 10px
            padding-top 4px
            &>p
                display flex
                justify-content space-between
                .name
                    font-size 18px
                    margin-bottom 4px
                .desc
                    color $text-ll
                    font-size 12px
                    max-width 200px
                    line-height 18px
                .quantity
                    color $text-lll
    .textbox
        width 100%
    textarea
        height 80px
        width 100%
        margin-top 10px
        resize none
        padding 10px 15px
        box-sizing border-box
        -webkit-appearance none
        outline none
        border none
</style>