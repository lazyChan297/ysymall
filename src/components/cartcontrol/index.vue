<template>
    <div class="cartcontrol-wrapper">
        <div class="icon icon-minus" @click.stop="minus"></div>
        <div class="num">{{good.quantity}}</div>
        <div class="icon icon-add" @click.stop="add"></div>
    </div>
</template>
<script>
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
</style>
