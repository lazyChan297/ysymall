<template>
    <div class="openListRecord-wrapper">
        <ul v-if="recordList">
            <li v-for="(item,index) in recordList" :key="index">
                <img :src="item.avatar" alt="" width="54">
                <div>
                    <div>
                        <div class="name">{{item.nickname}}</div>
                        <div class="acccount">开通金额:¥{{item.amount}}</div>
                    </div>
                    <div class="date">
                        开通时间：{{item.time}}
                    </div>
                </div>
            </li>
        </ul>
        <div class="nomore" v-else>暂无数据</div>
    </div>
</template>
<script> 
export default {
    data(){
        return {
            recordList:null
        }
    },
    created() {
        
    },
    mounted(){
        this.getRecord(this.$route.params.type)
    },
    methods:{
        getRecord(type){
            let url = ''
            if(type === 'level') {
                url = '/customer/level/upgrade-records'
            } else {
                url = '/customer/level/upgrade-list'
            }
            this.$axios.post(url).then((res)=>{
                if(res.data.code === 200) {
                    this.recordList = res.data.data
                }
            })
        }
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