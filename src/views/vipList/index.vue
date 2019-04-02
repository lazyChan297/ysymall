<template>
    <div v-show="ready">
        <div v-if="friendsList.length">
            <search :checkType="checkType" @keywords="handleKeyWords">
                <user-list :level="checkType" :list="friendsList" :vipInfo="vipInfo"></user-list>
            </search>
        </div>
        <div v-else class="empty">暂无数据</div>
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
            checkType:'vip',
            keywords:'',
            friendsList:[],
            vipInfo:{},
            ready:false
        }
    },
    components:{
        Search,
        UserList
    },
    created(){
        this.vipInfo = {
            vipLeft:this.userInfo.vipLeft,
            vipUsed:this.userInfo.vipUsed
        }
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
                toLevel:'member'//'需要的人脉的最高级别'
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
                keywords:this.keywords,
                // inviter:this.userInfo.sn,//'邀请人的sn',
                fromLevel:'member',//'需要的人脉的最低级别'
                toLevel:'member'//'需要的人脉的最高级别'
            })
            this.$axios.post('/customer/service/search-friends',params).then((res)=>{
                if(res.data.code === 200) {
                    this.ready = true
                    this.friendsList = res.data.data.friendsInfo
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

    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
.empty
    padding 100px 0 0
</style>