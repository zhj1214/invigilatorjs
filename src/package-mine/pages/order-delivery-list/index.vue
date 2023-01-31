<template>
  <view class="order-delivery-list">
    <view v-for="(item, index) in itemDtoList" :key="index" class="order-delivery-list-content">
      <view class="order-delivery-list-content-num-status">
        <view class="num">物流单号 {{ item.expressNum }}</view>
      </view>
      <view class="order-delivery-list-content-detail">
        <order-list-goods :order-item-dto-list="item.orderItemDtoList" />
      </view>
      <view class="order-delivery-list-content-btns">
        <view class="btn" @click.stop="goToLog(item)">查看物流</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderInfo } from '@src/api/order'
import orderListGoods from '../../components/order-list-goods/order-list-goods.vue'
import { useDeliveryStore } from '@src/pinia/delivery'

const deliveryStore = useDeliveryStore()
let orderId = ref('')
let itemDtoList: Order.LifeListItemInfo[] = reactive([])

onLoad((option: { orderId?: string }) => {
  orderId.value = option.orderId || ''
  getOrderInfos()
})

async function getOrderInfos() {
  uni.showLoading({
    title: '加载中'
  })
  const data = await getOrderInfo(orderId.value)
  uni.stopPullDownRefresh()
  uni.hideLoading()
  const { orderItemDtoList } = data as AnyObject
  let orderItemData: any = []
  orderItemDtoList.forEach((orderItem: AnyObject) => {
    const { itemImage, itemName, itemType, attributeMaps, quantity, id, status } = orderItem
    if (orderItem.orderDeliveryDtoList) {
      orderItem.orderDeliveryDtoList.forEach((deliveryItem: AnyObject) => {
        const { expressNum, expressCode } = deliveryItem
        let deliveryObj = { expressNum, expressCode }
        let orderItemList: AnyObject = {
          itemImage,
          itemName,
          itemType,
          attributeMaps,
          quantity,
          status
        }
        let obj = { ...deliveryObj, orderItemList, id }
        orderItemData.push(obj)
      })
    }
  })
  let newArr = []
  for (let i = 0; i < orderItemData.length; i++) {
    const { expressNum, expressCode, telphone, orderItemList, id } = orderItemData[i]
    let index = newArr.findIndex((item: AnyObject) => item.expressCode === expressCode && item.expressNum === expressNum)
    if (index !== -1) {
      newArr[index].orderItemDtoList.push(orderItemList)
    } else {
      newArr.push({
        expressNum,
        expressCode,
        telphone,
        orderItemDtoList: [orderItemList],
        orderId: id
      })
    }
  }
  itemDtoList.push(...(newArr as Order.LifeListItemInfo[]))
}

/**
 * @description: 跳转物流
 * @Date: 2021-12-01 14:52:07
 * @param {*}
 * @return {*}
 */
function goToLog(item: Order.LifeListItemInfo) {
  const { orderItemDtoList, expressCode, telphone, expressNum } = item
  let obj = {
    code: expressCode,
    telphone: telphone,
    expressNumber: expressNum
  }
  deliveryStore.setParams({
    mianPic: orderItemDtoList[0].itemImage,
    totalNum: orderItemDtoList.length
  })
  uni.navigateTo({
    url: `/package-mine/pages/order-delivery/index?params=${JSON.stringify(obj)}`
  })
}
</script>
<style lang="scss" scoped>
.order-delivery-list {
  padding: 0 40rpx;

  &-content {
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
    }
  }
}
</style>
