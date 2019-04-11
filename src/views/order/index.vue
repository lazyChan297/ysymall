<template>
    <div class="order-wrapper">
        <div class="tab">
            <router-link to="/order/index" class="tabItem" tag="div"><span>全部</span></router-link>
            <router-link to="/order/wait" class="tabItem" tag="div"><span>待发货</span></router-link>
            <router-link to="/order/already" class="tabItem" tag="div"><span>待收货</span></router-link>
            <router-link to="/order/done" class="tabItem" tag="div"><span>已完结</span></router-link>
        </div>
        <router-view></router-view>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.order-wrapper
  .tab
    display flex 
    line-height 40px
    background #fff
    margin-bottom 10px
    .tabItem
        flex 1
        text-align center
        &.router-link-exact-active
            span
                color $green
                &:after
                    content ''
                    display block
                    height 4px
                    width 28px
                    margin 0 auto
                    background rgba(0,132,255,1)
                    border-radius 2px
</style>