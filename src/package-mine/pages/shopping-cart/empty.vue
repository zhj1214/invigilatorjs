<template>
  <view class="empty flex-col items-center justify-center">
    <image class="img" :src="shoppingCartLargeImg" mode="aspectFill" />
    <view class="desc font-normal">
      您的购物车居然是空的，
      <text class="link" @click="goToLife">去逛逛</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const shoppingCartLargeImg = gdp('shopping-cart-large.png')

function goToLife() {
  uni.switchTab({
    url: '/pages/life/index'
  })
}
</script>
<style lang="scss" scoped>
$footer-height: calc(120rpx + env(safe-area-inset-bottom));
$scroll-height: calc(100vh - 103rpx - $footer-height - var(--window-top));

.empty {
  height: $scroll-height;

  .img {
    width: 144rpx;
    height: 144rpx;
  }

  .desc {
    color: #909ca8;
    font-size: 26rpx;
    margin-top: 40rpx;
  }

  .link {
    color: #4e6175;
    text-decoration: underline;
  }
}
</style>
