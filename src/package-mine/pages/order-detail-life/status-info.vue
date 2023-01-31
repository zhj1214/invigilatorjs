<template>
  <view class="order-detail-status">{{ getStatusText(orderDetail.status) }}</view>
  <!-- autoReceiveStatus = 0说明自动确认收货正常倒计时，=1 说明正在售后,不展示倒计时 -->
  <view v-if="orderDetail.status === Status.ToBeReceived && orderDetail.autoReceiveStatus === 0" class="order-detail-time">
    <text>剩余自动确认收货时间 {{ receiveLeftTimes }}</text>
  </view>
  <view v-if="orderDetail.status === Status.TobePaid && orderDetail.payLeftTime !== 0" class="order-detail-time">
    <text>剩余支付时间</text>
    <uni-countdown
      class="order-detail-time-count-down"
      :show-day="false"
      :show-hour="false"
      :show-colon="false"
      color="#909ca8"
      splitor-color="#909ca8"
      :second="orderDetail.payLeftTime"
      @timeup="handleTimeup"
    />
  </view>
</template>

<script setup lang="ts" name="StatusInfo">
import { Enum } from '@src/lib/enmu'
import { computed } from 'vue'
import { useDetail } from './detail'
const { orderDetail } = useDetail()

const { getStatusText, Status } = Enum.Order

// 倒计时时间
const receiveLeftTimes = computed(() => {
  let day: any = Math.floor(orderDetail.receiveLeftTime / (60 * 60 * 24))
  let hour: any = Math.ceil(orderDetail.receiveLeftTime / (60 * 60)) - day * 24
  if (hour === 24) {
    day++
    hour = 0
  }
  if (day > 0 && hour > 0) {
    return `${day}天${hour}小时`
  }
  if (day === 0 && hour > 0) {
    return `${hour}小时`
  }
  if (day > 0 && hour === 0) {
    return `${day}天`
  }
  return `${day}天`
})

function handleTimeup() {
  orderDetail.status = -80
}
</script>

<style scoped lang="scss">
.order-detail-status {
  padding: 30rpx 40rpx;
  font-size: 56rpx;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  color: #292c2e;
  line-height: 83rpx;
  font-weight: bold;
}

.order-detail-time {
  padding: 0 40rpx;
  margin-bottom: 26rpx;
  font-size: 24rpx;
  color: #909ca8;
  display: flex;
  align-items: center;
}
</style>
