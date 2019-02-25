<template>
    <div class="qrcode-wrapper">
        <div class="guide">
            <div class="title">
                <div class="bold">二维码使用指南</div>
                <div class="icon icon-slide" @click="isShowGuide = !isShowGuide"></div>
            </div>
            <transition name="slideDown">
                <div class="slideDown-container" v-show="isShowGuide">
                    <p>1、可选择多张图片，点击“导出图片”按钮，公众号将把所有图片推送给您； </p>
                    <p>2、网站将不定时更新新的图片。</p>
                </div>
            </transition>
        </div>
        <section>
            <div class="img-container" :style="widthStyle" v-for="(item,index) in imglist" @click="checkImg(item)">
                <img :src="item.src" alt="">
                <div class="icon icon-download"></div>
                <span>2</span>
                <div class="checkbox" v-if="item.checked">
                    <div class="icon icon-imgcheck"></div>
                </div>
            </div>
        </section>
        <div class="submit bold">导出图片</div>
    </div>
</template>
<script>
const WRAPPER_WIDTH = window.innerWidth - 46
const IMG_WIDTH = WRAPPER_WIDTH / 3
const MAX = 6
export default {
    data() {
        return {
            imglist: [],
            currentImg: 0,
            isShowGuide: false
        }
    },
    mounted() {
        this.getlist()
    },
    computed: {
        widthStyle() {
            return `width:${IMG_WIDTH}px;height:${IMG_WIDTH}px`
        }
    },
    methods: {
        checkImg(item) {
            if (item.checked === false) {
                if (this.currentImg < MAX) {
                    this.currentImg++
                    item.checked = !item.checked
                } else {
                    this.$vux.toast.show({
                        text: '最多可同时选择6张',
                        type: 'warn'
                    })
                    return 
                }
            } else {
                item.checked = !item.checked
                this.currentImg--
            }
        },
        getlist() {
            let ret = []
            for(let i = 0; i < 10; i++) {
                ret.push({
                    src: 'https://wx2.sinaimg.cn/large/ad98c251gy1fz67lyn0gaj21400qodoe.jpg',
                    checked: false
                })
            }
            this.imglist = ret
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
@import "../../common/stylus/transition.styl";
#app
    background #fff
.qrcode-wrapper
    height 100% 
    overflow hidden
    background #fff !important
    .guide
        position relative
        background #fff
        padding 0 15px
        .title
            position relative
            background #fff
            display flex
            align-items center
            justify-content space-between
            line-height 40px
            border-bottom 1px solid $line
            z-index 2
        .slideDown-container
            position absolute
            left 0
            padding 10px 15px
            background #fff
            z-index 1
            p
                line-height 20px
                text-align left
                margin-bottom 5px
    section
        padding 15px 0 0 15px
        font-size 0
        background #fff
        overflow hidden
    .img-container
        position relative
        float left
        margin-right 8px
        font-size 0
        margin-bottom 8px
        text-align center
        overflow hidden
        &:nth-child(3n)
            margin-right 0
        img 
            height 100%
        span
            font-size 14px
            color $text-lll
            display inline-block
            margin-left 3px
        .checkbox
            position absolute
            right 0
            bottom 0
            width 20px
            height 20px
            background #fff
    .submit
        position fixed
        transform translateX(-50%)
        left 50%
        bottom 20px
        background #fff
        width 290px
        margin 15px auto 0
        text-align center
        height 50px
        line-height 50px
        box-shadow 0px 4px 8px 0px rgba(0,0,0,0.15)
        border-radius 5px
</style>