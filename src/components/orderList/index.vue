<template>
    <div class="orderlist-wrapper">
            <router-link tag="section" class="order" v-for="(item,index) in orderList" :key="index" :to="{path:`/orderDetail/${item.order_id}`}">
                    <div class="cell">
                        <label class="date">{{item.created_at}}</label>
                        <span>{{item.order_status_name}}</span>
                    </div>
                    <div class="goods-container" v-for="(gitem,gindex) in item.products" :key="gindex">
                        <div class="goods">
                            <img :src="gitem.image" width="80" height="80" alt="">
                            <div class="text">
                                <p>
                                    <span class="name bold">{{gitem.name}}</span>
                                    <span class="price">¥{{gitem.price}}</span>
                                </p>
                                <p>
                                    <span class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</span>
                                    <span class="quantity bold">x{{gitem.qty}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <label></label>
                        <div v-if="item.order_status=='completed'||item.order_status=='dispatched'">
                            <router-link class="check" tag="span" :to="{path:`/express/${item.order_id}`}">查看物流</router-link>
                        </div>
                    </div>
            </router-link>
    </div>
</template>
<script>
import Qs from 'qs';
export default {
    data() {
        return{
            orderList:[],
            status:'',
            listParams:{
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
            
        }
    },
    mounted(){
        this.status = this.$route.name
        this.getOrder(this.$route.name)
        addEventListener('scroll',this.handleScroll)
    },
    watch:{
        '$route':function(route){
            this.status = route.name
            this.orderList = []
            this.listParams = {
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
            this.getOrder(route.name)
        }
    },
    methods:{
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
                    this.getOrder(this.status)
                }  
            }   
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .order
        margin 0 15px 10px
    .cell
        display flex
        justify-content space-between
        line-height 40px
        padding 0 15px
        background #fff
        border-bottom 1px solid $line
        &:first-child
            border-top-left-radius 5px
            border-top-right-radius 5px
        &:last-child
            border none
            border-bottom-left-radius 5px
            border-bottom-right-radius 5px
        &>span
            color $green
        .date
            color $text-ll
    .goods
        display flex
        padding 15px 10px
        background #fff
        &:last-child
            border-bottom 1px solid $line
        .text 
            flex 1
            margin-left 10px
            padding-top 4px
            &>p
                display flex
                justify-content space-between
                .name
                    font-size 18px
                    margin-bottom 4px
                .desc
                    color $text-ll
                    font-size 12px
                    max-width 200px
                    line-height 18px
                    text-align left
                .quantity
                    color $text-lll
    .check,.confirm
        font-size 14px
        text-align center
        line-height 26px
        width 80px
        border-radius 3px
        display inline-block
    .check
        color $text-lll
        border 1px solid $text-lll
    .confirm
        color #fff
        background $green
</style>