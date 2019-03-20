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
                <div class="content" @click="isShowCalendar = true">
                    <span :class="{'selected':timeValue}">{{timeValue || '请选择级别有效期'}}</span>
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
        <!-- 选择级别 -->
        <popup-picker :data="levelList" v-show="isShowLevelPopup"  :show.sync="isShowLevelPopup" @on-change="levelChange"></popup-picker>
        <!-- 选择有效期 -->
        <popup :hide-on-blur="false" v-model="isShowCalendar">
            <div class="popup-header">
                <span @click="popupCancel" class="popup-cancel">取消</span>
                <h4>选择日期</h4>
            </div>
            <inline-calendar
                :render-function="buildSlotFn"
                v-model="time"
                :disable-past="disablePast"
                @on-change="onCalendarChange"></inline-calendar>
        </popup>
    </div>
</template>
<script>
import {Popup,PopupPicker,InlineCalendar} from 'vux'
export default {
    data(){
        return {
            isShowLevelPopup:false,
            isShowCalendar:false,
            disablePast:true,
            levelList:[
                ["省代",
                "市代",
                "区代"]
            ],
            buildSlotFn:()=>'',
            time:[],
            levelValue:[],
            timeValue:'',
            currentLevel:null
        }
    },
    components:{
        Popup,
        PopupPicker,
        InlineCalendar
    },
    methods:{
        levelChange(e){
            this.currentLevel = e[0]
        },
        onCalendarChange(val){
            if(val.length >= 2) {
                this.isShowCalendar = false
                console.log(this.time)
                this.timeValue = val[0] + '-' + val[1]
            }
        },
        popupCancel(){
            this.isShowCalendar = false
        }
    },
    watch:{
        time(val){
            // if(val.length < 2) {
            //     this.buildSlotFn = (line, index, date) => {
			// 		if (val[0] == date.formatedDate) {
			// 			if (date.weekDay == 0) {
			// 				return '<div style="left: 0; margin: 0" class="date-tips">请选择使用后日期</div>'
			// 			}else if (date.weekDay == 6) {
			// 				return '<div style="right: 0; left: auto; margin: 0" class="date-tips">请选择使用后日期</div>'
			// 			}else {
			// 				return '<div class="date-tips">请选择使用后日期</div>'
			// 			}
			// 		}else {
			// 			return ''
			// 		}
			// 	}
            // }else {
			// 	this.buildSlotFn = (line, index, date) => {
			// 		if (val[0] == date.formatedDate) {
			// 			return ''
			// 		}
			// 	}
			// }
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
        margin-bottom 10px
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
        margin-bottom 10px
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
    .submit
        margin 10px 15px
        line-height:50px
        background linear-gradient(180deg,rgba(100,229,198,1) 0%,rgba(41,206,166,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(41,206,166,0.47)
        border-radius 5px
        color #fff
</style>