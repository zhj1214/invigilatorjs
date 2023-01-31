<template>
  <view class="order-list-car-content-operation">
    <view class="order-list-car-content-operation-price">
      <view class="price">
        <view class="text">总价</view>
        <view class="num">
          <template v-if="orderItem.order.extraMap.showPriceFlag">
            <text>￥</text>
            {{ getTotalMoney(orderItem.orderItemDto) }}
          </template>
          <text v-else style="font-size: 30rpx">价格待定</text>
          <text v-if="orderItem.orderItemDto.status === 7" class="refund">有退款</text>
        </view>
      </view>
      <view class="status">{{ orderStr[orderItem.order.status] }}</view>
    </view>
    <view class="order-list-car-content-operation-btns">
      <template v-if="orderItem.order.status === 60 || orderItem.order.status === 70">
        <view class="btn" @click.stop="cancelOrders(orderItem)">取消订单</view>
        <view class="btn black" @click.stop="goPay(orderItem.order)">{{ orderItem.order.status === 70 ? '支付定金' : '支付意向金' }}</view>
      </template>
      <view v-if="orderItem.order.wholeAssessStatus === 1" class="btn eva" @click.stop="goToEvaluation(orderItem.order)">评价</view>
      <view v-if="[61, 64].includes(orderItem.orderItemDto.status) && orderItem.order.extraMap.vehiclePayType === 0" class="btn after" @click.stop="goApplyFor(orderItem)">
        申请售后
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OrderorderItemInfo">
import { reactive } from 'vue'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import { formatMoney } from '@util/money'
import { cancelOrder } from '@src/api/order'
const afterSaleStore = useAfterSaleStore()

defineProps<{
  orderItem: Order.CarListInfo
}>()

const orderStr = reactive({
  60: '待付款',
  70: '待付款',
  61: '已支付',
  71: '已支付',
  74: '待提车',
  64: '交车准备中',
  68: '交易完成',
  7: '售后中',
  '-2': '退款完成',
  '-3': '待失效',
  '-4': '交易失效',
  '-5': '交易取消',
  '-80': '交易关闭',
  '-1': '已删除'
}) as AnyObject

function getTotalMoney(orderItem: Order.CarItemInfo) {
  let tempTotal = 0
  if (orderItem.optionalPackagePrice && orderItem.optionalPackagePrice.length > 0) {
    orderItem.optionalPackagePrice.forEach((i) => {
      tempTotal += i
    })
  }
  let computePrice = orderItem.carFacadePrice + orderItem.carRimPrice + orderItem.carInteriorPrice + orderItem.carVehiclePrice + tempTotal
  return formatMoney(computePrice, 0, 0)
}

function cancelOrders(orderItem: Order.CarListInfo) {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认取消订单吗？',
    success: (res) => {
      if (res.confirm) {
        cancelOrder(orderItem.order.id)
        uni.showToast({
          icon: 'none',
          title: '订单取消成功'
        })
        orderItem.order.status = -80
        orderItem.orderItemDto.status = -80
      }
    }
  })
}

function goPay(orderItem: Order.CarOrderInfo) {
  uni.navigateTo({
    url: `/package-life/pages/payment/index?orderId=${orderItem.id}`
  })
}

function goToEvaluation(orderItem: Order.CarOrderInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${orderItem.id}&orderType=${orderItem.orderType}&itemType=0`
  })
}

function goApplyFor(item: Order.CarListInfo) {
  let obj = {
    status: item.orderItemDto.status,
    orderId: item.orderItemDto.orderId,
    itemType: item.orderItemDto.itemType
  }
  console.log(obj)
  afterSaleStore.setParams(obj)
  uni.navigateTo({
    url: `/package-mine/pages/apply-for-after-sale/index?id=${item.orderItemDto.id}`
  })
}
</script>

<style scoped lang="scss">
.order-list-car-content-operation {
  padding: 36rpx;

  // height: 260rpx;
  background: #fff;

  &-price {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price {
      .text {
        font-size: 22rpx;
        color: #92969a;
        margin-bottom: 5rpx;
      }

      .num {
        font-size: 30rpx;
        color: #4e6175;
        line-height: 45rpx;

        text {
          font-size: 20rpx;
        }

        .refund {
          display: inline-block;
          text-align: center;
          font-size: 20rpx;
          width: 96rpx;
          height: 36rpx;
          line-height: 36rpx;
          background: #edeff1;
          border-radius: 22rpx;
          margin-left: 20rpx;
        }
      }
    }

    .status {
      font-size: 28rpx;
      color: #909ca8;
    }
  }

  &-btns {
    display: flex;
    justify-content: space-between;

    .btn {
      margin-top: 35rpx;
      width: 47%;
      height: 80rpx;
      line-height: 80rpx;
      background: #fff;
      border-radius: 2rpx;
      border: 2rpx solid #909ca8;
      font-size: 26rpx;
      color: #4e6175;
      text-align: center;
    }

    .black {
      background: #1a1a1a;
      color: #fff;
    }

    .eva {
      border: 2rpx solid #e4e7ea;
      width: 100%;
    }

    .after {
      border: 2rpx solid #e4e7ea;
      width: 100%;
      background: #1a1a1a;
      color: #fff;
    }
  }
}
</style>
