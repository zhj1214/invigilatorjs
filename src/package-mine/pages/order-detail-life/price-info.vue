<template>
  <view class="order-detail-info">
    <view>
      <text>商品总价</text>
      <view class="order-detail-info-price">
        <view v-if="subtotalPrice > 0" class="amount">￥{{ formatMoney(subtotalPrice) }}</view>
        <view v-if="subtotalPoint > 0" class="points">
          <view v-if="subtotalPrice > 0" class="points-symbol">+</view>
          <image class="points-icon" :src="orderDetailPointDetail" />
          <view class="points-amount">{{ subtotalPoint }}</view>
        </view>
      </view>
    </view>
    <view>
      <text>运费</text>
      <text>￥{{ formatMoney(orderDetail.shipAmount) }}</text>
    </view>
    <view v-if="orderDetail.totalCouponAmount && orderDetail.totalCouponAmount > 0">
      <text>优惠金额</text>
      <text>-￥{{ formatMoney(orderDetail.totalCouponAmount) }}</text>
    </view>
    <view>
      <text>实付金额</text>
      <common-price :point="orderDetail.totalPointNum" :price="orderDetail.totalAmount" />
    </view>
  </view>
</template>

<script setup lang="ts" name="PriceInfo">
import { inject } from 'vue'
import { formatMoney } from '@util/money'
import commonPrice from './common-price.vue'
import { useDetail } from './detail'
const { orderDetail, subtotalPoint, subtotalPrice } = useDetail()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailPointDetail = gdp('order-detail-point-detail.png')
</script>

<style scoped lang="scss">
.order-detail-info {
  margin: 0 40rpx;
  padding: 44rpx 0;
  border-bottom: 1rpx solid #e4e7ea;

  view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64rpx;
    padding: 11rpx 0;

    text {
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #696b6c;
      line-height: 41rpx;
    }

    text:last-child {
      text-align: right;
    }
  }

  .order-detail-price {
    display: flex;
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    color: #696b6c;

    &-amount {
      font-size: 32rpx;
      color: #4e6175;
    }

    .points {
      display: flex;
      align-items: center;

      &-symbol {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        color: #4e6175;
      }

      image {
        width: 26rpx;
        height: 26rpx;
      }

      &-num {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        color: #4e6175;
      }
    }
  }
}
</style>
