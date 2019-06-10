<template>
        <div v-show="ready" class="agentList-wrapper" v-if="ready">
            <div class="agentList-wrapper">
                <search :checkType="checkType" @keywords="handleKeyWords">
                    <div class="list-title">
                        <div>
                            <span class="gray">已开通：</span>
                            <span class="green">{{generalInfo.generalAgentUsed}}</span>
                            <span class="gray">/剩余</span>
                            <span class="red">{{generalInfo.generalAgentLeft}}</span>
                            <span class="gray">人</span>
                        </div>
                        <div>
                            <span class="gray">到期时间：</span>
                            <span class="red">{{generalInfo.generalAgentEndedAt}}</span>
                        </div>
                    </div>
                    <user-list :level="checkType" 
                               :list="friendsList" 
                               :generalInfo="generalInfo" 
                               @loadMore="loadMore" 
                               :loading="listParams.listParams"
                               :empty="empty"></user-list>
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
                generalAgentLeft:this.userInfo.generalAgentLeft,
                generalAgentEndedAt:this.userInfo.generalAgentEndedAt
            }
            if(process.env.NODE_ENV == 'production') {
                // 禁止分享
                this.$wechat.ready(() => {
                    this.$wechat.hideMenuItems({
                        menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                    });
                })
            }
        }
    }
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import '../../common/css/media.css';
.list-title
    display flex
    justify-content space-between
    line-height 30px
    padding 0 15px
    background #efefef
    font-size 14px
    .green
        color $green
        background transparent
    .red
        color $red
        background transparent
.dialog-window
    .title
            background $green
    .paymentDialog
        .title
            background $green
        .balance
            background $green
        .submit
            background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
            box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
.paymentDialog
    .title
        font-weight bold
        color #fff
        padding 23px 0 10px
        background $green
    .balance
        font-weight bold
        color #fff
        padding-bottom 17px
        background $green
        font-size 36px
    .inputbox
        padding 0 15px
        &>div
            display flex
            justify-content space-between
            align-items center
            height 50px
            border-bottom 1px solid #efefef
            .getcode
                color $text-l
                border-left 1px solid $text-l
                padding-left 10px
    .cancel
        color $text-lll
        line-height 50px
    .submit
        line-height 50px
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
        border-radius 5px
        color #fff
        font-weight bold
        margin 20px 15px 0
</style>