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
</template>
<script>
import Qs from 'qs';
export default {
    data() {
        return{
            orderList:[],
            status:'',
            custom_option_names:'',
            option_txt_arr:[],
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
                    // this.custom_option_names = res.data.data.orderList[0].products[0].custom_option_names
                    // // 保存可以转换为汉字的规格属性值
                    // if(this.custom_option_names) {
                    //     let attr = []
                    //     for(let i in this.custom_option_names) {
                    //         attr.push(i)
                    //     }
                    //     this.option_txt_arr = attr
                    // }
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
        paddind-bottom 10px
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