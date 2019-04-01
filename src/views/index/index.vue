<template>
    <div class="wrapper">
    <div class="index-wrapper">
        <div>
            <div class="header" :style="bgImg">
                <div class="mask"></div>
                <img :src="customerInfo.avatar" alt="" width="50" height="50">
                <p class="name bold">{{customerInfo.nickname}}</p>
                <p class="mobile">{{customerInfo.mobile}}</p>
            </div>
            <div :style="tabStyle" class="tab-container">
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
            </div>
            <!-- 商品 -->
            <goods-list :tab="currentTab" :productList="productList"/>
            <div class="suspension" @click="showExpress">
                    <div class="icon icon-stop"></div>
                    <span>公告</span>
            </div>
            <!-- <x-dialog v-model="isShowDialog" hide-on-blur>
                <div class="express">
                    <div v-html="expressInfo"></div>
                    <div class="cancel" @click="isShowDialog = false">确认</div>
                </div>        
            </x-dialog> -->
        </div>
    </div>
    <!-- tabbar -->
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index'
import GoodsList from '@/components/goodsList/index'
import {mapGetters} from 'vuex'
import Scroll from '@/base/scroll/index'
import {XDialog} from 'vux'

export default {
    data(){
        return {
            currentTab: 0,
            topCategories:[],
            allProdList:[],//全部商品
            productList: [], // 当前显示商品
            categoryList:[], // 分类好的商品
            isFixed: false,
            ulNoListenScroll: false,
            isScrollX: true,
            tabStyle:'',
            isShowDialog:false,
            expressInfo:'',
            inviter:'',
            customerInfo:{}
        }
    },
    components: {
        TabBar,
        GoodsList,
        Scroll,
        XDialog
    },
    created() {
        this.hasInviter()
    },
    mounted() {
        // 监听滚动
       addEventListener('scroll',this.handleScroll)
        // 获取停运信息
        this.getExpressInfo()
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
        // 打开物流停运窗口
        showExpress(){
            this.$vux.alert.show({
                content:this.expressInfo
            })
        },
        hasInviter(){
            let inviter = decodeURIComponent((new RegExp('[?|&]inviter='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
            if(inviter){
                this.inviter = inviter
                this.getIndex(inviter)
            } else {
                this.getIndex()
            }
        },
        switchTab(c,num){
            this.currentTab = Number(num)
            if(!c._id) {
                this.productList = this.allProdList
            } else {
                this.productList = this.categoryList[c._id]
            }
        },
        getIndex(inviter) {
            this.$axios.get('/cms/index/index',{
                params:{
                    inviter:inviter
                }
            }).then((res)=>{
                let data = res.data.data
                if(res.data.code === 200) {
                    this.topCategories = data.topCategories
                    let _id = this.topCategories[0]._id
                    this.formatProdList(this.topCategories,data.productList)
                    this.productList = this.categoryList[_id]
                    this.allProdList = data.productList
                    if(this.inviter) {
                        this.customerInfo = res.data.customerInfoOnTop
                    } else {
                        this.customerInfo = this.userInfo
                    }
                    // 分享
					this.$wechat.ready(() => {
                        this.$wechat.onMenuShareTimeline({
                            title: res.data.wechat.shareTimeline.title,
                            link:res.data.wechat.shareTimeline.link,
                            imgUrl: res.data.wechat.shareTimeline.imgUrl
                        })

                        this.$wechat.onMenuShareAppMessage({
                            title: res.data.wechat.shareAppMessage.title,
                            link:res.data.wechat.shareAppMessage.link,
                            imgUrl: res.data.wechat.shareAppMessage.imgUrl,
                            desc:res.data.wechat.shareAppMessage.desc
                        })
                    })
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
        // 监听滚动
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            if(scrollTop > 200) {
                this.tabStyle = `position:fixed;top:0;width: 100%;`
            } else {
                this.tabStyle = ''
            }
        },
        getExpressInfo(){
            this.$axios.get('/customer/service/get-notice').then((res)=>{
                if(res.data.code === 200) {
                    this.expressInfo = res.data.data.info.replace(/\n/g,"<br/>");
                    this.isShowDialog = res.data.data.hasRead === false?true:false
                    if(!res.data.data.hasRead){
                        this.showExpress()
                    }
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl';
    @import '../../common/css/media.css';
    /* 悬浮框 */
    .suspension
        position fixed
        width 45px
        height 70px
        border-radius 30px
        background #fff
        top 220px
        right 10px
        line-height 20px
        border 1px solid $red
        span
            color $red
            font-size 12px
    /* 物流停运 */
    .express
        padding 10px
        text-align left
        line-height 30px
        .cancel
            background $green
            color #fff
            width 94px
            line-height 34px
            text-align center
            margin 10px auto
            border-radius 5px
    .tab-container
        background $bgcolor
    .scrollTab
        overflow hidden
    /* .wrapper
        height 100%
        overflow hidden */
    .index-wrapper
        position raletive
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
            text-align left
            /* white-space nowrap */
            /* width 500px */
            /* min-width 550px */
            /* padding-right 50px */
            li
                flex 1
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
                /* &:last-child
                    margin-right 20px */
                        
</style>