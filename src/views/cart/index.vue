<template>
    <div class="cart-wrapper" v-if="ready">
        <div v-if="goodslist.length>0" style="padding-bottom:50px">
            <section>
                <div class="goodsItem" v-for="(item,index) in goodslist" :key="item.item_id">
                    <div class="icon icon-check" :class="{'icon-uncheck':!item.checked}" @click="selectGood(index)"></div>
                    <div class="goods">
                        <img :src="item.img_url" alt="" width="100" height="100">
                        <div class="info">
                            <p class="name bold">{{item.name}}</p>
                            <p class="desc">{{getOptionName(item.custom_option_info)}}</p>
                            <div>
                                <div class="price bold">¥{{item.product_price}}</div>
                                <cart-control :good="item" @minus="minusgoods(item)" @add="addgoods(item)" @input="inputChange($event,item)"></cart-control>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div class="control">
                <div class="icon" :class="isSelectAll?'icon-checkall':'icon-uncheckall'" @click="selectAll"></div>
                <span class="checkAll">全选</span>
                <div>
                    <span>合计：</span>
                    <span class="red">¥{{total}}</span>
                </div>
                <div class="submit bold" @click="submit">
                    结算
                </div>
            </div>
        </div>
        <!-- 购物车为空 -->
        <div v-else>
            <p class="title">购物车是空的，赶紧去购物吧</p>
            <router-link to="/" tag="div" class="button">去购物</router-link>
        </div>
    </div>
</template>
<script>
import CartControl from '@/components/cartcontrol/index'
import {mapGetters, mapMutations} from 'vuex'
import Qs from 'qs';
String.prototype.compare = function(str){
    //不区分大小写
    if(str.toLowerCase() == this.toLowerCase()){
        return "1"; // 正确
    } else {
        return "0"; // 错误
    }
}
var origin_products = {};
let timer;
export default {
    data(){
        return {
            isSelectAll: true,
            goodslist:[],
            ready:false,
            custom_option_names:null,
            option_txt_arr:[]
        }
    },
    components: {
        CartControl
    },
    created(){
        this.getCart()
        if(process.env.NODE_ENV == 'production') {
            // 禁止分享
            this.$wechat.ready(() => {
                this.$wechat.hideMenuItems({
                    menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                });
            })
        }
    },
    methods: {
        // 获取商品规格
        getOptionName(option){
            let str = '',custom_option_names = this.custom_option_names,
                option_txt_arr = this.option_txt_arr
            for(let goodsOpt in option) {
                for(let k in custom_option_names) {
                   if(goodsOpt.toLowerCase() == k) {
                       str += custom_option_names[k]+":"
                       for(let v in custom_option_names) {
                            if(v===option[goodsOpt]){
                                str += custom_option_names[v]+";"
                            } else if(option_txt_arr.indexOf(option[goodsOpt])==-1){
                                str += option[goodsOpt] + ";"
                                break;
                           }
                       } 
                       break;
                   }
                } 
            }
            return str
        },
        selectGood(index) {
            let goodslist = this.goodslist
            goodslist[index].checked = !goodslist[index].checked
            if(!goodslist[index].checked) {
                this.isSelectAll = false
            }
            this.goodslist = goodslist
        },
        getCart(){
            this.$axios.get('/checkout/cart/index').then((res)=>{
                if(res.data.code === 200) {
                    let cart_info = res.data.data.cart_info
                    let goodslist = cart_info && cart_info.products
                    this.custom_option_names = cart_info && cart_info.custom_option_names
                    if(goodslist) {
                        goodslist.forEach((item,index)=>{
                            item.checked = true
                        })
                        this.goodslist = goodslist
                    } else {
                        this.goodslist = []
                    }
                    // 保存可以转换为汉字的规格属性值
                    if(this.custom_option_names) {
                        let attr = []
                        for(let i in cart_info.custom_option_names) {
                            attr.push(i)
                        }
                        this.option_txt_arr = attr
                    }
                    this.ready = true && global.ready
                    let len = goodslist === null?0:goodslist.length
                    let origin_arr = res.data.data.cart_info.products
                    for(let i in origin_arr) {
                        origin_products[origin_arr[i].product_id] = origin_arr[i].qty
                    }
                    this.saveCartLen(len)
                }
            })
        },
        minusgoods(good) {
            let _this = this
            if (good.qty > 1) {
                good.qty--;
                this.updateCart(good,"less_one")
            } else if(good.qty === 1){
                this.$vux.confirm.show({
                    content:'是否从购物车删除该商品',
                    onConfirm () {
                        _this.updateCart(good,"remove")
                    }
                })
            }
        },
        inputChange(val,item) {
            let params = Qs.stringify({
                product_id:item.product_id,
                custom_option:Qs.stringify(item.custom_option_info),
                qty:val
            })
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                if(!val) {
                    this.$vux.toast.show({
                        text:"商品不能为0",
                        type: 'warn'
                    })
                    return false
                }
                this.$axios.post('/checkout/cart/add',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.getCart()
                    }
                })
            }, 1000)
        },
        addgoods(good) {
            good.qty++
            this.updateCart(good,"add_one")
        },
        updateCart(goods,up_type){
            let params = Qs.stringify({
                up_type:up_type,
                item_id:String(goods.item_id)
            })
            
            this.$axios.post('/checkout/cart/updateinfo',params).then((res)=>{
                if(res.data.code === 200) {
                    this.getCart()
                }
            })
        },
        formatCart(){
            let goodslist = this.cartInfo.products
            if(!goodslist) return
            goodslist.forEach((item)=>{
                item.checked = true
            })
            this.goodslist = goodslist
        },
        selectAll(){
            this.isSelectAll = !this.isSelectAll
            let goodslist = this.goodslist
            goodslist.forEach((item,index)=>{
                item.checked = this.isSelectAll
            })
        },
        // 结算
        submit(){
            let goodslist = this.goodslist
            let ret = []
            if(this.total <= 0) {
                console.log(this.total)
                this.$vux.toast.show({
                    text:'请至少选择一款商品',
                    type: 'warn'
                })
                return false
            } else {
                goodslist.forEach((item)=>{
                    if(!item.checked) {
                        this.updateCart(item,"remove")
                    }
                })
            }
            
            if(!this.userInfo.nickname) {
                this.$router.push({path:`/login?redirect=/payment`})
                return false
            }
            if(!this.userInfo.hasInviter) {
                this.$vux.toast.show({
                    text:'绑定邀请人',
                    type:'warn',
                    time:1500
                })
                let timer = setTimeout(()=>{
                    this.$router.push('/inviterList')
                },1500)
                
                return false
            }
            let turnPage = setTimeout(()=>{
                // window.location.href = global.serverHost + '/#/checkout/onepage/pay/'
                window.location.href = global.serverHost + '/checkout/onepage/pay/#/checkout/onepage/pay/'
            },200)
        },
        ...mapMutations({
            saveCartLen: 'SAVE_CARTLEN'
        })
    },
    computed:{
        total() {
            let goodslist = this.goodslist
            let total = 0
            if(!goodslist) return total
            goodslist.forEach(item => {
                if (item.checked) {
                    total += item.qty*item.product_price
                }
            });
            return total.toFixed(2)
        },
        ...mapGetters([
            'userInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    /* 购物车为空 */
    .title
        margin-top 200px
        color $text-ll
    .button
        width 120px
        line-height 50px
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
        border-radius 5px
        color #fff
        font-weight bold
        margin 20px auto 0
    .cart-wrapper
        padding-top 15px
        .goodsItem
            display flex
            height 120px
            margin 0 15px 15px
            background #fff
            padding 10px 0
            box-sizing border-box
            border-radius 5px
            box-shadow 0px 2px 4px 0px rgba(0,0,0,0.05)
            .icon-check,.icon-uncheck
                min-width 20px
            .goods
                display flex
                text-align left
                flex 1
                img
                    margin-left 10px
                    margin-bottom 2px
                    margin-right 10px
                .name
                    color $text-l
                    line-height 25px
                    font-size 18px
                .desc
                    color $text-ll
                    font-size 12px
                    line-height 17.5px
                    height 17.5px
                .info
                    display flex
                    flex-direction column
                    justify-content space-around
                    flex 1
                    &>div
                        display flex
                        align-items center
                        margin-top 13px
                        padding-right 10px
                        justify-content space-between
                        .price
                            color $red
        .control
            position fixed
            display flex
            align-items center
            bottom 0
            width 100%
            background #fff
            line-height 45px
            text-align left
            .icon-check
                margin 12px 10px
                height 20px
            span
                color $text-l
            .checkAll
                flex 1
            .red
                color $red
                margin-right 10px
                background #fff
            .submit
                background $red
                color #fff
                width 100px
                text-align center
</style>