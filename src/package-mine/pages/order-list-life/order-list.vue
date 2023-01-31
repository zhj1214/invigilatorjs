<template>
  <view v-for="(item, index) in list" :key="index" class="order-list-content" @click="goToDetail(item)">
    <view class="order-list-content-num-status">
      <view class="num">订单编号：{{ item.orderId }}</view>
      <view style="display: flex">
        <text class="status">{{ getStatusText(item.orderStatus) }}</text>
        <text v-if="toShowAfterSale(item)" class="aftersale">有售后</text>
      </view>
    </view>
    <view class="order-list-content-detail">
      <order-list-goods :total-amount="item.totalAmount" :total-point-num="item.totalPointNum" :order-item-dto-list="item.orderItemDtoList" />
    </view>
    <view class="order-list-content-btns">
      <template v-if="item.orderStatus === Status.TobePaid">
        <view class="btn" :loading="cancleLoading" @click.stop="cancelOrders(item)">取消订单</view>
        <view class="btn black" @click.stop="goToPay(item)">立即付款</view>
      </template>
      <view v-if="toShowLogistics(item)" class="btn" @click.stop="goToLog(item)">查看物流</view>
      <view v-if="item.wholeAssessStatus === Status.Paid" class="btn" @click.stop="goToEvaluation(item)">评价</view>
      <view v-if="item.orderStatus === Status.ToBeReceived" class="btn black" @click.stop="toConfirmReceipt(item)">确认收货</view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OrderList">
import { ref } from 'vue'
import orderListGoods from '../../components/order-list-goods/order-list-goods.vue'
import { cancelOrder, getArriveOrder } from '@src/api/order'
import { Enum } from '@src/lib/enmu'

defineProps<{
  list: Array<Order.LifeListItemInfo>
}>()

const emits = defineEmits(['refresh'])
const { getStatusText, Status } = Enum.Order
const { Status: AfterSaleStatus } = Enum.AfterSale

let cancleLoading = ref(false)

/**
 * @description: 跳转订单详情
 * @Date: 2021-12-04 11:13:26
 * @param {Order.LifeListItemInfo} item
 * @return {*}
 */
function goToDetail(item: Order.LifeListItemInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/order-detail-life/index?orderId=${item.orderId}`
  })
}

/**
 * @description: 是否展示有售后标识
 * @Date: 2021-12-10 10:14:23
 * @param {*} item
 * @return {*}
 */
function toShowAfterSale(item: Order.LifeListItemInfo) {
  const { orderItemDtoList } = item
  let flag = false
  orderItemDtoList.forEach((i: AnyObject) => {
    if ([AfterSaleStatus.InInspection, AfterSaleStatus.Rejected, AfterSaleStatus.ToBeReviewed].includes(i.status)) {
      flag = true
    }
  })
  return flag
}

/**
 * @description: 取消订单
 * @Date: 2021-12-01 11:35:10
 * @param {Order.LifeListItemInfo} item
 * @return {*}
 */
async function cancelOrders(item: Order.LifeListItemInfo) {
  uni.showModal({
    title: '提示',
    content: '您确认取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        cancleLoading.value = true
        try {
          await cancelOrder(item.orderId)
          cancleLoading.value = false
          uni.showToast({
            icon: 'none',
            title: '订单取消成功'
          })
          item.orderStatus = Status.IsCanceled
          emits('refresh')
        } catch (error) {
          cancleLoading.value = false
        }
      }
    }
  })
}

/**
 * @description: 跳转支付页
 * @Date: 2021-12-01 13:45:31
 * @param {Order.LifeListItemInfo} item
 * @return {*}
 */
function goToPay(item: Order.LifeListItemInfo) {
  uni.navigateTo({
    url: `/package-life/pages/payment/index?orderId=${item.orderId}&type=1`
  })
}

/**
 * @description: 是否显示物流
 * @Date: 2021-12-01 10:47:05
 * @param {Order.LifeListItemInfo} item
 * @return {*}
 */
function toShowLogistics(item: Order.LifeListItemInfo) {
  const { orderItemDtoList, orderStatus, orderDelivery } = item
  // 虚拟商品不显示物流 itemType 2
  const itemType = orderItemDtoList[0].itemType
  return ([Status.ToBeReceived, Status.SomeShipped, Status.IsEnd].includes(orderStatus) || orderDelivery?.length) && itemType !== '2'
}

/**
 * @description: 跳转物流
 * @Date: 2021-12-01 14:52:07
 * @param {Order.LifeListItemInfo} item
 * @return {*}
 */
function goToLog(item: Order.LifeListItemInfo) {
  const { orderId } = item
  uni.navigateTo({
    url: `/package-mine/pages/order-delivery-list/index?orderId=${orderId}`
  })
}

function goToEvaluation(item: Order.LifeListItemInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${item.orderId}&orderType=${item.orderType}&itemType=1`
  })
}

/**
 * @description: 确认收货
 * @Date: 2021-12-10 10:14:49
 * @param {*} item
 * @return {*}
 */
async function toConfirmReceipt(item: Order.LifeListItemInfo) {
  uni.showModal({
    title: '提示',
    content: '所有商品均已收到且没有问题嘛？',
    cancelText: '取消收货',
    confirmText: '确认收货',
    success: async (res) => {
      if (res.confirm) {
        try {
          await getArriveOrder(item.orderId)
          uni.showToast({
            icon: 'none',
            title: '确认收货成功'
          })
          item.orderStatus = Status.IsEnd
          item.wholeAssessStatus = 1
          emits('refresh')
        } catch {}
      }
    }
  })
}
</script>

<style scoped lang="scss">
.order-list-content {
  padding: 56rpx 0 48rpx;
  border-bottom: 1rpx solid #e4e7ea;

  &-num-status {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;

    .num {
      color: #909ca8;
    }

    .status {
      color: #4e6175;
    }

    .aftersale {
      width: 96rpx;
      height: 36rpx;
      line-height: 36rpx;
      background: #4e6175;
      border-radius: 22rpx;
      color: #edeff1;
      vertical-align: middle;
      display: inline-block;
      font-size: 20rpx;
      text-align: center;
      margin-left: 8rpx;
    }
  }

  &-btns {
    display: flex;
    justify-content: flex-end;

    .btn {
      width: 180rpx;
      height: 76rpx;
      background: #fff;
      border-radius: 2rpx;
      border: 2rpx solid #909ca8;
      font-size: 28rpx;
      color: #292c2e;
      text-align: center;
      line-height: 76rpx;
      margin-left: 32rpx;
    }

    .black {
      background: #1a1a1a;
      color: #fff;
      border: none;
    }
  }
}
</style>
