<template>
    <div class="userList-wrapper" :class="level==='generalAgent'?'agent':'vip'">
        <ul class="list" v-if="list.length>0">
            <div class="list-title" v-if="vipInfo">
                <div>已开通：<span :class="level==='generalAgent'?'red':'green'">{{vipInfo.vipUsed}}</span>人</div>
                <div>还可开通：<span :class="level==='generalAgent'?'red':'green'">{{vipInfo.vipLeft}}</span>人</div>
            </div>
            <div class="list-title" v-else-if="generalInfo">
                <div>已开通：<span :class="level==='generalAgent'?'red':'green'">{{generalInfo.generalAgentUsed}}</span>人</div>
                <div>还可开通：<span :class="level==='generalAgent'?'red':'green'">{{generalInfo.generalAgentLeft}}</span>人</div>
            </div>
            <li class="item" v-for="(item,index) in list" :key="index">
                <img v-lazy="item.avatar" alt="" class="avatar">
                <div class="center">
                    <div class="name">{{item.nickname}}</div>
                    <span class="level">{{getLevel(item.level)}}</span>
                    <div class="mobile">{{item.mobile}}</div>
                </div>
                <!-- 设置级别 -->
                <div class="right">
                    <div v-if="level==='level'" @click="setLevel(item)" class="btn">开通合伙人</div>
                    <div v-else @click="setLevel(item)">{{level==='vip'?"去开通VIP":'去开通总代'}}</div>
                    <router-link class="edit" v-if="item.level==='countyAgent'||item.level==='cityAgent'||item.level==='provinceAgent'" :to="{path:`/editAgent/${item.sn}`}">编辑合伙人</router-link>
                </div>
            </li>
        </ul>
        <div class="empty" v-else>{{empty}}</div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
import {debounce} from '@/common/js/util'
export default {
    data(){
        return {
            
        }
    },
    props:{
        empty:{
            type:String
        },
        level:{
            type:String
        },
        list:{
            type:Array,
            default:null
        },
        vipInfo:{
            type:Object,
            required:false
        },
        generalInfo:{
            type:Object,
            required:false
        },
        loading:{
            type: Boolean,
            default:false
        }
    },
    mounted(){
        addEventListener('scroll',this.handleScroll)
    },
    methods:{
        setLevel(customer){
            this.saveCurrentCustomer(customer)
            if(this.level === 'level') {
                this.$router.push(`/customLevel/open/${customer.sn}`)
            } else {
                this.$router.push(`/openDetail/${this.level}`)
            }
        },
        handleScroll(){
            let scrollTop =  document.documentElement.scrollTop||document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动到底部
            if(scrollTop+windowHeight==scrollHeight){
                this.$emit('loadMore')            
            }   
        },
        getLevel(level){
            switch(level){
                case "member":
                    return "普通会员";
                    break;
                case "vip":
                    return "VIP";
                    break;
                case "generalAgent":
                    return "总代";
                    break;
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
        ...mapMutations({
            saveCurrentCustomer:'SAVE_CURRENT_CUSTOMER'
        })
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.empty
    font-size 14px
    padding-top 100px
    color $text-lll
/* VIP */
.vip
    .right
        .btn
            background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
/* 总代 */
.agent
    .right
        .btn
            background linear-gradient(180deg,rgba(255,167,178,1) 0%,rgba(255,106,124,1) 100%)
.userList-wrapper
    height 100%
.list
    background #fff
    height 100%
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
        margin 23px 15px 0
        border-bottom 1px solid #efefef
        padding-bottom 23px
        padding-top 10px
        align-items center
        &:last-child
            border none
        img
            border-radius 50%
            width 54px
            height 54px
        .center
            text-align left
            margin-left 10px
            flex 1
            .level
                display inline-block
                background $text-lll
                color #fff
                border-radius 30px
                padding 0 15px
                line-height 24px
                font-size 14px
                margin-bottom 4px
            .level + .mobile
                margin-top 0
            .name
                color $text-l
                font-weight bold
                font-size 18px
                margin-bottom 4px
            .mobile
                color $text-ll
                font-size 14px
                margin-top 10px
        .right
            .btn
                border-radius 30px
                color #ffffff
                line-height 30px
                font-weight bold
                width 100px
            .edit
                display block
                color $text-lll
                font-size 14px
                margin-top 10px
</style>