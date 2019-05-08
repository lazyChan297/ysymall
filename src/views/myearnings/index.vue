<template>
    <div class="earnings-wrapper">
        
        <div class="panel">
            <div class="panel-linear">
            <p class="balance bold"> ¥{{earnInfo.balance}}</p>
            <p class="desc">当前余额</p>
            <router-link tag="div" to="/withdrawal" class="put">提现</router-link>
            </div>
            <div class="total-container">
                <router-link tag="div" to="/earn">
                    <p class="title bold">¥{{earnInfo.income}}</p>
                    <p class="desc">全部收益</p>
                </router-link>
                <router-link to="/cash" tag="div">
                    <p class="title bold">¥{{earnInfo.withdraw}}</p>
                    <p class="desc">已提现金额</p>
                </router-link>
            </div>
            <div class="figure-title-container">
                <p class="figure-title">一周收益曲线图</p>
            </div>
            <!-- 折线图 -->
            <ve-line :data="chartData" :extend="extend" :colors="colors" v-if="chartData.rows.length"></ve-line>
            <div class="empty-line" v-else>暂无收益</div>
            
           
        </div>
        <!-- 列表 -->
        <div class="sheet">
            <ul>
                <li @click="switchList(0)" :class="current_list_num==0?'active':''">今日收益明细</li>
                <li @click="switchList(1)" :class="current_list_num==1?'active':''">今日支出明细</li>
            </ul>
            <div>
                <ul v-if="current_list_num==0&&current_list.length">
                    <li v-for="(item,index) in current_list" :key="index">
                        <p>
                            <span>奖励到账提醒</span>
                            <span>{{item.boughtAt}}</span>
                        </p>
                        <div>
                            <span class="num bold">￥{{item.amount}}</span>
                            <span v-if="item.info" class="info">{{item.info}}</span>
                        </div>
                    </li>
                    
                </ul>
                <div v-else-if="current_list_num==0&&!current_list.length" class="empty">暂无数据</div>
                <ul v-else-if="current_list_num==1&&current_list.length>0">
                    <li v-for="(item,index) in current_list" :key="index">
                        <p>
                            <span>提现时间</span>
                            <span>{{item.withdrawnAt}}</span>
                        </p>
                        <div>
                            <span class="num bold">￥{{item.amount}}</span>
                            <div>
                                <div class="orderdate">到账时间:{{item.toAccountAt}}</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="empty">暂无数据</div>
            </div>
        </div>
        <!-- <p style="padding-top:100px">该页面正在开发中～敬请期待！</p> -->
    </div>
</template>

<script>
// import Schart from 'vue-schart';
import VeLine from 'v-charts/lib/line.common'
// import {VLine,VChart,VScale,VTooltip,VPoint} from 'vux'
export default {
    data() {
        this.extend = {
            series: {
                label: {
                    normal: {
                        show: true
                    }
                }
            }
        }
        this.colors = ['#fff']
        return {
            line_onready:false,
            earnInfo:null,
            current_list_num:0,//0收益1支出
            current_list:null,
            canvasId: 'myCanvas',
            type: 'line',
            height:200,
            width:document.body.clientWidth,
            inconmeLine:null,
            data: [],
            options: {
                bgColor:'#0084ff',
                axisColor:'#ffffff',
                contentColor:"#ffffff",
                fillColor:'#ffffff',
                yEqual:5
            }
        }
    },
    components:{
        VeLine
    },
    mounted(){
        this.getEarns()
        
    },
    methods:{
        getEarns(){
            this.$axios.post('/finance/income/overview').then((res)=>{
                if(res.data.code === 200) {
                    this.earnInfo = res.data.data
                    let rows = []
                    let list = res.data.data.lastSevenDays
                    list.forEach((item,index)=>{
                        rows.push({'日期': item.weekDay, '收益': item.amount})
                    })
                    this.chartData = {columns: ['日期', '收益'],
                        rows: rows}
                    if(this.current_list_num==0){
                        this.current_list = this.earnInfo.todayIncomeList
                    } else {
                        this.current_list = this.earnInfo.todayExpenditureList
                    }
                }
            })
        },
        switchList(n){
            if(n==0){
                this.current_list = this.earnInfo.todayIncomeList
            } else {
                this.current_list = this.earnInfo.todayExpenditureList
            }
            this.current_list_num = n
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/css/media.css";
/* 折线图样式 */
.ve-line
    background $green
.empty-line
    background $green
    color #fff
    height 100px
    line-height 100px
.earnings-wrapper
    background #fff !important
    height 100%
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
    .sheet
        background #fff
        padding-top 15px
        &>ul
            display flex
            margin 0 78px 15px
            line-height 40px
            border 1px solid $green
            border-radius 5px
            li
                flex 1
                color $green
                font-size 14px
                &.active
                    background $green
                    color #fff
                &:first-child
                    text-align right
                    padding-right 10px
                &:last-child
                    padding-left 10px
                    text-align left
        &>div>ul>li
                    border-top 1px solid $line
                    padding 10px 15px
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
                        &>div
                            flex 1
                            text-align right
                        span
                            &:last-child
                                flex 1
                                /* font-size 14px */
                        .info
                            font-size 14px
                            text-align right
                            line-height 22px
                    .num
                        color $red
                        font-size 20px
                        margin-right 50px
                        text-align left
                    .ordernum,.orderdate
                        font-size 14px
                        line-height 20px
    .empty
        height 50px
        line-height 50px
        color $text-ll
        font-size 14px
</style>