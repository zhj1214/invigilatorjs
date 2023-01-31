<template>
  <view class="order-detail-car-foot">
    <view v-if="orderDetail.status === Status.WaitingIntentionMoney || orderDetail.status === Status.DepositToBePaid" class="order-detail-car-foot-btns">
      <view class="btn" @click.stop="cancelOrders(orderDetail)">取消订单</view>
      <view class="btn black" @click.stop="goPay(orderDetail)">{{ orderDetail.status === Status.DepositToBePaid ? '支付定金' : '支付意向金' }}</view>
    </view>
    <view
      v-if="
        vehiclePayType === 0 &&
        ([Status.PaidIntentionMoney, Status.WaitingDelivery].includes(orderItemDetail.status) ||
          orderItemDetail.status === Status.AfterSales ||
          orderItemDetail.status === Status.IsRefunded)
      "
      class="order-detail-car-foot-btns"
    >
      <view v-if="[Status.PaidIntentionMoney, Status.WaitingDelivery].includes(orderItemDetail.status)" class="btn black wid" @click.stop="goApplyFor(orderItemDetail)">
        申请售后
      </view>
      <view v-if="orderItemDetail.status === Status.AfterSales" class="btn black wid" @click.stop="goAfterSaleDetail">正在售后</view>
      <view v-if="orderItemDetail.status === Status.IsRefunded" class="btn black wid" @click.stop="goAfterSaleDetail">退款成功</view>
    </view>
    <view v-if="orderDetail.wholeAssessStatus === 1" class="order-detail-car-foot-btns eva">
      <view class="btn evaluation" @click="goToEvaluation(orderDetail)">评价</view>
    </view>
  </view>
</template>

<script setup lang="ts" name="FooterBtn">
import { cancelOrder } from '@src/api/order'
import useDetail from './detail'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import { Enum } from '@src/lib/enmu'

const props = defineProps<{ orderId: string }>()

const { Status } = Enum.Order

const afterSaleStore = useAfterSaleStore()
const { orderDetail, vehiclePayType, orderItemDetail, orderAfterSale, getOrderDetail } = useDetail()

/**
 * 取消订单
 */
function cancelOrders(item: Order.CarOrderInfo) {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrder(item.id)
          uni.showToast({
            icon: 'none',
            title: '订单取消成功'
          })
          getOrderDetail(props.orderId)
        } catch {}
      }
    }
  })
}

function goPay(item: Order.CarOrderInfo) {
  uni.navigateTo({
    url: `/package-life/pages/payment/index?orderId=${item.id}`
  })
}

function goApplyFor(item: Order.CarDetailInfo) {
  let obj = {
    status: item.status,
    orderId: item.orderId,
    itemType: item.itemType
  }
  console.log(obj)
  afterSaleStore.setParams(obj)
  uni.navigateTo({
    url: `/package-mine/pages/apply-for-after-sale/index?id=${item.id}`
  })
}

function goAfterSaleDetail() {
  uni.navigateTo({
    url: `/package-mine/pages/after-sale-detail/index?id=${orderAfterSale.value.id}`
  })
}

function goToEvaluation(item: Order.CarOrderInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${item.id}&orderType=${item.orderType}&itemType=0`
  })
}
</script>

<style scoped lang="scss">
.order-detail-car-foot {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1;

  &-btns {
    display: flex;
    border-top: 1rpx solid #e4e7ea;
    justify-content: space-between;
    height: calc(120rpx + env(safe-area-inset-bottom));
    padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));
    background: #fff;
  }

  .eva {
    justify-content: flex-end;
  }

  .btn {
    width: 315rpx;
    height: 84rpx;
    line-height: 84rpx;
    background: #fff;
    border-radius: 1rpx;
    border: 2rpx solid #1a1a1a;
    font-size: 28rpx;
    color: #1a1a1a;
    text-align: center;
  }

  .black {
    background: #1a1a1a;
    color: #fff;
  }

  .wid {
    width: 100%;
  }

  .evaluation {
    width: 208rpx;
  }

  &-tips {
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #909ca8;
    padding: 20rpx 20rpx calc(env(safe-area-inset-bottom)) 20rpx;
  }
}
</style>
