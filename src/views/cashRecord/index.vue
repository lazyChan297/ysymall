<template>
    <div class="record-wrapper">
        <div class="cell">
            <span>转账金额</span>
            <span>3元</span>
        </div>
        <div class="cell">
            <span>账户订单</span>
            <span>3232</span>
        </div>
        <div class="cell">
            <span>微信订单</span>
            <span>1564615151</span>
        </div>
        <div class="cell">
            <span>发起时间</span>
            <span>2019-01-17 08:56:09 </span>
        </div>
        <div class="cell">
            <span>到账时间</span>
            <span>2019-01-17 08:56:09 </span>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.cell
    display flex
    justify-content space-between
    line-height 50px
    padding 0 15px
    background #fff
    border-bottom 1px solid $line
    &:last-child
        border none
    span
        &:last-child
            color $green
</style>