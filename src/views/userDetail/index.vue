<template>
    <div class="userDetail-wrapper">
        <div class="avatar">
            <img :src="userInfo.avatar" alt="" v-if="userInfo.avatar">
            <img src="../../common/images/avatar_default.png" alt="" v-else class="avatar">
            <div class="text">
                <p><span class="name bold">{{userInfo.nickname}}</span></p>
                <p class="account">
                    <span class="date">绑定时间：{{userInfo.boundAt}}</span>
                    <span></span>
                </p>
            </div>
        </div>
        <section>
            <a class="cell" :href="`tel:${userInfo.mobile}`">
                <span>手机号</span>
                <div>
                    <span>{{userInfo.mobile}}</span>
                    <div class="icon icon-phone1" ></div>
                </div>
                
            </a>
            <div class="cell">
                <span>级别</span>
                <span>{{getLevel(userInfo.level)}}</span>
            </div>
            <router-link :to="{path:`/second_friendship/${userInfo.sn}`}" class="cell" tag="div">
                    <span>二度人脉</span>
                <div>
                    <span>{{userInfo.friendsQuantity}}人</span>
                    <div class="icon icon-link"></div>
                </div>
                
            </router-link>
        </section>
        <section>
            <div class="cell">
                <span>订单数量</span>
                <div>
                    <span>{{userInfo.ordersQuantity}}</span>
                    <!-- <div class="icon icon-link"></div> -->
                </div>
            </div>
            <div class="cell">
                <span>成交额</span>
                <span>¥{{userInfo.ordersAmount}}</span>
            </div>
        </section>
        <section>
            <div class="cell">
                <span>最近访问网站时间</span>
                <span>{{userInfo.lastVisit}}</span>
            </div>
        </section>
    </div>
</template>
<script>
import Qs from 'qs'
export default {
    data(){
        return {
            sn:'',
            userInfo:''
        }
    },
    mounted(){
        this.sn = this.$route.params.sn
        this.getDetail(this.sn)
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    methods:{
        getDetail(sn) {
            let params = Qs.stringify({sn:sn})
            this.$axios.post('/customer/service/get-one-friend-info',params).then((res)=>{
                if(res.data.code === 200) {
                    this.userInfo = res.data.data.info
                }
            })
        },
        getLevel(level){
            switch(level){
                case "member":
                    return "普通会员";
                    break;
                case "vip":
                    return "VIP";
                    break;
                case "generalAgent":
                    return "总代";
                    break;
                case "countyAgent":
                    return "区代";
                    break;
                case "cityAgent":
                    return "市代";
                    break;
                case "provinceAgent":
                    return "省代";
                    break;
            }
        },
    }
    
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/css/media.css";
.avatar
    display flex
    background #fff
    height 100px
    padding 0 15px
    align-items center
    img
        border-radius 50%
        width 54px
        height 54px
    .text 
        flex 1
        text-align left
        margin-left 10px
        &>p
            display flex
            align-items center
            &:first-child
                margin-bottom 10px
        .name
            font-size 18px
            line-height 25px
        .account
            font-size 14px
            color $text-lll
            span
                &:last-child
                    color #fff
                    font-size 12px
                    background $green
                    border-radius 20px
                    line-height 20px
                    padding 0 10px
                    margin-left 10px
section
    margin-top 10px
    padding 0 15px
    background #fff
    .cell
        display flex
        justify-content space-between
        line-height 50px
        border-bottom 1px solid $line
        span
            color $text-l
        &:last-child
            border none
        &>div
            display flex
            align-items center
            span
                color $text-l
                margin-right 15px
</style>