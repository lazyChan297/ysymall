<template>
    <div class="earn-wrapper">
        <p class="title">我的收益</p>
         <ul class="total-container">
            <li>
                <p class="bold">¥22.00</p>
                <p>今日收益</p>
            </li>
            <li>
                <p class="bold">¥22.00</p>
                <p>本月收益</p>
            </li>
            <li>
                <p class="bold">¥22.00</p>
                <p>全部收益</p>
            </li>
         </ul>
        <p class="title">收益明细</p>
        <div class="title-desc">
            <span>本月收益：¥353.00</span>
            <div class="date-container">
                <div class="icon icon-date" @click="isShow = true" v-show="!value1"></div>
                <datetime
                    v-model="value1"
                    format="YYYY-MM"
                    @on-change="onChange"></datetime>
            </div>
            
        </div>
        <div class="sheet">
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
<script>
import { Group, Datetime, XButton} from 'vux'
export default {
    data() {
        return {
            value1: '',
            maxYear: 2019,
            isShow: false
        }
    },
    components: {
        Datetime,
        XButton,
        Group
    },
    methods: {
        onChange() {

        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.vux-datetime
    display block
    height 24px
    width 80px
.title
    height 40px
    line-height 40px
    padding-left 15px
    border-bottom 1px solid $line
    background #fff
    &:before
        content ''
        display inline-block
        width 4px
        height 22px
        background $green
        vertical-align middle
        margin-right 10px
.title-desc
    line-height 30px
    color $text-lll
    font-size 14px
    display flex
    justify-content space-between
    align-items center 
    padding 0 15px
    .date-container
        position relative
        height 30px
        .vux-datetime
            position absolute
            right 0
            top 0
            text-align right
            color $text-lll
            line-height 30px
.total-container
    display flex
    margin-bottom 10px
    li
        flex 1
        text-align center
        background #fff
        padding 10px 0
        p
            &:first-child
                color $green
                line-height 28px
                font-size 20px
            &:last-child
                color $text-lll
                margin-top 10px
/* 明细 */
.sheet
    background #fff
    &>div>ul>li
        border-bottom 1px solid $line
        padding 10px 15px
        &:last-child
            border none
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