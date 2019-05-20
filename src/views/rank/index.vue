<template>
    <div class="rank-wrapper" v-if="ready">
        <div class="headers">
            <img src="../../common/images/rank_bg.png" alt="" @load="imgload">
            <p class="interval" v-show="current_rank==1">倒计时: {{interval}}</p>
            <div class="tab-container">
                <div :class="current_rank==1?'current_rank':''" @click="switchRank(1)"><span>今日排名</span></div>
                <div :class="current_rank==2?'current_rank':''" @click="switchRank(2)"><span>昨日排名</span></div>
            </div>
        </div>
        <section>
            <div class="my_rank" v-if="rankList&&rankList.length">
                <img :src="userInfo.avatar" alt="" width="30" height="30">
                <span>您{{current_rank==1?'当前':'的'}}排名是第 {{my_rank}} 名</span>
                <!-- <div class="icon icon-no1"></div> -->
            </div>
            <div class="th">
                <span>排名</span>
                <span>用户</span>
                <span>{{current_rank==1?'今日':'昨日'}}</span>
            </div>
            <ul class="tb" v-if="rankList&&rankList.length">
                <li v-for="(item,index) in rankList" :key="index">
                    <div class="rank">
                        <div class="icon icon-no1" v-if="item.rankNo==1"></div>
                        <div class="icon icon-no2" v-else-if="item.rankNo==2"></div>
                        <div class="icon icon-no3" v-else-if="item.rankNo==3"></div>
                        <div v-else>{{item.rankNo}}</div>
                    </div>
                    <div class="user">
                        <img :src="item.avatar" alt="" width="35" height="35">
                        <span>{{item.nickname}}</span>
                    </div>
                    <div class="num">{{item.quantity}}</div>
                </li>
            </ul>
            <div v-else class="empty">
                <img src="../../common/images/rank_empty.png" alt="" width="182">
                <p class="desc">排行榜空了</p>
            </div>
        </section>
        <!-- tabbar -->
        <tab-bar/>
    </div>
</template>
<script>

import TabBar from '@/components/tabBar/index'
import {mapGetters} from 'vuex'
import Qs from 'qs'
export default {
    data(){
        return {
            current_rank:1,
            my_rank:'',
            rankList:null,
            countdown:'',
            interval:'',
            ready:global.ready
        }
    },
    components:{
        TabBar
    },
    mounted(){
        
    },
    methods:{
        imgload(){
            this.getRank('today')
            this.timer = null
        },
        switchRank(n){
            this.current_rank = n
            if(n==1){
                this.getRank('today')
            } else {
                this.getRank('yesterday')
            }
        },
        getRank(time){
            let params = Qs.stringify({time:time})
            this.$axios.post('/customer/contest/rank',params).then((res)=>{
                if(res.data.code === 200) {
                    this.my_rank = res.data.data.myRank
                    this.rankList = res.data.data.rankList
                    if(time==='today') {
                        this.countdown = res.data.data.countdown
                        this._setInterval(this.countdown)
                    } else {
                        clearInterval(this.timer)
                    }
                    
                }
            })
        },
        _setInterval(countdown){
            this.timer = setInterval(()=>{
                this.countdown--;
                this.formatTime(this.countdown)
                if(countdown<=0){
                    clearInterval(timer)
                    this.interval = '倒计时结束';
                }
            },1000)
        },
        formatTime(countdown){
            // 时
            let h = 0
            if(countdown<60*60) {
                h = '00'
            } else {
                h = parseInt(countdown / (60*60))<10?"0"+parseInt(countdown / (60*60)):parseInt(countdown / (60*60))
            }
            // 分
            let _m = countdown % (60*60) 
            let m = parseInt(_m/60)<10?'0'+parseInt(_m/60):parseInt(_m/60)
            // 秒
            let s = _m%60<10?"0"+_m%60:_m%60
            this.interval = h+":"+m+":"+s
        }
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    }
}
</script>

<style lang="stylus" scoped>
 @import '../../common/stylus/variable.styl';
.headers
    position relative
    img
        width 100%
    .interval
        position absolute
        color #fff
        top 0
        text-align center
        width 100%
        top 16px
    .tab-container
        position absolute
        display flex
        align-items  center
        bottom 0
        width 100%
        height 50px
        border-top-left-radius 20px
        border-top-right-radius 20px
        background #ffffff
        box-shadow 0px 2px 4px 0px rgba(0,132,255,0.2)
        &>div
            flex 1
            height 30px
            line-height 30px
            &:first-child
                border-right 1px solid $line
        .current_rank
            span
                position relative
                color $green
                font-weight bold
                font-size 20px
                &:after
                    content ''
                    display block
                    position absolute
                    width 100%
                    bottom -12px
                    left 0
                    background $green
                    height 2px

section
    padding-bottom 50px
    .my_rank
        height 60px
        line-height 60px
        background #fff
        img
            border-radius 50%
            margin 15px 0
            vertical-align middle
        span 
            color $text-ll
    .th
        font-size 0
        background #efefef
        span
            font-size 16px
            display inline-block
            width 33%
            line-height 60px
            color $text-l
    .tb
        background #ffffff
        padding 0 15px
        li
            display flex
            align-items center
            height 80px
            background #fff
            border-bottom 1px solid $line
            .rank
                flex 1
                span
                    color $text-ll
                    font-weight bold
                    font-size 18px
            .user
                display flex
                align-items center
                flex 1
                img
                    border-radius 50%
                    vertical-align middle
                    margin-right 10px
                span
                    font-size 14px
                    color $text-l
                    -webkit-line-clamp 1
                    word-break break-all
                    display block
                    white-space nowrap
                    text-overflow ellipsis
                    overflow hidden
                    width: 100px
                    text-align left
            .num
                flex 1
                font-size 18px
                color $green
                font-weight bold
.empty
    p
        color $text-lll
</style>

