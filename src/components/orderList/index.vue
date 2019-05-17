<template>
    <div class="orderlist-wrapper" v-if="ready">
            <div v-if="orderList.length>0" class="list">
                <router-link tag="section" class="order" v-for="(item,index) in orderList" :key="index" :to="{path:`/orderDetail/${item.order_id}`}">
                        <div class="cell">
                            <label class="date">{{item.created_at}}</label>
                            <span>{{item.order_status_name}}</span>
                        </div>
                        <div class="goods-container" v-for="(gitem,gindex) in item.products" :key="gindex">
                            <div class="goods">
                                <img :src="gitem.image" width="80" height="80" alt="">
                                <div class="text">
                                    <div class="name_price">
                                        <span class="name bold">{{gitem.name}}</span>
                                        <span class="price">¥{{gitem.price}}</span>
                                    </div>
                                    <p class="option_qty">
                                        <span class="desc">{{getOptionName(gitem.custom_option_info,gitem.custom_option_names)}}</span>
                                        <span class="quantity">x{{gitem.qty}}</span>
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
            <div v-else class="empty">暂无订单</div>
    </div>
</template>
<script>
import Qs from 'qs';
export default {
    props:{
        orderList:{
            type:Array
        },
        ready:{
            type:Boolean
        }
    },
    data() {
        return{
            status:'',
            custom_option_names:'',
            option_txt_arr:[],
        }
    },
    methods:{
        // 获取商品规格
        getOptionName(option,opt){
            let str = '',custom_option_names = opt
            let option_txt_arr = []
            for(let j in opt) {
                option_txt_arr.push(j)
            }
            for(let goodsOpt in option) {
                for(let k in custom_option_names) {
                   if(goodsOpt.toLowerCase() == k) {
                       str += custom_option_names[k]+":"
                       for(let v in custom_option_names) {
                            if(v==option[goodsOpt]){
                                str += custom_option_names[v]+";"
                                break;
                            } else if(option_txt_arr.indexOf(option[goodsOpt])==-1){
                                str += option[goodsOpt] + ";"
                                // console.log(option[goodsOpt])
                                break;
                           }
                       } 
                       break;
                   }
                } 
            }
            return str
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .orderlist-wrapper
        padding-top 10px
    .empty
        margin-top 70px
    .list
        padding-top 50px
        padding-bottom 10px
    .order
        margin 0 15px 10px
        paddind-bottom 10px
        &:last-child
            margin-bottom 0
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
            /* margin-left 10px */
            padding 0 0 0 10px
            box-sizing border-box
            padding-top 4px
            .name_price
                display flex
                line-height 22px
                flex 1
                justify-content space-between
                &>div
                    flex 1
                    display block
                .name
                    font-size 18px
                    margin-bottom 4px
                    text-align left
                    overflow hidden
                    display -webkit-box
                    text-overflow ellipsis
                    -webkit-line-clamp 1
                    -webkit-box-orient vertical
            .option_qty
                display flex
                flex 1
                justify-content space-between
                align-items center
                text-align left
            .desc
                color $text-ll
                font-size 12px
                max-width 200px
                line-height 18px
                text-align left
            .quantity
                color $text-ll
            /* &>div
                display flex
                .name_price
                    display flex
                    flex 1
                    justify-content space-between
                .option_qty
                    flex 1
                    justify-content space-between
                .name
                    font-size 18px
                    margin-bottom 4px
                    text-align left
                    display block
                    text-overflow ellipsis
                    overflow hidden
                    white-space nowrap
                    width 70%
                .desc
                    color $text-ll
                    font-size 12px
                    max-width 200px
                    line-height 18px
                    text-align left
                .quantity
                    color $text-lll */
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