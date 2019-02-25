<template>
        <div class="dynamic">
                <div>
                    <img src="../../common/images/df_user.jpg" alt="" width="40" height="40">
                    <div>
                        <p class="bold">姓名</p>
                        <p class="date">2019-01-15 12:12:13</p>
                    </div>
                </div>
                <div class="dynamic-text">这是一条搞笑的说说。</div>
                <div class="dynamic-pic">
                    <img src="../../common/images/1812.png" alt="" width="109" height="109">
                    <img src="../../common/images/1812.png" alt="" width="109" height="109">
                    <img src="../../common/images/1812.png" alt="" width="109" height="109">
                </div>
                <div class="operator">
                    <div>
                        <div class="icon icon-fengxiang"></div>
                        <span>10</span>
                    </div>
                    <div>
                        <div class="icon icon-pinglun"></div>
                        <span>10</span>
                    </div>
                    <div>
                        <div class="icon icon-dianzan"></div>
                        <span>10</span>
                    </div>
                </div>
        </div>
    </template>
    <script>
    const screenWidth = window.innerWidth
    const containerWidth = screenWidth - 30 - 18
    const imageWidth = containerWidth/3
    export default {
        
    }
    </script>
    <style lang="stylus" scoped>
        .dynamic
            padding 10px 15px 0
            background #fff
            &>div
                &:first-child
                    display flex
                    align-items center
                    img
                        border-radius 50%
                        margin-right 10px
                    div
                        flex 1
                        text-align left
                        .name
                            color $text-l
                            line-height 22px
                        .date
                            color $text-lll
                            font-size 14px
                            line-height 20px
                &.dynamic-text
                    text-align left
                    line-height 32px
                    color $text-l
                &.operator
                    display flex
                    align-items center
                    height 40px
                    &>div
                        display flex
                        align-items center
                        justify-content center
                        flex 1
                        line-height 40px
    </style>