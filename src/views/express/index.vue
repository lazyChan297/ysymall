<template>
    <div class="express-wrapper">
        <section>
            <div class="cell">
                <span>快递公司</span>
                <span>中通</span>
            </div>
            <div class="cell">
                <span>快递单号</span>
                <span>151545461551545</span>
            </div>
        </section>
        <ul>
            <li class="express">
                <div class="icon icon-car"></div>
                <div class="text">
                    <p class="expressTxt">
                        【南宁市】快件离开【南宁中转】已发往【南宁航洋分部】
                    </p>
                    <p class="date">
                        2019/01/16 15:59:01
                    </p>
                </div>
            </li>
            <li class="express">
                <div class="icon-dot"></div>
                <div class="text">
                    <p class="expressTxt">
                        快件已发往南宁
                    </p>
                    <p class="date">
                        2019/01/16 15:59:01
                    </p>
                </div>
            </li>
            <li class="express">
                <div class="icon-dot"></div>
                <div class="text">
                    <p class="expressTxt">
                        快件已发往南宁
                    </p>
                    <p class="date">
                        2019/01/16 15:59:01
                    </p>
                </div>
            </li>
            <li class="express">
                <div class="icon-dot"></div>
                <div class="text">
                    <p class="expressTxt">
                        快件已发往南宁
                    </p>
                    <p class="date">
                        2019/01/16 15:59:01
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.express-wrapper
    .cell
        display flex
        justify-content space-between
        line-height 50px
        padding 0 15px
        background #fff
        &:first-child
            border-bottom 1px solid $line
    ul
        margin-top 10px
        li
            display flex
            height 100px
            align-items center
            padding 0 15px
            background #f8f9fb
            position relative
            border-bottom 1px solid $line
            .icon-dot
                width 28px
                &:before
                    content ''
                    display block
                    width 14px
                    height 14px
                    margin 0 auto
                    border-radius 50%
                    background $text-lll
            .expressTxt
                line-height 22px
                color $text-lll
            .date
                margin-top 5px
                color $text-lll
                line-height 22px
            /* 第一个不显示 */
            &:first-child
                background #fff
                .expressTxt
                    color $green
                    .date
                        color $text-ll
                &:after
                    display none
            /* 2 */
            &:nth-child(2)
                &:after
                    content ''
                    width 2px
                    background $text-lll
                    display block
                    position absolute
                    height 50%
                    left 28px
                    top 50%
            /* last */
            &:last-child
                border none
                &:after
                    content ''
                    width 2px
                    background $text-lll
                    display block
                    position absolute
                    height 50%
                    left 28px
                    top 0
            .text
                flex 1
                margin-left 10px
            &:after
                content ''
                width 2px
                background $text-lll
                display block
                position absolute
                height 100%
                left 28px
</style>