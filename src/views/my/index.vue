<template>
    <div class="my-wrapper" v-if="ready">
        <div class="header">
            <img v-lazy="userInfo.avatar" alt=""  class="avatar">
            <div class="text">
                <p class="name bold">{{userInfo.nickname}}</p>
                <p class="mobile">{{userInfo.mobile}}</p>
            </div>
            <router-link class="icon icon-setting" to="/setting"></router-link>
        </div>
        <ul class="order-tab">
            <router-link to="/order/all" tag="li">
                <div class="icon icon-qbdd"></div>
                <span>全部订单</span>
            </router-link>
            <router-link to="/order/unshipped" tag="li">
                <div class="icon icon-dfh"></div>
                <span>待发货</span>
            </router-link>
            <router-link to="/order/shipped" tag="li">
                <div class="icon icon-dsh"></div>
                <span>待收货</span>
            </router-link>
            <router-link to="/order/completed" tag="li">
                <div class="icon icon-ywc"></div>
                <span>已完成</span>
            </router-link>
        </ul>
        <router-link tag="div" class="QRcode" to="/cardDetail">
            <div class="title">
                <span>我的</span><span class="red">名片</span>
            </div>
            <div class="desc">一键打通社交网络，全方位展示自己</div>
            <img src="../../common/images/qrcode.png" alt="" class="qrcode_img">
        </router-link>
        <section>
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
            <router-link class="cell" to="/inviteQRcode" tag="div">
                <div>
                    <span class="icon icon-code"></span>
                    <span class="bold">我的二维码</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell" to="/checkAgent" tag="div">
                <div>
                    <span class="icon icon-area"></span>
                    <span class="bold">未开通合伙人地区</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell"
                 tag="div"
                 to="/vipList" 
                 v-if="userInfo.level=='provinceAgent'||userInfo.level=='cityAgent'||userInfo.level=='countyAgent'||userInfo.level=='generalAgent'">
                <div>
                    <span class="icon icon-vip"></span>
                    <span class="bold">开通VIP</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link class="cell"
                 tag="div"
                 to="/agentList" 
                 v-if="userInfo.level=='provinceAgent'||userInfo.level=='cityAgent'||userInfo.level=='countyAgent'">
                <div>
                    <span class="icon icon-agent"></span>
                    <span class="bold">开通总代</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <!-- 仅限公司人员操作 -->
            <router-link class="cell" to="/levelList" tag="div" v-if="userInfo.isManager">
                <div>
                    <span class="icon icon-level"></span>
                    <span class="bold">开通合伙人</span>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <div class="cell" @click="applyVip" tag="div" v-if="userInfo.level==='member'">
                <div>
                    <span class="icon icon-UpVip"></span>
                    <span class="bold">申请VIP</span>
                    
                </div>
                <div class="icon icon-link"></div>
            </div>
            <div class="cell" @click="applyAgent" v-if="userInfo.level==='vip'||userInfo.level==='member'">
                <div>
                    <span class="icon icon-UpAgent"></span>
                    <span class="bold">申请总代理</span>
                    
                </div>
                <div class="icon icon-link"></div>
            </div>
        </section>
        <tab-bar/>
    </div>
</template>
<script>
import TabBar from '@/components/tabBar/index';
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            ready:global.ready
        }
    },
    created(){
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    components: {
        TabBar
    },
    beforeRouteEnter(to,from,next){
        next()
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    methods:{
        chooseLevel(){
            let level = this.userInfo.level
            if(level === 'provinceAgent'|| level === 'cityAgent' || level === 'countyAgent') {
                // 省/市/区 可以开通vipor总代
                this.$router.push({path:`/chooseLevel/${level}`})
            } else {
                // 总代只可以开通vip
                this.$router.push('/vipList')
            }
        },
        applyVip(){
            window.location.href = global.serverHost + '/checkout/onepage/pay/#/applyVip/'
        },
        applyAgent() {
            window.location.href = global.serverHost + '/checkout/onepage/pay/#/applyAgent/'
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .my-wrapper
        padding-top 15px
        background #fff !important
        height 100%
    .header 
        display flex
        background url("../../common/images/wode@2x.png") no-repeat center
        height 135px
        margin 0 15px 0
        border-radius 8px
        align-items center
        padding 15px 15px 0
        box-shadow 0px 4px 16px 0px rgba(41,206,166,0.4)
        img
            border-radius 50%
            border 2px solid #fff
            height 70px
            width 70px
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
        padding 0 15px 60px
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
    .order-tab
        display flex
        background #fff
        li
            flex 1
            padding 15px 0 20px
            span
                font-size 14px
    .QRcode
        position relative
        height 80px
        background rgba(244,243,247,1)
        box-shadow 0px 8px 8px 0px rgba(192,180,180,0.2)
        border-radius 10px
        margin 10px 15px
        .title
            text-align left
            padding 15px 0 0 15px
            span
                color $text-l
                font-size 20px
                font-weight bold
            .red
                color $red
                background transparent
        .desc
            color $text-ll
            font-size 14px
            text-align left
            margin-left 15px
            margin-top 10px
        img
            width 80px
            position absolute
            top 10px
            right 10px
</style>