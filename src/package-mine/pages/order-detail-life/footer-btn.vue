<template>
  <view class="order-detail-foot">
    <view class="order-detail-foot-price">
      <view class="text">{{ payText }}</view>
      <view class="price">
        <view v-if="orderDetail.totalAmount > 0" class="price-amount">￥{{ formatMoney(orderDetail.totalAmount) }}</view>
        <view v-if="orderDetail.totalPointNum > 0" class="points">
          <view v-if="orderDetail.totalAmount > 0" class="points-symbol">+</view>
          <image class="points-icon" :src="orderDetailPointTotal" />
          <view class="points-num">{{ orderDetail.totalPointNum }}</view>
        </view>
      </view>
    </view>
    <view class="order-detail-foot-btns">
      <template v-if="orderDetail.status === Status.TobePaid">
        <view class="btn" @click="cancelOrders">取消订单</view>
        <view class="btn black" @click="goToPay">立即付款</view>
      </template>
      <view v-if="handleShowLogistics()" class="btn" @click="goToLog('multiple', {})">查看物流</view>
      <view v-if="orderDetail.wholeAssessStatus === 1" class="btn" @click="goToEvaluation">评价</view>
      <view v-if="orderDetail.status === Status.ToBeReceived" class="btn black" @click="handleConfirmReceipt">确认收货</view>
    </view>
  </view>
</template>

<script setup lang="ts" name="FooterBtn">
import { computed, inject } from 'vue'
import { cancelOrder, getArriveOrder } from '@src/api/order'
import { formatMoney } from '@util/money'
import { useDeliveryStore } from '@src/pinia/delivery'
import { useDetail } from './detail'
import { Enum } from '@src/lib/enmu'
const props = defineProps({
  orderItemDeliveryData: {
    type: Object,
    default: () => {}
  }
})
const { orderDetail } = useDetail()
const deliveryStore = useDeliveryStore()
const emits = defineEmits(['refresh'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailPointTotal = gdp('order-detail-point-total.png')

const { Status } = Enum.Order

let payText = computed(() => {
  let text = ''
  const status = orderDetail.status
  if ([Status.TobePaid, Status.IsCanceled, Status.IsClosed].includes(status)) {
    text = '应付金额'
  } else if ([Status.Paid, Status.ToBeShipped, Status.ToBeReceived, Status.SomeShipped, Status.IsEnd, Status.IsRefunded].includes(status)) {
    text = '已付金额'
  }
  return text
})

/**
 * @description: 是否显示物流
 * @Date: 2021-12-01 10:47:05
 * @param {*}
 * @return {*}
 */
function handleShowLogistics() {
  let flag = false
  if (orderDetail.id) {
    const { orderItemDtoList, status, orderDelivery } = orderDetail
    // 虚拟商品不显示物流 itemType 2
    const itemType = orderItemDtoList[0].itemType
    if (([Status.ToBeReceived, Status.SomeShipped, Status.IsEnd].includes(status) || orderDelivery?.length) && itemType !== '2') {
      flag = true
    }
  }
  return flag
}

/**
 * @description: 取消订单
 * @Date: 2021-12-06 10:58:01
 * @param {*}
 * @return {*}
 */
function cancelOrders() {
  uni.showModal({
    title: '提示',
    content: '您确认取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrder(orderDetail.id)
          uni.showToast({
            icon: 'none',
            title: '订单取消成功'
          })
          emits('refresh')
        } catch (error) {}
      }
    }
  })
}
/**
 * @description: 跳转物流列表或详情
 * @Date: 2021-12-06 09:34:34
 * @param {*} type
 * @param {*} item
 * @return {*}
 */
function goToLog(type: string, item: AnyObject) {
  const deliveryData = props.orderItemDeliveryData
  if (type === 'multiple' && deliveryData.length > 1) {
    uni.navigateTo({
      url: `/package-mine/pages/order-delivery-list/index?orderId=${orderDetail.id}`
    })
  } else {
    let obj = {
      code: item?.expressCode || deliveryData[0]?.expressCode,
      telphone: item?.telphone || deliveryData[0]?.telphone,
      expressNumber: item?.expressNumber || deliveryData[0]?.expressNum
    }
    let mianPic = ''
    let totalNum = 0
    if (type === 'single') {
      deliveryData.map((delivery: AnyObject) => {
        if (delivery.expressNum === item?.expressNumber) {
          mianPic = delivery?.orderItemDtoList[0].itemImage
          totalNum = delivery.orderItemDtoList.length
        }
      })
    } else {
      mianPic = deliveryData[0]?.orderItemDtoList[0].itemImage
      totalNum = deliveryData[0]?.orderItemDtoList.length
    }
    deliveryStore.setParams({
      mianPic: mianPic,
      totalNum: totalNum
    })
    uni.navigateTo({
      url: `/package-mine/pages/order-delivery/index?params=${JSON.stringify(obj)}`
    })
  }
}

function goToPay() {
  uni.navigateTo({
    url: `/package-life/pages/payment/index?orderId=${orderDetail.id}&type=1`
  })
}

function goToEvaluation() {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${orderDetail.id}&orderType=${orderDetail.orderType}&itemType=1`
  })
}

/**
 * @description: 确认收货
 * @Date: 2021-12-06 10:57:52
 * @param {*}
 * @return {*}
 */
function handleConfirmReceipt() {
  uni.showModal({
    title: '提示',
    content: '所有商品均已收到且没有问题嘛？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await getArriveOrder(orderDetail.id)
          uni.showToast({
            icon: 'none',
            title: '确认收货成功'
          })
          emits('refresh')
        } catch {}
      }
    }
  })
}
</script>

<style scoped lang="scss">
.order-detail-foot {
  border-top: 1rpx solid #e4e7ea;
  background: #fff;
  height: calc(120rpx + env(safe-area-inset-bottom));
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
  padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;

  &-price {
    .text {
      font-size: 26rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      color: #696b6c;
    }

    .price {
      display: flex;
      font-weight: bold;
      align-items: center;

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
          width: 28rpx;
          height: 28rpx;
        }

        &-num {
          font-size: 32rpx;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          color: #4e6175;
        }
      }
    }
  }

  &-btns {
    display: flex;

    .btn {
      margin-left: 24rpx;
      width: 132rpx;
      height: 64rpx;
      line-height: 64rpx;
      border-radius: 1rpx;
      border: 2rpx solid #d8d8d8;
      font-size: 24rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      color: #1a1a1a;
      background: #fff;
      text-align: center;
    }

    .black {
      background: #1a1a1a;
      color: #fff;
    }
  }
}
</style>
