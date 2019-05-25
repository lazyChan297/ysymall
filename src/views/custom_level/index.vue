<template>
    <div class="customeLevel-wrapper" v-if="ready">
        <div class="header">
            <div class="userinfo">
                <div>
                    <img v-lazy="current_customer.avatar" alt="" width="54" height="54">
                </div>
                <div>
                    <div class="name">{{current_customer.nickname}}</div>
                    <div class="mobile">手机号:{{current_customer.mobile}}</div>
                </div>
            </div>
            <div class="relationship" v-if="current_customer.inviterNickname">
                <div>
                    <span>邀请人</span>
                    <span>{{current_customer.inviterNickname}}</span>
                </div>
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
                <div class="content" @click="showPopupDate('agent')">
                    <!-- <span class="selected" v-if="agentStartedAt&&agentEndedAt">
                        {{agentStartedAt.replace(/-/g,'/')}}-{{agentEndedAt.replace(/-/g,'/')}}
                    </span> -->
                    <span class="selected" v-if="agentEndedAt">
                        {{agentEndedAt.replace(/-/g,'/')}}
                    </span>
                    <span v-else>请选择有效期</span>
                </div>
            </div>
            
        </div>
        
        <div class="article">
            <div>
                <span class="label">赠送VIP数量</span>
                <div class="content">
                    <input type="tel" placeholder="请输入赠送数量" v-model="vipQuota">
                </div>
            </div>
            <div @click="showPopupDate('vip')">
                <span class="label">VIP有效期</span>
                <div class="content">
                    <!-- <span class="selected" v-if="vipStartedAt&&vipEndedAt">
                        {{vipStartedAt.replace(/-/g,'/')}}-{{vipEndedAt.replace(/-/g,'/')}}
                    </span> -->
                    <span class="selected" v-if="vipEndedAt">
                        {{vipEndedAt.replace(/-/g,'/')}}
                    </span>
                    <span v-else>请选择有效期</span>
                </div>
            </div>
            <div>
                <span class="label">赠送总代数量</span>
                <div class="content">
                   <input type="tel" placeholder="请输入赠送数量" v-model="generalAgentQuota">
                </div>
            </div>
            
            <div @click="showPopupDate('general')">
                <span class="label">总代有效期</span>
                <div class="content">
                    <!-- <span class="selected" v-if="generalAgentStartedAt&&generalAgentEndedAt">
                        {{generalAgentStartedAt.replace(/-/g,'/')}}-{{generalAgentEndedAt.replace(/-/g,'/')}}
                    </span> -->
                    <span class="selected" v-if="generalAgentEndedAt">
                        {{generalAgentEndedAt.replace(/-/g,'/')}}
                    </span>
                    <span v-else>请选择有效期</span>
                </div>
            </div>
        </div>
        <div class="article">
                <div>
                    <span class="label">应缴金额（元）</span>
                    <div class="content">
                        <input type="tel" v-model="payableAmount">
                    </div>
                </div>
                <div>
                    <span class="label">实收金额</span>
                    <div class="content">
                        <input type="tel" v-model="paidAmount">
                    </div>
                </div>
                <div>
                    <span class="label">允许提现</span>
                    <div class="content">
                        <group>
                            <x-switch v-model="withdraw" title="" @on-change="handleWithdrawal"></x-switch>
                        </group>
                    </div>
                </div>
                <div>
                    <span class="label">给上级结算佣金</span>
                    <div class="content">
                        <group>
                            <x-switch v-model="distribute" title="" @on-change="handleAllowSettlement"></x-switch>
                        </group>
                    </div>
                </div>
        </div>
        <div class="submit" @click="submit">开通合伙人</div>
        <!-- 选择级别 -->
        <popup-picker :data="levelList" v-show="isShowLevelPopup"  :show.sync="isShowLevelPopup" @on-change="levelChange" v-model="agentRegion"></popup-picker>
        <!-- 选择有效期 -->
        <popup-picker :data="periodList" v-show="isShowPeriodPopup"  :show.sync="isShowPeriodPopup" @on-change="handlePeriod"></popup-picker>
        <!-- 选择地区 -->
        <x-address style="display: none;" title="选择地区" v-model="district" raw-value :list="addressData" :show.sync="showAddress"></x-address>
        <!-- <popup-picker @on-change="filterAddr" v-model="selRegion" v-show="showPopupPicker" :show-cell="false" :show.sync="showPopupPicker" :data="agentRegion"></popup-picker> -->
        <popup :hide-on-blur="false" v-model="isshowPopupDate">
            <div class="popup-header">
                <h4>选择日期</h4>
                <span @click="isshowPopupDate = false" class="popup-cancel">取消</span>
            </div>
            <inline-calendar :show.sync="showPopupDate" v-model="validDate" @on-change="generalDateChange"></inline-calendar>
        </popup>
        <!-- dialog -->
        <x-dialog v-model="isShowDialog">
            <div class="confirm-container">
                <div class="title bold">确认开通级别</div>
                <div class="confirm-content">
                    <div class="desc">请进行手机验证:</div>
                    <div class="cell">
                        <div class="mobile">{{getMobile()}}</div>
                        <div class="getcode" @click="getcode" :class="canSubmit?'':'disabled'">{{button_text}}</div>
                    </div>
                    <div class="cell">
                        <input type="tel" placeholder="请输入验证码" v-model="captcha">
                    </div>
                </div>
                <div class="button-group">
                    <div class="submit" @click="confirmDialog">确定</div>
                    <div class="cancel" @click="isShowDialog = false">取消</div>
                </div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
import {Popup,
        PopupPicker,
        InlineCalendar,
        XDialog,
        XAddress,
        Value2nameFilter as value2name,
        Group,
        XSwitch} from 'vux'
import Qs from 'qs'
import {mapGetters} from 'vuex'
let addrArray = []
export default {
    data(){
        return {
            captcha:'',
            ready:false,
            isShowDialog:false,
            dialog_content:'',
            agentRegion:districts.levels,
            current_customer:null,//用户信息
            // showPopupDate:false,//显示时间控件
            isshowPopupDate:false,
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
            validDate:[],
            generalAgentStartedAt:'',//总代起始日期
            generalAgentEndedAt:'',//总代结束日期
            vipStartedAt:'',//vip起始有效期
            vipEndedAt:'',//vip结束有效期
            agentStartedAt:'',//代理有效期开始
            agentEndedAt:'',//代理有效期结束
            periodList:[[1,2,3]],
            isShowPeriodPopup:false,
            districtId:null,//地址id
            account:'',//缴纳金额
            payableAmount:null,//应付金额
            paidAmount:null,//实付金额
            generalAgentQuota:'',//赠送总代数量
            vipQuota:'',//vip数量
            withdrawal:false,
            distribute:false,
            withdraw:null,//允许提现
            allowSettlement:false,
            current_date:'',
            canSubmit:true,
            button_text:'发送验证码',
            reset:60
        }
    },
    components:{
        Popup,
        PopupPicker,
        InlineCalendar,
        XAddress,
        XSwitch,
        Group,
        XDialog
    },
    mounted(){
        this.getDistricts()
        this.getCustomerInfo(this.$route.params.sn)
    },
    methods:{
        // 获取用户信息
        getCustomerInfo(sn){
            let params = Qs.stringify({sn:sn})
            this.$axios.post('/customer/service/get-customer-info',params).then((res)=>{
                if(res.data.code === 200) {
                   this.current_customer = res.data.data.customerInfo
                    this.ready = true && global.ready
                }
            })
        },
        getcode() {
            if(!this.canSubmit) {
                return false
            }
            let params = Qs.stringify({
                mobile:this.userInfo.mobile,
                type:10
            })
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code === 200) {
                    let reset = 60
                    let timer = setInterval(()=>{
                        this.canSubmit = false
                        reset--;
                        this.button_text = `${reset}s`;
                        if(reset==0) {
                            this.canSubmit = true
                            this.button_text = '发送验证码'
                        }
                    },1000)
                } else {
                    this.$vux.show.toast({
                        text:'验证码发送失败,请稍后再试！',
                        type:'warn'
                    })
                }
            })
        },
        getMobile(){
            var tel = this.userInfo.mobile;
            tel = "" + tel;
            var tel1 = tel.substr(0,3) + "****" + tel.substr(7)
            return tel1
        },
        confirmDialog(){
            if(!this.captcha) {
                this.$vux.toast.show({
                    text:"请输入验证码",
                    type:'warn'
                })
                return false
            }
            let params = Qs.stringify({
                sn:this.current_customer.sn,
                toLevel:this.level,
                payableAmount:this.payableAmount,
                paidAmount:this.paidAmount,
                districtId:this.districtId,
                // agentStartedAt:this.agentStartedAt,
                // agentStartedAt:"2019-05-04",
                agentEndedAt:this.agentEndedAt,
                // vipStartedAt:"2019-05-04",
                vipEndedAt:this.vipEndedAt,
                // generalAgentStartedAt:"2019-05-04",
                generalAgentEndedAt:this.generalAgentEndedAt,
                vipQuota:this.vipQuota,
                generalAgentQuota:this.generalAgentQuota,
                withdraw:Number(this.withdraw),
                distribute:Number(this.distribute),
                captcha:this.captcha
            })
            this.$axios.post('/customer/level/upgrade-step-one',params).then((res)=>{
                if(res.data.code === 200) {
                    this.isShowDialog = false
                    this.$vux.toast.show({
                        text:"开通成功",
                        type:'warn'
                    })
                    let timer = setTimeout(()=>{
                        this.$router.go(-1)
                    },1000)
                } else {
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                }
            })
        },
        // 打开时间弹窗
        showPopupDate(type){
            this.isshowPopupDate = true
            if(type=='general') {
                this.current_date = 'general'
            } else if (type == 'vip') {
                this.current_date = 'vip'
            } else if (type == 'agent') {
                this.current_date = 'agent'
            }
        },
        // 监听时间改变
        generalDateChange(val){
            if(val.length==1) {
                let year = new Date().getFullYear(),
                    month = new Date().getMonth()<=9?'0'+(Number(new Date().getMonth())+1):Number(new Date().getMonth())+1,
                    day = new Date().getDate();
                let second = val[0]
                // let firstArr = frist.split('/'), secondArr = second.split('-');
                let firstArr = [year,month,day],secondArr = second.split('-');
                // 有效期在同一年,
                let valid = (firstArr[0]<secondArr[0]) || (firstArr[0]==secondArr[0]&&firstArr[1]<secondArr[1]) || (firstArr[0]==secondArr[0]&&firstArr[1]==secondArr[1]&&firstArr[2]<secondArr[2]) 
                if(!valid) {
                    this.$vux.toast.show({
                        text:'请正确选择有效期',
                        type:'warn',
                        time:500
                    })
                    setTimeout(() => {
                        // this.isshowPopupDate = false
                        this.validDate = []
                    }, 500);
                    
                    return false
                }
                if(this.current_date == 'general') {
                    this.isshowPopupDate = false
                    // this.generalAgentStartedAt = val[0]
                    // this.generalAgentEndedAt = val[1]
                    this.generalAgentEndedAt = val[0]
                } else if (this.current_date == 'vip') {
                    // this.vipStartedAt = val[0]
                    // this.vipEndedAt = val[1]
                    this.vipEndedAt = val[0]
                } else if (this.current_date == 'agent') {
                    // this.agentStartedAt = val[0]
                    // this.agentEndedAt = val[1]
                    this.agentEndedAt = val[0]
                }
                this.isshowPopupDate = false
                this.validDate = []
            }
        },
        handleWithdrawal(val){
            this.withdrawal = val
        },
        handleAllowSettlement(val){
            this.distribute = val
        },
        // 打开选择级别的弹框
        showPeriodPopup(period){
            this.isShowPeriodPopup = true
            this.currentPeriod = period
        },
        handlePeriod(e){
            let currentPeriod = this.currentPeriod
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
            this.filterAddr(e)
        },
        popupCancel(){
            this.isShowCalendar = false
        },
        getDistricts(){
            // this.$axios.get('/customer/service/get-districts').then((res)=>{
            //     if(res.data.code) {
            //         addrArray = res.data.data.districts
            //         let _levelList = res.data.data.levels,levelList = []
            //         _levelList.forEach((item,index)=>{
            //             levelList.push(item.name)
            //         })
			// 		this.addressData = res.data.data.districts
            //         this.levelList = [levelList]
            //     }
            // })
            addrArray = districts.districts;
            let _levelList = districts.levels,levelList = []
            _levelList.forEach((item,index)=>{
                levelList.push(item.name)
            })
            this.addressData = districts.districts
            this.levelList = [levelList]
        },
        areaDetail (value) {
            this.addressArr = (value2name(value, this.addressData)).split(' ')
                this.districtId = value[value.length-1]
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
            if(!this.districtId){
                this.showWarn("请选择地区")
                return false
            }
            // if(!this.agentStartedAt){
            //     this.showWarn("请选择级别有效期")
            //     return false
            // }
            if(!this.agentEndedAt){
                this.showWarn("请选择级别有效期")
                return false
            }
            // if(!this.vipStartedAt){
            //     this.showWarn("请选择VIP有效期")
            //     return false
            // }
            if(!this.vipEndedAt){
                this.showWarn("请选择VIP有效期")
                return false
            }
            // if(!this.generalAgentStartedAt){
            //     this.showWarn("请选择总代有效期")
            //     return false
            // }
            if(!this.generalAgentEndedAt){
                this.showWarn("请选择总代有效期")
                return false
            }
            if(!this.district) {
                this.showWarn('请选择地区')
                return false
            }
            if(!this.payableAmount) {
                this.showWarn('请输入应缴金额')
                return false
            }
            if(!this.paidAmount){
                this.showWarn("请输入实付金额")
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
            if(!valid) return false
            this.isShowDialog = true
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
            'userInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/stylus/variable.styl";
    .customeLevel-wrapper
        padding-bottom 10px
    .disabled
        background $text-lll !important
    .confirm-container
        .title
            height 72px
            color #fff
            line-height 72px
            font-size 24px
            background $green
        .content
            margin 40px 0
        .cancel
            line-height 50px
        .confirm-content
            padding 0 15px
            .desc
                font-size 14px
                color $tetx-lll
                margin-top 27px
                text-align left
            .cell
                display flex
                align-items center
                padding-top 10px
                .mobile
                    flex 1
                    background #f2f2f2
                    line-height 40px
                    border-radius 3px
                    color $text-lll
                    margin-right 10px
                    text-align left
                    padding-left 10px
                .getcode
                    width 90px
                    background $green
                    color #fff
                    line-height 40px
                    border-radius 3px
                    font-size 12px
                input
                    background #f2f2f2
                    line-height 40px
                    border-radius 3px
                    flex 1
                    padding-left 10px
    .header
        background #fff
        margin-bottom 10px
        .userinfo
            display flex
            align-items center
            height 100px
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
        .relationship
            border-top 2px dashed $line
            padding 0 15px
            &>div
                display flex
                justify-content space-between
                line-height 35px
                color $text-lll
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
                height 100%
                line-height 50px
                span
                    color $text-lll
                .selected
                    color $text-l
                input
                    text-align right
                input::-webkit-input-placeholder,    
                textarea::-webkit-input-placeholder       
                    color $text-lll
                    font-size 16px
                .icon
                    margin auto
            .label 
                color $text-l
    .popup-header
        display flex
        line-height 40px
        padding-right 15px
        h4
            flex 1

    .submit
        margin 10px 15px 0
        line-height 50px
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
        border-radius 5px
        color #fff
</style>