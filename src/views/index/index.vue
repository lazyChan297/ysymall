<template>
    <div class="index-wrapper">
        <div class="header" :style="bgImg">
            <div class="mask"></div>
            <img :src="userInfo.avatar" alt="" width="50" height="50">
            <p class="name bold">{{userInfo.nickname}}</p>
            <p class="mobile">{{userInfo.mobile}}</p>
        </div>
        <ul class="category" >
            <li @click="switchTab(c,index)" :class="{'active':currentTab==index}" v-for="(c,index) in topCategories">
                <span>{{c.name}}</span>
            </li>
        </ul>
        <!-- 商品 -->
        <goods-list :tab="currentTab" :productList="productList"/>
        <!-- tabbar -->
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index'
import GoodsList from '@/components/goodsList/index'
import {mapMutations, mapGetters} from 'vuex'
export default {
    data(){
        return {
            currentTab: 0,
            topCategories:[{id:0,name:'全部'}],
            allProdList:[],//全部商品
            productList: [], // 当前显示商品
            categoryList:[] // 分类好的商品
        }
    },
    components: {
        TabBar,
        GoodsList
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
                if(res.code === 200) {
                    // this.userInfo = res.data.customerInfo
                    // 保存到store
                    this.saveUserInfo(res.data.customerInfo)
                    console.log('userinfo',this.userInfo)
                    this.topCategories = this.topCategories.concat(res.data.topCategories)
                    this.formatProdList(this.topCategories,res.data.productList)
                    this.productList = res.data.productList
                    this.allProdList = res.data.productList
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
        ...mapMutations({
            saveUserInfo: 'SAVE_USERINFO'
        })
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
            min-width 100%
            overflow scroll
            white-space nowrap
            margin-bottom 15px
            li
                line-height 50px
                color $text-l
                margin 0 10px
                display inline-block
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