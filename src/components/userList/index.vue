<template>
    <div class="userList-wrapper" :class="level==='agent'?'agent':'vip'">
        <ul class="list">
            <div class="list-title">
                <div>已开通：<span :class="level==='agent'?'red':'green'">1</span>人</div>
                <div>还可开通：<span :class="level==='agent'?'red':'green'">79</span>人</div>
            </div>
            <li class="item">
                <img src="../../common/images/df_user.jpg" alt="" width="54">
                <div class="center">
                    <div class="name">程潇</div>
                    <div class="mobile">18677185555</div>
                </div>
                <!-- 设置级别 -->
                <router-link tag="li" class="right" v-if="level==='level'" to="/customLevel">设置级别</router-link>
                <router-link tag="li" class="right" :to="{path:`/openDetail/${level}`,}" v-else>{{level==='vip'?"去开通VIP":'去开通总代'}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:{
        level:{
            type:String
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
.list
    background #fff
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
</style>