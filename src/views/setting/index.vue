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
            <!-- {{userInfo}} -->
            <router-link tag="div" to="/inviterList" class="cell" v-if="userInfo.level=='registered'&&userInfo.hasInviter">
                <label>邀请人</label>              
                <div>
                    <span>{{userInfo.inviterRealName || userInfo.inviterNickname || userInfo.inviterMobile || '设置邀请人'}}</span>
                    <div class="icon icon-link"></div>
                </div>
            </router-link>
            <router-link tag="div" to="/inviterList" class="cell" v-else-if="!userInfo.hasInviter">
                <label>邀请人</label>
                <div>
                    <span>设置邀请人</span>
                    <div class="icon icon-link"></div>
                </div>
            </router-link>
            <div class="cell" v-else-if="userInfo.hasInviter">
                <label>邀请人</label>
                <span>{{userInfo.inviterRealName || userInfo.inviterNickname}}{{userInfo.inviterMobile}}</span>
                <!-- <span v-else-if="userInfo.inviterNickname">{{userInfo.inviterNickname}}</span>
                <span v-else-if="userInfo.inviterMobile">{{userInfo.inviterMobile}}</span> -->
            </div>
            <div class="cell" @click="chooseAddr">
                <label>收货地址</label>
                <div class="icon icon-link"></div>
            </div>
            
            <div class="cell">
                <label>级别</label>
                <span>{{getLevel(userInfo.level)}}</span>
            </div>
            <div class="cell" v-if="userInfo.agentDistrict">
                <label>地区</label>
                <span>{{userInfo.agentDistrict}}</span>
            </div>
        </section>
        <div class="logout" @click="isShowDialog = true">重新登录</div>
        <x-dialog v-model="isShowDialog">
            <div class="confirm-container">
                <div class="content">是否退出登录</div>
                <div class="submit" @click="dialogConfrim">确定</div>
                <div class="cancel" @click="dialogCancel">取消</div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
import {XDialog} from 'vux'
import webStorageCache from 'web-storage-cache'
import Qs from 'qs'
import { setTimeout } from 'timers';
import {getOpenid} from '@/common/js/util'
export default {
    inject:['reload'],
    data() {
        return {
            isShowDialog:false
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
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    mounted() {
        this.getUserInfo()
    },
    components:{
        XDialog
    },
    methods:{
        dialogConfrim() {
            this.isShowDialog = false             
            this.$axios.post('/customer/service/delwechat').then((res)=>{
                if (res.data.code === 200) {
                    let wscache = new webStorageCache()
                    wscache.delete('token')
                    wscache.delete('uuid')
                    global.token = ''
                    global.uuid = ''
                    global.isBoundWechat = false
                    // getOpenid(window.location.href)
                    this.$vux.loading.show({
                        text:'退出登录中…'
                    })
                    // this.reload()
                    let timer = setTimeout(()=>{
                        this.$vux.loading.hide()
                        window.location.href = global.serverHost + '#/login?redirect=/setting'
                    },3000)
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
        },
        dialogCancel() {
            this.isShowDialog = false
        },
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
        },
        getUserInfo() {
            this.$axios.post('/customer/service/get-customer-info').then((res)=>{
                if(res.data.code === 200) {
                    let data = res.data.data
                    this.savaUserInfo(data.customerInfo)
                }
            })
        },
        ...mapMutations({
            savaUserInfo:'SAVE_USERINFO',
            clearUserInfo: 'CLEAR_USERINFO'
        })
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl"
    @import "../../common/stylus/dialog.styl"
    .logout
        height 50px
        line-height 50px
        color $text-l
        background #ffffff
        margin 10px 0 0
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