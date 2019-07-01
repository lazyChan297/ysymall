<template>
    <div></div>
</template>
<script>
export default {
    beforeRouterEnter(to,from,next){
        console.log(from)
        next()
    },
    created() {
        if(!sessionStorage.getItem('isOpen')) {
            window.location.reload()
            sessionStorage.setItem('isOpen',true)
        } else {
            window.location.href = global.serverHost + '#/login?redirect=/setting'
        }
    }
}
</script>

