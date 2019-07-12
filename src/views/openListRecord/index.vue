<template>
    <div class="openListRecord-wrapper" v-if="ready">
        <ul v-if="!isEmpty">
            <li v-for="(item,index) in recordList" :key="index">
                <img :src="item.avatar" alt="" v-if="item.avatar">
                <img src="../../common/images/avatar_default.png" alt="" v-else>
                <div>
                    <!-- <div>
                        <div class="name">{{item.nickname}}</div>
                        <div class="acccount">开通金额:¥{{item.amount}}</div>
                    </div>
                    <div class="date">
                        开通时间：{{item.time}}
                    </div> -->
                    <div class="name bold">{{item.nickname}}</div>
                    <div class="mobile" v-if="type=='level'">{{item.mobile}}</div>
                    <div class="date">操作时间：{{item.time}}</div>
                    <div class="agent" v-if="type=='level'">开通区域：{{item.district}}</div>
                    <div class="account">{{type=='level'?'实收':'开通'}}金额：¥{{item.amount}}</div>
                </div>
            </li>
        </ul>
        <div class="nomore" v-else>您没有开通记录~</div>
    </div>
</template>
<script>
import Qs from 'qs'; 
export default {
    data(){
        return {
            recordList:[],
            ready:global.ready,
            listParams:{
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            },
            isEmpty:false,
            type:''
        }
    },
    created() {
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    mounted(){
        addEventListener('scroll',this.handleScroll)
        this.getlist()
    },
    methods:{
        handleScroll() {
            let scrollTop =  document.documentElement.scrollTop||document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动到底部
            if(scrollTop+windowHeight==scrollHeight){
                if(!this.listParams.nomore) {
                    this.getlist()
                }  
            }   
        },
        getlist(){
            this.type = this.$route.params.type
            if(this.type == 'level') {
                this.getRecordManager()   
            } else {
                this.getRecordUser()
            }
        },
        getRecordUser(){
            let params = Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number,
                level:this.$route.params.type
            })
            this.$axios.post('/customer/level/upgrade-list',params).then((res)=>{
                if(res.data.code === 200) {
                    if(!res.data.data.length) {
                        this.isEmpty = true
                    }
                    this.recordList = res.data.data
                    this.listParams.page++;
                    if(res.data.data.length<this.listParams.number) {
                        this.listParams.nomore = true
                    }
                }
            })
        },
        getRecordManager() {
            let params = Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number
            })
            this.$axios.post('/customer/level/upgrade-records',params).then((res)=>{
                if(res.data.code === 200) {
                    if(!res.data.data.length) {
                        this.isEmpty = true
                    }
                    this.recordList = this.recordList.concat(res.data.data)
                    this.listParams.page++;
                    if(res.data.data.length<this.listParams.number) {
                        this.listParams.nomore = true
                    }
                }
            })
        }
    },
    destroyed() {
        removeEventListener('scroll',this.handleScroll)
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import '../../common/css/media.css';
.openListRecord-wrapper
    background $bgcolor
ul
    background #fff
    li
        display flex
        align-items center
        padding 23px 0
        border-bottom 1px solid #efefef
        margin 0 15px
        img
            border-radius 50%
            width 54px
        &>div
            flex 1
            &>div
                display flex
                justify-content space-between
                margin-left 10px
            .name
                color $text-l
                font-size 18px
                margin-bottom 7px
            .mobile
                color $green
                font-size 14px
                margin-bottom 7px

            .account
                color $green
                font-weight bold
                margin-top 7px
            .date
                color $text-ll
                font-size 14px
            .agent
                font-size 14px
                margin-top 7px
                text-align left
.nomore
    font-size 14px
    color $text-ll
    padding-top 70px
</style>