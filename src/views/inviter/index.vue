<template>
    <div class="inviter-wrapper">
        <p class="title">修改邀请人</p>
        <section>
            <div class="cell">
                <input type="text" placeholder="请输入邀请人手机号码或微信昵称">
            </div>
        </section>
        <div class="large-green-button">确认</div>
    </div>
</template>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl"
    .title
        line-height 50px
        color $text-lll
        padding-left 15px
    section
        padding 0 15px
        background #fff
    .cell
        display flex
        border-bottom 1px solid $line
        align-items center
        justify-content space-between
        height 50px
        &:last-child
            border none
</style>