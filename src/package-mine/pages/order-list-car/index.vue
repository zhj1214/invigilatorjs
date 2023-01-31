<template>
  <view class="order-list-car">
    <!-- <view class="order-list-car-title">整车订单</view> -->
    <view v-for="(item, index) in orderList" :key="index" class="order-list-car-content" @click="goCarDetail(item.order)">
      <order-car-card :order-item="item.orderItemDto" :pre-sale-flag="item.order.extraMap.preSaleFlag" type="list" />

      <order-item-info :order-item="item" />
    </view>
    <view v-if="!orderList.length && !loading">
      <view class="order-list-car-no-data">暂无整车订单</view>
      <view class="order-list-car-go-car">
        <button @click="goCar">去购车</button>
      </view>
    </view>

    <sp-recommend-goods :recommend-list="recommendList" :point-ratio="pointRatio" />
    <view v-if="isNoMore" class="order-list-car-no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { useGoodsStore } from '@src/pinia/goods'
import { useCarStore } from '@src/pinia/car'
import { getOrderList } from '@src/api/order'
import { getPageForOrderList } from '@api/recommend'
import orderCarCard from '../../components/order-car-card/order-car-card.vue'
import orderItemInfo from './order-item-info.vue'

const carStore = useCarStore()
const goodsStore = useGoodsStore()

goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)
let pageNo = ref(1)
let recommendPageNo = ref(1)
let isNoMore = ref(false)
let isEnd = ref(false)
let loading = ref(false)
let orderList: Order.CarListInfo[] = reactive([])
let recommendList: Goods.Item[] = reactive([])
const pages = getCurrentPages()
const currentRoute = pages[pages.length - 1].route

async function getCarOrderList() {
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  let params = {
    pageNo: pageNo.value,
    pageSize: 10,
    criteria: {
      orderAscription: 0
    }
  }
  try {
    const { data, total } = await getOrderList(params)
    uni.stopPullDownRefresh()
    uni.hideLoading()
    loading.value = false
    orderList.push(...(carStore.getInfo(data, 0) as Array<Order.CarListInfo>))
    isEnd.value = orderList.length === total
  } catch {}
}

async function init() {
  isNoMore.value = false
  pageNo.value = 1
  orderList.splice(0)
  await getCarOrderList()
  recommendPageNo.value = 1
  recommendList.splice(0)
  if (isEnd.value) {
    getCommendList()
  }
}

async function getCommendList() {
  let recommendObj = {
    recItemTypes: [1, 2, 3],
    orderIds: orderList.map((item) => item.order.id)
  }
  try {
    const { data, total } = await getPageForOrderList({ pageNo: recommendPageNo.value, pageSize: 20 }, recommendObj)
    recommendList.push(...data)
    isNoMore.value = recommendList.length === total
  } catch {}
}

function onScrolltolower() {
  if (isEnd.value && isNoMore.value) {
    return
  }
  if (!isEnd.value) {
    pageNo.value++
    getCarOrderList()
  }
  if (!isNoMore.value) {
    recommendList.length > 0 ? recommendPageNo.value++ : (recommendPageNo.value = 1)
    getCommendList()
  }
}

function goCarDetail(item: Order.CarOrderInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/order-detail-car/index?id=${item.id}`
  })
}

function goCar() {
  uni.switchTab({
    url: '/pages/car/car'
  })
}

onShow(() => {
  if (currentRoute === 'package-mine/pages/order-list-car/index') {
    init()
  }
})

onPullDownRefresh(() => {
  init()
})

onReachBottom(() => {
  onScrolltolower()
})
</script>

<style scoped lang="scss">
.order-list-car {
  padding: 0 40rpx;

  &-title {
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium;
    font-weight: bold;
    color: #292c2e;
  }

  &-content {
    box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 17%);
    border: 1rpx solid #e4e7ea;
    margin-top: 56rpx;
  }

  &-no-data {
    padding: 75rpx 40rpx 124rpx;
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    color: #909ca8;
  }

  &-go-car {
    text-align: center;
    width: 100%;

    button {
      font-size: 30rpx;
      background: #1a1a1a;
      color: #fff;
    }
  }

  &-no-more {
    text-align: center;
    font-size: 26rpx;
    color: #909ca8;
    padding-bottom: 20rpx;
  }

  .order-list-car-no-more {
    margin-top: 64rpx;
  }
}

::v-deep .wrap-recommend-goods {
  padding: 0 !important;
}
</style>
