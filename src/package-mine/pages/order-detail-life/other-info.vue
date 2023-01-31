<template>
  <view v-if="orderDetail.orderInvoice.invoiceTitle" class="order-detail-info">
    <view>
      <text>发票类型</text>
      <text>纸质普通发票</text>
    </view>
    <view>
      <text>发票抬头</text>
      <text>{{ orderDetail.orderInvoice.invoiceTitle }}</text>
    </view>
    <view>
      <text>发票内容</text>
      <text>{{ orderDetail.orderInvoice.invoiceContent }}</text>
    </view>
  </view>
  <view class="order-detail-info" style="border: 0">
    <view>
      <text>订单编号</text>
      <text>{{ orderDetail.id }}</text>
    </view>
    <view v-if="orderDetail.userRemark">
      <text>订单备注</text>
      <text>{{ orderDetail.userRemark }}</text>
    </view>
    <view>
      <text>提交时间</text>
      <text>{{ formatDate(orderDetail.createdAt, 'YYYY.MM.DD HH:mm:ss') }}</text>
    </view>
    <template v-if="[Status.Paid, Status.ToBeReceived, Status.IsRefunded, Status.ToBeShipped, Status.IsEnd].includes(orderDetail.status)">
      <view>
        <text>支付方式</text>
        <text>在线支付</text>
      </view>
      <view>
        <text>支付渠道</text>
        <text>{{ orderDetail.payType === 1 || orderDetail.extraMap.pay?.agencyCode == '09' ? payStatus[9] : payStatus[orderDetail.payType] }}</text>
      </view>
      <view>
        <text>支付时间</text>
        <text>{{ formatDate(orderDetail.payTime, 'YYYY.MM.DD HH:mm:ss') }}</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts" name="OtherInfo">
import { reactive } from 'vue'
import { formatDate } from '@util/date-time'
import { useDetail } from './detail'
import { Enum } from '@src/lib/enmu'
const { orderDetail } = useDetail()

const { Status } = Enum.Order

const payStatus = reactive({
  1: '现金支付',
  2: '积分支付',
  3: '混合支付',
  4: '零现金零积分',
  9: '微信支付'
}) as AnyObject
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
}
</style>
