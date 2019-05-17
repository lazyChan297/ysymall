<template>
    <div class="order-wrapper" v-if="ready">
        <div class="tab">
            <div class="tabItem" @click="switchTab('all')" :class="current=='all'?'active':''"><span>全部</span></div>
            <div class="tabItem" @click="switchTab('unshipped')" :class="current=='unshipped'?'active':''"><span>待发货</span></div>
            <div class="tabItem" @click="switchTab('shipped')" :class="current=='shipped'?'active':''"><span>待收货</span></div>
            <div class="tabItem" @click="switchTab('completed')" :class="current=='completed'?'active':''"><span>已完结</span></div>
        </div>
        <order-list :orderList="orderList" :ready="ready"></order-list>
    </div>
</template>
<script>
import OrderList from '@/components/orderList/index';
import Qs from 'qs';
export default {
    data() {
        return {
            current:'all',
            orderList:[],
            ready:global.ready,
            listParams:{
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
        }
    },
    components:{
        OrderList
    },
    created() {
        this.current = this.$route.params.name
    },
    mounted() {
        addEventListener('scroll',this.handleScroll)
        this.getOrder(this.current)
    },
    methods:{
        switchTab(e){
            this.current = e
            document.documentElement.scrollTop = 0
            this.orderList = []
            this.listParams = {
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
            this.getOrder(e)
        },
        getOrder(name) {
            let url = `/customer/order/${name}`
            let params = Qs.stringify({
                page:this.listParams.page,
                number:10
            })
            this.$axios.post(url,params).then((res)=>{
                if(res.data.code === 200) {
                    if(res.data.data.orderList.length < this.listParams.number) {
                        this.listParams.nomore = true
                    }
                    this.listParams.page++;
                    let ori_orderList = this.orderList,
                        orderList = res.data.data.orderList
                    this.orderList = ori_orderList.concat(orderList)
                    // this.orderList = []
                    this.ready = true
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
                    this.getOrder(this.current)
                }  
            }   
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.order-wrapper
  .tab
    position fixed
    display flex 
    width 100%
    top 0
    line-height 40px
    background #fff
    margin-bottom 10px
    .tabItem
        flex 1
        text-align center
        &.active
            span
                color $green
                &:after
                    content ''
                    display block
                    height 4px
                    width 28px
                    margin 0 auto
                    background rgba(0,132,255,1)
                    border-radius 2px
</style>