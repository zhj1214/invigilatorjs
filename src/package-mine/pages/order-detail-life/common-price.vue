<template>
  <view class="price">
    <template v-if="price > 0">
      <text>￥</text>
      <text>{{ formatMoney(price) }}</text>
    </template>
    <text v-if="price > 0 && point > 0">+</text>
    <template v-if="point > 0">
      <image class="img" :src="orderDetailPointDetail" />
      <text>{{ point }}</text>
    </template>
  </view>
</template>
<script lang="ts" setup name="CommonPrice">
import { inject } from 'vue'
import { formatMoney } from '@util/money'
defineProps<{
  price: number
  point: number
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailPointDetail = gdp('order-detail-point-detail.png')
</script>
<style lang="scss" scoped>
.price {
  font-size: 28rpx;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  color: #696b6c;

  .img {
    width: 26rpx;
    height: 26rpx;
  }
}
</style>
