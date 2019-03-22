<template>
    <div class="friendship-wrapper">
        <!-- <ul class="tab">
            <router-link to="/friendship/inviter" tag="li">访客</router-link>
            <router-link to="/friendship/customer" tag="li">客户</router-link>
        </ul>
        <router-view></router-view> -->
        <p style="padding-top:100px">该页面正在开发中～敬请期待！</p>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.friendship-wrapper
    .tab
        display flex
        background #fff
        li 
            flex 1
            font-size 18px
            line-height 50px
            &.router-link-active
                color $green
                font-weight bold
                border-bottom 4px solid $green
</style>