<template>
  <view class="order-detail-car-status">
    <image class="img" :src="statusIcon" />
    <view>
      <text class="status">{{ getStatusText(orderDetail.status) }}</text>
      <view v-if="orderDetail.status === Status.DepositToBePaid || orderDetail.status === Status.WaitingIntentionMoney" class="time">
        <text>剩余时间</text>
        <uni-countdown :show-day="false" color="#4E6175" background-color="#F8F8F8" :hour="0" :minute="0" :second="orderDetail.payLeftTime / 1000" @timeup="onTimeup" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OrderStatus">
import { Enum } from '@src/lib/enmu'
import { inject, computed } from 'vue'
import useDetail from './detail'
const { getStatusText, Status } = Enum.Order
const { orderDetail, orderItemDetail } = useDetail()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [orderCompleteIcon, orderCountTimeIcon, orderCloseIcon, orderClockIcon] = gdp(['icon-complete.png', 'icon-count-time.png', 'icon-order-close.png', 'icon-order-clock.png'])
const statusIcon = computed(() => {
  let status = orderDetail.status && orderDetail.status
  let statusIcons = ''
  if ([Status.DepositToBePaid, Status.WaitingIntentionMoney].includes(status)) {
    statusIcons = orderCountTimeIcon
  } else if ([Status.WaitingDelivery, Status.WaitingToPickUpCar, Status.AfterSales].includes(status)) {
    statusIcons = orderClockIcon
  } else if ([Status.PaidIntentionMoney, Status.PaidDeposit, Status.IsCarEnd, Status.IsRefunded].includes(status)) {
    statusIcons = orderCompleteIcon
  } else if ([Status.IsClosed, Status.IsCanceled].includes(status)) {
    statusIcons = orderCloseIcon
  }
  return statusIcons
})

function onTimeup() {
  orderDetail.status = -80
  orderItemDetail.status = -80
}
</script>

<style scoped lang="scss">
.order-detail-car-status {
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
</style>
