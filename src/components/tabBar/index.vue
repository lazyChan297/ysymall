<template>
    <div class="tabBar-wrapper">
        <router-link to="/" tag="div">
            <div class="icon icon-index"></div>
            <p class="bold">首页</p>
        </router-link>
        <router-link to="/found" tag="div">
            <div class="icon icon-found"></div>
            <p class="bold">发现</p>
        </router-link>
        <router-link to="/cart" tag="div">
            <div class="icon icon-cart"></div>
            <p class="bold">购物车</p>
        </router-link>
        <router-link to="/my" tag="div">
            <div class="icon icon-my"></div>
            <p class="bold">我的</p>
        </router-link>
    </div>
</template>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl'
    .tabBar-wrapper
        position fixed
        display flex
        bottom 0
        width 100%
        background #fff
        height 50px
        box-shadow 0px -1px 2px 0px rgba(0,0,0,0.1)
        &>div
            flex 1
            text-align center
            p
                font-size 12px
                color $text-lll
                line-height 17px
            .icon
                height 24px
                width 24px
                margin-top 4px
            &.router-link-exact-active
                p
                    color $green

</style>