<template>
    <div class="payment-wrapper">
        <div class="userInfo" @click="chooseAddr">
            <div class="icon icon-location"></div>
            <div class="text" v-if="addr.length">
                <p class="user">
                    收货人,18677185478
                </p>
                <p class="addr">
                    广西壮族自治区 南宁市 青秀区 民族大道131号会展中心航洋城
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
                            <span class="desc"></span>
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
        <textarea name="" placeholder="选填：订单备注信息（50字以内）" id="" cols="30" rows="10"></textarea>
        <div class="large-green-button">去支付</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            addr:[],
            goodslist:[],
            cart_info:{}
        }
    },
    created(){
        this.getOrder()
    },
    methods: {
        getOrder(){
            this.$axios.get('/checkout/onepage/index ').then((res)=>{
                console.log(res)
                if(res.data.code===200){
                    let data = res.data.data
                    this.addr = data.addr
                    this.goodslist = data.cart_info.products
                    this.cart_info = data.cart_info
                }
            })
        },
        chooseAddr() {
            this.$wechat.openAddress({
                success: res => {
                    let addrInfo = JSON.stringify({
                        userName: res.userName,
                        telNumber: res.telNumber,
                        provinceName: res.provinceName,
                        cityName: res.cityName,
                        countyName: res.countryName,
                        detail: res.detailInfo,
                        postalCode: res.postalCode
                    })
                    // let params = Qs.stringify({addrInfo})
                    // that.$axios.post('/users/addAddr', params).then(res => {
                    //     // alert(res)
                    //     if (res.status == 1) {
                    //         that.addressData = res.data.addr
                    //     }
                    // })
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.payment-wrapper
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
    textarea
        height 80px
        width 100%
        margin-top 10px
        resize none
        padding 10px 15px
</style>