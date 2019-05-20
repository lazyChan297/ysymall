<template>
        <div v-show="ready" class="agentList-wrapper" v-if="ready">
            <div class="agentList-wrapper">
                <search :checkType="checkType" @keywords="handleKeyWords">
                    <user-list :level="checkType" 
                               :list="friendsList" 
                               :generalInfo="generalInfo" 
                               @loadMore="loadMore" 
                               :loading="listParams.listParams"
                               :empty="empty"></user-list>
                </search>
            </div>
            <!-- <div v-else class="empty">暂无数据</div> -->
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
                checkType:'generalAgent',
                keywords:'',
                friendsList:[],
                generalInfo:{},
                ready:global.ready
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
        }
    }
    </script>