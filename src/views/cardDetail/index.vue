<template>
    <div class="cardDetail-wrapper">
        <div class="cardImageContainer">
            <img src="../../common/images//card.png" alt="" v-if="!cardSrc">
            <img :src="cardSrc" alt="" v-else>
            <div class="desc">(长按二维码保存或发送名片)</div>
        </div>
        <div class="article">
            <div class="cell">
                <span class="label">姓名</span>
                <input type="text" v-model="name" placeholder="请输入姓名">
            </div>
            <div class="cell">
                <span class="label">手机</span>
                <input type="text" v-model="mobile" placeholder="请输入手机号码">
            </div>
            <div class="cell">
                <span class="label">电话</span>
                <input type="text" v-model="tel" placeholder="请输入电话">
            </div>
            <div class="cell">
                <span class="label">邮箱</span>
                <input type="text" v-model="email" placeholder="请输入邮箱">
            </div>
            <div class="cell" v-if="url">
                <span class="label">网址</span>
                <input readonly type="text" v-model="url"></input>
            </div>
            <div class="cell">
                <span class="label">公司</span>
                <input type="text" v-model="organization" placeholder="请输入公司">
            </div>
            <div class="cell">
                <span class="label">职务</span>
                <input type="text" v-model="title" placeholder="请输入职务">
            </div>
            <div class="cell textarea">
                <span class="label">地址</span>
                <textarea name="" id="" cols="30" rows="10" v-model="address" placeholder="请输入地址"></textarea>
            </div>
            <!-- <div class="cell">
                <span class="label">备注</span>
                <input type="text">
            </div> -->
        </div>
        <div class="submit" @click="submit">修改名片</div>
    </div>
</template>
<script>
    import Qs from 'qs'
    import {validPhone} from '@/common/js/validated'
    import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                name:'',
                mobile:'',
                email:'',
                tel:'',
                organization:'',
                title:'',
                address:'',
                cardSrc:undefined,
                url:''
            }
        },
        mounted(){
            let params = Qs.stringify({
                name:this.userInfo.nickname,
                mobile:this.userInfo.mobile
            })
            this.getCard(params)
            if(process.env.NODE_ENV == 'production') {
                // 禁止分享
                this.$wechat.ready(() => {
                    this.$wechat.hideMenuItems({
                        menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
                    });
                })
            }
        },
        methods:{
            getCard(params){
                this.$axios.post('/customer/service/generate-biz-card',params).then((res)=>{
                    if(res.data.code === 200) {
                        let data = res.data.data
                        this.cardSrc = data.bizCardUrl
                        this.name = data.name
                        this.mobile = data.mobile
                        this.address = data.address
                        this.title = data.title
                        this.email = data.email
                        this.tel = data.tel
                        this.url = data.url
                        this.organization = data.organization
                         this.$vux.toast.show({
                            text:'顶部已生成名片！',
                            type:'success'
                        })
                    } else if (res.data.code === 1000000) {
                        this.$vux.toast.show({
                            text:res.data.message,
                            type:'warn'
                        })
                        let timer = setTimeout(()=>{
                            this.$router.go(-1)
                        },2000)
                    }
                })
            },
            submit(){
                if(!this.name) {
                    this.$vux.toast.show({
                        text:'请输入姓名',
                        type:'warn'
                    })
                    return false 
                }
                let valid = validPhone(this.mobile)&&this.name !== ''
                if(!valid) {
                    return false
                }
                let params = Qs.stringify({
                    name:this.name,
                    mobile:this.mobile,
                    email:this.email,
                    tel:this.tel,
                    title:this.title,
                    organization:this.organization,
                    address:this.address
                })
                this.getCard(params)
            }
        },
        computed:{
            ...mapGetters([
                'userInfo'
            ])
        }
    }
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
    .cardDetail-wrapper
        padding-bottom 10px
    .cardImageContainer
        padding 10px 0
        img
            width 90%
    .desc
        line-height 30px
    .article
        background #fff
        padding 0 15px
        .cell
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px solid #efefef
            height 50px
            line-height 50px
            .label
                color $text-lll
            input
                color $text-l
                text-align right
                min-width 0
                height 100%
                flex 1
            textarea
                flex 1
                height 45px
                min-height 45px
                font-size 16px
                text-align right
                margin-left 15px
                color $text-l
            &.textarea
                height 100px
                align-items baseline
    .submit
        background:linear-gradient(180deg,rgba(0,132,255,1) 0%,rgba(69,165,255,1) 100%);
        box-shadow:0px 4px 7px 0px rgba(163,206,255,0.76)
        border-radius 5px
        color #fff
        font-weight bold
        line-height 50px
        margin 20px 15px 0
</style>