<template>
    <div class="goodsList-wrapper">
        <router-link to="/goodsDetail/1" class="goodsItem" tag="div" v-for="(g,index) in productList">
            <!-- <img :src="g.image" alt=""> -->
            <p class="name bold">{{g.name}}</p>
            <p class="desc">{{g.desc}}</p>
            <div>
                <span class="price bold">¥{{g.special_price.value?g.special_price.value:g.price.value}}</span>
                <span class="oldprice" v-if="g.special_price.value">原价：#{{g.price.value}}</span>
                <span class="oldprice" v-else></span>
                <span class="cart bold">加入购物车</span>
            </div>
        </router-link>
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
    }
    // watch: {
    //     tab(newVal){
            
    //     }
    // }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl'
    .goodsList-wrapper
        padding-bottom 50px
    .goodsItem
        background #fff
        margin 0 15px
        padding-bottom 10px
        box-shadow 0px 2px 2px -1px rgba(129,131,140,0.1)
        border-radius 8px
        margin-bottom 15px
        img
            width 100%
        .name
            color $text-l
            font-size 22px
            margin-top 10px
            line-height 30px
            padding-left 10px
            text-align left
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
                font-size 24px
                padding-left 10px
            .oldprice
                font-size 14px
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