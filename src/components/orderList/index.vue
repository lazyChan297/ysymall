<template>
    <div class="orderlist-wrapper">
            <section class="order">
                    <div class="cell">
                        <label class="date">2019/01/16 15:59:41</label>
                        <span>待收货</span>
                    </div>
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
                        <label></label>
                        <div>
                            <span class="check">查看物流</span>
                            <span class="confirm">确认收货</span>
                        </div>
                    </div>
                </section>
    </div>
</template>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .order
        margin 0 15px 10px
    .cell
        display flex
        justify-content space-between
        line-height 40px
        padding 0 15px
        background #fff
        border-bottom 1px solid $line
        &:first-child
            border-top-left-radius 5px
            border-top-right-radius 5px
        &:last-child
            border none
            border-bottom-left-radius 5px
            border-bottom-right-radius 5px
        &>span
            color $green
        .date
            color $text-ll
    .goods
        display flex
        padding 15px 10px
        background #fff
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
                    text-align left
                .quantity
                    color $text-lll
    .check,.confirm
        font-size 14px
        text-align center
        line-height 26px
        width 80px
        border-radius 3px
        display inline-block
    .check
        color $text-lll
        border 1px solid $text-lll
    .confirm
        color #fff
        background $green
</style>