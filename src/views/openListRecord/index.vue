<template>
    <div class="openListRecord-wrapper">
        <ul>
            <li>
                <img src="../../common/images/df_user.jpg" alt="" width="54">
                <div>
                    <div>
                        <div class="name">用户名</div>
                        <div class="acccount">开通金额:¥50.00</div>
                    </div>
                    <div class="date">
                        开通时间：2019-02-13 12:12:33
                    </div>
                </div>
            </li>
        </ul>
        <div class="nomore">暂无数据</div>
    </div>
</template>
<script> 
export default {
    created() {
        console.log(this.$route.params)
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.openListRecord-wrapper
    background $bgcolor
ul
    background #fff
    li
        display flex
        align-items center
        padding 23px 0
        border-bottom 1px solid #efefef
        margin 0 15px
        img
            border-radius 50%
        &>div
            flex 1
            &>div
                display flex
                justify-content space-between
                margin-left 10px
            .name
                color $text-l
                font-weight bold
                font-size 18px
            .account
                color $text-l
            .date
                color $text-ll
                font-size 14px
                margin-top 10px
.nomore
    font-size 14px
    color $text-ll
    margin-top 20px
</style>