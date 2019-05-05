<template>
    <div class="cartcontrol-wrapper">
        <div class="icon icon-minus" @click.stop="minus"></div>
        <input type="tel" v-model="good.qty" class="num" v-on:input="inputchange"></input>
        <div class="icon icon-add" @click.stop="add"></div>
    </div>
</template>
<script>
    import {debounce} from '@/common/js/util';
    export default {
        props:{
            good: {
                type: Object,
                default: null
            }
        },
        methods: {
            minus() {
                this.$emit('minus')
            },
            add() {
                this.$emit('add')
            },
            inputchange(val) {
                this.$emit('input',val.target.value)
            }
        }
    }
</script>
<style lang="stylus" scoped>
.cartcontrol-wrapper
    display flex
    align-items center
    .num
        color $text-l
        margin 0 10px
        width 20px
        text-align center
</style>
