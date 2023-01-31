<template>
  <view>
    <scroll-view scroll-y class="content">
      <rich-text :nodes="detail" />
    </scroll-view>
    <view class="bottom border-top-1">
      <view v-if="tempData.price" class="price">
        <text class="text1">￥</text>
        <text class="text2">{{ formatMoney(tempData.price, 0, 0) }}</text>
      </view>
      <view v-else class="price price-none">价格已包含</view>
      <view class="btn" @click="checkSeries">确认选择</view>
    </view>
  </view>
</template>

<script setup lang="ts" name="PackagesDetail">
import { computed } from 'vue'
import { formatMoney } from '@util/money'
import { useCarStore } from '@src/pinia/car'
const carStore = useCarStore()

const vehicle = computed(() => carStore.vehicle).value
const tempData = computed(() => carStore.tempData).value
const detail = computed(() => {
  const details = tempData.detail && JSON.parse(tempData.detail)
  const richText = details?.filter((item: AnyObject) => item.type === 0) || {}
  return richText?.[0]?.text || ''
}).value
const checkSeries = () => {
  setVehicle()
  setTimeout(() => {
    uni.navigateBack({
      delta: 1
    })
  })
}
const setVehicle = () => {
  const packages = JSON.parse(JSON.stringify(vehicle.packages))
  if (packages.findIndex((pk: Car.Packages) => pk.id === tempData.id) < 0) {
    packages.push(tempData)
    carStore.setVehicle({ packages: packages })
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  background: #fff;
  z-index: 9999;

  .price {
    height: 84rpx;
    line-height: 84rpx;

    &.price-none {
      color: #92969a;
    }

    text {
      color: #4e6175;
      line-height: 84rpx;
      vertical-align: middle;
    }

    .text1 {
      font-size: 26rpx;
      font-weight: 400;
    }

    .text2 {
      font-size: 40rpx;
      font-weight: bold;
    }
  }

  .btn {
    width: 232rpx;
    height: 84rpx;
    background: #1a1a1a;
    border-radius: 1px;
    color: #fff;
    line-height: 84rpx;
    text-align: center;
  }
}
</style>
