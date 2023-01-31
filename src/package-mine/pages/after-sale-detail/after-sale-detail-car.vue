<template>
  <view class="after-sale-detail-car">
    <view class="after-sale-detail-car-status">
      <image class="img" :src="statusIcon" />
      <view class="text">
        <text class="status">{{ getStatusDetailText(afterSaleInfo.status) }}</text>
        <view v-if="afterSaleInfo.status === Status.ToBeReviewed" class="time">
          <text>剩余时间</text>
          <uni-countdown :show-day="false" color="#4E6175" background-color="#F8F8F8" splitor-color="#4E6175" :hour="0" :minute="0" :second="seconds" />
        </view>
      </view>
    </view>
    <view v-if="afterSaleInfo.status !== Status.Success" class="after-sale-detail-car-step">
      <scroll-view scroll-x class="steps-wrap">
        <uni-steps :class="{ 'more-steps': options.length > 4 }" :options="options" :active="active" class="steps" />
      </scroll-view>
    </view>
    <view v-else class="after-sale-detail-car-success">
      <view class="refund">
        <view class="refund-label">退款金额：</view>
        <view v-if="afterSaleInfo.totalAmount > 0" class="refund-amount">￥{{ formatMoney(afterSaleInfo.totalAmount) }}</view>
      </view>
      <view>退款时间：{{ afterSaleInfo.updatedAt }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="AfterSaleDetailCar">
import { inject, defineProps, computed, toRefs } from 'vue'
import { formatMoney } from '@util/money'
import { Enum } from '@src/lib/enmu'

const props = defineProps<{
  afterSaleInfo: AfterSale.DetailInfo
  options: Array<AnyObject>
  active: number
  seconds: number
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [orderCompleteIcon, afterAfterWaitIcon] = gdp(['icon-complete.png', 'icon-after-sale-wait.png'])
const info = toRefs(props.afterSaleInfo) as unknown as { status: number }
const statusIcon = computed(() => {
  let status = info.status && info.status
  let statIcon = ''
  if (status === 4) {
    statIcon = orderCompleteIcon
  } else {
    statIcon = afterAfterWaitIcon
  }
  return statIcon
})

const { getStatusDetailText, Status } = Enum.AfterSale
</script>

<style lang="scss" scoped>
.after-sale-detail-car {
  position: relative;

  &-status {
    width: 100%;
    height: 280rpx;
    background: linear-gradient(180deg, #eee 0%, #fff 100%);
    padding: 0 43rpx;
    display: flex;
    align-items: center;

    .img {
      width: 64rpx;
      height: 64rpx;
      margin-right: 17rpx;
    }

    .text {
      flex: 1;
      min-width: 0;
      word-break: break-all;

      .status {
        font-size: 40rpx;
        font-weight: bold;
        color: #292c2e;
      }

      .time {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #4e6175;
        line-height: 59rpx;
      }
    }
  }

  &-step {
    position: relative;
    top: -40rpx;

    // padding: 0 40rpx;
    .steps-wrap {
      margin-bottom: 80rpx;
    }

    // #ifdef H5
    .more-steps {
      width: 150vw;
    }

    // #endif
  }

  &-success {
    padding: 0 40rpx 16rpx;
    font-size: 32rpx;
    color: #909ca8;
    position: relative;
    top: -80rpx;

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
    }
  }
}
</style>
