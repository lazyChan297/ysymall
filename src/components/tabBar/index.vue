<template>
    <div class="tabBar-wrapper">
        <router-link to="/" tag="div">
            <div class="icon icon-index"></div>
            <p class="bold">首页</p>
        </router-link>
        <router-link to="/found" tag="div">
            <div class="icon icon-found"></div>
            <p class="bold">发现</p>
        </router-link>
        <router-link to="/cart" tag="div">
            <div class="icon icon-cart"></div>
            <span class="cartNum" v-if="cartLen">{{cartLen}}</span>
            <p class="bold">购物车</p>
        </router-link>
        <router-link to="/my" tag="div">
            <div class="icon icon-my"></div>
            <p class="bold">我的</p>
        </router-link>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    data(){
        return {
            cartLen:null
        }
    },
    mounted(){
        this.getCartLen()
    },
    computed:{
        ...mapGetters([
            'cartInfo'
        ])
    },
    methods:{
        getCartLen(){
            this.$axios.get('/checkout/cart/index').then((res)=>{
              if(res.data.code === 200) {
                  console.log('....')
                  console.log(res)
                  let data = res.data.data
                  if(data.cart_info){
                      this.cartLen = data.cart_info.products.length
                  }
                //   this.saveCartInfo(data.cart_info)    
              }
            })
        },
        ...mapActions({
            saveCartInfo:'SAVE_CARTINFO'
        })
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl'
    .tabBar-wrapper
        position fixed
        display flex
        bottom 0
        width 100%
        background #fff
        height 50px
        box-shadow 0px -1px 2px 0px rgba(0,0,0,0.1)
        &>div
            position relative
            flex 1
            text-align center
            p
                font-size 12px
                color $text-lll
                line-height 17px
            .icon
                height 24px
                width 24px
                margin-top 4px
            &.router-link-exact-active
                p
                    color $green
        .cartNum
            color #fff
            background $red
            display block
            position absolute
            border-radius 50%
            width 20px
            height 20px
            text-align center
            line-height 20px
            left 50%
            top 0px
</style>