<template>
    <div class="cart-wrapper">
        <section>
        <div class="goodsItem" v-for="(good,index) in goodslist" @click="selectGood(good)">
            <div class="icon" :class="good.checked?'icon-check':'icon-uncheck'"></div>
            <div class="goods">
                <img src="../../common/images/1812.png" alt="" width="100" height="100">
                <div class="info">
                    <p class="name bold">{{good.name}}</p>
                    <p class="desc">{{good.desc}}</p>
                    <div>
                        <div class="price bold">¥{{good.price}}</div>
                        <cart-control :good="good" @minus="minusgoods(good)" @add="addgoods(good)"></cart-control>
                    </div>
                </div>
            </div>
        </div>
        </section>
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
export default {
    data(){
        return {
            isSelectAll: true,
            goodslist:[
                {
                    name: '姜汁洗发露',
                    quantity:1,
                    price:39.80,
                    desc:'生姜艾叶萃取润发护发精华发根护理、净爽控油',
                    checked: true
                },
                {
                    name: '姜汁洗发露',
                    quantity:1,
                    price:39.80,
                    desc:'生姜艾叶萃取润发护发精华发根护理、净爽控油',
                    checked:true
                }
            ]
        }
    },
    components: {
        CartControl
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
            if (good.quantity >= 1) {
                good.quantity--
            }
        },
        addgoods(good) {
            good.quantity++
        }
    },
    computed:{
        total() {
            let goodslist = this.goodslist
            let total = 0
            goodslist.forEach(item => {
                if (item.checked>=1) {
                    total += item.quantity*item.price
                }
            });
            return total.toFixed(2)
        }
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