<template>
    <div class="earnings-wrapper" v-if="ready">
        <div class="header" v-if="earnInfo">
            <p class="title">余额</p>
            <div>
                <div>
                    <span class="symbol bold">¥</span>
                    <span class="num bold">{{balance}}</span>
                </div>
                
                <router-link  to="/withdrawal" tag="div" class="submit">
                    提现
                </router-link>
            </div>
        </div>
        <router-link tag="p" to="/cash" class="title-route" style="margin-top:0;border:none">
            <span>提现记录</span><div class="icon icon-link"></div>
        </router-link>
        <p  class="title-route"><span>我的收益</span></p>
        <ul class="total-container" v-if="earnInfo">
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
        <div class="title-desc" v-if="earnInfo">
            <span>本月收益：¥{{earnInfo.monthIncome}}</span>
            <div class="date-container">
                <div class="icon icon-date" @click="isShow = true" v-show="!value1"></div>
                <datetime
                    class="datetime"
                    :min-year="min_year"
                    :max-year="max_year"
                    v-model="value1"
                    format="YYYY-MM"
                    @on-change="onChange"></datetime>
            </div>
        </div>
        <div class="sheet">
                <div>
                    <ul v-if="earnInfo">
                        <li v-for="(item,index) in earnInfo.incomeList" :key="index">
                            <p>
                                <span>奖励到账提醒</span>
                                <span>{{item.boughtAt}}</span>
                            </p>
                            <div>
                                <span class="num bold">￥{{item.amount}}</span>
                                <span>{{item.info}}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="empty">暂无数据</div>
                </div>
            </div>
    </div>
</template>

<script>
import { Group, Datetime, XButton} from 'vux';
import Qs from 'qs';
export default {
    data() {
        return {
            earnInfo:'',
            balance:'',
            ready:global.ready,
            value1: null,
            maxYear: 2019,
            isShow: true,
            startedAt:'',
            endedAt:'',
            min_year:new Date().getFullYear() - 1,
            max_year: Number(new Date().getFullYear()) + 1,
            listParams:{
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
        }
    },
    components:{
        Datetime,
        XButton,
        Group
    },
    mounted(){
        addEventListener('scroll',this.handleScroll)
        this.getList()
        this.getEarns()
    },
    methods:{
        onChange(val){
            let month =Number(val.split('-')[1])
            
            let year = val.split('-')[0]
            this.startedAt = val+'-01'
            
            if(month+1>9&&month+1<=12) {
                month = Number(month+1)
            } else if(month+1>12) {
                month = '01'
                year = Number(year)+1
            } else {
                month = '0'+ Number(month+1)
            }
            this.endedAt = year + '-' + month + '-01'
            this.listParams.page = 1
            let params = Qs.stringify({
                startedAt:this.startedAt,
                endedAt:this.endedAt,
                page:this.listParams.page,
                number:this.listParams.number
            })
            this.getListByDate(params)
        },
        getEarns(){
            this.$axios.post('/finance/income/overview').then((res)=>{
                if(res.data.code === 200) {
                    this.balance = res.data.data.balance
                }
            })
        },
        getListByDate(params) {
            this.$axios.post('/finance/income/all',params).then((res)=>{
                if(res.data.code === 200) {
                    if(res.data.data.incomeList.length<this.listParams.number) {
                        this.listParams.nomore = true
                    }
                    let incomeList = this.earnInfo.incomeList?this.earnInfo.incomeList:[]
                    this.earnInfo.incomeList = this.earnInfo.incomeList.concat(res.data.data.incomeList)

                }
            })
        },
        getList(params){
            this.$axios.post('/finance/income/all',params).then((res)=>{
                if(res.data.code === 200) {
                    this.earnInfo = res.data.data
                }
            })
        },
        handleScroll(){
            let scrollTop =  document.documentElement.scrollTop||document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动到底部
            if(scrollTop+windowHeight==scrollHeight){
                if(!this.listParams.nomore) {
                    this.listParams.page++;
                    let params = Qs.stringify({
                        startedAt:this.startedAt,
                        endedAt:this.endedAt,
                        page:this.listParams.page,
                        number:this.listParams.number
                    })
                    this.getListByDate(params)
                }           
            }   
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/css/media.css";
/* datetime */
.date-container
    width 100px
    text-align right
.datetime
    display block
    width 100%
    padding 0 !important
    height 100%
.empty-line
    background $green
    color #fff
    height 100px
    line-height 100px
.earnings-wrapper
    height 100%
    .header
        position relative
        background-image url("../../common/images/earn_bg.png")
        height 140px
        padding-top 30px
        background-size 100%
        box-sizing border-box
        text-align left
        padding-left 20px
        padding-right 15px
        box-shadow:0px 5px 8px 0px rgba(163,206,255,0.76)
        .title
            color #fff
            font-size 18px
            margin-bottom 10px
        &>div
            display flex
            line-height 50px
            justify-content space-between
        .symbol
            color #fff
            font-size 20px
        .num 
            font-size 36px
            color #fff
        .submit
            background linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(221,236,252,1) 100%);
            box-shadow 0px 4px 6px 0px rgba(0,0,0,0.2)
            color $text-l
            border-radius 30px
            line-height 40px
            height 40px
            width 110px
            text-align center
    .title-route
        display flex
        align-items center
        justify-content space-between
        height 40px
        line-height 40px
        padding-left 15px
        background #fff
        text-align left
        border-bottom 1px solid $line
        padding-right 15px
        margin-top 15px
        span
            &:before
                content ''
                display inline-block
                width 4px
                height 22px
                background $green
                vertical-align middle
                margin-right 10px
    /* 收益列表 */
    .total-container
        display flex
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
    .panel
        /* height 70% */
        color #fff
        text-align center
        .panel-linear
            background:linear-gradient(360deg,rgba(0,132,255,100) 0%,rgba(69,165,255,100) 100%)
            padding-top 35px
        .balance
            font-size 36px
            line-height 50px
        .desc
            line-height 22px
            margin-bottom 10px
        .put
            width 90px
            border-radius 30px
            border 1px solid #fff
            line-height 34px
            margin 0 auto
        .total-container
            display flex
            background $green
            padding-top 10px
            &>div
                flex 1
                height 60px
                .title
                    margin-top 10px
                    line-height 28px
                .desc
                    font-size 14px
                &:first-child
                    border-right 1px solid #fff
        .figure-title-container
            background $green
            padding 10px 15px 0
        .figure-title
            padding 10px 0
            border-top 1px solid #fff
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
    .empty
        height 50px
        line-height 50px
        color $text-ll
        font-size 14px
</style>