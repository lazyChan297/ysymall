<template>
        <div>
            <search :checkType="checkType" @keywords="handleKeyWords">
                <user-list :level="checkType" :list="friendsList"></user-list>
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
                friendsList:[]
            }
        },
        components:{
            Search,
            UserList
        },
        mounted(){
            this.getFriends()
        },
        methods:{
            getFriends(){
                let params = Qs.stringify({
                    keywords:this.keywords,
                    inviter:'bhqwDF',//'邀请人的sn',
                    fromLevel:'member',//'需要的人脉的最低级别'
                    toLevel:'cityAgent'//'需要的人脉的最高级别'
                })
                this.$axios.post('/customer/service/get-friends',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.friendsList = res.data.data.friendsInfo
                    }
                })
            },
            // 监听input
            handleKeyWords(val){
                this.keywords = val
                this.getFriends()
            }
        }
    }
    </script>