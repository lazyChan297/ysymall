<template>
    <div class="cart-wrapper">
        <section>
        <div class="goodsItem">
            <div class="icon icon-check"></div>
            <div class="goods">
                <img src="../../common/images/1812.png" alt="" width="100" height="100">
                <div class="info">
                    <p class="name bold">姜汁洗发露</p>
                    <p class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</p>
                    <div>
                        <div class="price bold">¥39.80</div>
                        <cart-control></cart-control>
                    </div>
                </div>
            </div>
        </div>
        <div class="goodsItem">
                <div class="icon icon-uncheck"></div>
                <div class="goods">
                    <img src="../../common/images/1812.png" alt="" width="100" height="100">
                    <div class="info">
                        <p class="name bold">姜汁洗发露</p>
                        <p class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</p>
                        <div>
                            <div class="price bold">¥39.80</div>
                            <cart-control></cart-control>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="control">
            <div class="icon icon-check"></div>
            <span class="checkAll">全选</span>
            <div>
                <span>合计：</span>
                <span class="red">¥39.00</span>
            </div>
            <div class="submit bold">
                结算
            </div>
        </div>
    </div>
</template>
<script>
import CartControl from '@/components/cartcontrol/index'
export default {
    components: {
        CartControl
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .cart-wrapper
        padding-top 15px
        .goodsItem
            display flex
            height 120px
            margin 0 15px 15px
            background #fff
            padding 10px 0
            box-sizing border-box
            border-radius 5px
            box-shadow 0px 2px 4px 0px rgba(0,0,0,0.05)
            .goods
                display flex
                img
                    margin-left 10px
                    margin-bottom 2px
                    margin-right 10px
                .name
                    color $text-l
                    line-height 25px
                    font-size 18px
                .desc
                    color $text-ll
                    font-size 12px
                    line-height 17.5px
                .info
                    &>div
                        display flex
                        align-items center
                        margin-top 13px
                        padding-right 15px
                        justify-content space-between
                        .price
                            color $red
        .control
            position fixed
            display flex
            bottom 0
            width 100%
            background #fff
            line-height 45px
            .icon-check
                margin 12px 10px
                height 20px
            span
                color $text-l
            .checkAll
                flex 1
            .red
                color $red
                margin-right 10px
                background #fff
            .submit
                background $red
                color #fff
                width 100px
                text-align center
</style>