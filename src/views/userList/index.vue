<template>
    <div class="userList-wrapper">
        <div class="desc">
            <span>客户数量：1351</span>
            <span>今日新增客户：4</span>
        </div>
        <ul>
            <router-link to="/userDetail/i" tag="li">
                <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
                <div class="text">
                    <p><span class="name bold">用户名</span></p>
                    <p class="account">
                        <span>成交额：</span>
                        <span>¥39.80</span>
                    </p>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <li>
                <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
                <div class="text">
                    <p>
                        <span class="bold name">用户名</span>
                        <span class="position">(散客)</span>
                        <span class="interval">距离失效：23:03:01</span>
                    </p>
                    <p class="account">
                        <span>访问时间：2019-01-14 12:01:01</span>
                    </p>
                </div>
            </li>
            <li>
                <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
                <div class="text">
                    <p>
                        <span class="bold name">用户名</span>
                        <span class="position">(散客)</span>
                    </p>
                    <p class="account">
                        <span>访问时间：2019-01-14 12:01:01</span>
                    </p>
                </div>
                <div class="icon icon-valid"></div>
            </li>
        </ul>

    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";

.desc
    font-size 12px
    color $text-lll
    padding-left 15px
    text-align left
    line-height 30px
    span
        margin-right 10px
ul>li
    display flex
    background #fff
    height 100px
    padding 0 15px
    align-items center
    border-bottom 1px solid $line
    &:last-child
        border-bottom none
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
        .position,
        .account
            font-size 14px
            color $text-lll
        .interval
            color $red
            flex 1
            text-align right
</style>