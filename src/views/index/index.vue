<template>
    <div class="index-wrapper" ref="wrapper">
        <div class="scroll-container" ref="indexscroll" :data="productList">
            <div>
                <!-- inviter header -->
                <div class="header" ref="header" v-if="headerInfo">
                    <div class="userInfo-container">
                            <img :src="headerInfo.avatar" alt="" v-if="headerInfo.avatar">
                            <div class="name bold" v-if="headerInfo.mobile">
                                <span>{{headerInfo.nickname}}</span>
                                <a class="icon icon-phone" :href="`tel:${headerInfo.mobile}`" ></a>
                            </div>
                            <div class="desc">邀请您参与社交电商</div>
                            <div class="received-invite" @click="receivedInvite" v-if="headerInfo.mobile">接收邀请</div>
                            <router-link class="received-invite" to="/login" v-else tag="div">绑定手机号码</router-link>
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
                <div class="goodsList-wrapper">
                        <div>
                        <router-link :to="{path:`/goodsDetail/${g.product_id}`}" class="goodsItem" tag="div" v-for="(g,index) in productList">
                            <img :src="g.image" alt="">
                            <p class="name bold">{{g.name}}</p>
                            <div>
                                <span class="price bold">¥{{g.special_price.value?g.special_price.value:g.price.value}}</span>
                                <span class="oldprice" v-if="g.special_price.value">¥{{g.price.value}}</span>
                                <span class="oldprice" v-else></span>
                            </div>
                        </router-link>
                        </div>
                    </div>
                <div class="suspension" @click="showExpress">
                        <div class="icon icon-stop"></div>
                        <span>公告</span>
                </div>
                
            </div>
        </div>
        <router-view/>
        <!-- tabbar -->
        <tab-bar/>
        <x-dialog v-model="isShowDialog">
            <div class="confirm-container">
                <div class="content" v-html="expressInfo"></div>
                <div class="button-group">
                    <div class="submit" @click="confirmDialog">确定</div>
                    <!-- <div class="cancel">取消</div> -->
                </div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
const env = process.env.NODE_ENV
import TabBar from '@/components/tabBar/index'
import {mapGetters,mapMutations} from 'vuex'
import {XDialog} from 'vux'
import Qs from 'qs'
import Scroll from '@/base/scroll/index'
// 阻止滚动时间
const mo=function(e){e.preventDefault();};
// 取消限制页面滚动
function move(){
        document.body.style.overflow='';//出现滚动条
        document.removeEventListener("touchmove",mo,false);        
}
// 限制页面滚动
function stop(){
        document.body.style.overflow='hidden';        
        document.addEventListener("touchmove",mo,false);//禁止页面滑动
}
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
            headerInfo:null,
            ready:global.ready
        }
    },
    watch:{
        '$route':(route)=>{
            if(route.name !== 'index') {
                this.$refs.wrapper.style.overflow = 'hidden'
            } else {
                this.$refs.wrapper.style.overflow = ''
            }
        }
    },
    components: {
        TabBar,
        XDialog,
        Scroll
    },
    created() {
        this.hasInviter()
    },
    mounted() {
        // 监听滚动
        // addEventListener('scroll',this.handleScroll)
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
        confirmDialog(){
            this.isShowDialog = false
        },
        // 打开物流停运窗口
        showExpress(){
            //  ====使用微信原生confirm
            // let vuxAlert = document.getElementsByClassName('vux-alert')[0]
            // let alertContent = document.getElementsByClassName('weui-dialog__bd')[1]
            // alertContent.style.textAlign = 'left'
            // let expressInfo = this.expressInfo
            // let strArr = expressInfo.split('n')
            // let _str = ''
            // strArr.forEach((item,index)=>{
            //     let len = item.length
            //     item = item.substring(0,len-1)
            //     item+="<br/>"
            //     _str+=item
            // })
            // this.$vux.alert.show({
            //     content:_str
            // })
            //  ===样式优化版
            this.isShowDialog = true
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
            let headerHeight = this.$refs.header && this.$refs.header.clientHeight
            let tabContainerHeight = this.$refs.tabContainer && (this.$refs.tabContainer.clientHeight/2)
            let listenerHeight = headerHeight
            document.documentElement.scrollTop = document.body.scrollTop = listenerHeight
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
                        // this.savaInviteInfo(res.data.customerInfoOnTop)
                    }
                    this.$refs.indexscroll.refresh()
                    if(env == 'production') {
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
            let listenerHeight = headerHeight + tabContainerHeight + 50
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
                    this.expressInfo = res.data.data.info.replace(/\\n/gm,"</br>")
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
    @import '../../common/stylus/dialog.styl';
    @import '../../common/css/media.css';
    /* 弹窗样式 */
    .confirm-container .content
        text-align left
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
        background $bgcolor
    .scrollTab
        overflow hidden
    .wrapper
        height 100%
    .index-wrapper
        position relative
        height 100%
        /* overflow hidden */
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
                    width 120px
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
.goodsList-wrapper
    padding-bottom 50px
    padding 15px 15px 50px
    font-size 0
    text-align left
    .goodsItem
        display inline-block
        width 47%
        background #fff
        /* margin 0 15px */
        padding-bottom 10px
        box-shadow 0px 2px 2px -1px rgba(129,131,140,0.1)
        border-radius 8px
        margin-bottom 15px
        &:nth-child(odd)
            margin-right 15px
        img
            display block
            width 100%
            border-top-left-radius 8px
            border-top-right-radius 8px
        .name
            color $text-l
            font-size 16px
            margin 5px 0
            line-height 22px
            padding-left 10px
            text-align left
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
        .desc
            color $text-ll
            font-size 14px
            line-height 20px
            margin-bottom 10px
            padding-left 10px
            text-align left
        &>div
            display flex
            align-items center
            .price
                color $red
                font-size 16px
                padding-left 10px
            .oldprice
                font-size 12px
                color $text-lll
                flex 1
                margin-left 5px
                text-decoration line-through
                text-align left
            .cart
                border-radius 20px
                border 3px solid $red
                line-height 30px
                font-size 14px
                padding 0 15px
                color $red
                box-sizing border-box
                margin-right 10px
                        
</style>