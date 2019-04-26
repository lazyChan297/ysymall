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
            <schart :canvasId="canvasId" 
                    :type="type" 
                    :data="data" 
                    :options="options" 
                    :height="height"
                    :width="width"></schart>
        </div>
        <!-- 列表 -->
        <div class="sheet">
            <ul>
                <li @click="switchList(0)" :class="current_list_num==0?'active':''">今日收益明细</li>
                <li @click="switchList(1)" :class="current_list_num==1?'active':''">今日支出明细</li>
            </ul>
            <div>
                <ul v-if="current_list_num==0">
                    <li v-for="(item,index) in current_list" :key="index">
                        <p>
                            <span>奖励到账提醒</span>
                            <span>{{item.boughtAt}}</span>
                        </p>
                        <div>
                            <span class="num bold">￥{{item.amount}}</span>
                            <span>{{item.buyer.nickname}}购买缘生源相关商品，您获得3级内奖励。</span>
                        </div>
                    </li>
                </ul>
                <ul v-else>
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
            </div>
        </div>
        <!-- <p style="padding-top:100px">该页面正在开发中～敬请期待！</p> -->
    </div>
</template>

<script>
import Schart from 'vue-schart';
export default {
    data() {
        return {
            earnInfo:null,
            current_list_num:0,//0收益1支出
            current_list:null,
            canvasId: 'myCanvas',
            type: 'line',
            height:200,
            width:document.body.clientWidth,
            data: [
                {name: '周一', value: 1342},
                {name: '周二', value: 2123},
                {name: '周三', value: 1654},
                {name: '周四', value: 1795},
                {name: '周五', value: 1795},
                {name: '周六', value: 1795},
                {name: '周日', value: 1795},
            ],
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
        Schart
    },
    mounted(){
        this.getEarns()
    },
    methods:{
        getEarns(){
            this.$axios.post('/finance/income/overview').then((res)=>{
                if(res.data.code === 200) {
                    this.earnInfo = res.data.data
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
.earnings-wrapper
    .panel
        height 70%
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
            padding-top 10px
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
                        span
                            &:last-child
                                flex 1
                                font-size 14px
                    .num
                        color $red
                        font-size 20px
                        margin-right 50px
                    .ordernum,.orderdate
                        font-size 14px
                        line-height 20px

</style>