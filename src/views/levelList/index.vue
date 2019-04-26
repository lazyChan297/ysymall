<template>
        <div>
            <search :checkType="checkType" @keywords="handleKeyWords">
                <user-list :level="checkType" :list="friendsList" @loadMore="loadMore"></user-list>
            </search>
        </div>
    </template>
    <script>
    import Search from '@/components/search/index'
    import UserList from '@/components/userList/index'
    import Qs from 'qs'
    export default {
        data(){
            return {
                checkType:'level',
                keywords:'',
                friendsList:[],
                listParams:{
                    loading:false,
                    nomore:false,
                    page:1, //初始搜索页码
                    number:10 //每页返回数据
                }
            }
        },
        components:{
            Search,
            UserList
        },
        methods:{
            searchFriends(){
                let params = Qs.stringify({
                    page:this.listParams.page,
                    number:this.listParams.number,
                    keywords:this.keywords,
                    fromLevel:'member',//'需要的人脉的最低级别'
                    toLevel:'cityAgent'//'需要的人脉的最高级别'
                })
                this.$axios.post('/customer/service/search-customers',params).then((res)=>{
                    if(res.data.code === 200) {
                        // 原来已请求到的
                        let friendsList = this.friendsList
                        // 本次请求的
                        let _list = res.data.data.customersInfo
                        // 合并数组
                        this.friendsList = friendsList.concat(_list)
                        // 如果本次请求到的为空则禁止滚动加载
                        if(!_list.length){
                            this.listParams.loading = false
                            this.listParams.nomore = true
                        }
                    }
                })
            },
            // 监听input
            handleKeyWords(val){
                // input值改变后重置page相关参数
                this.listParams.nomore = false
                this.listParams.page = 1
                this.friendsList = []
                this.keywords = val
                this.searchFriends()
            },
            // 滚动加载
            loadMore(){
                if(!this.keywords) return
                if(!this.listParams.nomore){
                    this.listParams.page++;
                    this.listParams.loading = true
                    this.searchFriends()
                } else {
                    this.listParams.loading = false
                }
            }
        }
    }
    </script>