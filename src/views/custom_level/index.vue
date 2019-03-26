<template>
    <div class="customeLevel-wrapper">
        <div class="header">
            <div>
                <img v-lazy="current_customer.avatar" alt="" width="54" height="54">
            </div>
            <div>
                <div class="name">{{current_customer.nickname}}</div>
                <div class="mobile">手机号:{{current_customer.mobile}}</div>
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
                <div class="content" @click="showAddress=true">
                    <span :class="{'selected':districtInfo}">{{districtInfo || '请选择地区'}}</span>
                    <div class="icon icon-link"></div>
                </div>
            </div>
            <div>
                <span class="label">级别有效期</span>
                <div class="content" @click="showPeriodPopup(1)">
                    <span :class="{'selected':period}">{{period || '请选择级别有效期'}}</span><span v-show="period" class="selected">年</span>
                </div>
            </div>
            <div>
                <span class="label">缴纳金额（元）</span>
                <div class="content">
                    <input type="text" v-model="account">
                </div>
            </div>
        </div>
        <div class="article">
            <div>
                <span class="label">赠送VIP数量</span>
                <div class="content">
                    <input type="text" placeholder="请输入赠送数量" v-model="vipQuota">
                </div>
            </div>
            <div @click="showPeriodPopup(2)">
                <span class="label">VIP有效期</span>
                <div class="content">
                    <span :class="{'selected':vipPeriod}">{{vipPeriod||'请选择有效期'}}</span>
                    <span v-show="vipPeriod" class="selected">年</span>
                </div>
            </div>
            <div>
                <span class="label">赠送总代数量</span>
                <div class="content">
                   <input type="text" placeholder="请输入赠送数量" v-model="generalAgentQuota">
                </div>
            </div>
            <div @click="showPeriodPopup(3)">
                <span class="label">总代有效期</span>
                <div class="content">
                    <span :class="{'selected':generalAgentPeriod}">{{generalAgentPeriod || '请选择有效期'}}</span>
                    <span v-show="generalAgentPeriod" class="selected">年</span>
                </div>
            </div>
        </div>
        <div class="submit" @click="submit">开通级别</div>
        <!-- 选择级别 -->
        <popup-picker :data="levelList" v-show="isShowLevelPopup"  :show.sync="isShowLevelPopup" @on-change="levelChange"></popup-picker>
        <!-- 选择有效期 -->
        <popup-picker :data="periodList" v-show="isShowPeriodPopup"  :show.sync="isShowPeriodPopup" @on-change="handlePeriod"></popup-picker>
        <!-- 选择地区 -->
        <x-address style="display: none;" title="选择地区" v-model="district" raw-value :list="addressData" :show.sync="showAddress"></x-address>
        <!-- <popup-picker @on-change="filterAddr" v-model="selRegion" v-show="showPopupPicker" :show-cell="false" :show.sync="showPopupPicker" :data="agentRegion"></popup-picker> -->
    </div>
</template>
<script>
import {Popup,PopupPicker,InlineCalendar,XAddress,Value2nameFilter as value2name } from 'vux'
import Qs from 'qs'
import {mapGetters} from 'vuex'
let addrArray = []
export default {
    data(){
        return {
            isShowLevelPopup:false,
            isShowCalendar:false,
            disablePast:true,
            levelList:[],
            buildSlotFn:()=>'',
            time:[],
            levelValue:[],
            level:'',
            timeValue:'',
            currentLevel:null,
            district:[],
            addressData:[],
            selRegion:[],
            showPopupPicker:false,
            agentRegion:[],
            showAddress:false,
            period:'',//级别有效期
            vipPeriod:'',//vip有效期
            generalAgentPeriod:'',//总代有效期
            periodList:[[1,2,3]],
            isShowPeriodPopup:false,
            account:'',//缴纳金额
            generalAgentQuota:'',//赠送总代数量
            vipQuota:''//vip数量
        }
    },
    mounted(){
        this.getDistricts()
    },
    components:{
        Popup,
        PopupPicker,
        InlineCalendar,
        XAddress
    },
    methods:{
        // 打开选择级别的弹框
        showPeriodPopup(period){
            console.log(period)
            this.isShowPeriodPopup = true
            this.currentPeriod = period
        },
        handlePeriod(e){
            let currentPeriod = this.currentPeriod
            console.log(currentPeriod)
            switch(currentPeriod) {
                case 1:
                    this.period = e[0]
                    break
                case 2:
                    this.vipPeriod = e[0]
                    break
                case 3:
                    this.generalAgentPeriod = e[0]
                    break
            }
        },
        levelChange(e){
            this.currentLevel = e[0]
            if(e[0] === '省级') {
                this.level = 'provinceAgent'
            } else if (e[0] === '市级') {
                this.level = 'cityAgent'
            } else {
                this.level = 'countyAgent'
            }
            console.log(this.level)
            this.filterAddr(e)
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
        },
        getDistricts(){
            this.$axios.get('/customer/service/get-districts').then((res)=>{
                if(res.data.code) {
                    addrArray = res.data.data.districts
                    let _levelList = res.data.data.levels,levelList = []
                    _levelList.forEach((item,index)=>{
                        levelList.push(item.name)
                    })
					this.addressData = res.data.data.districts
                    this.levelList = [levelList]
                }
            })
        },
        areaDetail (value) {
            this.addressArr = (value2name(value, this.addressData)).split(' ')
                return value2name(value, this.addressData)
        },
        filterAddr (v) {
			this.district = []
			let addressData = []
			if (v[0] === '省级') {
				addrArray.forEach(item => {
					if (item.parent == 0) {
						addressData.push(item)
					}
				})
				this.addressData = addressData
			}else if (v[0] === '市级') {
				addrArray.forEach((item) => {
					if (item.parent != 2) {
						addressData.push(item)
					}
				})
				this.addressData = addressData
			}else {
				this.addressData = addrArray
			}
        },
        validForm(){
            if(!this.level) {
                this.showWarn("请选择级别")
                return false
            }
            if(!this.period) {
                this.showWarn('请选择级别有效期')
                return false
            }
            if(!this.vipPeriod) {
                this.showWarn('请选择VIP有效期')
                return false
            }
            if(!this.generalAgentPeriod) {
                this.showWarn('请选择总代有效期')
                return false
            }
            if(!this.district) {
                this.showWarn('请选择地区')
                return false
            }
            if(!this.account) {
                this.showWarn('请输入金额')
                return false
            }
            if(!this.generalAgentQuota) {
                this.showWarn('请输入赠送总代数量')
                return false
            }
            if(!this.vipQuota) {
                this.showWarn('请输入赠送VIP数量')
                return false
            }
            return true
        },
        showWarn(txt){
            this.$vux.toast.show({
                text:txt,
                type:'warn'
            })
        },
        submit(){
            let valid = this.validForm()
            let params = Qs.stringify({
                sn:this.current_customer.sn,
                toLevel:this.level,
                amount:this.account,
                province:this.district[0],
                city:this.district[1],
                county:this.district[2],
                vipQuota:this.vipQuota,
                generalAgentQuota:this.generalAgentQuota,
            })
            this.$axios.post('/customer/level/upgrade-step-one',params).then((res)=>{
                console.log(res)
            })
        }
    },
    computed:{
        districtInfo: {
			get () {
				return this.areaDetail(this.district)
			},
			set () {
				return ''
			}
        },
        ...mapGetters([
            'userInfo',
            'current_customer'
        ])
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
                input
                    text-align right
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