<template>
    <div class="goodsDetail-wrapper">

        <div ref="goodsDetailScroll" class="goodsDetail-scroll">
            
            <section v-if="goodsDetail" class="goodsDetail-container">
                <swiper :options="swiperOption" v-if="goodsDetail.thumbnail_img">
                    <swiper-slide  v-for="(img,index) in goodsDetail.thumbnail_img" :key="index">
                        <img v-lazy="img" alt="" class="slideImg">
                    </swiper-slide>
                </swiper>
                <!-- <span>{{textarr.indexOf(1)}}</span> -->
                <!-- <span>{{custom_option_names.indexOf('color')}}</span> -->
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
                <div class="goodsDetail" v-if="goodsDetail.image_detail">
                    <div v-for="(img,imgindex) in goodsDetail.image_detail"> 
                        <img v-lazy="img" alt=""  class="goodsImg">
                    </div> 
                </div>
            </section>
        </div>
        <div class="tabbar">
            <div class="icon-container">
                <router-link to="/" tag="div">
                    <div class="icon icon-gobackIndex"></div>
                    <div class="text">首页</div>
                </router-link>
                <router-link to="/cart" tag="div">
                    <div class="icon icon-shopcart"></div>
                    <div class="text">购物车</div>
                    <span class="cartLen" v-if="cartLen">{{cartLen}}</span>
                </router-link>
            </div>
            <div class="yellow bold" @click="showSlide(true)">加入购物车</div>
            <div class="red bold" @click="showSlide(false)">购买</div>
        </div>
        <transition name="slide">
            <div class="slide-wrapper" v-show="isShow">
                <div class="goods-content">
                    <div class="imgbox" v-if="goodsDetail.thumbnail_img"><img :src="select_img" alt="" width="100"></div>
                    <div class="text">
                        <p class="name">{{goodsDetail.name}}</p>
                        <p class="price" v-if="goodsDetail.price_info">¥{{goodsDetail.price_info.special_price?goodsDetail.price_info.special_price.value:goodsDetail.price_info.price.value}}</p>
                        <!-- <p class="reset">
                            库存（2435件）
                        </p> -->
                    </div>
                    <div class="icon icon-close" @click="isShow = false"></div>
                </div>
                <div class="goods_options_container">
                <div class="goods_options">
                    <!-- <div class="label">
                        <span class="black">{{item.name}}</span>
                        <span class="gray">(请选择{{item.name}})</span>
                    </div> -->
                    <!-- <ul class="value">
                        <li v-for="(c_item,index) in item.arr" 
                            :class="c_item.class"
                            @click="selectCustomOption(attr,c_item.key)">{{c_item.text || c_item.key}}</li>
                    </ul> -->
                    <!-- <div class="label">
                        <span class="black">请选择规格</span>
                        <span class="gray">(请选择{{item.name}})</span>
                    </div> -->
                    <ul class="value" >
                        <li v-for="(item,attr) in custom_option_attr" 
                            @click="_selectCustomOption(item)"
                            :class="item.class">{{item.name}}</li>
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
        <div class="mask" v-show="isShow" @click="isShow = false"></div>
    </div>
</template>
<script>
const env = process.env.NODE_ENV
import Scroll from '@/base/scroll/index'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CartControl from '@/components/cartcontrol/index'
import {mapGetters, mapMutations} from 'vuex'
import Qs from 'qs'
export default {
    data() {
        return {
            textarr:[1,2],
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
            custom_option_selected_attr:null,     // 选中的属性，以及对应的值
            custom_option_active_attr:{},       // active的属性，以及对应的值（active代表有相应的库存）
            // custom_option_active_attr: {当前选择的label:value}
            ustom_option_all_select:0,         // 当把所有的custom option选择完成后(譬如颜色尺码都选择完成)，这个值将会被设置成1。
            custom_option_add_price:0,          // 当把所有的custom option选择完成后，这个custom option 附加或减少的价格值，这个值用来计算这个custom option对应的最终价格
            custom_option_selected_sku:'',      // 当把所有的custom option选择完成后，这个将会设置当前选择的custom option sku。
            custom_option_show_as_img: '',
            custom_option_checkAttr: [], // 保存所有应该提交的key
            custom_option_names:[], // 显示选项中文
            custom_option_lens:0, //可选规格数
            select_img:'',//当前选中商品img
            inviter:'',
            default_img:''
        }
    },
    components: {
        swiper,
        swiperSlide,
        CartControl,
        Scroll
    },
    created(){
        this.product_id = this.$route.params.id
        // this.product_id = '57bac5c6f656f2940a3bf570'
        // this.getGoodsDetail(this.product_id)
        this.hasInviter(this.product_id)
    },
    computed:{
        ...mapGetters([
            'cartLen'
        ])
    },
    mounted() {
        
    },
    methods: {
        // 返回首页
        goBack(){
            this.$router.push({path:'/'})
        },
        hasInviter(id){
            let inviter = decodeURIComponent((new RegExp('[?|&]inviter='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
            if(inviter){
                this.inviter = inviter
                this.getGoodsDetail(id,inviter)
            } else {
                this.getGoodsDetail(id)
            }
        },
        getGoodsDetail(id,inviter){
            this.$axios.get('/catalog/product/index',{params:{product_id:id,inviter:inviter}}).then((res)=>{
                if(res.data.code === 200) {
                    this.goodsDetail = Object.assign({qty:1},res.data.data.product) 
                    this.custom_option = res.data.data.product.custom_option
                    this.custom_option_names = res.data.data.product.custom_option_names
                    this.select_img = this.goodsDetail.thumbnail_img[0]
                    this.default_img = this.goodsDetail.thumbnail_img[0]
                    // this.getCustomOptionAttr()
                    this._getCustomOptionAttr()
                    this.$refs.goodsDetailScroll.refresh()
                    // 分享
                    if(env == 'production') {
                        this.$wechat.ready(() => {
                            this.$wechat.onMenuShareTimeline({
                                title: res.data.data.wechat.shareTimeline.title,
                                link:res.data.data.wechat.shareTimeline.link,
                                imgUrl: res.data.data.wechat.shareTimeline.imgUrl
                            })

                            this.$wechat.onMenuShareAppMessage({
                                title: res.data.data.wechat.shareAppMessage.title,
                                link:res.data.data.wechat.shareAppMessage.link,
                                imgUrl: res.data.data.wechat.shareAppMessage.imgUrl,
                                desc:res.data.data.wechat.shareAppMessage.desc
                            })
                        })
                    }
                }
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
        // 获取购物车信息
        getCart(){
            this.$axios.get('/checkout/cart/index').then((res)=>{
                if(res.data.code === 200) {
                    let cart_info = res.data.data.cart_info
                    if (cart_info) {
                        this.saveCartLen(cart_info.products.length)
                    }
                }
            })
        },
        add(){
            this.goodsDetail.qty = this.goodsDetail.qty +1
        },
        isSubmit() {
            // ======各种属性分开选择
            // let selected_attr = []
            // for (let i in this.custom_option_selected_attr) {
            //     selected_attr.push(i)
            // }
            // this.selected_attr = selected_attr
            // for (let i in this.custom_option_attr) {
            //     if(selected_attr.indexOf(i) <= -1) {
            //         this.$vux.toast.show({
            //             text:`请选择${this.custom_option_attr[i].name}`,
            //             type: 'warn'
            //         })
            //         return false;
            //     }
            // }
            // return true
            // ======各种属性组合在一起
            let selectAttr = this.custom_option_selected_attr
            if(this.custom_option.length === 0){
                return true
            }
            
            if(!selectAttr) {
                this.$vux.toast.show({
                    text:`请选择商品规格`,
                    type: 'warn'
                })
                return false
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
        _selectCustomOption(selectVal){
            // 只有一个必选选项
            if (selectVal.required) return false
            let custom_option_attr = this.custom_option_attr
            if(!selectVal.class) {
                for(let i in custom_option_attr) {
                    custom_option_attr[i].class = ''
                }
                this.custom_option_attr = custom_option_attr
                selectVal.class += " current "
                this.select_img = selectVal.value.image
                let value = selectVal.value
                let obj = {}
                for(let key in value) {
                    if(key !== 'image'){
                        obj[key] = value[key]
                    }
                }
                this.custom_option_selected_attr = obj
            } else {
                selectVal.class = ''
                this.custom_option_selected_attr = null
                this.select_img = this.default_img
            }
            
            
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
            if(this.custom_option_lens <= 1) return
            // 确保已经选了全部规格
            if(Object.keys(this.custom_option_selected_attr).length == this.custom_option_lens) {
                for(let n in this.custom_option_selected_attr) {
                    for(let i in this.custom_option) {
                        if(i.indexOf(this.custom_option_selected_attr[n])<= -1) {
                            continue
                        } else {
                            this.select_img = this.custom_option[i].image
                        }
                    } 
                }
            }
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
        _getCustomOptionAttr(){
            let noAttrArr = ['price','qty','sku'];
            let custom_option = this.custom_option
            let custom_option_names = this.custom_option_names
            let custom_option_arr = []
            for(let a in custom_option) {
                if(a) {
                    let arrText = a.split('-')
                    // if(custom_option[a].content) {
                    //     arrText = [custom_option[a].content]
                    // }
                    // if(custom_option[a].volume) {
                    //     arrText = [custom_option[a].volume]
                    // }
                    let arrLen = arrText.length
                     let str = '',obj = {}
                    for(let b in arrText) {
                        if(custom_option_names.hasOwnProperty(arrText[b])){
                            str += custom_option_names[arrText[b]]
                        } else {
                            str += arrText[b]
                        }
                    }
                    let option = custom_option[a]
                    for(let d in option) {
                        if(noAttrArr.indexOf(d)<=-1) {
                            obj[d] = option[d]
                        }
                    }
                    custom_option_arr.push({name:str,value:obj})
                }
            }
            if(custom_option_arr.length === 1) {
                custom_option_arr[0].class = ' current '
                this.custom_option_selected_attr = custom_option_arr[0].required = true
            }
            this.custom_option_attr = custom_option_arr
            console.log(this.custom_option_attr)
        },
        // 处理视图显示
        getCustomOptionAttr() {
            let noAttrArr = ['price','qty','sku','image'];
            let custom_option_attr = {};
            let custom_option = this.custom_option;
            let custom_option_names = this.custom_option_names
            let custom_option_lens = this.custom_option_lens
            let custom_option_group_arr = []
            for (let o in custom_option) {
                if(o) {
                    let option = custom_option[o]
                    for(let attr in option) {
                        if (attr && (noAttrArr.indexOf(attr) <= -1)) {
                            let value = option[attr]
                            let obj = {
                                key: value
                            }
                           
                            for(let kt in custom_option_names) {
                                if (kt === value) {
                                    obj.text = custom_option_names[kt]
                                    break
                                }
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
                                for(let other_option in custom_option_attr[attr]['arr']) {
                                    // 如果已经添加过该选项相同的选择
                                    let other = custom_option_attr[attr]['arr'][other_option]
                                    if(other.key == value) {
                                        flag = false
                                        break;
                                    }
                                }
                                if(flag) {
                                    custom_option_attr[attr]['arr'].push(obj)
                                }
                            } else {
                                // custom_option_attr[attr] = [obj]
                                for(let kn in custom_option_names) {
                                    if(kn === attr) {
                                        custom_option_attr[attr] = {
                                            arr:[obj],
                                            name:custom_option_names[kn]
                                        }
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for(let i in custom_option_attr) {
                if(custom_option_attr[i].arr.length ===1) {
                    for(let k in custom_option_attr[i].arr) {
                        custom_option_attr[i].arr[k].class += ' current '
                        this.custom_option_selected_attr[i] = custom_option_attr[i].arr[k].key
                    }
                }
            }
            this.custom_option_attr = custom_option_attr
            this.custom_option_lens = Object.keys(custom_option_attr).length
        },
        addGoodsToCart(){
            let valid = this.isSubmit()
            if(!valid) return
            let custom_option = JSON.stringify(this.custom_option_selected_attr)
            let params = Qs.stringify({
                product_id: this.product_id,
                custom_option: custom_option,
                qty:this.goodsDetail.qty
            })
            
            this.$axios.post('/checkout/cart/add',params,{
                headers:{
                    'fecshop-currency':'CNY',
                    'fecshop-lang':'zh_CN'
                }
            }).then((res)=>{
                if(res.data.code === 200) {
                    this.getCart()
                    if(this.submitText === '加入购物车') {
                        this.$vux.toast.show({
                            text:'成功加入购物车'
                        })
                        this.isShow = false
                        return
                    } else {
                        window.location.href = global.serverHost + '/checkout/onepage/pay/#/checkout/onepage/pay/'
                    }
                }
            })
        },
        ...mapMutations({
            saveCartLen:'SAVE_CARTLEN'
        })
    }

}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    @import "../../common/stylus/transition.styl";
    /* scroll */
    /* .wrapper
        overflow scroll
        height 100% */
    /* 悬浮框 */
    .suspension
        position fixed
        border-radius 50%
        background #fff
        bottom 70px
        right 10px
        padding 10px
        line-height 20px
        border 1px solid $green
        z-index 1
    .goodsDetail-wrapper
        position fixed
        width 100%
        background $bgcolor
        height 100%
        /* overflow scroll */
        top 0
        z-index 3
        .goodsDetail-scroll
            overflow: scroll;
            height: 100%
    .goodsDetail-container
        padding-bottom 50px
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
    .goodsDetail
        margin-bottom 10px
    .goodsImg
        width 100%
        display block
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
        .icon-container
            display flex
            &>div
                position relative
                flex 1
        &>div
            position relative
            flex 1
            text-align center
            color #fff
            .text
                color $text-lll
                font-size 12px
                line-height 20px
            .cartLen
                position absolute
                display block
                color #fff
                background $red
                top 0
                width 20px
                height 20px
                line-height 20px
                border-radius 50%
                left 50%
                
    /* 弹窗 */
    .slide-wrapper
        position fixed
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
            padding-bottom 10px
            padding-top 10px
            .imgbox
                height 100px
                overflow hidden
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
                padding 10px 0
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
            // background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
            // box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
            background:linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%);
            box-shadow:0px 4px 7px 0px rgba(0,132,255,0.3)
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