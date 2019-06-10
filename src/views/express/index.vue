<template>
    <div class="express-wrapper">
        <section>
            <div class="cell">
                <span>快递公司</span>
                <span>{{expressInfo.company}}</span>
            </div>
            <div class="cell">
                <span>快递单号</span>
                <span>{{expressInfo.no}}</span>
            </div>
        </section>
        <ul>
            <li class="express" v-for="(item,index) in expressInfo.details" :key="index">
                <div :class="index==0?'icon icon-car':'icon icon-dot'"></div>
                <div class="text">
                    <p class="expressTxt">
                        {{item.context}}
                    </p>
                    <p class="date">
                        {{item.ftime}}
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import Qs from 'qs';
export default {
    data(){
        return {
            expressInfo:''
        }
    },
    mounted(){
        this.order_id = this.$route.params.id
        this.getExpress(this.order_id)
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
        getExpress(id) {
            let params = Qs.stringify({orderId:id})
            this.$axios.post('/customer/order/express-info',params).then((res)=>{
                if(res.data.code === 200) {
                    this.expressInfo = res.data.data
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.express-wrapper
    .cell
        display flex
        justify-content space-between
        line-height 50px
        padding 0 15px
        background #fff
        &:first-child
            border-bottom 1px solid $line
    ul
        margin-top 10px
        text-align left
        li
            display flex
            height 100px
            align-items center
            padding 0 15px
            background #f8f9fb
            position relative
            border-bottom 1px solid $line
            .icon-dot
                width 28px
                &:before
                    content ''
                    display block
                    width 14px
                    height 14px
                    margin 0 auto
                    border-radius 50%
                    background $text-lll
            .expressTxt
                line-height 22px
                color $text-lll
            .date
                margin-top 5px
                color $text-lll
                line-height 22px
            /* 第一个不显示 */
            &:first-child
                background #fff
                .expressTxt
                    color $green
                    .date
                        color $text-ll
                &:after
                    display none
            /* 2 */
            &:nth-child(2)
                &:after
                    content ''
                    width 2px
                    background $text-lll
                    display block
                    position absolute
                    height 50%
                    left 28px
                    top 50%
            /* last */
            &:last-child
                border none
                &:after
                    content ''
                    width 2px
                    background $text-lll
                    display block
                    position absolute
                    height 50%
                    left 28px
                    top 0
            .text
                flex 1
                margin-left 10px
            &:after
                content ''
                width 2px
                background $text-lll
                display block
                position absolute
                height 100%
                left 28px
</style>