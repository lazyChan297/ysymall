<template>
    <div v-if="ready">
        <div>
            <search :checkType="checkType" @keywords="handleKeyWords">
                <user-list :level="checkType" :list="friendsList" :vipInfo="vipInfo" @loadMore="loadMore"></user-list>
            </search>
        </div>
    </div>
</template>
<script>
import Search from '@/components/search/index'
import UserList from '@/components/userList/index'
import {friendsListMixin} from '@/common/js/mixin'
export default {
    mixins:[friendsListMixin],
    data(){
        return {
            checkType:'vip',
            keywords:'',
            friendsList:[],
            vipInfo:{},
            ready:global.ready
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
    }
}
</script>
