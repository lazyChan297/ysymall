<template>
    <div class="tabBar-wrapper">
        <router-link to="/index" tag="div">
            <div class="icon icon-index"></div>
            <p class="bold">首页</p>
        </router-link>
        <router-link to="/found" tag="div" exact>
            <div class="icon icon-found"></div>
            <p class="bold">发现</p>
        </router-link>
        <router-link to="/rank" tag="div" exact>
            <div class="icon icon-rank"></div>
            <p class="bold">竞赛</p>
        </router-link>
        <router-link to="/cart" tag="div" exact>
            <div class="icon icon-cart"></div>
            <span class="cartNum" v-if="cartLen">{{cartLen}}</span>
            <p class="bold">购物车</p>
        </router-link>
        <router-link to="/my" tag="div" exact>
            <div class="icon icon-my"></div>
            <p class="bold">我的</p>
        </router-link>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters([
            'cartLen'
        ])
    }
}
</script>
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
            position relative
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
            &.router-link-active
                p
                    color $green
        .cartNum
            color #fff
            background $red
            display block
            position absolute
            border-radius 50%
            width 20px
            height 20px
            text-align center
            line-height 20px
            left 50%
            top 0px
</style>