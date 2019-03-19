<template>
    <div class="customeLevel-wrapper">
        <div class="header">
            <div>
                <img src="../../common/images/df_user.jpg" alt="" width="54" height="54">
            </div>
            <div>
                <div class="name">用户名</div>
                <div class="mobile">手机号:18677185555</div>
            </div>
        </div>
        <div class="article">
            <div>
                <span class="label">开通级别</span>
                <div class="content" @click="isShowLevelPopup=true">
                    <span :class="{'selected':currentLevel}">{{currentLevel || '请选择级别'}}</span>
                    <div class="icon icon-link"></div>
                </div>
            </div>
            <div>
                <span class="label">开通地区</span>
                <div class="content" @click="isShowLevelPopup=true">
                    <span >请选择地区</span>
                    <div class="icon icon-link"></div>
                </div>
            </div>
            <div>
                <span class="label">级别有效期</span>
                <div class="content">
                    <span>2017</span>
                    <div class="icon icon-link"></div>
                </div>
            </div>
            <div>
                <span class="label">缴纳金额（元）</span>
                <div class="content">
                    <input type="text">
                </div>
            </div>
        </div>
        <div class="article">
            <div>
                <span class="label">赠送VIP数量</span>
                <div class="content">
                    <span>80</span>
                </div>
            </div>
            <div>
                <span class="label">VIP有效期</span>
                <div class="content">
                    <span>1</span>
                    <span>年</span>
                </div>
            </div>
            <div>
                <span class="label">赠送总代数量</span>
                <div class="content">
                    <span>10</span>
                </div>
            </div>
            <div>
                <span class="label">总代有效期</span>
                <div class="content">
                    <span>1</span>
                    <span>年</span>
                </div>
            </div>
        </div>
        <div class="submit">开通级别</div>
        
        <popup-picker :data="levelList" v-show="isShowLevelPopup"  :show.sync="isShowLevelPopup" @on-change="levelChange"></popup-picker>
    </div>
</template>
<script>
import {PopupPicker} from 'vux'
export default {
    data(){
        return {
            isShowLevelPopup:false,
            levelList:[
                ["省代",
                "市代",
                "区代"]
            ],
            levelValue:[],
            currentLevel:null
        }
    },
    components:{
        PopupPicker
    },
    methods:{
        levelChange(e){
            console.log(e)
            this.currentLevel = e[0]
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .header
        display flex
        align-items center
        height 100px
        background #fff
        padding 0 15px
        img
            border-radius 50%
            margin-right 10px
        .name
            text-align left
            color $text-l
            font-weight bold
        .mobile
            color $text-lll
            margin-top 7px
    .article
        background #fff
        padding 0 15px
        &>div
            display flex
            justify-content space-between
            align-items center
            height 50px
            border-bottom 1px solid #efefef
            &:last-child
                border none
            .content
                display flex
                span
                    color $text-lll
                .selected
                    color $text-l
            .label 
                color $text-l
</style>