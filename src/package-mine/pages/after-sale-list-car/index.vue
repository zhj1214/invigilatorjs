<template>
  <view class="after-sale-list-car">
    <view v-for="(item, index) in afterSaleList" :key="index" class="after-sale-list-car-content" @click="goAfterSaleDetail(item)">
      <order-car-card :order-item="item" />
      <view class="after-sale-list-car-content-status">
        <view class="text" :class="{ blue: [Status.ToBeReviewed, Status.Refunding].includes(item.status) }">
          {{ getStatusText(item.status) }}
          <uni-countdown
            v-if="item.status === Status.ToBeReviewed"
            class="count-down"
            :show-day="false"
            :hour="0"
            :minute="0"
            :color="[Status.ToBeReviewed, Status.Refunding].includes(item.status) ? '#4e6175' : '#909CA8'"
            :splitor-color="[Status.ToBeReviewed, Status.Refunding].includes(item.status) ? '#4e6175' : '#909CA8'"
            :second="getTime(item.auditOutTime)"
          />
          <text v-if="item.status === Status.Success">￥{{ item.totalAmount / 100 }}</text>
        </view>
        <view v-if="item.status === Status.ToBeReviewed" class="btn" @click.stop="toBackApply(item)">撤回申请</view>
      </view>
    </view>
    <view v-if="!afterSaleList.length && !loading" class="after-sale-list-car-no-data">暂无售后单</view>
    <view v-if="afterSaleList.length && isEnd" class="after-sale-list-car-no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import orderCarCard from '../../components/order-car-card/order-car-card.vue'
import { useCarStore } from '@src/pinia/car'
import { getOrderList, setAfterRefundCancel } from '@src/api/after-sale'
import { Enum } from '@src/lib/enmu'

const carStore = useCarStore()

const { getStatusText, Status } = Enum.AfterSale

let pageNo = ref(1)
let isEnd = ref(false)
let afterSaleList: AfterSale.ListInfo[] = reactive([])
let loading = ref(false)

onShow(() => {
  onRefresh()
})

onPullDownRefresh(() => {
  onRefresh()
})

onReachBottom(() => {
  onScrolltolower()
})

async function getPagingOrder() {
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  let params = {
    pageNo: pageNo.value,
    pageSize: 10,
    itemTypes: [0].toString()
  }
  try {
    const { data, total } = await getOrderList(params)
    uni.stopPullDownRefresh()
    uni.hideLoading()
    const afterSaleData = carStore.getInfo(data, 2)
    afterSaleList.push(...(afterSaleData as Array<AfterSale.ListInfo>))
    isEnd.value = afterSaleList.length === total
    loading.value = false
  } catch {
    loading.value = false
    uni.hideLoading()
  }
}

function onRefresh() {
  isEnd.value = false
  pageNo.value = 1
  afterSaleList.splice(0)
  getPagingOrder()
}

function onScrolltolower() {
  if (isEnd.value) {
    return
  }
  if (!isEnd.value) {
    pageNo.value++
    getPagingOrder()
  }
}

function getTime(auditOutTime: number) {
  let now = new Date().getTime()
  if (now <= auditOutTime) {
    let time = ((auditOutTime - now) / 1000).toString()
    return parseInt(time)
  }
}

function goAfterSaleDetail(item: AfterSale.ListInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/after-sale-detail/index?id=${item.id}`
  })
}

function toBackApply(item: AfterSale.ListInfo) {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认撤销申请吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await setAfterRefundCancel(item.id)
          item.status = -1
        } catch (error) {}
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.after-sale-list-car {
  padding: 0 40rpx;

  &-content {
    margin-bottom: 56rpx;
    border: 1rpx solid #e4e7ea;

    &-status {
      height: 130rpx;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 36rpx;

      .count-down {
        margin-top: 4rpx;
        margin-left: 24rpx;
      }

      .text {
        font-size: 26rpx;
        color: #909ca8;
        display: flex;
        align-items: center;

        image {
          width: 28rpx;
          height: 28rpx;
        }
      }

      .blue {
        color: #4e6175;
      }

      .btn {
        width: 180rpx;
        height: 70rpx;
        line-height: 70rpx;
        background: #fff;
        border-radius: 2rpx;
        border: 2rpx solid #909ca8;
        text-align: center;
        font-size: 26rpx;
        color: #4e6175;
      }
    }
  }

  &-no-data {
    padding: 75rpx 40rpx 124rpx;
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #909ca8;
  }

  &-no-more {
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #909ca8;
    padding: 20rpx;
  }
}
</style>
