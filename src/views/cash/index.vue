<template>
    <div class="cash-wrapper">
        <ul class="tab">
            <router-link tag="li" to="/cash/arrival">已到账</router-link>
            <router-link tag="li" to="/cash/non_arrival">未到账</router-link>
        </ul>
        <router-view></router-view>
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
</style>