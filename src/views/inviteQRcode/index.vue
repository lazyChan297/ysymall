<template>
    <div v-if="ready">
        <div v-if="userInfo.level!=='registered'">
            <p class="title">邀请卡</p>
            <p class="desc">长按图片保存至相册</p>
            <img :src="posterUrl" alt="">
        </div>
        <div v-else class="empty">购买商品成为会员可使用该功能</div>
    </div>
</template>
<script>
const env = process.env.NODE_ENV
import {mapGetters,mapMutations} from 'vuex';
export default {
    data(){
        return {
            posterUrl:'',
            ready:global.ready
        }
    },
    mounted(){
        this.getUserInfo()
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
        getQRcode(){
            this.$axios.get('/customer/service/generate-poster').then((res)=>{
                if(res.data.code === 200) {
                    this.posterUrl = res.data.data.posterUrl
                }
            })
        },
        getUserInfo() {
            this.$axios.post('/customer/service/get-customer-info').then((res)=>{
                if(res.data.code === 200) {
                    let data = res.data.data
                    this.savaUserInfo(data.customerInfo)
                    this.getQRcode()
                }
            })
        },
         ...mapMutations({
            savaUserInfo:'SAVE_USERINFO'
        })
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    }
}
</script>
<style lang="stylus" scoped>
    .title
        font-size 18px
        color #4a4a4a
        font-weight bold
        padding 13px 0 5px
    .desc
        font-szie 14px
        color #4a4a4a
        margin-bottom 15px
    img
        width 90%
    .empty
        padding-top 100px
</style>