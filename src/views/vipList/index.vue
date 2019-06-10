<template>
    <div v-if="ready">
        <div>
            <search :checkType="checkType" @keywords="handleKeyWords">
                <div class="list-title">
                <div>
                    <span class="gray">已开通：</span>
                    <span class="green">{{vipInfo.vipUsed}}</span>
                    <span class="gray">/剩余</span>
                    <span class="red">{{vipInfo.vipLeft}}</span>
                    <span class="gray">人</span>
                </div>
                <div>
                    <span class="gray">到期时间：</span>
                    <span class="red">{{vipInfo.vipEndedAt}}</span>
                </div>
            </div>
                <user-list 
                    :level="checkType" 
                    :list="friendsList" 
                    :vipInfo="vipInfo" 
                    @loadMore="loadMore"
                    :empty="empty"></user-list>
            </search>
            <x-dialog v-model="showDialog" class="paymentDialog">
                <div class="title">升级VIP</div>
                <div class="inputbox">
                    <div>
                        <div class="mobile">{{userInfo.mobile}}</div>
                        <div class="getcode" @click="sendCode">{{codeTxt}}</div>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入验证码" v-model="code">
                    </div>
                </div>
                <div class="submit">确认</div>
                <div class="cancel" @click="showDialog=false">取消</div>
            </x-dialog>
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
            ready:global.ready,
            codeTxt:'获取验证码'
        }
    },
    components:{
        Search,
        UserList
    },
    created(){
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    mounted() {
        this.vipInfo = {
            vipLeft:this.userInfo.vipLeft,
            vipUsed:this.userInfo.vipUsed,
            vipEndedAt:this.userInfo.vipEndedAt
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
