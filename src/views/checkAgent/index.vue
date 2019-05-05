<template>
    <div class="checkAgent_wrapper">
        <div class="header">
            如果未选择任何省、市选项则系统会显示全国地区所有开通省级代理的状态列表，如果只悬着省信息则显示所辖市级代理开通状态，吐过两者皆悬着则显示该区域合伙人开通状态列表。
        </div>
        <div class="article">
            <div class="check-cell" @click="isShowLevel = true">
                <div>查询级别</div>
                <div>{{level[0] || '请选择级别'}}</div>
            </div>
            
            <div class="check-cell" v-if="level[0]=='省级'">
                <div>查询所在地区</div>
                <div>中国</div>
            </div>
            <div class="check-cell" @click="showAddress = true" v-else>
                <div>查询所在地区</div>
                <div>{{districtInfo || '请选择地区'}}</div>
            </div>
        </div>
        <div class="list-title">
            <div>省</div>
            <div>市</div>
            <div>县区</div>
            <div>状态</div>
        </div>
        <ul class="list">
            <li v-for="(item,index) in agentDistricts" :key="index">
                <div>{{item.province}}</div>
                <div>{{item.city}}</div>
                <div></div>
                <div>
                    <span class="status" :class="item.status=='已开通'?'active':''">{{item.status}}</span>
                </div>
            </li>
        </ul>
        <!-- 选择地区 -->
        <popup-picker :data="levelList" :show.sync="isShowLevel" v-show="false" @on-change="levelChange" v-model="level"></popup-picker>
        <p-address style="display: none;" title="选择地区" v-model="district" raw-value :list="areaData" :show.sync="showAddress"></p-address>
        
        <div class="footer">
            <div class="submit" @click="submit">查询</div>
        </div>
    </div>
</template>
<script>
let addrArray = [],provinceArray = [], cityArray = []
import {
        Popup,
        PopupPicker,
        XAddress as PAddress,
        XAddress as CAddress,
        Value2nameFilter as value2name} from 'vux';
import Qs from 'qs';
export default {
    data()  {
        return {
            isShowLevel:false,
            agentDistricts:[],
            level:[],
            levelList:[['省级','市级','区级']],
            showProvince: false,
            showAddress:false,
            showCity:false,
            addressData:[],
            provinceData:[],
            areaData:[],
            cityData:[],
            cityList:[],
            province:[],
            city:[],
            provinceId:'',
            cityId:'',
            district:[],
            districtId:'',
            cityDistrict:[]
        }
    },
    components:{
        Popup,
        PAddress,
        CAddress,
        PopupPicker
    },
    computed:{
        districtInfo:{
            get() {
                return this.areaDetail(this.district)
            },
            set() {
                return ''
            }
        }
    },
    watch:{
        district(val){
            let province = val[0]
            let city = val.length == 2 ? val[1] : undefined
            this.provinceId = province
            this.cityId = city
            // if(!this.district.length) return
        }
    },
    mounted(){
        this.getDistricts()
    },
    methods:{
        levelChange(v){
            this.district = []
            if(v[0] === '省级') {
                this.areaData = [{
                    name:"中国",
                    parant:"",
                    value:0
                }]
            } else if(v[0] === '市级') {
                this.areaData = provinceArray
            } else {
                this.areaData = cityArray
            }
        },
        getDistricts(){
            addrArray = districts.districts;
            let areaData = [],cityData = [];
            addrArray.forEach((item,index)=>{
                if(item.parent == 0) {
                    provinceArray.push(item)
                } 
                if(item.parent != 2) {
                    cityArray.push(item)
                }
            })
        },
        checkAgent(params){
            this.$axios.post('/customer/service/agent-districts',params).then((res)=>{
                if(res.data.code === 200) {
                    let areaList = res.data.data.agentDistricts
                    let agentDistricts = []
                    for(let i in areaList) {
                        if(areaList[i] == "未开通" || areaList[i] == "已开通") {
                            agentDistricts.push({
                                province:i,
                                city:'-',
                                county:'-',
                                status:areaList[i]
                            })
                        } else {
                            for(let j in areaList[i]) {
                            if(areaList[i][j] != "未开通" && areaList[i][j] != "已开通") {
                                for(let k in areaList[i][j]) {
                                    agentDistricts.push({
                                        province:i,
                                        city:j,
                                        county:areaList[i][j],
                                        status:areaList[i][j][k]
                                    })
                                }
                            } else {
                                agentDistricts.push({
                                    province:i,
                                    city:j,
                                    status:areaList[i][j]
                                })
                            }
                        }
                        }
                        
                    }
                    this.agentDistricts = agentDistricts
                    console.log(this.agentDistricts)
                } 
            })
        },
        areaDetail(value) {
            this.districtId = value[value.length-1]
            return value2name(value, this.areaData)
        },
        submit(){
            let params = Qs.stringify({
                province:this.provinceId,
                city:this.cityId
            })
            this.checkAgent(params)
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.header
    background #fff
    padding 15px
    margin-bottom 10px
    line-height 28px
    text-align left
.article
    padding 0 15px
    background #fff
    .check-cell
        display flex
        justify-content space-between
        line-height 50px
        border-bottom 1px solid $line
.list-title
    display flex
    line-height 50px
    div
        flex 1
.list
    background #fff
    padding 0 15px
    li
        display flex
        border-bottom 1px solid $line
        &>div
            flex 1
            line-height 50px
            .status
                display inline-block
                margin 0 auto
                color #fff
                border-radius 30px
                height 24px
                line-height 24px
                padding 0 6px
                background $text-lll
            .active
                background $green
.footer
    position fixed
    bottom 0
    left 0
    width 100%
    height 60px
    background #fff
    .submit
        line-height 50px
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        border-radius 5px
        color #fff
        font-weight bold
        margin 5px 15px
</style>