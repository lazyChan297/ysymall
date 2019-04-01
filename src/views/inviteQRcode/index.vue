<template>
    <div>
        <p class="title">邀请卡</p>
        <p class="desc">长按图片保存至相册</p>
        <img :src="posterUrl" alt="">
    </div>
</template>
<script>
export default {
    data(){
        return {
            posterUrl:''
        }
    },
    mounted(){
        this.getQRcode()
    },
    methods:{
        getQRcode(){
            this.$axios.get('/customer/service/generate-poster').then((res)=>{
                if(res.data.code === 200) {
                    this.posterUrl = res.data.data.posterUrl
                }
            })
        }
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
</style>