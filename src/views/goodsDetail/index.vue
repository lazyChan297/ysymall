<template>
    <div class="goodsDetail-wrapper">
        <section>
            <swiper :options="swiperOption">
                <swiper-slide>
                    <img src="../../common/images/1812.png" alt="" class="slideImg">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../common/images/1812.png" alt="" class="slideImg">
                </swiper-slide>
            </swiper>
            <div class="price-container">
                <span class="price bold">¥39.80</span>
                <span class="oldprice">原价：￥398.00</span>
            </div>
            <div class="desc-container">
                <p class="name bold">姜汁洗发露</p>
                <p class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</p>
            </div>
            <div class="title bold">详情页</div>
            <div class="tabbar">
                <div>
                    <div class="icon icon-shopcart"></div>
                    <div class="text">购物车</div>
                </div>
                <div class="yellow bold" @click="showSlide(true)">加入购物车</div>
                <div class="red bold" @click="showSlide(false)">购买</div>
            </div>
        </section>
        <transition name="slide">
            <div class="slide-wrapper" v-show="isShow">
                <div class="goods-content">
                    <img src="../../common/images/1812.png" alt="" width="100" height="100">
                    <div class="text">
                        <p class="name">洗发露</p>
                        <p class="price">¥39.80</p>
                        <p class="reset">
                            库存（2435件）
                        </p>
                    </div>
                    <div class="icon icon-close" @click="isShow = false"></div>
                </div>
                <div class="goods_options_container">
                <div class="goods_options" v-for="(item,attr) in custom_option_attr">
                    <div class="label">
                        <span class="black">{{attr}}</span>
                        <span class="gray">(请选择{{attr}})</span>
                    </div>
                    <ul class="value">
                        <li v-for="(c_item,index) in item">{{c_item.label}}</li>
                    </ul>
                </div>
                </div>
                <div class="cell">
                    <span>购买数量</span>
                    <cart-control></cart-control>
                </div>
                <div class="submit bold" @click="submit">{{submitText}}</div>
            </div>
        </transition>
        <div class="mask" v-show="isShow"></div>
    </div>
</template>
<script>
import {detail} from '@/views/goodsDetail/json'
console.log(detail)
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CartControl from '@/components/cartcontrol/index'
// console.log(custom_option)
export default {
    data() {
        return {
            // 幻灯片的配置项
            swiperOption: {
                notNextTick: true,
                pagination: '.swiper-pagination',
                paginationType : 'fraction',
                paginationClickable: true,
                loop: false,
                autoplay: 0,
                autoplayDisableOnInteraction: false      
            },
            isShow: false,
            submitText: '',
            custom_option:[],                   // 产品的custom_option属性，传递过来的custom option，img和price都已经处理。
            custom_option_attr:{},              // 处理后的 custom_option 数组，这个数组用于生成显示
            custom_option_show_as_img:'',       // 那个属性 当做图片显示
            custom_option_selected_attr:{},     // 选中的属性，以及对应的值
            custom_option_active_attr:{},       // active的属性，以及对应的值（active代表有相应的库存）
            // custom_option_active_attr: {当前选择的label:value}
            ustom_option_all_select:0,         // 当把所有的custom option选择完成后(譬如颜色尺码都选择完成)，这个值将会被设置成1。
            custom_option_add_price:0,          // 当把所有的custom option选择完成后，这个custom option 附加或减少的价格值，这个值用来计算这个custom option对应的最终价格
            custom_option_selected_sku:'',      // 当把所有的custom option选择完成后，这个将会设置当前选择的custom option sku。
            custom_option_show_as_img: ''
        }
    },
    components: {
        swiper,
        swiperSlide,
        CartControl
    },
    mounted() {
        this.custom_option = detail.custom_option
        this.custom_option_show_as_img = detail.custom_option_showImg_attr
        this.getCustomOptionAttr()
    },
    methods: {
        showSlide(flag) {
            if(flag) {
                this.submitText = '加入购物车'
            } else {
                this.submitText = '购买'
            }
            this.isShow = true
        },
        submit() {
            if (this.submitText === '购买') {
                this.$router.push('/payment')
            }
        },
        getCustomOptionAttr() {
            var noAttrArr = ['price','qty','sku','image'];
            var co_arr = {};
            var custom_option = this.custom_option;
            // =======源码实现
            // if(custom_option){
            //     for(var x in custom_option){
            //         if(x){
            //             var option = custom_option[x];
            //             if(option){
            //                 for(var attr in option){
            //                     // 筛选出'price','qty','sku','image' 以外的值
            //                     if(attr && (noAttrArr.indexOf(attr) <= -1)){
            //                         // 某个属性下可选择的值
            //                         var value = option[attr];
            //                         console.log('value:-------',value)
            //                         var kv = {
            //                             key:value,
            //                             label:value
            //                         };
            //                         // 状态
            //                         kv.status = "";  //no_active
            //                         kv.class = "";
            //                         if(this.custom_option_selected_attr[attr] == value ){
            //                             kv.status = " current ";
            //                             kv.class += " current ";
            //                         }
            //                         var co_active = this.custom_option_active_attr[attr];
            //                         if(!co_active){
            //                             kv.class += " active_v ";
            //                         }else{
            //                             if(co_active.indexOf(value) > -1  ){
            //                                 kv.class += " active_v ";
            //                             }else{
            //                                 kv.class += " no_active ";
            //                             }
            //                         }
            //                         //this.custom_option_selected_attr:{},       // 选中的属性，以及对应的值
            //                         //this.custom_option_active_attr:{},   
                                    
            //                         if(attr == this.custom_option_show_as_img){
            //                             kv.image = option.image;
            //                         }
            //                         if(co_arr[attr]){
            //                             var hasIt = 0;
            //                             for(var y in co_arr[attr]){
            //                                 var one = co_arr[attr][y];
            //                                 var key = one.key;
            //                                 console.log('key---------',key)
            //                                 if(key == value){
            //                                     hasIt = 1;
            //                                     break;
            //                                 }
            //                             }
            //                             if(hasIt == 0){
            //                                 co_arr[attr].push(kv);
            //                             }
            //                         }else{
            //                             co_arr[attr] = [kv];
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     var all_select = 1;
            //     console.log(attr)
            //     for(attr in co_arr){
            //         if(!this.custom_option_selected_attr[attr]){
            //             all_select = 0;
            //             break;
            //         }
            //     }
            //     this.custom_option_all_select = all_select;
            //     console.log('^^^^^^^^^^^^^^:'+all_select);
            //     this.custom_option_attr = co_arr;
            //     console.log(this.custom_option_attr);
            //     console.log('66666666');
            // }

            // my
            if(custom_option) {
                for(let x in custom_option) {
                    if (x) {
                        let option = custom_option[x]
                        for (var attr in option) {
                            if (attr&&(noAttrArr.indexOf(attr) <= -1)) {
                                let value = option[attr] //选项N中的可选值M
                                let kv = {
                                    key:value,
                                    label: value
                                }
                                //判断选项是否已存在co_arr
                                    if (co_arr[attr]) {
                                        var hasIt = 0;
                                        for (let alreadyOption in co_arr[attr]) {
                                            let one = co_arr[attr][alreadyOption]
                                            let key = one.key
                                            if (key == value) {
                                                hasIt = 1
                                                break;
                                            }
                                        }
                                        if (hasIt == 0) {
                                            co_arr[attr].push(kv)
                                        }
                                    } else {
                                        co_arr[attr] = [kv]
                                    }
                            }
                            
                        }
                    }
                }
                this.custom_option_attr = co_arr;
            }
        }
    }

}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    @import "../../common/stylus/transition.styl";
    .price-container
        line-height 50px
        padding-left 15px
        height 50px
        background #fff
        text-align left
        .price
            color $red
            font-size 24px
            
        .oldprice
            color $text-lll
            font-size 14px
            text-decoration line-through
    .desc-container
        padding 0 15px 8px
        background #fff
        margin-bottom 10px
        .name
            font-size 22px
            color $text-l
            line-height 30px
            margin-bottom 5px
            text-align left
        .desc
            color $text-ll
            font-size 14px
            line-height 20px
            text-align left
    .title
        color $text-l
        padding-left 15px
        line-height 50px
        background #fff
        text-align left
    .slideImg
        width 100%
    .tabbar
        position fixed
        display flex
        width 100%
        height 50px
        line-height 50px
        left 0
        bottom 0
        background #fff
        &>div
            flex 1
            text-align center
            color #fff
            .text
                color $text-lll
                font-size 12px
                line-height 20px
    /* 弹窗 */
    .slide-wrapper
        position absolute
        width 100%
        bottom 0
        background #fff
        border-top-left-radius 8px
        border-top-right-radius 8px
        padding 0 15px
        box-sizing border-box
        text-align left
        z-index 2
        .goods-content
            display flex
            border-bottom 1px solid $line
            .text
                flex 1
                margin-left 10px
                .name
                    color $text-l
                    margin-bottom 24px
                .price
                    color $red
                    margin-bottom 5px
                .reset
                    color $text-lll
        .goods_options_container
            max-height 300px
            overflow scroll
        .goods_options
            .label
                line-height 50px
                .black
                    color $text-l
                .gray
                    color $text-ll
                    font-size 14px
            .value
                overflow hidden
                li
                    float left
                    width 130px
                    background #efefef
                    color $text-l
                    text-align center
                    line-height 28px
                    border-radius 5px
                    font-size 14px
                    margin-right 10px
                    margin-bottom 10px
        .cell
            display flex
            justify-content space-between
            height 50px
            align-items center
        .submit
            margin 10px 0
            background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
            box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
            border-radius 5px 
            color #fff
            text-align center
            line-height 50px
    /* 遮罩 */
    .mask
        position fixed
        top 0
        bottom 0
        width 100%
        background rgba(0,0,0,0.3)
        z-index 1
</style>