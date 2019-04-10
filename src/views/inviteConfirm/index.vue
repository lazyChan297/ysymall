<template>
    <div class="inviteConfirm">
        <div class="confirm-container">
            <img :src="inviter.avatar" alt="" width="70" height="70">
            <p class="name">{{inviter.nickname}}</p>
            <p class="desc">邀请你加入缘生源</p>
            <div class="submit" @click="submit">接受邀请</div>
        </div>
    </div>
</template>
<script>
import Qs from 'qs'
export default {
    data(){
        return {
            inviter:'',
            userSn:''
        }
    },
    mounted(){
        this.userSn = this.$route.query.inviter
        this.getInviter(this.userSn)
    },
    methods:{
        // 获取邀请人信息
        getInviter(sn){
            let params = Qs.stringify({inviter:sn})
            this.$axios.post('/customer/service/get-inviter-info',params).then((res)=>{
                if(res.data.code === 200) {
                    this.inviter = res.data.data.inviterInfo
                }
            })
        },
        // 接受邀请
        submit(){
            let params = Qs.stringify({inviter:this.userSn})
            this.$axios.post('/customer/service/confirm-inviter',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'接受邀请成功！',
                        type:'success'
                    })
                    let timer = setTimeout(()=>{
                        this.$router.push({path:'/login'})
                    },1000) 
                } else if (res.data.code=== 1000008){
                    this.$vux.toast.show({
                        text:res.data.message,
                        type:'warn'
                    })
                    let timer = setTimeout(()=>{
                        this.$router.push({path:'/'})
                    },1000) 
                }
                
            })
        }
    }
}
</script>

<style lang="stylus" scoped>
 @import '../../common/stylus/variable.styl';
.inviteConfirm
    padding-top 170px
.confirm-container
    margin 0 63px 0
    background #fff
    box-shadow 0px 4px 8px 0px rgba(0,0,0,0.15)
    border-radius 8px
    height 200px
    img
        margin-top -35px
        border-radius 50%
    .name
        font-size 20px
        color $text-l
        margin-top 5px
        line-height 28px
    .desc
        font-size 16px
        color $text-ll
        margin-bottom 43px
    .submit
        border-radius 30px
        line-height 50px
        color #fff
        margin 0 30px
        background linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%)
        box-shadow 0px 4px 7px 0px rgba(0,132,255,0.3)
</style>

