<template>
    <div class="friendship-wrapper" v-if="ready">
        <ul class="tab">
            <li @click="switchTab('friends')" :class="current=='friends'?'active':''">一度人脉</li>
            <li @click="switchTab('customer')" :class="current=='customer'?'active':''">扫码客</li>
            <!-- <li @click="switchTab('inviter')" :class="current=='inviter'?'active':''">访客</li> -->
        </ul>
        <user-list :vistors="vistors" :list="friendsInfo" :category="current"></user-list>
        <!-- <p style="padding-top:100px">该页面正在开发中～敬请期待！</p> -->
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
            friendsInfo:[],
            category:'',
            listParams:{
                nomore:true,
                number:10,
                page:1
            }
        }
    },
    mounted() {
        addEventListener('scroll',this.handleScroll)
        this.getlist('friends')
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
        switchTab(type) {
            this.current = type
            this.listParams.nomore = true
            this.listParams.page = 1
            this.friendsInfo = []
            this.getlist(type)
        },
        getlist(type){
            // 获取扫码客
            let url = ''
            if(type == 'inviter') {
                url = '/customer/service/get-visitors'
            } else if (type === 'customer') {
                url = '/customer/service/get-scanners'
            } else {
                url = '/customer/service/get-first-layer-friends'
            }
            let params = Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number
            })
            this.$axios.post(url,params).then((res)=>{
                if(res.data.code === 200) {
                    if(type == 'friends') {
                        if(res.data.data.friendsInfo.length < this.listParams.number) {
                            this.listParams.nomore = true
                        } else {
                            this.listParams.nomore = false
                        }
                        this.friendsInfo = this.friendsInfo.concat(res.data.data.friendsInfo)
                    }
                    if(type== 'customer'|| type == 'inviter') {
                        if(res.data.data.visitorsInfo !== null) {
                            if (res.data.data.visitorsInfo.length < this.listParams.number) {
                                this.listParams.nomore = true
                            } else {
                                this.listParams.nomore = false   
                            }
                            this.friendsInfo = this.friendsInfo.concat(res.data.data.visitorsInfo)
                        } else {
                            this.listParams.nomore = true
                        }                  
                    }  
                    this.listParams.page++;
                    this.vistors = res.data.data
                }
            })
        },
        handleScroll() {
            let scrollTop =  document.documentElement.scrollTop||document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动到底部
            if(scrollTop+windowHeight==scrollHeight){
                let params = Qs.stringify({
                    page:this.listParams.page,
                    number:this.listParams.number
                })
                if(!this.listParams.nomore) {
                    this.getlist(this.current,params)
                }            
            }   
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.friendship-wrapper
    .tab
        position fixed
        width 100%
        bottom 0
        display flex
        background #fff
        z-index 1
        li 
            flex 1
            font-size 18px
            line-height 50px
            &.active
                color $green
                font-weight bold
</style>