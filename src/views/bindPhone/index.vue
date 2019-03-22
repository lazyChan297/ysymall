<template>
    <div class="bindPhone-wrapper">
        <p class="title">绑定手机号</p>
        <section>
            <div class="cell">
                <input type="text" placeholder="请输入手机号码">
            </div>
            <div class="cell">
                <input type="text" placeholder="请输入验证码">
                <span>获取验证码</span>
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
    text-align left
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
