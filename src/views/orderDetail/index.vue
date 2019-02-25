<template>
    <div class="orderDetail-wrapper">
        <div class="cell">
            <label>状态</label>
            <span>待收货</span>
        </div>
        <section class="update">
            <router-link to="/express" tag="div" class="express">
                <div class="icon icon-car"></div>
                <div class="text">
                    <p class="expressTxt">
                        已揽件
                    </p>
                    <p class="date">
                        2019/01/16 15:59:01
                    </p>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <div class="userInfo">
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
        </section>
        <section class="goods-container">
            <div>
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
        <section class="orderinfo">
            <p>
                订单编号：234576145 <span class="copy">复制</span>
            </p>
            <p>
                下单时间：2019/01/16 15:59:01
            </p>
            <p>
                发货时间：2019/01/16 15:59:01
            </p>
        </section>
        <div class="large-green-button">确认收货</div>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.update
    margin 10px 0
.userInfo,
.express
    display flex
    align-items center
    padding 10px 15px
    background #fff
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
        .expressTxt
            color $green
            line-height 22px
        .date
            color $text-lll
            line-height 22px
.express
    border-bottom 1px solid $line
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
.goods-container
    .cell
        &>span
            color $red
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
                .quantity
                    color $text-lll
textarea
    height 80px
    width 100%
    box-sizing border-box
    border none
    border-top 1px solid $line
    resize none
    padding 10px 15px
.orderinfo
    background #fff
    margin 10px 0
    font-size 14px
    color $text-lll
    padding 10px 15px
    line-height 22px
    .copy
        border 1px solid $text-lll
        font-size 12px
</style>