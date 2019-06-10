<template>
    <div class="goodsList-wrapper">
        <div>
        <router-link :to="{path:`/goodsDetail/${g.product_id}`}" class="goodsItem" tag="div" v-for="(g,index) in productList">
            <img :src="g.image" alt="">
            <p class="name bold">{{g.name}}</p>
            <div>
                <span class="price bold">¥{{g.special_price.value?g.special_price.value:g.price.value}}</span>
                <span class="oldprice" v-if="g.special_price.value">¥{{g.price.value}}</span>
                <span class="oldprice" v-else></span>
            </div>
        </router-link>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tab: {
            type: Number,
            default: 0
        },
        productList: {
            type: Array,
            default: []
        }
    },
    methods:{
        
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl'
    .goodsList-wrapper
        padding-bottom 50px
        padding 15px 15px 50px
        font-size 0
        text-align left
    .goodsItem
        display inline-block
        width 47%
        background #fff
        /* margin 0 15px */
        padding-bottom 10px
        box-shadow 0px 2px 2px -1px rgba(129,131,140,0.1)
        border-radius 8px
        margin-bottom 15px
        &:nth-child(odd)
            margin-right 15px
        img
            display block
            width 100%
            border-top-left-radius 8px
            border-top-right-radius 8px
        .name
            color $text-l
            font-size 16px
            margin 5px 0
            line-height 22px
            padding-left 10px
            text-align left
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
        .desc
            color $text-ll
            font-size 14px
            line-height 20px
            margin-bottom 10px
            padding-left 10px
            text-align left
        &>div
            display flex
            align-items center
            .price
                color $red
                font-size 16px
                padding-left 10px
            .oldprice
                font-size 12px
                color $text-lll
                flex 1
                margin-left 5px
                text-decoration line-through
                text-align left
            .cart
                border-radius 20px
                border 3px solid $red
                line-height 30px
                font-size 14px
                padding 0 15px
                color $red
                box-sizing border-box
                margin-right 10px
</style>