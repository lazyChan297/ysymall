<template>
    <div class="userOrders-wrapper">
        <div class="quantity">
          <span>订单数量</span>
          <span><span class="bold">1</span>笔</span>
        </div>  
    </div>
    <!-- <ul>
        <li class="order">
            <div class="cell">
                <label class="date">2019/01/16 15:59:41</label>
                <span>待收货</span>
            </div>
            <div class="goods-container">
                <div class="goods">
                    <img src="../../common/images/1812.png" width="80" height="80" alt="">
                    <div class="text">
                        <p>
                            <span class="name bold">姜汁洗发露</span>
                            <span class="price">¥39.80</span>
                        </p>
                        <p>
                            <span class="desc">生姜艾叶萃取润发护发精华发根护理、净爽控油</span>
                            <span class="quantity bold">x1</span>
                        </p>
                    </div>
                </div>
            </div>
        </li>
    </ul> -->
</template>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl";
.quantity
    display flex
    justify-content space-between
    padding 0 15px
    background $green
    color #fff
    line-height 45px
    .bold
        font-size 24px
</style>