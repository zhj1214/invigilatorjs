<template>
  <view class="order-detail-car-info">
    <view class="title">价格明细</view>
    <view v-if="orderItemDetail.carFacade">
      <text>{{ orderItemDetail.carFacade.colorName }}+{{ orderItemDetail.carFacade.paintingName }}</text>
      <text v-if="orderItemDetail.carFacade.price && showPriceFlag">
        <text class="yuan">￥</text>
        {{ formatMoney(orderItemDetail.carFacade.price, 0, 0) }}
      </text>
      <text v-if="!orderItemDetail.carFacade.price && showPriceFlag">价格已包含</text>
      <text v-if="!showPriceFlag">价格待定</text>
    </view>
    <view v-if="orderItemDetail.carRim">
      <text>{{ orderItemDetail.carRim.rimName }}</text>
      <text v-if="orderItemDetail.carRim.price && showPriceFlag">
        <text class="yuan">￥</text>
        {{ formatMoney(orderItemDetail.carRim.price, 0, 0) }}
      </text>
      <text v-if="!orderItemDetail.carRim.price && showPriceFlag">价格已包含</text>
      <text v-if="!showPriceFlag">价格待定</text>
    </view>
    <view v-if="orderItemDetail.carInterior">
      <text>{{ orderItemDetail.carInterior.colorName }}+{{ orderItemDetail.carInterior.materialName }}</text>
      <text v-if="orderItemDetail.carInterior.price && showPriceFlag">
        <text class="yuan">￥</text>
        {{ formatMoney(orderItemDetail.carInterior.price, 0, 0) }}
      </text>
      <text v-if="!orderItemDetail.carInterior.price && showPriceFlag">价格已包含</text>
      <text v-if="!showPriceFlag">价格待定</text>
    </view>
    <view v-for="pk in orderItemDetail.optionalPackage || []" :key="pk.name">
      <text>{{ pk.name }}</text>
      <text v-if="pk.price && showPriceFlag">
        <text class="yuan">￥</text>
        {{ formatMoney(pk.price, 0, 0) }}
      </text>
      <text v-if="!pk.price && showPriceFlag">价格已包含</text>
      <text v-if="!showPriceFlag">价格待定</text>
    </view>
    <view>
      <text>总计</text>
      <text v-if="showPriceFlag">
        <text class="yuan">￥</text>
        {{ getTotalMoney(orderItemDetail) }}
      </text>
      <text v-else>价格待定</text>
    </view>
  </view>
</template>

<script setup lang="ts" name="PriceInfo">
import { formatMoney } from '@util/money'
import useDetail from './detail'

const { orderItemDetail, showPriceFlag, getTotalMoney } = useDetail()
</script>

<style scoped lang="scss">
.order-detail-car-info {
  padding: 0 40rpx;

  .title {
    margin: 107rpx 0 35rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #292c2e;
  }

  view {
    display: flex;
    justify-content: space-between;

    // align-items: center;
    min-height: 64rpx;
    padding: 11rpx 0;

    .label {
      min-width: 200rpx;
    }

    text {
      font-size: 30rpx;
      color: #696b6c;
      line-height: 41rpx;

      .yuan {
        font-size: 24rpx;
      }
    }

    text:last-child {
      text-align: right;
      flex: 1;
      min-width: 0;
      word-break: break-all;
    }
  }
}
</style>
