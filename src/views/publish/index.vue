<template>
    <div class="publish-wrapper">
        <div class="title">
            <span class="cancel" @click="back">取消</span>
            <span class="submit">发现</span>
        </div>
        <div class="textarea-container">
            <textarea name="" id="" cols="30" rows="10"></textarea>
        </div>
        <div class="chooseImage-container">
            <div v-for="(item,index) in imglist" :key="index">
                <div class="icon icon-delete" @click="deleteItem(index)"></div>
                <img :src="item" alt="">
            </div>
            <div class="addImage" @click="chooseImg">
                <div class="icon icon-addImage"></div>
            </div>
        </div>
    </div>
</template>
<script>
const MAX_LEN = 9
export default {
    data() {
        return {
            imglist: []
        }
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        chooseImg() {
            if ((MAX_LEN - this.imglist.length) === 0) {
                return false
            }
            let imglist = this.imglist
            let reset = MAX_LEN - this.imglist.length
            let that = this
            let before = []
            imglist.forEach((item,index)=>{
                before.push(item)
            })
            this.$wechat.chooseImage({
                count: reset, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    let localIds = res.localIds;
                    let newlist = before.concat(localIds)
                    that.imglist = newlist
                }
            });
        },
        deleteItem(index) {
            let imglist = this.imglist
            imglist.splice(index,1)
            this.imglist = imglist
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/variable.styl';
    div.publish-wrapper
        background #fff !important
        height 100%
    .title
        line-height 50px
        display flex
        justify-content space-between
        margin 0 15px
        border-bottom 1px solid $line
        .submit
            color $green
    .textarea-container
        display flex
    textarea
        flex 1
        margin 0 15px
        font-size 16px
        color $text-l
    .chooseImage-container
        padding 0 15px 10px
        display flex
        flex-flow wrap
        box-sizing border-box
        &>div
            display flex
            flex-flow column
            position relative
            width 90px
            height 90px
            margin-right 10px
            margin-bottom 10px
            img
                position absolute
                display block
                height 100%
                width 100%
                left 0
    .addImage
        width 90px
        height 90px
        background #efefef
    .icon-delete
        position absolute
        right -10px
        top -10px
</style>