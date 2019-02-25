<template>
    <div class="index-wrapper">
        <div class="header">
            <div class="mask"></div>
            <img src="../../common/images/df_user.jpg" alt="" width="50" height="50">
            <p class="name bold">用户名</p>
            <p class="mobile">18744512547</p>
        </div>
        <ul class="category" >
            <li @click="switchTab(0)" :class="{'active':currentTab==0}">
                <span>全部</span>
            </li>
            <li @click="switchTab(1)" :class="{'active':currentTab==1}">
                <span>食品</span>
            </li>
            <li @click="switchTab(2)" :class="{'active':currentTab==2}">
                <span>洗护</span>
            </li>
            <li @click="switchTab(3)" :class="{'active':currentTab==3}">
                <span>日化</span>
            </li>
            <li @click="switchTab(4)" :class="{'active':currentTab==4}">
                <span>保健品</span>
            </li>
            <li @click="switchTab(5)" :class="{'active':currentTab==5}">
                <span>药品</span>
            </li>
        </ul>
        <!-- 商品 -->
        <goods-list :tab="currentTab"/>
        <!-- tabbar -->
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index'
import GoodsList from '@/components/goodsList/index'
export default {
    data(){
        return {
            currentTab: 0
        }
    },
    components: {
        TabBar,
        GoodsList
    },
    methods: {
        switchTab(e){
            this.currentTab = Number(e)
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl';
    .index-wrapper
        /* 头像 */
        .header
            position relative
            padding-top 15px
            background-image url("../../common/images/df_user.jpg")
            background-size 100%
            background-position-y center
            height 140px
            text-align center
            color #fff
            box-sizing border-box
            box-shadow 0px 4px 8px 0px rgba(41,206,166,0.5)
            margin-bottom 10px
            .mask 
                position absolute
                background $green
                width 100%
                height 100%
                opacity 0.9
                top 0
            img
                position relative
                display block
                margin 0 auto 0
                border 2px solid #fff
                border-radius 50%
            .name
                position relative
                font-size 18px
                line-height 25px
                margin-bottom 3px
                margin-top 10px
            .mobile
                position relative
                font-size 16px
                line-height 22px
        /* 商品分类栏 */
        .category
            display flex
            margin-bottom 15px
            li
                line-height 50px
                color $text-l
                flex 1
                text-align center
                &.active
                    span
                        display inline-block
                        color $green
                        font-weight bold
                        font-size 20px
                        line-height 28px
                        &:after
                            content ''
                            display block
                            height 6px
                            background rgba(41,206,166,1)
                            box-shadow 0px 4px 8px 0px rgba(41,206,166,0.47)
                            border-radius 3px
                        
</style>