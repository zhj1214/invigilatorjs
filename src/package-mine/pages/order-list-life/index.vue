<template>
  <view class="order-list">
    <view id="tab" class="sp-header-tabs">
      <sp-tabs :menus="tabList" @on-click="handleTabChange" />
    </view>
    <!-- 占位元素 -->
    <view class="placeholder-label" />
    <view class="pad-l">
      <order-list :list="orderListData" @refresh="init" />
    </view>
    <!-- 推荐商品 -->
    <sp-recommend-goods :recommend-list="recommendList" :point-ratio="pointRatio" />
    <view v-if="(isEnd && !loading && tabStatus === 0) || isNoMore" class="order-list-no-more" :class="(isEnd && !loading && tabStatus === 0) || isNoMore ? 'pad-t' : ''">
      -没有更多了-
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onHide } from '@dcloudio/uni-app'
import { getOrderList } from '@src/api/order'
import { getPageForOrderList } from '@api/recommend'
import { useGoodsStore } from '@src/pinia/goods'
import { throttle } from '@src/lib/lodash'
import orderList from './order-list.vue'

const goodsStore = useGoodsStore()
goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)
let orderListData: Array<Order.LifeListItemInfo> = reactive([])
let recommendList: Goods.Item[] = reactive([])
let tabStatus = ref(0)
let pageNo = ref(1)
let recommendPageNo = ref(1)
const orderStatusList: Order.StatusList = {
  1: [0],
  2: [2],
  3: [3, 4],
  4: []
}
let isEnd = ref(false)
let loading = ref(false)
let isNoMore = ref(false)

/**
 * @description: 切换tab
 * @Date: 2021-12-01 09:52:27
 * @param {number} type
 * @return {*}
 */
function handleTabChange(type: number) {
  uni.pageScrollTo({
    scrollTop: 0
  })
  tabStatus.value = type
  init()
}

/**
 * @description: 获取订单列表
 * @Date: 2021-11-30 19:38:13
 * @param {*}
 * @return {*}
 */
async function getOrderLists() {
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  try {
    let params: Order.ListParams = {
      pageNo: pageNo.value,
      pageSize: 10,
      criteria: {
        orderAscription: 1
      }
    }
    if (tabStatus.value !== 0) {
      params.statuses = orderStatusList[tabStatus.value]
    }

    if (tabStatus.value === 4) {
      params.wholeAssessStatus = 1
    }
    const { data, total } = await getOrderList(params)
    uni.stopPullDownRefresh()
    uni.hideLoading()
    const orderData = data.map((item: AnyObject) => {
      const { order, orderItemDtoList } = item
      const { id, totalAmount, totalPointNum } = order
      return {
        orderId: id,
        orderItemDtoList: orderItemDtoList,
        orderStatus: order.status,
        totalAmount: Number(totalAmount),
        totalPointNum: Number(totalPointNum),
        receiveInfo: order.receiveInfo,
        orderDelivery: item.orderDelivery,
        wholeAssessStatus: order.wholeAssessStatus,
        orderType: order.orderType
      }
    })
    orderListData.push(...orderData)
    isEnd.value = orderListData.length === total
    loading.value = false
  } catch {
    uni.hideLoading()
  }
}

/**
 * @description: 下拉刷新
 * @Date: 2021-12-01 09:52:03
 * @param {*}
 * @return {*}
 */
function onRefresh() {
  init()
}

/**
 * @description: 上拉加载
 * @Date: 2021-12-01 09:57:44
 * @param {*}
 * @return {*}
 */
function onScrolltolower() {
  if (isEnd.value && isNoMore.value) {
    return
  }
  if (!isEnd.value) {
    pageNo.value++
    getOrderLists()
  }
  if (isEnd.value && !isNoMore.value && tabStatus.value !== 0) {
    recommendList.length > 0 ? recommendPageNo.value++ : (recommendPageNo.value = 1)
    getCommendList()
  }
}

/**
 * @description: 猜你喜欢列表
 * @Date: 2021-12-01 16:09:53
 * @param {*}
 * @return {*}
 */

async function getCommendList() {
  let recommendObj = {
    recItemTypes: [1, 2, 3],
    orderIds: orderListData.map((item) => item.orderId)
  }
  try {
    const { data, total } = await getPageForOrderList({ pageNo: recommendPageNo.value, pageSize: 20 }, recommendObj)
    recommendList.push(...data)
    isNoMore.value = recommendList.length === total
  } catch {}
}

/**
 * @description: 初始化数据
 * @Date: 2021-12-02 09:59:57
 * @param {*}
 * @return {*}
 */
async function init() {
  isNoMore.value = false
  pageNo.value = 1
  orderListData.splice(0)
  await getOrderLists()
  recommendPageNo.value = 1
  recommendList.splice(0)
  if (tabStatus.value !== 0 && isEnd.value) {
    getCommendList()
  }
}

// #ifdef H5
const resize = throttle(
  () => {
    const $header = document.getElementsByClassName('uni-page-head')[0] as HTMLElement
    const top = $header.offsetHeight + $header.offsetTop
    ;(document.getElementById('tab') as HTMLElement).style.top = `${top}px`
  },
  300,
  {
    trailing: false
  }
)
// #endif

const tabList = [
  { name: '全部', value: 0 },
  { name: '待付款', value: 1 },
  { name: '待发货', value: 2 },
  { name: '待收货', value: 3 },
  { name: '待评价', value: 4 }
]

onLoad(() => {
  uni.pageScrollTo({
    scrollTop: 0
  })
})

onShow(() => {
  init()
  // #ifdef H5
  window.addEventListener('resize', resize, false)
  // #endif
})

// #ifdef H5
onHide(() => {
  window.removeEventListener('resize', resize)
})
// #endif

onPullDownRefresh(() => {
  onRefresh()
})

onReachBottom(() => {
  onScrolltolower()
})
</script>

<style lang="scss" scoped>
.order-list {
  .sp-header-tabs {
    position: fixed;
    top: var(--window-top);
    width: 100%;
    z-index: 999;

    // height: 60rpx;
    padding: 0 40rpx;
    background: #fff;
  }

  .placeholder-label {
    width: 100%;
    height: 64rpx;
  }

  .pad-l {
    padding: 0 40rpx;
  }

  &-no-more {
    padding: 0 40rpx;
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    color: #909ca8;
    padding-bottom: 20rpx;
  }

  .pad-t {
    padding: 60rpx 0 env(safe-area-inset-bottom);
  }
}

::v-deep .wrap-recommend-goods {
  // padding: 0 !important;
}

::v-deep .sp-tabs {
  padding: 0 !important;

  .sp-tabs-content {
    display: block !important;

    .left {
      display: flex !important;
      justify-content: space-between !important;

      .menu-item {
        margin: 0 !important;
      }
    }
  }
}
</style>
