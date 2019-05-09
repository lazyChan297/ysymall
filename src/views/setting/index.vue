<template>
    <div class="setting-wrapper">
        <p class="title">基本信息</p>
        <section>    
            <div class="cell">
                <label>头像</label>
                <img :src="userInfo.avatar" width="36" height="36" alt="">
            </div>
            <div class="cell">
                <label>昵称</label>
                <span>{{userInfo.nickname}}</span>
            </div>
            <div to="/bindPhone" class="cell" tag="div">
                <label>手机号</label>
                <div>
                    <span>{{userInfo.mobile}}</span>
                    <!-- <div class="icon icon-link"></div> -->
                </div>
            </div>
            <router-link tag="div" to="/inviterList" class="cell" v-if="userInfo.level=='registered'">
                <label>邀请人</label>
                <div>
                    <span>{{userInfo.inviterNickname || '设置邀请人'}}</span>
                    <div class="icon icon-link"></div>
                </div>
            </router-link>
            <div class="cell" v-else-if="userInfo.inviterNickname">
                <label>邀请人</label>
                <div>{{userInfo.inviterNickname}}</div>
                </div>
            <div class="cell" @click="chooseAddr">
                <label>收货地址</label>
                <div class="icon icon-link"></div>
            </div>
            <div class="cell">
                <label>级别</label>
                <span>{{getLevel(userInfo.level)}}</span>
            </div> 
        </section>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Qs from 'qs'
export default {
    created(){
        console.log("userInfo")
        console.log(this.userInfo)
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    methods:{
        getLevel(level){
            switch(level){
                case('registered'):
                    return "注册会员";
                    break;
                case('member'): 
                    return "会员";
                    break;
                case('vip'):
                    return "vip";
                    break;
                case("generalAgent"):
                    return "总代";
                    break;
                case("provinceAgent"):
                    return "省代";
                    break;
                case("cityAgent"):
                    return "市代";
                    break;
                case("countyAgent"):
                    return "区代";
                    break;
            }
        },
        chooseAddr() {
            let that = this
            this.$wechat.openAddress({
                success: res => {
                    let addrInfo = JSON.stringify({
                        userName: res.userName,
                        telNumber: res.telNumber,
                        provinceName: res.provinceName,
                        cityName: res.cityName,
                        countyName: res.countryName,
                        detail: res.detailInfo
                    })
                    let params = Qs.stringify({addrInfo})
                    that.$axios.post('/customer/service/save-addr', params).then(res => {
                        // alert(res.data.data)
                        if (res.data.code == 200) {
                            that.addr = res.data.data
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl"
    .title
        line-height 50px
        color $text-lll
        padding-left 15px
        text-align left
    section
        padding 0 15px
        background #fff
    .cell
        display flex
        justify-content space-between
        align-items center
        background #fff
        line-height 50px
        border-bottom 1px solid $line
        &:last-child
            border none
        img
            border-radius 50%
        span
            &:last-child
                color $text-lll
        &>div
            display flex
            align-items center
            span
                color $text-lll
</style>