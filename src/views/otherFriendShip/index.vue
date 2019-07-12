<template>
    <div class="userList-wrapper">
        <ul>
            <router-link :to="{path:`/userDetail/${item.sn}`}" tag="li" v-for="(item,index) in list" :key="index">
                <img :src="item.avatar" alt="" class="avatar" v-if="item.avatar">
                <img src="../../common/images/avatar_default.png" alt="" v-else>
                <div class="text">
                    <div>
                        <span class="name bold">{{item.nickname || item.realName}}</span>
                        <span class="desc">{{item.mobile}}</span>
                    </div>
                    <!-- <div class="account">
                        <span>成交额：</span>
                        <span>{{item.orderAmount}}</span>
                    </div> -->
                </div>
                <div class="friendQua">人脉:{{item.friendsQuantity}}</div>
                <div class="icon icon-link"></div>
            </router-link>
        </ul>
    </div>
</template>
<script>
import Qs from 'qs'
export default {
    data(){
        return {
            list:[],
            listParams:{
                page:1,
                number:10,
                nomore:false
            }
        }
    },
    mounted(){
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
        this.getlist(this.$route.params.sn)
    },
    methods:{
        formatTime(time){
            // 时
            let h = 0
            if(time<60*60) {
                h = '00'
            } else {
                h = parseInt(time / (60*60))<10?"0"+parseInt(time / (60*60)):parseInt(time / (60*60))
            }
            // 分
            let _m = time % (60*60) 
            let m = parseInt(_m/60)<10?'0'+parseInt(_m/60):parseInt(_m/60)
            // 秒
            let s = _m%60<10?"0"+_m%60:_m%60
            let interval = h+":"+m+":"+s
            return interval
        },
        getlist(sn){
            this.$axios.post('/customer/service/get-first-layer-friends',Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number,
                sn:sn
            })).then((res)=>{
                if(res.data.code === 200) {
                   this.list = res.data.data.friendsInfo
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";

.desc
    font-size 12px
    color $text-lll
    padding-left 15px
    text-align left
    line-height 30px
    span
        margin-right 10px
ul
    padding-bottom 50px
ul>li
    display flex
    background #fff
    height 100px
    padding 0 15px
    align-items center
    border-bottom 1px solid $line
    &:last-child
        border-bottom none
    img
        border-radius 50%
        width 54px
        height 54px
    .text 
        flex 1
        text-align left
        margin-left 10px
        margin-right 10px
        // &>div
        //     &:first-child
        //         margin-bottom 10px
        .name
            display block
            font-size 18px
            line-height 25px
        .desc
            font-size 14px
            padding-left 0
        .position,
        .account
            display block
            font-size 14px
            color $text-lll
            overflow: hidden;
            text-overflow ellipsis
            width 80%
            white-space nowrap   
        .interval
            color $red
            flex 1
            text-align right
    .invalid
        position absolute
        right 15px
    .friendQua
        color $text-lll
        font-size 14px
</style>