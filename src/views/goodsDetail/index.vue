<template>
    <div class="goodsDetail-wrapper">
        <section v-if="goodsDetail">
            <swiper :options="swiperOption" v-if="goodsDetail.image_detail">
                <swiper-slide  v-for="(img,index) in goodsDetail.image_detail" :key="index">
                    <img :src="img" alt="" class="slideImg">
                </swiper-slide>
            </swiper>
            <div class="price-container" v-if="goodsDetail.price_info">
                <span class="price bold">
                    ¥{{goodsDetail.price_info.special_price?goodsDetail.price_info.special_price.value:goodsDetail.price_info.price.value}}
                </span>
                <span class="oldprice" v-show="goodsDetail.price_info.special_price">原价：￥{{goodsDetail.price_info.price.value}}</span>
            </div>
            <div class="desc-container">
                <p class="name bold">{{goodsDetail.name}}</p>
                <!-- <p class="desc">{{goodsDetail.desc}}</p> -->
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
                        <p class="name">{{goodsDetail.name}}</p>
                        <p class="price" v-if="goodsDetail.price_info">¥{{goodsDetail.price_info.special_price?goodsDetail.price_info.special_price.value:goodsDetail.price_info.price.value}}</p>
                        <p class="reset">
                            库存（2435件）
                        </p>
                    </div>
                    <div class="icon icon-close" @click="isShow = false"></div>
                </div>
                <div class="goods_options_container">
                <div class="goods_options" v-for="(item,attr) in custom_option_attr">
                    <div class="label">
                        <span class="black">{{attr=='my_color'?'颜色':'尺寸'}}</span>
                        <span class="gray">(请选择{{attr=='my_color'?'颜色':'尺寸'}})</span>
                    </div>
                    <ul class="value">
                        <li v-for="(c_item,index) in item" 
                            :class="c_item.class"
                            @click="selectCustomOption(attr,c_item.key)">{{c_item.key}}</li>
                    </ul>
                </div>
                </div>
                <div class="cell">
                    <span>购买数量</span>
                    <cart-control :good="goodsDetail" @minus="minus" @add="add"></cart-control>
                </div>
                <div class="submit bold" @click="addGoodsToCart">{{submitText}}</div>
            </div>
        </transition>
        <div class="mask" v-show="isShow"></div>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CartControl from '@/components/cartcontrol/index'
import Qs from 'qs'
export default {
    data() {
        return {
            product_id:null,
            goodsDetail:{},
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
            custom_option_show_as_img: '',
            custom_option_checkAttr: [] // 保存所有应该提交的key
        }
    },
    components: {
        swiper,
        swiperSlide,
        CartControl
    },
    created(){
        // this.product_id = this.$route.params.id
        this.product_id = '57bac5c6f656f2940a3bf570'
        this.getGoodsDetail(this.product_id)
    },
    methods: {
        getGoodsDetail(id){
            this.$axios.get('/catalog/product/index',{params:{product_id:id}}).then((res)=>{
                this.goodsDetail = Object.assign({qty:1},res.data.data.product) 
                this.custom_option = res.data.data.product.custom_option
                this.getCustomOptionAttr()
            })
        },
        showSlide(flag) {
            if(flag) {
                this.submitText = '加入购物车'
            } else {
                this.submitText = '购买'
            }
            this.isShow = true
        },
        // 减少
        minus(){
            if(this.goodsDetail.qty>0){
                this.goodsDetail.qty = this.goodsDetail.qty -1
            }
        },
        add(){
            this.goodsDetail.qty = this.goodsDetail.qty +1
        },
        isSubmit() {
            let selected_attr = []
            for (let i in this.custom_option_selected_attr) {
                selected_attr.push(i)
            }
            this.selected_attr = selected_attr
            for (let i in this.custom_option_attr) {
                if(selected_attr.indexOf(i) <= -1) {
                    // alert(`请选择${i}`)
                    this.$vux.toast.show({
                        text:`请选择${i}`,
                        type: 'warn'
                    })
                    return false;
                }
            }
            return true
        },
        // 判断是否可选
        isActiveSelectCustomOption(selectAttr,selectVal) {
            // 获取已选选项
            let select_attr = Object.assign({},this.custom_option_selected_attr)
            // 添加当前点击选项
            select_attr[selectAttr] = selectVal
            // 可选组合
            let custom_option = this.custom_option;
            for(let c in custom_option) {
                if(c) {
                    let flag = true
                    let option = custom_option[c]
                    for (let attr in select_attr) {
                        // 如果可选组合中相同选项的值和已选选项中的值相同,则可以点击
                        if (option[attr] != select_attr[attr]) {
                            flag = false
                            break;
                        }
                    }
                    if(flag) {
                        return true
                    }
                }
            }
            return false
        },
        selectCustomOption(selectAttr,selectVal) {
            // 判断该选项是否可选
            if (!this.isActiveSelectCustomOption(selectAttr,selectVal)) {
                return;
            }
            // 如果已经存在勾选则取消选择
            if (this.custom_option_selected_attr[selectAttr] == selectVal) {
                // 如果已选则取消选择
                delete this.custom_option_selected_attr[selectAttr]
            } else {
                // 不存在则添加选择
                this.custom_option_selected_attr[selectAttr] = selectVal
            }
            // 可以选择的选项
            var active_attr = {};
            var other_tj = {};
            var select_attr = [];
            for(var attr1 in this.custom_option_selected_attr){
                var tj = {};
                //把已选选项名放入数组
                select_attr.push(attr1); 
                // 已选选项值
                var val1 = this.custom_option_selected_attr[attr1];
                other_tj[attr1] = val1;
                for(var attr2 in this.custom_option_selected_attr){
                    var val2 = this.custom_option_selected_attr[attr2];
                    if(val1 != val2){
                        // 获取同一个选项,其他的值
                        tj[attr2] = val2;
                    }
                }
                // tj 就是除去本元素，其他选中的属性的 k v 对象。
                // 下面 得到本属性中active的值有哪些
                // console.log("attr1:"+attr1);
                // console.log('other_tj:',other_tj)
                // console.log('tj:',tj);
                // tj 其他已选， otder_tj 目前选择的
                active_attr[attr1] = this.getActiveCustomOption(tj,attr1);
            }
            for(var attr in this.custom_option_attr){
                if(select_attr.indexOf(attr) == -1){
                    active_attr[attr] = this.getActiveCustomOption(other_tj,attr);
                }
            }
            this.custom_option_active_attr = active_attr;
            this.reflushCustomOption();
        },
        // 更新视图选项
        reflushCustomOption() {
            this.getCustomOptionAttr()
        },
        // 获取可选选项
        getActiveCustomOption: function(tj,attr1){
            var activeArr = [];
            var custom_option = this.custom_option;
            // 判断tj 是否为空对象
            if(JSON.stringify(tj) != '{}'){
                for(var x in custom_option){
                    if(x){
                        var option = custom_option[x];
                        var c = 1;
                        for(var tj_attr in tj){
                            var tj_val = tj[tj_attr];
                            if(option[tj_attr] != tj_val){
                                c = 0;
                                break;
                            }
                        }
                        if(c){
                            if(activeArr.indexOf(option[attr1]) == -1){
                                activeArr.push(option[attr1]);
                            }
                        }
                    }
                }
            }else{
                // tj is empty
                for(var x in custom_option){
                    if(x){
                        var option = custom_option[x];
                        if(activeArr.indexOf(option[attr1]) == -1){
                            activeArr.push(option[attr1]);
                        }
                    }
                }
            }
            return activeArr;
        },
        // 处理视图显示
        getCustomOptionAttr() {
            var noAttrArr = ['price','qty','sku','image'];
            let custom_option_attr = {};
            let custom_option = this.custom_option;
            for (let o in custom_option) {
                if(o) {
                    let option = custom_option[o]
                    for(let attr in option) {
                        if (attr && (noAttrArr.indexOf(attr) <= -1)) {
                            let value = option[attr]
                            let obj = {
                                key: value
                            }
                            obj.class = "" // current被选中 able可选 disable不可选
                            let option_able = this.custom_option_active_attr[attr]
                            // 是否被选中
                            if (this.custom_option_selected_attr[attr] == value) {
                                obj.class += " current "
                            }
                            if (!option_able) {
                                obj.class += " active_v "
                            } else {
                                if (option_able.indexOf(value) > -1) {
                                    obj.class += " active_v "
                                } else {
                                    obj.class += " no_active "
                                }
                            }
                            if(custom_option_attr[attr]) {
                                let flag = true
                                for(let other_option in custom_option_attr[attr]) {
                                    // 如果已经添加过该选项相同的选择
                                    let other = custom_option_attr[attr][other_option]
                                    if(other.key == value) {
                                        flag = false
                                        break;
                                    }
                                }
                                if(flag) {
                                    custom_option_attr[attr].push(obj)
                                }
                            } else {
                                custom_option_attr[attr] = [obj]
                            }
                        }
                    }
                }
            }
            this.custom_option_attr = custom_option_attr
        },
        addGoodsToCart(){
            let valid = this.isSubmit()
            if(!valid) return
            let custom_option = Qs.stringify(this.custom_option_selected_attr)
            let params = Qs.stringify({
                product_id: this.product_id,
                custom_option: custom_option,
                qty:this.goodsDetail.qty
            })
            this.$axios.post('/checkout/cart/add',params).then((res)=>{
                if(res.data.code === 200) {
                    if(this.submitText === '加入购物车') {
                        this.$vux.toast.show({
                            text:'成功加入购物车'
                        })
                        return
                    } else {
                        this.$router.push('/payment')
                    }
                }
            })
            
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
        max-height 375px
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
                    border 1px solid transparent
                    box-sizing border-box
                    &.no_active
                        color #ADAFB6
                    &.current
                        border 1px solid $red
                        color $red
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