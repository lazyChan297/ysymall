<template>
    <div class="earn-wrapper" v-if="earnInfo">
        <p class="title">我的收益</p>
         <ul class="total-container">
            <li>
                <p class="bold">¥{{earnInfo.todayIncome}}</p>
                <p>今日收益</p>
            </li>
            <li>
                <p class="bold">¥{{earnInfo.monthIncome}}</p>
                <p>本月收益</p>
            </li>
            <li>
                <p class="bold">¥{{earnInfo.totalIncome}}</p>
                <p>全部收益</p>
            </li>
         </ul>
        <p class="title">收益明细</p>
        <div class="title-desc">
            <span>本月收益：¥{{earnInfo.monthIncome}}</span>
            <div class="date-container">
                <div class="icon icon-date" @click="isShow = true" v-show="!value1"></div>
                <datetime
                    :min-year="min_year"
                    :max-year="max_year"
                    v-model="value1"
                    format="YYYY-MM"
                    @on-change="onChange"></datetime>
            </div>
            
        </div>
        <div class="sheet">
            <div>
                <ul v-if="earnInfo.incomeList.length">
                    <li v-for="(item,index) in earnInfo.incomeList" :key="index">
                        <p>
                            <span>奖励到账提醒</span>
                            <span>{{item.boughtAt}}</span>
                        </p>
                        <div v-if="item.buyer">
                            <span class="num bold">￥{{item.amount}}</span>
                            <span>{{item.buyer.nickname}}购买缘生源相关商品，您获得3级内奖励。</span>
                        </div>
                    </li>
                </ul>
                <div v-else class="empty">暂无数据</div>
            </div>
        </div>
    </div>
</template>
<script>
import { Group, Datetime, XButton} from 'vux'
import Qs from 'qs'
export default {
    data() {
        return {
            value1: null,
            maxYear: 2019,
            isShow: false,
            earnInfo:null,
            startedAt:'',
            endedAt:'',
            min_year:new Date().getFullYear() - 1,
            max_year: Number(new Date().getFullYear()) + 1
        }
    },
    components: {
        Datetime,
        XButton,
        Group
    },
    mounted(){
        this.getIncomeLine()
    },
    methods: {
        onChange(val){
            let month =Number(val.split('-')[1])
            
            let year = val.split('-')[0]
            let startedAt = val+'-01'
            
            if(month+1>9&&month+1<=12) {
                month = Number(month+1)
            } else if(month+1>12) {
                month = '01'
                year = Number(year)+1
            } else {
                month = '0'+ Number(month+1)
            }
            let endedAt = year + '-' + month + '-01'
            
            let params = Qs.stringify({
                startedAt:startedAt,
                endedAt:endedAt
            })
            this.getIncomeLine(params)
        },
        getIncomeLine(params){
            this.$axios.post('/finance/income/all',params).then((res)=>{
                if(res.data.code === 200) {
                    if(params) {
                        this.earnInfo.incomeList = res.data.data.incomeList
                    } else {
                        this.earnInfo = res.data.data
                    }
                    
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.empty
    line-height 100px
    background #f2f2f2
    font-size 14px
.vux-datetime
    display block
    width 80px
    padding 0
    height 30px
    box-sizing border-box
    line-height 30px
    &:before
        content ''
        display none
.vux-datetime-value
    &:after
        content ''
        display none
.title
    height 40px
    line-height 40px
    padding-left 15px
    border-bottom 1px solid $line
    background #fff
    text-align left
    &:before
        content ''
        display inline-block
        width 4px
        height 22px
        background $green
        vertical-align middle
        margin-right 10px
.title-desc
    line-height 30px
    color $text-lll
    font-size 14px
    display flex
    justify-content space-between
    align-items center 
    padding 0 15px
    .date-container
        position relative
        height 30px
        .vux-datetime
            position absolute
            right 0
            top 0
            text-align right
            color $text-lll
            line-height 30px
.total-container
    display flex
    margin-bottom 10px
    li
        flex 1
        text-align center
        background #fff
        padding 10px 0
        p
            &:first-child
                color $green
                line-height 28px
                font-size 20px
            &:last-child
                color $text-lll
                margin-top 10px
/* 明细 */
.sheet
    background #fff
    &>div>ul>li
        border-bottom 1px solid $line
        padding 10px 15px
        &:last-child
            border none
        &>p
            display flex
            justify-content space-between
            span
                &:last-child
                    color $text-lll
                    font-size 14px
                    
        &>div
            display flex
            align-items center
            margin-top 10px
            span
                &:last-child
                    flex 1
                    font-size 14px
                    line-height 20px
                    text-align right
        .num
            color $red
            font-size 20px
            margin-right 50px
</style>