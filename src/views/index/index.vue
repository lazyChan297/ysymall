<template>
    <div class="wrapper">
    <div class="index-wrapper">
        <div>
            <!-- inviter header -->
            <div class="header" ref="header" v-if="headerInfo || inviterInfo">
                <div class="userInfo-container">
                        <img :src="headerInfo.avatar || inviterInfo.avatar" alt="">
                        <div class="name bold">
                            <span>{{headerInfo.nickname|| inviterInfo.nickname}}</span>
                            <a class="icon icon-phone" :href="`tel:${headerInfo.mobile || inviterInfo.mobile}`" v-if="headerInfo.mobile || inviterInfo.mobile"></a>
                        </div>
                        <div class="desc">邀请您参与社交电商</div>
                        <div class="received-invite" @click="receivedInvite">接收邀请</div>
                </div>
            </div>
            <!-- tips -->
            <div class="tips">
                <span class="icon icon-tips"></span>
                <span>所有商品买五送一,全场包邮！！！</span>
            </div>
            <div :style="tabStyle" class="tab-container" ref="tabContainer">
                <!-- <ul class="category" :style="{width:tabContainerWidth}"> -->
                <ul class="category">
                    <li 
                        @click="switchTab(c,index)" 
                        :class="{'active':currentTab==index}" 
                        v-for="(c,index) in topCategories"
                        :key="index"
                        ref="tabItem"
                        :style="{width:tabItemWidth}">
                        <img :src="c.imgUrl" alt="">
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
import {mapGetters,mapMutations} from 'vuex'
import Scroll from '@/base/scroll/index'
import {XDialog} from 'vux'
import Qs from 'qs'
const ICON_SRC = [
    'quanbu',
    'jiankang',
    'meiye',
    'xihu',
    'yanjing',
    'dalibao',
    'jingpin',
    'wuliao'
]
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
            customerInfo:{},
            tabItemWidth:'',
            tabContainerWidth:'',
            userSn:'',
            headerInfo:null
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
        ...mapGetters([
            'userInfo',
            'inviterInfo'
        ])
    },
    methods: {
        // 接收邀请
        receivedInvite(){
            if(!this.userSn) {
                this.$vux.toast.show({
                    text:'您是本人,不可以邀请自己',
                    type:'warn'
                })
                return false
            }
            let params = Qs.stringify({inviter:this.userSn})
            this.$axios.post('/customer/service/confirm-inviter',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'接受邀请成功！',
                        type:'success'
                    })
                    let timer = setTimeout(()=>{
                        this.$router.push({path:'/login'})
                    },1000) 
                } else if (res.data.code=== 1000008){
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
                
            })
        },
        // 计算tab宽度
        calculateWidth(num){
            let sw = window.innerWidth
            let iw = sw / 4
            this.tabItemWidth = iw + 'px'
            this.tabContainerWidth = num * (iw+4) + 'px'
        },
        // 打开物流停运窗口
        showExpress(){
            let vuxAlert = document.getElementsByClassName('vux-alert')[0]
            let alertContent = document.getElementsByClassName('weui-dialog__bd')[1]
            alertContent.style.textAlign = 'left'
            let expressInfo = this.expressInfo
            let strArr = expressInfo.split('n')
            let _str = ''
            strArr.forEach((item,index)=>{
                let len = item.length
                item = item.substring(0,len-1)
                item+="<br/>"
                _str+=item
            })
            this.$vux.alert.show({
                content:_str
            })
        },
        hasInviter(){
            let userSn = decodeURIComponent((new RegExp('[?|&]inviter='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
            if(userSn){
                this.userSn = userSn
                this.getIndex(userSn)
            } else {
                this.getIndex()
                this.inviter = null
            }
        },
        // 获取邀请人信息
        getInviter(sn){
            let params = Qs.stringify({inviter:sn})
            this.$axios.post('/customer/service/get-inviter-info',params).then((res)=>{
                if(res.data.code === 200) {
                    this.headerInfo = res.data.data.inviterInfo
                }
            })
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
                    let array = [{name:"全部",_id:''}]
                    this.topCategories = array.concat(data.topCategories)
                    this.topCategories.forEach((item,index)=>{
                        item.imgUrl = require('@/common/images/' + ICON_SRC[index]+ '.png')
                    })
                    // 计算tab宽度
                    this.calculateWidth(data.topCategories.length+1)
                    let _id = this.topCategories[0]._id
                    this.formatProdList(this.topCategories,data.productList)
                    // console.log(this.categoryList[_id])
                    this.allProdList = data.productList
                    // this.productList = this.categoryList[_id]
                    this.productList = this.allProdList
                    if(!inviter) {
                        this.headerInfo = this.userInfo
                    } else {
                        this.headerInfo = res.data.customerInfoOnTop
                        this.savaInviteInfo(res.data.customerInfoOnTop)
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
            let headerHeight = this.$refs.header && this.$refs.header.clientHeight
            let tabContainerHeight = this.$refs.tabContainer && this.$refs.tabContainer.clientHeight
            let listenerHeight = headerHeight + tabContainerHeight
            if(scrollTop > listenerHeight) {
                this.tabStyle = `position:fixed;top:0;width: 100%;`
            } else {
                this.tabStyle = ''
            }
        },
        getExpressInfo(){
            this.$axios.get('/customer/service/get-notice').then((res)=>{
                if(res.data.code === 200) {
                    // this.expressInfo = res.data.data.info.replace(/\n/g,"<br/>");
                    this.expressInfo = res.data.data.info
                    this.isShowDialog = res.data.data.hasRead === false?true:false
                    if(!res.data.data.hasRead){
                        this.showExpress()
                    }
                }
            })
        },
        ...mapMutations({
            savaInviteInfo:'SAVE_INVITEINFO'
        })
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
        z-index 1
        span
            color $text-l
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
        /* overflow scroll */
        background $bgcolor
    .scrollTab
        overflow hidden
    /* .wrapper
        height 100%
        overflow hidden */
    .index-wrapper
        height 100%
        overflow-y hidden
        /* 头像 */
        .header
            position relative
            background-size 100%
            background-position-y center
            height 250px
            background-image url('../../common/images/index_bg.png')
            text-align center
            color #fff
            padding-top 60px
            box-sizing border-box
            .userInfo-container
                position relative
                margin 0 15px
                height 175px
                background #fff
                border-radius 5px
                padding-top 40px
                box-sizing border-box
                .desc
                    color $text-ll
                    margin-top 10px
                .name
                    display flex
                    align-items center
                    justify-content center
                    span
                        font-size 22px
                        line-height 22px
                        color $text-l
                .received-invite
                    border-radius 30px
                    border 1px solid $red
                    line-height 35px
                    color $red
                    width 100px
                    margin 15px auto 0
            .call
                position relative
                display flex
                align-items center
                margin-top 5px
                z-index 1
                .mobile
                    color #fff
            img
                position absolute
                display block
                top -30px
                border 2px solid #fff
                border-radius 50%
                width 60px
                height 60px
                left 50%
                margin-left -30px
            
            .mobile
                font-size 18px
                line-height 25px
        .tips
            display flex
            align-items center
            font-size 14px
            width 100%
            line-height 40px
            border-bottom 1px solid $line
            color $red
            text-align left
            padding-left 15px
            box-sizing border-box
        /* 商品分类栏 */
        .category
            /* display flex */
            text-align left
            background #fff
            padding-bottom 12px
            /* white-space nowrap */
            /* width 500px */
            /* min-width 550px */
            /* padding-right 50px */
            li
                /* flex 1 */
                /* line-height 50px */
                color $text-l
                /* margin 0 2px */
                display inline-block
                text-align center
                min-width 40px
                margin-top 12px
                img
                    display block
                    margin 0 auto 9px
                    width 35px
                    height 35px
                span
                    font-size 14px
                    color $text-ll
                &.active
                    span
                        color $green
                /* &.active
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
                            background rgba(0,132,255,1)
                            box-shadow 0px 4px 8px 0px rgba(0,132,255,0.3)
                            border-radius 3px */
                /* &:last-child
                    margin-right 20px */
                        
</style>