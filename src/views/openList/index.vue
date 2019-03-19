<template>
    <div class="openList-wrapper" :class="level==='vip'?'vip':'agent'">
        <div class="search-wrapper">
                <div class="searchBox">
                    <div class="icon icon-search"></div>
                    <input type="text" placeholder="输入手机号或昵称">
                </div>
        </div>
        <ul class="list">
            <div class="list-title">
                <div>已开通：<span :class="level==='vip'?'green':'red'">1</span>人</div>
                <div>还可开通：<span :class="level==='vip'?'green':'red'">79</span>人</div>
            </div>
            <li class="item">
                <img src="../../common/images/df_user.jpg" alt="" width="54">
                <div class="center">
                    <div class="name">程潇</div>
                    <div class="mobile">手机号：18677185555</div>
                </div>
                <router-link tag="li" class="right" :to="{path:`/openDetail/${level}`,}">{{level==='vip'?"去开通VIP":'去开通总代'}}</router-link>
            </li>

        </ul>
        <router-link class="checkMore" tag="div" to="/openRecord">
            <span>查看开通记录</span>
            <div class="icon icon-link"></div>
        </router-link>
    </div>
</template>
<script>
export default {
    data(){
        return {
            level:undefined
        }
    },
    created() {
        if(this.$route.params.level === 'vip') {
            this.level = 'vip'
            document.title = '开通VIP'
        } else {
            this.level = 'agent'
            document.title = '开通总代'
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
/* VIP */
.vip
    .right
        background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
/* 总代 */
.agent
    .right
        background linear-gradient(180deg,rgba(255,167,178,1) 0%,rgba(255,106,124,1) 100%)
.search-wrapper
    padding 10px 15px
    background #fff
    height 60px
    box-sizing border-box
    .searchBox
        display flex
        align-items center
        background #efefef
        border-radius 30px
        height 40px
        padding-left 15px
        input
            background #efefef
            margin-left 10px
.list-title
    display flex
    justify-content space-between
    line-height 30px
    padding 0 15px
    background #efefef
    font-size 14px
    .green
        color $green
        background transparent
    .red
        color $red
        background transparent
.list
    background #fff
    .item
        display flex
        margin 23px 15px
        border-bottom 1px solid #efefef
        padding-bottom 23px
        align-items center
        img
            border-radius 50%
        .center
            text-align left
            margin-left 10px
            flex 1
            .name
                color $text-l
                font-weight bold
                font-size 18px
            .mobile
                color $text-ll
                font-size 14px
                margin-top 10px
        .right
            border-radius 30px
            color #ffffff
            line-height 30px
            font-weight bold
            width 100px
.checkMore
    position fixed
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    width 100%
    bottom 0
    background #fff
    height 50px
    color $text-l
    padding 0 15px
</style>