<template>
    <div class="setting-wrapper">
        <p class="title">基本信息</p>
        <section>    
            <div class="cell">
                <label>头像</label>
                <img src="../../common/images/df_user.jpg" width="36" height="36" alt="">
            </div>
            <div class="cell">
                <label>昵称</label>
                <span>微信昵称</span>
            </div>
            <router-link to="/bindPhone" class="cell" tag="div">
                <label>手机号</label>
                <div>
                    <span>18677185477</span>
                    <div class="icon icon-link"></div>
                </div>
            </router-link>
            <router-link tag="div" to="/inviter" class="cell">
                <label>邀请人</label>
                <div>
                    <span>shbh</span>
                    <div class="icon icon-link"></div>
                </div>
            </router-link>
            <div class="cell">
                <label>收货地址</label>
                <div class="icon icon-link"></div>
            </div>
            <div class="cell">
                <label>级别</label>
                <span>普通用户</span>
            </div>
            <div class="cell">
                <label>编号</label>
                <span>123456</span>
            </div>
            
        </section>
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
        justify-content space-between
        align-items center
        background #fff
        line-height 50px
        border-bottom 1px solid $line
        &:last-child
            border none
        img
            border-radius 50%
        span
            &:last-child
                color $text-lll
        &>div
            display flex
            align-items center
            span
                color $text-lll
</style>