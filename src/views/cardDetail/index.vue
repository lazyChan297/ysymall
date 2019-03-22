<template>
    <div class="cardDetail-wrapper">
        <div class="article">
            <div class="cell">
                <span class="label">姓名</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">手机</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">电话</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">邮箱</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">网址</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">公司</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">职务</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">地址</span>
                <input type="text">
            </div>
        </div>
        <div class="submit">编辑</div>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
    .article
        background #fff
        padding 0 15px
        .cell
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px solid #efefef
            line-height 50px
            .label
                color $text-lll
            input
                color $text-l
                text-align right
    .submit
        background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
        border-radius 5px
        color #fff
        font-weight bold
        line-height 50px
        margin 10px 15px 0
</style>