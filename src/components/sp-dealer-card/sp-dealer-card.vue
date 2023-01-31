<template>
  <view class="flex-col dealer-item">
    <image :src="dealer.image || dealerDefaultImg" class="image" />
    <view class="flex-col dealer-info">
      <text class="name font-medium">{{ dealer.name || '' }}</text>
      <text class="address">{{ dealer.address || '' }}</text>
    </view>
  </view>
</template>

<script lang="ts" name="SpDealerCard" setup>
import { inject, toRefs } from 'vue'
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
const props = defineProps({
  dealer: {
    type: Object,
    required: true
  }
})
// 经销商默认图片
const dealerDefaultImg = gdp('dealer-default.png')

const { dealer } = toRefs(props)
</script>

<style lang="scss" scoped>
.dealer-item {
  width: 100%;
  padding: 0 32rpx;
  margin-bottom: 57rpx;

  .image {
    width: 100%;
    height: 288rpx;
  }

  .dealer-info {
    margin-top: 24rpx;

    .name {
      color: #213a53;
      font-size: 30rpx;
      font-weight: 500;
      line-height: 45rpx;
      white-space: nowrap;
    }

    .address {
      margin-top: 3rpx;
      color: rgb(146 150 154);
      font-size: 26rpx;
      line-height: 38rpx;
      white-space: nowrap;
    }
  }
}
</style>
