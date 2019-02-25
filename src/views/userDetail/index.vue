<template>
    <div class="userDetail-wrapper">
        <div class="avatar">
            <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
            <div class="text">
                <p><span class="name bold">用户名</span></p>
                <p class="account">
                    <span class="date">绑定时间：2019-01-15 12:13:23</span>
                    <span>下单绑定</span>
                </p>
            </div>
        </div>
        <section>
            <div class="cell">
                <span>手机号</span>
                <span>18677185478</span>
            </div>
            <div class="cell">
                <span>级别</span>
                <span>17185478</span>
            </div>
            <div class="cell">
                <span>编号</span>
                <span>18677185478</span>
            </div>
        </section>
        <section>
            <router-link class="cell" to="/userOrders" tag="div">
                <span>订单数量</span>
                <div>
                    <span>1</span>
                    <!-- <div class="icon icon-link"></div> -->
                </div>
            </router-link>
            <div class="cell">
                <span>成交额</span>
                <span>¥39.80</span>
            </div>
        </section>
        <section>
            <div class="cell">
                <span>首次登陆时间</span>
                <span>2018年8月31日 14:32</span>
            </div>
            <div class="cell">
                <span>最近访问网站时间</span>
                <span>2018年8月31日 14:32</span>
            </div>
        </section>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/css/media.css";
.avatar
    display flex
    background #fff
    height 100px
    padding 0 15px
    align-items center
    img
        border-radius 50%
    .text 
        flex 1
        text-align left
        margin-left 10px
        &>p
            display flex
            align-items center
            &:first-child
                margin-bottom 10px
        .name
            font-size 18px
            line-height 25px
        .account
            font-size 14px
            color $text-lll
            span
                &:last-child
                    color #fff
                    font-size 12px
                    background $green
                    border-radius 20px
                    line-height 20px
                    padding 0 10px
                    margin-left 10px
section
    margin-top 10px
    padding 0 15px
    background #fff
    .cell
        display flex
        justify-content space-between
        line-height 50px
        border-bottom 1px solid $line
        &:last-child
            border none
        &>div
            display flex
            align-items center
            span
                color $text-lll
                margin-right 5px
</style>