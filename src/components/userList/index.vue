<template>
    <div class="userList-wrapper" :class="level==='generalAgent'?'agent':'vip'">
        <ul class="list">
            <div class="list-title" v-if="vipInfo">
                <div>已开通：<span :class="level==='generalAgent'?'red':'green'">{{vipInfo.vipUsed}}</span>人</div>
                <div>还可开通：<span :class="level==='generalAgent'?'red':'green'">{{vipInfo.vipLeft}}</span>人</div>
            </div>
            <div class="list-title" v-else-if="generalInfo">
                <div>已开通：<span :class="level==='generalAgent'?'red':'green'">{{generalInfo.generalAgentUsed}}</span>人</div>
                <div>还可开通：<span :class="level==='generalAgent'?'red':'green'">{{generalInfo.generalAgentLeft}}</span>人</div>
            </div>
            <li class="item" v-for="(item,index) in list">
                <img v-lazy="item.avatar" alt="" width="54">
                <div class="center">
                    <div class="name">{{item.nickname}}</div>
                    <div class="mobile">{{item.mobile}}</div>
                </div>
                <!-- 设置级别 -->
                <div class="right" v-if="level==='level'" @click="setLevel(item)">设置级别</div>
                <div class="right" v-else @click="setLevel(item)">{{level==='vip'?"去开通VIP":'去开通总代'}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    props:{
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
        }
    },
    mounted(){
        console.log(this.level)
    },
    methods:{
        setLevel(customer){
            this.saveCurrentCustomer(customer)
            if(this.level === 'level') {
                this.$router.push('/customLevel')
            } else {
                console.log('....')
                this.$router.push(`/openDetail/${this.level}`)
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