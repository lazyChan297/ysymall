<template>
    <div class="cash-wrapper">
        <!-- <ul class="tab">
            <router-link tag="li" to="/cash/arrival">已到账</router-link>
            <router-link tag="li" to="/cash/non_arrival">未到账</router-link>
        </ul>
        <router-view></router-view> -->
        <ul class="sheet">
            <router-link to="/cashSuccess/1" tag="li">
                <p>
                    <span>奖励到账提醒</span>
                    <span>2019-01-16 16:17:42</span>
                </p>
                <div>
                    <span class="num bold">￥3.00</span>
                    <span>陈层(ID:2345656)购买缘生源相关商品，您获得3级内奖励。</span>
                </div>
                <p class="submit-container"><span></span><span class="submit">点击重新提交申请</span></p>
            </router-link>
        </ul>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
    .cash-wrapper
        .tab
            line-height 40px
            text-align center
            display flex
            background #fff
            margin-bottom 10px
            li
                flex 1
                &.router-link-active
                    color $green
        .sheet
            background #fff
        li
            border-bottom 1px solid $line
            padding 10px 0 0
            &:last-child
                border none
            &>p
                display flex
                justify-content space-between
                &:first-child
                    padding 0 15px
                span
                    &:last-child
                        color $text-lll
                        font-size 14px
            &>div
                display flex
                align-items center
                margin-top 10px
                padding 0 15px 10px
                span
                    &:last-child
                        flex 1
                        font-size 14px
                        line-height 20px
                        text-align right
            .num
                color $red
                font-size 20px
                margin-right 50px
            .submit-container
                border-top 1px solid $line
                padding-right 15px
            .submit
                color $red !important
                font-size 14px
                line-height 40px
</style>