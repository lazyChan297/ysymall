<template>
        <div class="customeLevel-wrapper" v-if="agentInfo">
            <div class="header">
                <div class="userinfo">
                    <div>
                        <img v-lazy="agentInfo.avatar" alt="" width="54" height="54">
                    </div>
                    <div>
                        <div class="name">{{agentInfo.nickname}}</div>
                        <div class="mobile">手机号:{{agentInfo.mobile}}</div>
                    </div>
                </div>
                <div class="relationship">
                    <div>
                        <span>邀请人</span>
                        <span>{{agentInfo.inviterNickname}}</span>
                    </div>
                </div>
            </div>
            <div class="article">
                <div>
                    <span class="label">开通级别</span>
                    <div class="content" @click="isShowLevelPopup=true">
                        <span :class="{'selected':agentInfo.levelName}">{{newAgentInfo&&getLevel(newAgentInfo.level) || getLevel(agentInfo.level)}}</span>
                        <div class="icon icon-link"></div>
                    </div>
                </div>
                <div>
                    <span class="label">开通地区</span>
                    <div class="content" @click="showAddress=true">
                        <span class="maxtext selected">{{districtInfo || origin_districtInfo}}</span>
                        <div><div class="icon icon-link"></div></div>
                        
                    </div>
                </div>
                <div>
                    <span class="label">级别有效期</span>
                    <div class="content" @click="showPopupDate('agent')">
                        <span class="selected">有效期至{{agentInfo.endedAt.substring(0,10)}}</span>
                    </div>
                </div>
            </div>
            <div class="article">
                <div>
                    <span class="label">赠送VIP数量</span>
                    <div class="content">
                        <input type="text" placeholder="请输入赠送数量" v-model="agentInfo.vipQuota">
                    </div>
                </div>
                <div @click="showPopupDate('vip')">
                    <span class="label">VIP有效期</span>
                    <div class="content">
                        <!-- <span class="selected" v-if="agentInfo.vipStartedAt">
                            {{agentInfo.vipStartedAt.replace(/-/g,'/').substring(0,10)}}-{{agentInfo.vipEndedAt.replace(/-/g,'/').substring(0,10)}}
                        </span> -->
                        <span class="selected">
                            有效期至{{agentInfo.vipEndedAt.replace(/-/g,'/').substring(0,10)}}
                        </span>
                    </div>
                </div>
                <div>
                    <span class="label">赠送总代数量</span>
                    <div class="content">
                       <input type="text" placeholder="请输入赠送数量" v-model="agentInfo.generalAgentQuota">
                    </div>
                </div>
                
                <div @click="showPopupDate('general')">
                    <span class="label">总代有效期</span>
                    <div class="content">
                        <span class="selected">
                            有效期至{{agentInfo.generalAgentEndedAt.replace(/-/g,'/').substring(0,10)}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="article">
                    <div>
                        <span class="label">允许提现</span>
                        <div class="content">
                            <group>
                                <x-switch v-model="agentInfo.withdraw===1?true:false" title="" @on-change="handleWithdrawal"></x-switch>
                            </group>
                        </div>
                    </div>
            </div>
            <div class="submit" @click="submit">编辑合伙人</div>
            <!-- 选择级别 -->
            <popup-picker :data="levelList" v-show="isShowLevelPopup"  :show.sync="isShowLevelPopup" @on-change="levelChange" v-model="agentRegion"></popup-picker>
            <!-- 选择有效期 -->
            <popup-picker :data="periodList" v-show="isShowPeriodPopup"  :show.sync="isShowPeriodPopup" @on-change="handlePeriod"></popup-picker>
            <!-- 选择地区 -->
            <x-address style="display: none;" title="选择地区" v-model="district" raw-value :list="addressData" :show.sync="showAddress"></x-address>
            <popup-picker @on-change="filterAddr" v-model="selRegion" v-show="showPopupPicker" :show-cell="false" :show.sync="showPopupPicker" :data="agentRegion"></popup-picker>
            <popup :hide-on-blur="false" v-model="isshowPopupDate">
                <div class="popup-header">
                    <h4>选择日期</h4>
                    <span @click="isshowPopupDate = false" class="popup-cancel">取消</span>
                </div>
                <inline-calendar :show.sync="showPopupDate" v-model="validDate" @on-change="generalDateChange"></inline-calendar>
            </popup>
            <!-- 弹框 -->
            <x-dialog v-model="isShowDialog">
                <div class="confirm-container">
                    <div class="title bold">确认编辑级别</div>
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
        XDialog,
        PopupPicker,
        InlineCalendar,
        XAddress,
        Value2nameFilter as value2name,
        Group,
        XSwitch} from 'vux'
    import Qs from 'qs'
    import {mapGetters} from 'vuex'
    let addrArray = []
    const env = process.env
    export default {
        data(){
            return {
                captcha:'',
                newAgentInfo:null,//需要提交的修改信息
                dialog_content:'',
                dialog_confirm_btn:'',
                isShowDialog:false,
                agentRegion:districts.levels,
                agentInfo:null,
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
                origin_districtId:null,//旧地址id
                districtId:null,//地址id
                account:'',//缴纳金额
                payableAmount:null,//应付金额
                paidAmount:null,//实付金额
                generalAgentQuota:'',//赠送总代数量
                vipQuota:'',//vip数量
                withdrawal:false,
                distribute:false,
                withdraw:true,//允许提现
                allowSettlement:false,
                current_date:'',
                origin_districtInfo:'',
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
            this.getCustomerInfo(this.$route.params.sn)
            if(env == 'production') {
                // 禁止分享
                this.$wechat.ready(() => {
                    this.$wechat.hideMenuItems({
                        menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                    });
                })
            }
        },
        methods:{
            // 获取用户信息
            getCustomerInfo(sn){
                let params = Qs.stringify({
                    sn:sn
                })
                this.$axios.post('/manager/agent/get-agent-info',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.agentInfo = res.data.data
                        this.getDistricts(this.agentInfo.level)
                        let agentDistricts = this.agentInfo.agentDistricts
                        this.origin_districtId = agentDistricts[agentDistricts.length-1]
                        let districtInfo = []
                        for(let i in agentDistricts) {
                            districtInfo.push(agentDistricts[i].toString())
                        }
                        this.origin_districtInfo = value2name(districtInfo, this.addressData)
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
                    }
                })
            },
            getMobile(){
                var tel = this.userInfo.mobile;
                tel = "" + tel;
                var tel1 = tel.substr(0,3) + "****" + tel.substr(7)
                return tel1
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
            confirmDialog(){
                if(!this.captcha) {
                    this.$vux.toast.show({
                        text:"请输入验证码",
                        type:'warn'
                    })
                    return false
                }
                let params = Qs.stringify({
                    sn:this.$route.params.sn.replace(/&/g, '&amp;'),
                    newLevel:this.newAgentInfo&&this.newAgentInfo.level,
                    newDistrictId:this.districtId,
                    agentEndedAt:this.agentInfo.endedAt,
                    vipEndedAt:this.agentInfo.vipEndedAt,
                    generalAgentEndedAt:this.agentInfo.generalAgentEndedAt,
                    vipQuota:this.agentInfo.vipQuota,
                    generalAgentQuota:this.agentInfo.generalAgentQuota,
                    withdraw:Number(this.agentInfo.withdraw),
                    captcha:this.captcha
                })
                this.$axios.post('/manager/agent/update',params).then((res)=>{
                    if(res.data.code === 200) {
                        this.isShowDialog = false
                        this.$router.go(-1)
                        this.$vux.toast.show({
                            text:"编辑成功",
                            type:'success'
                        })
                    } else {
                        this.$vux.toast.show({
                            text:res.data.message,
                            type:'warn'
                        })
                    }
                })
            },
            // 监听时间改变
            generalDateChange(val){
                if(this.current_date == 'agent' && val.length ==1) {
                    this.agentInfo.endedAt = val[0]
                    this.isshowPopupDate = false
                    this.validDate = []
                }
                if(val.length==1) {
                    if(this.current_date == 'general') {
                        this.showPopupDate = false
                        this.agentInfo.generalAgentEndedAt = val[0]
                    } else if (this.current_date == 'vip') {
                        this.agentInfo.vipEndedAt = val[0]
                    }
                    this.isshowPopupDate = false
                    this.validDate = []
                }
            },
            handleWithdrawal(val){
                this.agentInfo.withdraw = val
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
                this.newAgentInfo = {}
                if(e[0] === '省级') {
                    this.newAgentInfo.level = 'provinceAgent'
                } else if (e[0] === '市级') {
                    this.newAgentInfo.level = 'cityAgent'
                } else {
                    this.newAgentInfo.level = 'countyAgent'
                }
                this.filterAddr(e)
            },
            getLevel(level){
                switch(level){
                case "countyAgent":
                    return "区代";
                    break;
                case "cityAgent":
                    return "市代";
                    break;
                case "provinceAgent":
                    return "省代";
                    break;
            }
            },
            popupCancel(){
                this.isShowCalendar = false
            },
            getDistricts(level){
                let n = level==='provinceAgent'?0:2
                addrArray = districts.districts;
                let _levelList = districts.levels,levelList = []
                let addressData = []
                _levelList.forEach((item,index)=>{
                    if(item)
                    levelList.push(item.name)
                })
                if (level === 'provinceAgent') {
                    addrArray.forEach(item => {
                        if (item.parent == 0) {
                            addressData.push(item)
                        }
                    })
                    this.addressData = addressData
                }else if (level === 'cityAgent') {
                    addrArray.forEach((item) => {
                        if (item.parent != 2) {
                            addressData.push(item)
                        }
                    })
                    this.addressData = addressData
                }else {
                    this.addressData = addrArray
                }
                // this.addressData = districts.districts
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
                if(!this.agentStartedAt){
                    this.showWarn("请选择级别有效期")
                    return false
                }
                if(!this.vipStartedAt){
                    this.showWarn("请选择VIP有效期")
                    return false
                }
                if(!this.generalAgentStartedAt){
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
        @import '../../common/stylus/dialog.styl';
        .customeLevel-wrapper
            padding-bottom 10px
        .disabled
            background $text-lll !important
        .confirm-container
            margin 0
            padding 0
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
                overflow hidden
                &:last-child
                    border none
                .content
                    display flex
                    max-width 70%
                    /* flex 1 */
                    span
                        color $text-lll
                        /* flex 1 */
                        /* text-align right */
                    .maxtext
                        display block
                        overflow hidden
                        width 100%
                        white-space nowrap
                        text-overflow ellipsis
                    .selected
                        color $text-l
                    input
                        text-align right
                        /* flex 1 */
                .label 
                    color $text-l
        .popup-header
            display flex
            line-height 40px
            padding-right 15px
            h4
                flex 1
        .submit
            margin 10px 15px
            line-height 50px
            background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
            box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
            border-radius 5px
            color #fff
    </style>