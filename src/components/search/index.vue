<template>
    <div class="searchPage-wrapper">
        <div class="search-wrapper">
            <div class="searchBox">
                <div class="icon icon-search"></div>
                <input type="text" placeholder="输入手机号或昵称" v-model="keywords">
            </div>
        </div>
        <slot></slot>
        <router-link class="checkMore" tag="div" :to="{path:`/openRecord/${checkType}`}">
            <span>查看开通记录</span>
            <div class="icon icon-link"></div>
        </router-link>
    </div>
</template>
<script>
import {debounce} from '@/common/js/util'
export default {
    props:{
        checkType:{
            type:String,
            default:null
        }
    },
    data(){
        return{
            keywords:''
        }
    },
    created(){
        this.$watch('keywords',debounce((newQuery)=>{
            this.$emit('keywords', newQuery)
        },200))
    }
}
</script>
<style lang="stylus" scoped>
.searchPage-wrapper
    height 100%
.search-wrapper
    padding 10px 15px
    background #fff
    height 60px
    box-sizing border-box
    .searchBox
        display flex
        align-items center
        background #efefef
        border-radius 30px
        height 40px
        padding-left 15px
        input
            background #efefef
            margin-left 10px
.checkMore
    position fixed
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    width 100%
    bottom 0
    background #fff
    height 50px
    color $text-l
    padding 0 15px
</style>