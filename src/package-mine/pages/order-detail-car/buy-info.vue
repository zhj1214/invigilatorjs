<template>
  <view v-if="orderDetail && orderDetail.extraMap && orderDetail.extraMap.purchaser" class="order-detail-car-info">
    <view class="title">购买信息</view>
    <view>
      <text class="label">购买人姓名</text>
      <text>{{ orderDetail.extraMap.purchaser.name }}</text>
    </view>
    <view>
      <text>手机号码</text>
      <text>{{ orderDetail.extraMap.purchaser.mobile }}</text>
    </view>
    <view v-if="vehiclePayType !== 1">
      <text>证件类型</text>
      <text>{{ idTypeMaps[orderDetail.extraMap.purchaser.certificateType] }}</text>
    </view>
    <view v-if="vehiclePayType !== 1">
      <text>证件号码</text>
      <text>{{ orderDetail.extraMap.purchaser.certificateNumber }}</text>
    </view>
    <view v-if="orderDetail && orderDetail.dealer && orderDetail.dealer.dealerName">
      <text>服务商</text>
      <text>{{ orderDetail.dealer.dealerName }}</text>
    </view>
  </view>
</template>

<script setup lang="ts" name="BuyInfo">
import useDetail from './detail'

const { orderDetail, vehiclePayType, idTypeMaps } = useDetail()
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
