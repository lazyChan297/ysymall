<template>
        <div v-show="ready" class="agentList-wrapper">
            <div class="agentList-wrapper">
                <search :checkType="checkType" @keywords="handleKeyWords">
                    <user-list :level="checkType" :list="friendsList" :generalInfo="generalInfo" @loadMore="loadMore" :loading="listParams.loading"></user-list>
                </search>
            </div>
            <!-- <div v-else class="empty">暂无数据</div> -->
        </div>
    </template>
    <script>
    import Search from '@/components/search/index'
    import UserList from '@/components/userList/index'
    import {mapGetters} from 'vuex'
    import Qs from 'qs'
    export default {
        data(){
            return {
                checkType:'generalAgent',
                keywords:'',
                friendsList:[],
                generalInfo:{},
                ready:false,
                listParams:{
                    loading:true,
                    nomore:false,
                    page:1,
                    number:1
                }
            }
        },
        components:{
            Search,
            UserList
        },
        created(){
            this.generalInfo = {
                generalAgentUsed:this.userInfo.generalAgentUsed,
                generalAgentLeft:this.userInfo.generalAgentLeft
            }
        },
        mounted(){
            this.getFriends()
        },
        methods:{
            getFriends(){
                let params = Qs.stringify({
                    page:this.listParams.page,
                    number:this.listParams.number,
                    keywords:this.keywords,
                    fromLevel:'member',//'需要的人脉的最低级别'
                    toLevel:'vip'//'需要的人脉的最高级别'
                })
                this.$axios.post('/customer/service/get-friends',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.ready = true
                        this.friendsList = res.data.data.friendsInfo
                    }
                })
            },
            searchFriends(){
                let params = Qs.stringify({
                    page:this.listParams.page,
                    number:this.listParams.number,
                    keywords:this.keywords,
                    // inviter:this.userInfo.sn,//'邀请人的sn',
                    fromLevel:'member',//'需要的人脉的最低级别'
                    toLevel:'vip'//'需要的人脉的最高级别'
                })
                this.$axios.post('/customer/service/search-friends',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.ready = true
                        let friendsList = this.friendsList
                        let _list = res.data.data.friendsInfo
                        this.friendsList = friendsList.concat(_list)
                        if(!_list.length){
                            this.listParams.loading = false
                            this.listParams.nomore = true
                        }
                    }
                })
            },
            // 监听input
            handleKeyWords(val){
                this.keywords = val
                if(!val) {
                    this.getFriends()
                    return
                }
                this.searchFriends()
            },
            // 滚动加载更多
            loadMore(){
                console.log('loadmore')
                if(!this.listParams.nomore){
                    this.listParams.page++;
                    this.listParams.loading = true
                    this.searchFriends()
                } else {
                    this.listParams.loading = false
                }
            }
        },
        computed:{
            ...mapGetters([
                'userInfo'
            ])
        }
    }
    </script>
    <style scoped lang="stylus">
    .agentList-wrapper
        height 100%
    </style>