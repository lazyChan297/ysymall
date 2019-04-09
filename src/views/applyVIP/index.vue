<template>
    <div class="applyVIP-wrapper">
        <div class="headers">
            <img src="../../common/images/applyvip_bg.png" alt="">
            <div class="userInfo">用户名 | 会员等级</div>
            <div class="account">
                <p class="desc">申请VIP需要支付</p>
                <p class="accountNum"><span class="ti">￥</span><span class="num">500.00</span></p>
            </div>
        </div>
        <section>
            <img src="../../common/images/applyvip_c.png" alt="" class="vipContent">
            <div class="addrInfo">
                <div class="icon icon-location"></div>
                <div class="content">
                    <p class="mobile">张三,18677189999</p>
                    <p class="addr">广西壮族自治区 南宁市 青秀区 民族大道131号会展中心航洋城</p>
                </div>
                <div class="icon icon-link"></div>
            </div>
        </section>
        <div class="submit">支付</div>
    </div>
</template>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl';
.applyVIP-wrapper
    background #fff !important
.headers
    position relative
    img
        position absolute
        left 0
        width 100%
        z-index 0
    .userInfo
        position relative
        padding-top 110px
        color #fff
        z-index 1
    .account
        position relative
        background #ffffff
        height 160px
        border-radius 8px
        margin 0 15px
        padding-top 34px
        box-sizing border-box
        box-shadow 0px 4px 12px 0px rgba(0,0,0,0.1)
        z-index 1
    .desc
        color $text-ll
    .accountNum
        line-height 70px
        .num
            font-size 50px
            font-weight bold
            color $text-l
            display inline-block
            vertical-align middle
        .ti
            font-size 30px
            color $text-l
            font-weight bold
            display inline-block
            vertical-align middle
section
    margin-top -15px
    padding 0 15px
    background #ffffff
    .vipContent
        display block
        width 100%
    .addrInfo
        display flex
        align-items center
        background #ffffff
        border-top 1px solid $line
        border-bottom 1px solid $line
        padding 10px 0
        .icon-location
            margin-right 15px
        .content
            flex 1
            text-align left
            .mobile
                color $text-l
                font-size 16px
            .addr
                color $text-lll
                font-size 14px
                margin-top 2px
.submit
    line-height 50px
    background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
    box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
    border-radius 5px
    color #fff
    font-weight bold
    margin 20px 15px
</style>

