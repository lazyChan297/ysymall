<template>
    <div class="vipLevel-wrapper">
        <div class="header">
            <img src="../../common/images/viplevelbg.png" alt="">
            <p class="txt">您的级别为南宁市市代，可以为三度以内人脉开通VIP会员或开通总代，请选择要开通的会员级别。</p>
        </div>
        <div class="article">
            <router-link tag="div" to="/openList/vip" class="green">
                <span>开通VIP</span>
                <div class="icon icon-link"></div>
            </router-link>
            <router-link tag="div" to="/openList/agent" class="red">
                <span>开通总代</span>
                <div class="icon icon-link"></div>
            </router-link>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.header
    position relative
    box-shadow 0px 4px 16px 0px rgba(41,206,166,0.47)
    img
        width 100%
        display block
    .txt
        position absolute
        top 50%
        transform translateY(-50%)
        left 15px
        color #fff
        width 50%
        text-align left
        line-height 24px
.green, .red
    display flex
    align-items center
    line-height 80px
    font-weight bold
    background #fff
    padding-right 15px
    &>span
        flex 1

.green
    color $green
.red
    color $red
</style>