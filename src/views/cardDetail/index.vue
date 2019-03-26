<template>
    <div class="cardDetail-wrapper">
        <div class="cardImageContainer">
            <img src="../../common/images//card.png" alt="">
        </div>
        <div class="article">
            <div class="cell">
                <span class="label">姓名</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">手机</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">电话</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">邮箱</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">网址</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">公司</span>
                <input type="text">
            </div>
            <div class="cell">
                <span class="label">职务</span>
                <input type="text">
            </div>
            <div class="cell textarea">
                <span class="label">地址</span>
                <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div class="cell">
                <span class="label">备注</span>
                <input type="text">
            </div>
        </div>
        <div class="submit">点击生成名片</div>
    </div>
</template>
<script>
    export default {
        mounted(){
            
        },
        methods:{

        }
    }
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
    .cardDetail-wrapper
        padding-bottom 10px
    .cardImageContainer
        padding 10px 0
        img
            width 90%
    .article
        background #fff
        padding 0 15px
        .cell
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px solid #efefef
            line-height 50px
            .label
                color $text-lll
            input
                color $text-l
                text-align right
                min-width 0
                flex 1
            textarea
                flex 1
                height 45px
                min-height 45px
                font-size 16px
                text-align right
                margin-left 15px
            &.textarea
                height 100px
                align-items baseline
    .submit
        background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
        border-radius 5px
        color #fff
        font-weight bold
        line-height 50px
        margin 20px 15px 0
</style>