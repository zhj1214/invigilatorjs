<template>
  <view class="after-sale-detail-life">
    <view class="after-sale-detail-life-status">{{ getStatusDetailText(afterSaleInfo.status) }}</view>
    <view class="after-sale-detail-life-time">
      <template v-if="afterSaleInfo.status === Status.ToBeReviewed">
        <text>剩余时间</text>
        <uni-countdown class="after-sale-detail-life-time-count-down" :show-day="false" :hour="0" :minute="0" color="#4E6175" splitor-color="#4E6175" :second="seconds" />
      </template>
      <view v-if="afterSaleInfo.status === Status.Passed">请尽快完成退货</view>
      <view v-if="afterSaleInfo.status === Status.InInspection">请耐心等待商家验货</view>
    </view>
    <view v-if="afterSaleInfo.status !== Status.Success" class="after-sale-detail-life-line" />
    <view v-if="afterSaleInfo.status !== Status.Success" class="after-sale-detail-life-step">
      <scroll-view scroll-x class="steps-wrap">
        <uni-steps :class="{ 'more-steps': options.length > 4 }" :options="options" :active="active" class="steps" />
      </scroll-view>
    </view>
    <view v-else class="after-sale-detail-life-success">
      <view class="refund">
        <view class="refund-label">退款总金额：</view>
        <view v-if="afterSaleInfo.totalAmount > 0" class="refund-amount">￥{{ formatMoney(afterSaleInfo.totalAmount) }}</view>
        <view v-if="afterSaleInfo.totalPointNum > 0" class="refund-points">
          <view v-if="afterSaleInfo.totalAmount > 0" class="refund-points-symbol">+</view>
          <image class="refund-points-icon" :src="orderDetailPointTotal" />
          <view class="refund-points-amount">{{ afterSaleInfo.totalPointNum }}</view>
        </view>
      </view>
      <view>退款时间：{{ afterSaleInfo.updatedAt }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="AfterSaleDetailLife">
import { inject, defineProps } from 'vue'
import { formatMoney } from '@util/money'
import { Enum } from '@src/lib/enmu'

defineProps<{
  afterSaleInfo: AfterSale.DetailInfo
  options: Array<AnyObject>
  active: number
  seconds: number
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailPointTotal = gdp('order-detail-point-total.png')

const { getStatusDetailText, Status } = Enum.AfterSale
</script>

<style lang="scss" scoped>
.after-sale-detail-life {
  &-line {
    border-bottom: 1rpx solid #e4e7ea;
  }

  &-status {
    padding: 0 40rpx;
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    color: #292c2e;
    line-height: 83rpx;

    // margin-bottom: 31rpx;
  }

  &-time {
    padding: 0 40rpx;
    font-size: 30rpx !important;
    color: #4e6175 !important;
    margin-bottom: 48rpx;
    display: flex;
    align-items: center;

    &-count-down {
      margin-left: 16rpx;
    }
  }

  &-step {
    // padding: 0 40rpx;
    .steps-wrap {
      margin: 80rpx 0;
    }

    // #ifdef H5
    .more-steps {
      width: 150vw;
    }

    // #endif
  }

  &-success {
    padding: 22rpx 40rpx 96rpx;
    font-size: 32rpx;
    color: #909ca8;

    .refund {
      display: flex;
      height: 47rpx;
      font-size: 32rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #4e6175;
      line-height: 47rpx;

      &-label {
        color: #909ca8;
      }

      &-points {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #4e6175;
        display: flex;

        &-symbol {
          position: relative;
          top: -4rpx;
          margin: 0 4rpx;
        }

        &-icon {
          width: 28rpx;
          height: 28rpx;
          position: relative;
          top: 8rpx;
          margin-right: 4rpx;
        }
      }
    }
  }
}
</style>
