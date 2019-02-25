<template>
    <div class="payment-wrapper">
        <div class="userInfo" @click="chooseAddr">
            <div class="icon icon-location"></div>
            <div class="text">
                <p class="user">
                    收货人,18677185478
                </p>
                <p class="addr">
                    广西壮族自治区 南宁市 青秀区 民族大道131号会展中心航洋城
                </p>
            </div>
            <div class="icon icon-link"></div>
        </div>
        <section>
            <div class="cell"><label>商城</label></div>
            <div class="goods-container">
                <div class="goods">
                    <img src="../../common/images/1812.png" width="80" height="80" alt="">
                    <div class="text">
                        <p>
                            <span class="name bold">姜汁洗发露</span>
                            <span class="price">¥39.80</span>
                        </p>
                        <p>
                            <span class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</span>
                            <span class="quantity bold">x1</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="cell">
                <label for="">总计</label>
                <span>¥39.80</span>
            </div>
            <div class="cell">
                <label for="">运费</label>
                <span>¥0</span>
            </div>
            <div class="cell">
                <label for="">实付款</label>
                <span>¥39.80</span>
            </div>
        </section>
        <textarea name="" placeholder="选填：订单备注信息（50字以内）" id="" cols="30" rows="10"></textarea>
        <div class="large-green-button">去支付</div>
    </div>
</template>
<script>
export default {
    methods: {
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