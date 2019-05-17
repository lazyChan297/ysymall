<template>
    <div class="friendship-wrapper" v-if="ready">
        <!-- <ul class="tab">
            <router-link to="/friendship/inviter" tag="li">访客</router-link>
            <router-link to="/friendship/customer" tag="li">扫码客</router-link>
            <router-link to="/friendship/friends" tag="li">一度人脉</router-link>
        </ul> -->
        <ul class="tab">
            <li @click="switchTab('friends')" :class="current=='friends'?'active':''">一度人脉</li>
            <li @click="switchTab('customer')" :class="current=='customer'?'active':''">扫码客</li>
            <li @click="switchTab('inviter')" :class="current=='inviter'?'active':''">访客</li>
        </ul>
        <user-list :vistors="vistors"></user-list>
        <!-- <p style="padding-top:100px">该页面正在开发中～敬请期待！</p> -->
    </div>
</template>
<script>
import UserList from '@/views/userList/index'
export default {
    data() {
        return {
            vistors:null,
            current:'friends',
            ready:global.ready
        }
    },
    mounted() {
        this.getlist('friends')
    },
    components:{
        UserList
    },
    methods:{
        switchTab(type) {
            this.current = type
            this.getlist(type)
        },
        getlist(type){
            // 获取扫码客
            let url = ''
            if(type == 'inviter') {
                url = '/customer/service/get-visitors'
            } else if (type === 'customer') {
                url = '/customer/service/get-scanners'
            } else {
                url = '/customer/service/get-first-layer-friends'
            }
            this.$axios.post(url).then((res)=>{
                if(res.data.code === 200) {
                    this.vistors = res.data.data
                }
            })
        },
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.friendship-wrapper
    .tab
        position fixed
        width 100%
        bottom 0
        display flex
        background #fff
        li 
            flex 1
            font-size 18px
            line-height 50px
            &.active
                color $green
                font-weight bold
</style>