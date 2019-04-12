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
                articleParams:{
                    loading:true,
                    nomore:false,
                    page:1,//初始请求的页面
                    number:6 //每页请求的数据
                }
            }
        },
        components:{
            Search,
            UserList
        },
        mounted(){
            // this.searchFriends()
        },
        methods:{
            searchFriends(){
                let params = Qs.stringify({
                    // page:this.articleParams.page,
                    // number:this.articleParams.number,
                    keywords:this.keywords,
                    fromLevel:'member',//'需要的人脉的最低级别'
                    toLevel:'cityAgent'//'需要的人脉的最高级别'
                })
                this.$axios.post('/customer/service/search-customers',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.friendsList = res.data.data.customersInfo
                    }
                })
            },
            // 监听input
            handleKeyWords(val){
                this.keywords = val
                let reg = /^[0-9]*$/
                // 当搜索手机号码时，大于7位才发送请求
                if(reg.test(val)){
                    if(val.length>7){
                        this.searchFriends()
                    }
                } else if(val.length>=2) {
                    this.searchFriends()
                }
            },
            // 滚动加载
            loadMore(){

            }
        }
    }
    </script>