<template>
    <div class="my-wrapper">
        <div class="header">
            <img src="../../common/images/df_user.jpg" alt="" width="70" height="70px">
            <div class="text">
                <p class="name bold">用户名</p>
                <p class="mobile">18677185541</p>
            </div>
            <router-link class="icon icon-setting" to="/setting"></router-link>
        </div>
        <section>
            <router-link class="cell" to="/order/index" tag="div">
                <div>
                    <span class="icon icon-dingdan"></span>
                    <span class="bold">我的订单</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell" to="/myearnings" tag="div">
                <div>
                    <span class="icon icon-shouyi"></span>
                    <span class="bold">我的收益</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell" to="/friendship" tag="div">
                <div>
                    <span class="icon icon-renmai"></span>
                    <span class="bold">人脉</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell" to="/QRcode" tag="div">
                <div>
                    <span class="icon icon-code"></span>
                    <span class="bold">二维码</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell" to="/" tag="div">
                <div>
                    <span class="icon icon-area"></span>
                    <span class="bold">代理区域</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
        </section>
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index';
export default {
    components: {
        TabBar
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .my-wrapper
        padding-top 15px
        background #fff
        height 100%
    .header 
        display flex
        background url("../../common/images/wode@2x.png") no-repeat center
        height 135px
        margin 0 15px 15px
        border-radius 8px
        align-items center
        padding 0 15px
        box-shadow 0px 4px 16px 0px rgba(41,206,166,0.4)
        img
            border-radius 50%
            border 2px solid #fff
        .text
            flex 1
            color #fff
            margin-left 10px
            .name
                font-size 24px
                line-height 33px
                margin-bottom 5px
                text-align left
            .mobile
                font-size 14px
                line-height 20px
                text-align left
    section
        padding 0 15px
        background #fff
    .cell
        display flex
        line-height 60px
        justify-content space-between
        align-items center 
        border-bottom 1px solid $line
        &:last-child
            border none
        .bold
            color $text-l
        &>div
            &:first-child
                display flex
                align-items center   
</style>