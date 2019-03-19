<template lang="html">
    <div class="wrapper" ref="wrapper">
      <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props:{
        listenScroll:{
            type: Boolean,
            default: true
        },
        probeType: {
            type: Number,
            default: 3
        },
        click:{
            type: Boolean,
            default: true
        },
        scrollX:{
            type: Boolean,
            default: false
        },
        data:{
            type: Array,
            default:null
        }
    },
    mounted(){
        this._initScroll()
    },
    methods:{
        _initScroll() {
            if (!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                scrollX:this.scrollX
            })
            if (this.listenScroll) {
                let _this = this
                this.scroll.on('scroll', (pos) => {
                _this.$emit('scroll', pos)
                })
            }
            // 开启上拉加载更多
            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                    this.$emit('scrollToEnd')
                }
                })
            }
        },
        // 为了防止数据没有请求完scroll开始渲染
        refresh() {
            this.scroll && this.scroll.refresh()
        }
    },
    watch:{
        data(){
            setTimeout(()=>{
                this.refresh()
            }, 20) 
        }
    }
}
</script>