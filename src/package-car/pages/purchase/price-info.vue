<template>
  <view class="group">
    <view class="group-title">价格明细</view>
    <!-- 车系价格 -->
    <view class="price-item items-center justify-between">
      <view class="label ellipsis">{{ model.attrs.title }}</view>
      <view class="price items-center justify-end">
        <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <view v-if="model.attrs.price">
            <text class="symbal">￥</text>
            {{ formatMoney(model.attrs.price, 0, 0) }}
          </view>
          <text v-else>价格已包含</text>
        </template>
        <text v-else>价格待定</text>
      </view>
    </view>
    <!-- 外饰颜色和喷漆价格 -->
    <view v-if="vehicle.outColor || vehicle.outPainting" class="price-item items-center justify-between">
      <view class="label ellipsis">{{ outText }}</view>
      <view class="price items-center justify-end">
        <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <view v-if="vehicle.outPrice">
            <text class="symbal">￥</text>
            {{ formatMoney(vehicle.outPrice, 0, 0) }}
          </view>
          <text v-else>价格已包含</text>
        </template>
        <text v-else>价格待定</text>
      </view>
    </view>
    <!-- 轮毂价格 -->
    <view v-if="vehicle.rim" class="price-item items-center justify-between">
      <view class="label ellipsis">{{ vehicle.rim.name || '' }}</view>
      <view class="price items-center justify-end">
        <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <view v-if="vehicle.rimPrice">
            <text class="symbal">￥</text>
            {{ formatMoney(vehicle.rimPrice, 0, 0) }}
          </view>
          <text v-else>价格已包含</text>
        </template>
        <text v-else>价格待定</text>
      </view>
    </view>
    <!-- 内饰颜色和内饰材质价格 -->
    <view v-if="vehicle.rim" class="price-item items-center justify-between">
      <view class="label ellipsis">{{ innerText }}</view>
      <view class="price items-center justify-end">
        <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <view v-if="vehicle.innerPrice">
            <text class="symbal">￥</text>
            {{ formatMoney(vehicle.innerPrice, 0, 0) }}
          </view>
          <text v-else>价格已包含</text>
        </template>
        <text v-else>价格待定</text>
      </view>
    </view>
    <!-- 选装价格 -->
    <view v-for="pk in vehicle.packages" :key="pk.id" class="price-item items-center justify-between">
      <view class="label ellipsis">{{ pk.name || '' }}</view>
      <view class="price items-center justify-end">
        <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <view v-if="pk.price">
            <text class="symbal">￥</text>
            {{ formatMoney(pk.price, 0, 0) }}
          </view>
          <text v-else>价格已包含</text>
        </template>
        <text v-else>价格待定</text>
      </view>
    </view>
    <!-- 总计 -->
    <view class="price-item price-item-total items-center justify-between">
      <text class="label">总计</text>
      <view class="price items-center justify-end">
        <view v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
          <text class="symbal">￥</text>
          {{ formatMoney(totalPrice, 0, 0) }}
        </view>
        <text v-else>价格待定</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" name="PriceInfo" setup>
import usePurchase from './purchase'
import { formatMoney } from '@util/money'

const { model, vehicle, outText, innerText, totalPrice } = usePurchase()
</script>

<style lang="scss" scoped>
.group {
  padding: 72rpx 40rpx 56rpx;

  .group-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #292c2e;
    margin-bottom: 40rpx;
  }
}

.price-item {
  height: 64rpx;
  overflow: hidden;

  .label {
    font-size: 28rpx;
    color: #909ca8;
    flex: 1;
  }

  .price {
    flex-basis: 220rpx;
    font-size: 30rpx;
    color: #292c2e;

    .symbal {
      font-size: 24rpx;
    }
  }

  &-total {
    height: 93rpx;

    .price {
      font-size: 36rpx;
      color: #4e6175;
    }
  }
}
</style>
