<template>
    <div class="inviterList-wrapper">
        <div class="search-wrapper">
            <div class="searchBox">
                <div class="icon icon-search"></div>
                <input type="text" placeholder="输入手机号或昵称" v-model="keywords">
            </div>
        </div>
        <ul class="list">
            <li class="item" v-if="inviterInfo">
                <img :src="inviterInfo.avatar" alt="" width="54">
                <div class="center">
                    <div class="name">{{inviterInfo.nickname}}</div>
                    <!-- <span class="level">getLevel(item.level)</span> -->
                    <!-- <div class="mobile">item.mobile</div> -->
                </div>
                <!-- 设置级别 -->
                <div class="right">
                    <div class="btn" @click="showDialog">绑定</div>
                </div>
            </li>
        </ul>
        <x-dialog v-model="isShowDialog">
            <div class="confirm-container">
                <div class="content">是否绑定该用户为邀请人？</div>
                <div class="button-group">
                    <div class="submit" @click="confirmSubmit">确定</div>
                    <div class="cancel" @click="confirmCancel">取消</div>
                </div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
import Qs from 'qs';
import {XDialog} from 'vux';
export default {
    data() {
        return {
            keywords:'',
            inviterInfo:'',
            isShowDialog:false
        }
    },
    mounted(){
        addEventListener('scroll',this.handleScroll)
    },
    watch:{
        keywords:function(newVal){
            if(newVal.length == 11) {
                this.searchInviter(this.keywords)
            }
        }
    },
    components:{
        XDialog
    },
    methods:{
        handleScroll(){
            let scrollTop =  document.documentElement.scrollTop||document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动到底部
            if(scrollTop+windowHeight==scrollHeight){
                // console.log('loadMore')            
            }   
        },
        searchInviter() {
            let params = Qs.stringify({mobile:this.keywords})
            this.$axios.post('/customer/service/search-customer-by-mobile',params).then((res)=>{
                if(res.data.code === 200) {
                    this.inviterInfo = res.data.data
                }
            })
        },
        confirmSubmit() {
            let params = Qs.stringify({mobile:this.keywords})
            this.$axios.post('/customer/service/set-invitor',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'设置成功',
                        type:'success'
                    })
                    window.location.href = global.serverHost + '#/setting'
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
            this.hideConfirm()
        },
        confirmCancel() {
            
            this.hideConfirm()
        },
        showDialog() {
            this.isShowDialog = true
        },
        hideConfirm() {
            this.isShowDialog = false
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/stylus/dialog.styl";
.search-wrapper
    padding 10px 15px
    background #fff
    height 60px
    box-sizing border-box
    .searchBox
        display flex
        align-items center
        background #efefef
        border-radius 30px
        height 40px
        padding-left 15px
        input
            flex 1
            background #efefef
            margin-left 10px
.list
    background #fff
    height 100%
    .item
        display flex
        margin 23px 15px
        border-bottom 1px solid #efefef
        padding-bottom 23px
        padding-top 10px
        align-items center
        img
            border-radius 50%
        .center
            text-align left
            margin-left 10px
            flex 1
            .level
                background $text-lll
                color #fff
                border-radius 30px
                padding 0 15px
                line-height 24px
                font-size 14px
            .name
                color $text-l
                font-weight bold
                font-size 18px
            .mobile
                color $text-ll
                font-size 14px
                margin-top 10px
        .right
            .btn
                border-radius 30px
                background linear-gradient(180deg,rgba(10,114,255,1) 0%,rgba(29,161,243,1) 100%)
                color #ffffff
                line-height 30px
                font-weight bold
                width 100px
</style>