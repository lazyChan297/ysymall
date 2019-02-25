<template>
    <div class="earnings-wrapper">
        <!-- 折线图 -->
        <div class="panel">
            <p class="balance bold"> ¥4642.00</p>
            <p class="desc">当前余额</p>
            <router-link tag="div" to="/withdrawal" class="put">提现</router-link>
            <div class="total-container">
                <router-link tag="div" to="/earn">
                    <p class="title bold">¥4642.00</p>
                    <p class="desc">全部收益</p>
                </router-link>
                <router-link to="/cash" tag="div">
                    <p class="title bold">¥4642.00</p>
                    <p class="desc">已提现金额</p>
                </router-link>
            </div>
            <p class="figure-title">一周收益曲线图</p>
        </div>
        <!-- 列表 -->
        <div class="sheet">
            <ul>
                <li class="active">今日收益明细</li>
                <li>今日支出明细</li>
            </ul>
            <div>
                <ul>
                    <li>
                        <p>
                            <span>奖励到账提醒</span>
                            <span>2019-01-16 16:17:42</span>
                        </p>
                        <div>
                            <span class="num bold">￥3.00</span>
                            <span>陈层(ID:2345656)购买缘生源相关商品，您获得3级内奖励。</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/css/media.css";
.earnings-wrapper
    height inherit
    .panel
        height 70%
        background linear-gradient(360deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
        padding-top 35px
        color #fff
        text-align center
        .balance
            font-size 36px
            line-height 50px
        .desc
            line-height 22px
            margin-bottom 10px
        .put
            width 90px
            border-radius 30px
            border 1px solid #fff
            line-height 34px
            margin 0 auto 10px
        .total-container
            display flex
            &>div
                flex 1
                height 60px
                .title
                    margin-top 10px
                    line-height 28px
                .desc
                    font-size 14px
                &:first-child
                    border-right 1px solid #fff
        .figure-title
            padding-top 10px
            border-top 1px solid #fff
            margin 10px 15px 0
    .sheet
        background #fff
        padding-top 15px
        &>ul
            display flex
            margin 0 78px 15px
            line-height 40px
            border 1px solid $green
            border-radius 5px
            li
                flex 1
                color $green
                &.active
                    background $green
                    color #fff
                &:first-child
                    text-align right
                    padding-right 10px
                &:last-child
                    padding-left 10px
                    text-align left
        &>div>ul>li
                    border-top 1px solid $line
                    padding 10px 15px
                    &>p
                        display flex
                        justify-content space-between
                        span
                            &:last-child
                                color $text-lll
                                font-size 14px
                    &>div
                        display flex
                        align-items center
                        margin-top 10px
                        span
                            &:last-child
                                flex 1
                                font-size 14px
                    .num
                        color $red
                        font-size 20px
                        margin-right 50px

</style>