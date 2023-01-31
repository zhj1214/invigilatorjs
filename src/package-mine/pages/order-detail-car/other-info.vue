<template>
  <!-- 车主信息 -->
  <view v-if="vehiclePayType === 1" class="order-detail-car-info">
    <view class="title">车主信息</view>
    <view>
      <text>姓名</text>
      <text>{{ orderDetail.extraMap.carOwner.name }}</text>
    </view>
    <view>
      <text>证件类型</text>
      <text>{{ idTypeMaps[orderDetail.extraMap.carOwner.certificateType] }}</text>
    </view>
    <view>
      <text>证件号码</text>
      <text>{{ orderDetail.extraMap.carOwner.certificateNumber }}</text>
    </view>
  </view>

  <view class="order-detail-car-protocol" @click="goToPurchaseAgreement">
    <view class="title">购车协议</view>
    <image :src="orderDetailRight" mode="asceptFit" class="img" />
  </view>

  <!-- 付款明细 -->
  <view class="order-detail-car-info">
    <view class="title">付款明细</view>
    <view>
      <text>{{ vehiclePayType === 0 ? '商品意向金' : '商品定金' }}</text>
      <text>
        <text class="yuan">￥</text>
        {{ formatMoney(orderDetail.totalAmount) }}
      </text>
    </view>
    <view>
      <text v-if="shouldToPayStatus.includes(orderDetail.status)">应付金额</text>
      <text v-else>已付金额</text>
      <text>
        <text class="yuan">￥</text>
        {{ formatMoney(orderDetail.totalAmount) }}
      </text>
    </view>
  </view>

  <!-- 订单信息 -->
  <view class="order-detail-car-info">
    <view class="title">订单信息</view>
    <view>
      <text>订单编号</text>
      <text>{{ orderDetail.id }}</text>
    </view>
    <view>
      <text>提交时间</text>
      <text>{{ formatDate(orderDetail.createdAt, 'YYYY.MM.DD HH:mm:ss') }}</text>
    </view>
    <template v-if="!shouldToPayStatus.includes(orderDetail.status)">
      <view>
        <text>支付方式</text>
        <text>线上支付</text>
      </view>
      <view>
        <text>支付渠道</text>
        <text>{{ agencyCode === '01' ? '支付宝支付' : '微信支付' }}</text>
      </view>
      <view>
        <text>支付时间</text>
        <text>{{ formatDate(orderDetail.payTime, 'YYYY.MM.DD HH:mm:ss') }}</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts" name="OtherInfo">
import { inject } from 'vue'
import { formatMoney } from '@util/money'
import { formatDate } from '@util/date-time'
import useDetail from './detail'
import { Enum } from '@src/lib/enmu'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailRight = gdp('order-detail-right.png')

const { orderDetail, vehiclePayType, agencyCode, idTypeMaps } = useDetail()

function goToPurchaseAgreement() {
  uni.navigateTo({
    url: '/package-car/pages/agreements/purchase-agreement'
  })
}

const { Status } = Enum.Order
// 应付金额订单状态 [60, 70, -3, -4, -5, -80, -1]
const shouldToPayStatus = [Status.WaitingIntentionMoney, Status.DepositToBePaid, Status.WillInvalid, Status.IsInvalid, Status.IsCanceled, Status.IsClosed, Status.IsDelete]
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

.order-detail-car-protocol {
  padding: 93rpx 40rpx 48rpx;
  border-bottom: 1rpx solid #e4e7ea;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 32rpx;
    color: #4e6175;
  }

  image {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
