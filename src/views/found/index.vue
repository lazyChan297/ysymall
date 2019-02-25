<template>
    <div class="found-wrapper">
        <div class="search-warpper">
            <img src="../../common/images/df_user.jpg" alt="" width="35" height="35">
            <div class="input-wrapper">
                <div class="icon icon-search"></div>
                <input type="text" placeholder="请输入关键词搜索">
            </div>
            <div class="submit" @click="isSubmit = !isSubmit">
                <div class="icon icon-submit"></div>
                <span>发布</span>
            </div>
            <div class="submit-wrapper" v-show="isSubmit">
                <router-link tag="div" to="/publish">
                    <div class="icon icon-bianji"></div>
                    <div>发图文</div>
                </router-link>
                <div>
                    <div class="icon icon-video"></div>
                    <div>发视频</div>
                </div>
            </div>
        </div>
        <div class="topNavigator-wrapper">
            <div @click="switchTab(0)" :class="{'active':currentTab==0}">动态</div>
            <div @click="switchTab(1)" :class="{'active':currentTab==1}">资讯</div>
        </div>
        <dynamic-list></dynamic-list>
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index'
import DynamicList from '@/components/dynamicList/index'
export default {
    data() {
        return {
            isSubmit: false,
            currentTab: 0
        }
    },
    components: {
        TabBar,
        DynamicList
    },
    methods: {
        switchTab(e) {
            this.currentTab = e
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl';
    .search-warpper
        position relative
        display flex
        align-items center
        padding 0 15px
        background $green
        height 50px
        img
            border-radius 50%
            border 2px solid #fff
            margin-right 15px
        .input-wrapper
            height 35px
            line-height 35px
            border-radius 5px
            display flex
            align-items center
            background #fff
            padding-left 10px
            margin-right 15px
            flex 1
            input
                flex 1
                height 100%
                border-radius 5px
                padding-left 10px
        .submit
            span 
                font-size 12px
                color #fff
    .submit-wrapper
        position absolute
        top 58px
        right 10px
        box-shadow 0px 0px 8px 0px rgba(0,0,0,0.15)
        border-radius 5px
        &:before
            content ''
            width 10px
            height 10px
            display block
            background #fff
            transform rotate(45deg)
            position absolute
            top -5px
            right 14px
            z-index 0
            box-shadow 0px 0px 8px 0px rgba(0,0,0,0.15)
        &>div
            position relative
            height 60px
            line-height 20px
            display flex 
            align-items center
            background #fff
            width 134px
            justify-content center
            border-radius 5px
            z-index 1
    .topNavigator-wrapper
        display flex
        line-height 40px
        background #fff
        box-shadow 0px 2px 4px 0px rgba(0,0,0,0.05)
        margin-bottom 15px
        &>div
            flex 1
            &.active
                color $green
                font-weight bold
                font-size 20px
</style>