<template>
    <div class="wrapper">
    <scroll class="index-wrapper" @scroll="scrollList">
        <div>
        <div class="header" :style="bgImg">
            <div class="mask"></div>
            <img :src="userInfo.avatar" alt="" width="50" height="50">
            <p class="name bold">{{userInfo.nickname}}</p>
            <p class="mobile">{{userInfo.mobile}}</p>
        </div>
        <scroll :listenScroll="ulNoListenScroll" :scrollX="isScrollX" class="scrollTab" :data="topCategories">
            <ul class="category">
                <li 
                    @click="switchTab(c,index)" 
                    :class="{'active':currentTab==index}" 
                    v-for="(c,index) in topCategories"
                    :key="index"
                    ref="categoryItem">
                    <span>{{c.name}}</span>
                </li>
            </ul>
        </scroll>
        <!-- 商品 -->
        <goods-list :tab="currentTab" :productList="productList"/>
        
        </div>
    </scroll>
    <!-- tabbar -->
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index'
import GoodsList from '@/components/goodsList/index'
import {mapMutations, mapGetters} from 'vuex'
import Scroll from '@/base/scroll/index'
import webStorageCache from 'web-storage-cache'
const wsCache = new webStorageCache()
export default {
    data(){
        return {
            currentTab: 0,
            topCategories:[{id:0,name:'全部'}],
            allProdList:[],//全部商品
            productList: [], // 当前显示商品
            categoryList:[], // 分类好的商品
            isFixed: false,
            ulNoListenScroll: false,
            isScrollX: true
        }
    },
    components: {
        TabBar,
        GoodsList,
        Scroll
    },
    created() {
        this.getIndex()
    },
    mounted() {
       
    },
    computed:{
        bgImg() {
            return `background-image:url(${this.userInfo.avatar})`
        },
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {
        switchTab(c,num){
            this.currentTab = Number(num)
            if(!c._id) {
                this.productList = this.allProdList
            } else {
                this.productList = this.categoryList[c._id]
            }
        },
        getIndex() {
            this.$axios.get('/cms/index/index').then((res)=>{
                let data = res.data.data
                if(res.data.code === 200) {
                    // 保存到store
                    this.saveUserInfo(data.customerInfo)
                    this.topCategories = this.topCategories.concat(data.topCategories)
                    this.formatProdList(this.topCategories,data.productList)
                    this.productList = data.productList
                    this.allProdList = data.productList
                }
            })
        },
        formatProdList(category,plist) {
            let categoryList = {}
            category.forEach((item,index)=>{
                if(item._id) {
                    categoryList[item._id] = []
                }
            })
            plist.forEach((item,index)=>{
                let clist = item.category
                clist.forEach((c)=>{
                    for(let k in categoryList) {
                        if(c===k) {
                            categoryList[k].push(item)
                        } 
                    }
                })
            })
            this.categoryList = categoryList
        },
        scrollList(pos){
            // 超过头像
            if (-pos.y > 140 ) {
                this.isFixed = true
            }
        },
        ...mapMutations({
            saveUserInfo: 'SAVE_USERINFO'
        })
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl';
    .wrapper
        height 100%
        overflow hidden
    .index-wrapper
        height 100%
        overflow-y hidden
        /* 头像 */
        .header
            position relative
            padding-top 15px
            /* background-image url("../../common/images/df_user.jpg") */
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
            text-align left
            white-space nowrap
            margin-bottom 15px
            /* width 500px */
            min-width 550px
            /* padding-right 50px */
            li
                line-height 50px
                color $text-l
                margin 0 10px
                display inline-block
                text-align center
                min-width 40px
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