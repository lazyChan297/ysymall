<template>
    <div class="orderDetail-wrapper">
        <div class="cell">
            <label>状态</label>
            <span>{{details.order_status_name}}</span>
        </div>
        <section class="update">
            <router-link to="/express" tag="div" class="express">
                <div class="icon icon-car"></div>
                <div class="text">
                    <p class="expressTxt">
                        {{lastExpressInfo.context}}
                    </p>
                    <p class="date">
                        {{lastExpressInfo.updatedAt}}
                    </p>
                </div>
                <div class="icon icon-link"></div>
            </router-link>
            <div class="userInfo">
                <div class="icon icon-location"></div>
                <div class="text">
                    <p class="user">
                        {{details.reciever}},{{details.customer_telephone}}
                    </p>
                    <p class="addr">
                        {{details.customer_address_province}}
                        {{details.customer_address_city}}
                        {{details.customer_address_county}}
                        {{details.customer_address_details}}
                    </p>
                </div>
                <div class="icon icon-link"></div>
            </div>
        </section>
        <section class="goods-container">
            <div>
                <div class="goods" v-for="(item,index) in details.products">
                    <img :src="item.image" width="80" height="80" alt="">
                    <div class="text">
                        <p>
                            <span class="name bold">{{item.name}}</span>
                            <span class="price">¥{{item.price}}</span>
                        </p>
                        <p>
                            <span class="desc"></span>
                            <span class="quantity bold">x{{item.qty}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="cell">
                <label for="">总计</label>
                <span>¥{{details.subtotal}}</span>
            </div>
            <!-- <div class="cell">
                <label for="">运费</label>
                <span>¥0</span>
            </div> -->
            <div class="cell">
                <label for="">实付款</label>
                <span>¥39.80</span>
            </div>
        </section>
        <section class="orderinfo">
            <!-- <p>
                订单编号：234576145 <span class="copy">复制</span>
            </p> -->
            <p>
                下单时间：{{details.created_at}}
            </p>
            <!-- <p>
                发货时间：2019/01/16 15:59:01
            </p> -->
        </section>
        <!-- <div class="large-green-button">确认收货</div> -->
    </div>
</template>
<script>
import Qs from 'qs';
export default {
    data() {
        return {
            details:{},
            lastExpressInfo:''
        }
    },
    mounted() {
        this.getDetail(this.$route.params.id)
    },
    methods:{
        getDetail(id){
            let params = Qs.stringify({
                orderId:id
            })
            this.$axios.post('/customer/order/details',params).then((res)=>{
                if(res.data.code === 200) {
                    this.details = res.data.data.order
                    this.lastExpressInfo = res.data.data.lastExpressInfo
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.update
    margin 10px 0
.userInfo,
.express
    display flex
    align-items center
    padding 10px 15px
    background #fff
    text-align left
    .text 
        flex 1
        margin 0 10px
        .name
            line-height 22px
        .addr
            color $text-lll
            font-size 14px
            margin-top 5px
            line-height 20px
        .expressTxt
            color $green
            line-height 22px
        .date
            color $text-lll
            line-height 22px
.express
    border-bottom 1px solid $line
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
.goods-container
    .cell
        &>span
            color $red
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
                .quantity
                    color $text-lll
textarea
    height 80px
    width 100%
    box-sizing border-box
    border none
    border-top 1px solid $line
    resize none
    padding 10px 15px
.orderinfo
    background #fff
    margin 10px 0
    font-size 14px
    color $text-lll
    padding 10px 15px
    line-height 22px
    text-align left
    .copy
        border 1px solid $text-lll
        font-size 12px
</style>