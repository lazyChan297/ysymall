<template>
    <div class="cart-wrapper">
        <section>
            <div class="goodsItem" v-for="(good,index) in goodslist" @click="selectGood(good)">
                <div class="icon" :class="good.checked?'icon-check':'icon-uncheck'"></div>
                <div class="goods">
                    <img :src="good.img_url" alt="" width="100" height="100">
                    <div class="info">
                        <p class="name bold">{{good.name}}</p>
                        <p class="desc">{{good.desc}}</p>
                        <div>
                            <div class="price bold">¥{{good.product_price}}</div>
                            <cart-control :good="good" @minus="minusgoods(good)" @add="addgoods(good)"></cart-control>
                        </div>
                    </div>
                </div>
            </div>
        </section>
         <!-- <x-dialog v-model="showDialog">
            <div class="dialog-container">
                <div class="content">验证码无效</div>
                <div class="buttonGroup" @click="showDialog = false">确认</div>
            </div>
        </x-dialog> -->
        <div class="control">
            <div class="icon" :class="isSelectAll?'icon-checkall':'icon-uncheckall'"></div>
            <span class="checkAll">全选</span>
            <div>
                <span>合计：</span>
                <span class="red">¥{{total}}</span>
            </div>
            <div class="submit bold">
                结算
            </div>
        </div>
    </div>
</template>
<script>
import CartControl from '@/components/cartcontrol/index'
import {mapGetters, mapActions} from 'vuex'
import Qs from 'qs'
export default {
    data(){
        return {
            isSelectAll: true,
            goodslist:[],
            cart_info:{},
            showDialog:false
        }
    },
    components: {
        CartControl
    },
    created(){
        
    },
    mounted(){
        this.getCart()
    },
    methods: {
        selectGood(good) {
            good.checked = !good.checked
            let checkAll_flag = true
            for(let i in this.goodslist) {
                if (this.goodslist[i].checked === false) {
                    this.isSelectAll = false
                    checkAll_flag = false
                }
            }
            if (checkAll_flag) {
                this.isSelectAll = true
            }
        },
        minusgoods(good) {
            let _this = this
            if (good.qty > 1) {
                good.qty--
            } else if(good.qty === 1){
                this.$vux.confirm.show({
                    content:'是否从购物车删除该商品',
                    onCancel () {
                       
                    },
                    onConfirm () {
                        _this.addGoodsToCart(good)
                    }
                })
            }
        },
        addgoods(good) {
            good.qty++
        },
        addGoodsToCart(goods){
            // let params = Qs.stringify({
            //     product_id: goods.product_id,
            //     custom_option: custom_option,
            //     qty:this.goodsDetail.qty
            // })
            // this.$axios.post('/checkout/cart/add',params).then((res)=>{
            //     if(res.data.code === 200) {
            //         if(this.submitText === '加入购物车') {
            //             this.$vux.toast.show({
            //                 text:'成功加入购物车'
            //             })
            //             return
            //         } else {
            //             this.$router.push('/payment')
            //         }
            //     }
            // })
            console.log(goods)
        },
        getCart() {
            this.$axios.get('/checkout/cart/index').then((res)=>{
                if(res.data.code === 200) {
                    let data = res.data.data
                    let goodslist = data.cart_info.products
                    if(!data.cart_info) return
                    goodslist.forEach((item)=>{
                        item.checked = true
                    })
                    this.goodslist = goodslist
                    this.cart_info = data.cart_info
                    this.saveCartInfo(data.cart_info)
                }
            })
        },
        ...mapActions([
            'saveCartInfo'
        ])
    },
    computed:{
        total() {
            let goodslist = this.goodslist
            let total = 0
            goodslist.forEach(item => {
                if (item.checked) {
                    total += item.qty*item.product_price
                }
            });
            return total.toFixed(2)
        },
        ...mapGetters([
            'cartInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
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
            .goods
                display flex
                text-align left
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
                .info
                    &>div
                        display flex
                        align-items center
                        margin-top 13px
                        padding-right 15px
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