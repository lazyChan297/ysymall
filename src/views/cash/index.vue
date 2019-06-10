<template>
    <div class="cash-wrapper">
        <!-- <ul class="tab">
            <router-link tag="li" to="/cash/arrival">已到账</router-link>
            <router-link tag="li" to="/cash/non_arrival">未到账</router-link>
        </ul>
        <router-view></router-view> -->
        <ul class="sheet" v-if="list.length">
            <li  v-for="(item,index) in list" :key="index">
                <p>
                    <span>奖励到账提醒</span>
                    <span>{{item.appliedAt}}</span>
                </p>
                <div>
                    <span class="num bold">￥{{item.amount}}</span>
                    <span>到账时间：{{item.toAccountAt}}</span>
                </div>
                <!-- <p class="submit-container"><span></span><span class="submit">点击重新提交申请</span></p> -->
            </li>
        </ul>
        <div v-else class="empty">暂无提现记录</div>
    </div>
</template>
<script>
import Qs from 'qs';
export default {
    data() {
        return {
            list:[]
        }
    },
    mounted() {
        this.getList()
    },
    methods:{
        getList(){
            let params = Qs.stringify({page:1,number:10})
            this.$axios.post('/finance/expenditure/all',params).then((res)=>{
                if(res.data.code === 200) {
                    this.list = res.data.data
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
    .empty
        padding 100px 0 0
    .cash-wrapper
        .tab
            line-height 40px
            text-align center
            display flex
            background #fff
            margin-bottom 10px
            li
                flex 1
                &.router-link-active
                    color $green
        .sheet
            background #fff
        li
            border-bottom 1px solid $line
            padding 10px 0 0
            &:last-child
                border none
            &>p
                display flex
                justify-content space-between
                &:first-child
                    padding 0 15px
                span
                    &:last-child
                        color $text-lll
                        font-size 14px
            &>div
                display flex
                align-items center
                margin-top 10px
                padding 0 15px 10px
                span
                    &:last-child
                        flex 1
                        font-size 14px
                        line-height 20px
                        text-align right
            .num
                color $red
                font-size 20px
                /* width 60% */
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
                display block
                text-align left
            .submit-container
                border-top 1px solid $line
                padding-right 15px
            .submit
                color $red !important
                font-size 14px
                line-height 40px
</style>