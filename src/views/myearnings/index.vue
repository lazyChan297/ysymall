<template>
    <div class="earnings-wrapper" v-if="ready">
        <div class="header" v-if="earnInfo">
            <p class="title">余额</p>
            <div>
                <div>
                    <div>
                        <span class="symbol bold">¥</span>
                        <span class="num bold">{{balance}}</span>
                    </div>
                    <div class="desc"><span>原网站未到账总额:￥{{earnInfo.withdrawFailed}}</span>
                    <span>已并入可提现余额</span>
                    </div>
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

        <div class="income_box" v-if="earnInfo">
            <div>
                <div class="text">全部收益</div>
                <div class="num total">¥{{earnInfo.totalIncome}}</div>
            </div>
            <div>
                <div class="text">本月收益</div>
                <div class="num">¥{{earnInfo.monthIncome}}</div>
            </div>
            <div>
                <div class="text">今日收益</div>
                <div class="num">¥{{earnInfo.todayIncome}}</div>
            </div>
        </div>
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
                    @on-confirm="onConfirm"></datetime>
            </div>
        </div>
        <div class="sheet">
            <div >
                <ul v-if="earnInfo.incomeList&&earnInfo.incomeList.length>0">
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
            <!-- <div v-else class="empty">暂无收益</div> -->
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
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    methods:{
        onConfirm(val){
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
            this.listParams.nomore = false
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
                    this.earnInfo.incomeList = res.data.data.incomeList
                }
            })
        },
        getList(params){
            this.$axios.post('/finance/income/all',params).then((res)=>{
                if(res.data.code === 200) {
                    this.earnInfo = res.data.data
                    this.balance = res.data.data.balance
                }
            })
        },
        loadMore(params) {
            this.$axios.post('/finance/income/all',params).then((res)=>{
                if(res.data.code === 200) {
                    if(res.data.data.incomeList.length<this.listParams.number) {
                        this.listParams.nomore = true
                    }
                    console.log(this.earnInfo.incomeList)
                    this.earnInfo.incomeList = this.earnInfo.incomeList.concat(res.data.data.incomeList)
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
                    this.loadMore(params)
                }           
            }   
        }
    },
    destroyed() {
        removeEventListener('scroll',this.handleScroll)
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
        padding-top 30px
        background-size 100%
        box-sizing border-box
        text-align left
        padding-left 20px
        padding-right 15px
        padding-bottom 10px
        box-shadow:0px 5px 8px 0px rgba(163,206,255,0.76)
        .desc
            line-height 20px
            color #fff
            font-size 14px
            span
                display block
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
            font-size 26px
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
        height 50px
        line-height 50px
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
    .income_box
        background #fff
        &>div
            display flex
            justify-content space-between
            line-height 50px
            padding 0 15px
            border-top 1px solid $line
            &:first-child
                border none
            .num
                color $green
                font-size 20px
                font-weight bold
            .total
                color $red
            .text
                color $text-l
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
        height 80px
        line-height 80px
        color $text-ll
        font-size 14px
        border-top 1px solid $line
        background $bgcolor
</style>