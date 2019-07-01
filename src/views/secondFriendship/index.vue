<template>
    <div class="friendship-wrapper" v-if="ready">
        <ul v-if="friendsList&&friendsList.length>0">
            <li v-for="(item,index) in friendsList" :key="index">
                <img :src="item.avatar" alt="" class="avatar" v-if="item.avatar">
                <img src="../../common/images/avatar_default.png" alt="" v-else class="avatar">
                <div class="text">
                    <p><span class="name bold">{{item.nickname}}</span></p>
                    <p class="account">
                        <span>成交额：</span>
                        <span>{{item.orderAmount}}</span>
                    </p>
                </div>
                <div class="friendQua">人脉:{{item.friendsQuantity}}</div>
                <div class="icon icon-link"></div>
            </li>
        </ul>
    </div>
</template>
<script>
import UserList from '@/views/userList/index';
import Qs from 'qs';
export default {
    data() {
        return {
            vistors:null,
            current:'friends',
            ready:global.ready,
            friendsList:[],
            listParams:{
                page:1,
                number:10,
                nomore:false
            }
        }
    },
    mounted() {
        this.getlist(this.$route.params.sn)
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    components:{
        UserList
    },
    methods:{
        switchTab(tpe) {
            this.getlist()
        },
        getlist(sn){
            this.$axios.post('/customer/service/get-second-layer-friends',Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number,
                friendSn:sn
            })).then((res)=>{
                if(res.data.code === 200) {
                   this.friendsList = res.data.data.friendsInfo
                }
            })
        },
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.friendship-wrapper
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
            &>p
                display flex
                align-items center
                &:first-child
                    margin-bottom 10px
            .name
                font-size 18px
                line-height 25px
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