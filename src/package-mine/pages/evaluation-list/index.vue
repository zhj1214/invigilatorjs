<template>
  <view>
    <view id="tab" class="sp-header-tabs">
      <sp-tabs underline :menus="tabList" :active-tab="status" @on-click="toTabChange" />
    </view>
    <!-- 占位元素 -->
    <view class="placeholder-label" />
    <!--整车-->
    <car-evalution-list v-show="itemType === 0" :car-order-lists="carOrderLists" :status="status" />
    <!--生活-->
    <life-evalution-list v-show="itemType === 1" :life-order-lists="lifeOrderLists" :status="status" />
    <view v-if="isNoMore && (carOrderLists.length > 0 || lifeOrderLists.length > 0)" class="no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { getEvaluatedList } from '@src/api/evaluation'
import { getOrderList } from '@api/order'
import { useCarStore } from '@src/pinia/car'
import carEvalutionList from './car-evaluation-list.vue'
import lifeEvalutionList from './life-evaluation-list.vue'
import { useUserStore } from '@src/pinia/user'

type OnLoadOption<T> = Record<keyof T, string | undefined>
interface EvaluationOptions {
  isFromSuccess?: number
  itemType?: string
}

onLoad((options: OnLoadOption<EvaluationOptions>) => {
  itemType.value = Number(options.itemType)
  if (options.isFromSuccess) {
    status.value = 1
  }
  uni.setNavigationBarTitle({
    title: itemType.value === 0 ? '购车评价中心' : '生活评价中心'
  })
})

onShow(() => {
  pageNo.value = 1
  getUserInfo()
})
onReachBottom(() => {
  if (isNoMore.value) {
    return
  }
  pageNo.value++
  getOrderData()
})

const carStore = useCarStore()

let status = ref(0)
let itemType = ref(0)
let isNoMore = ref(false)
let pageNo = ref(1)
let carOrderLists: Array<Evaluation.CarEvaluation> = reactive([])
let lifeOrderLists: Array<Evaluation.LifeEvaluation> = reactive([])
const tabList = [
  { name: '待评价', value: 0 },
  { name: '已评价', value: 1 }
]

/**
 * 用户信息
 */
let userId = ref('')

async function getUserInfo() {
  const user = await useUserStore().getUserInfo()
  userId.value = user.accountId
  getOrderData()
}

function toTabChange(index: number) {
  status.value = index
  toReload()
}
function toReload() {
  pageNo.value = 1
  getOrderData()
}
// 车辆信息配置数据 复制于订单列表
function toDealData(resData: { data: any; total: number }) {
  if (itemType.value === 0) {
    // 整车
    let data = carStore.getInfo(resData.data, status.value)
    carOrderLists.push(...(data as Array<Evaluation.CarEvaluation>))
    isNoMore.value = carOrderLists.length >= resData.total // 没有更多数据
  } else {
    // 过滤掉已评价的商品
    status.value === 0 &&
      resData.data.forEach((item: Evaluation.LifeEvaluation, index: number) => {
        resData.data[index].orderItemDtoList = item?.orderItemDtoList?.filter((order) => order.assessStatus === 1)
      })
    lifeOrderLists.push(...resData.data)
    isNoMore.value = lifeOrderLists.length >= resData.total // 没有更多数据
  }
}
function getStatus0List() {
  uni.showLoading({
    title: '加载中'
  })
  let data = {
    pageNo: pageNo.value,
    pageSize: 10,
    wholeAssessStatus: status.value + 1, // 待评价 1，已评价 2
    criteria: {
      orderAscription: itemType.value // 0:整车 1：生活
    }
  }
  getOrderList(data)
    .then((res) => {
      if (res) {
        toDealData(res as { data: any; total: number })
      }
    })
    .finally(() => {
      uni.hideLoading()
    })
}
function getStatus1List() {
  uni.showLoading({
    title: '加载中'
  })
  let params = {
    userId: userId.value,
    pageNo: pageNo.value,
    businessTypes: itemType.value === 0 ? ['0'].join(',') : ['1', '2'].join(','), // itemType 0:整车 1：生活
    pageSize: 10
  }
  getEvaluatedList(params)
    .then((res) => {
      if (res) {
        toDealData(res as { data: any; total: number })
      }
    })
    .finally(() => {
      uni.hideLoading()
      uni.stopPullDownRefresh() // 得到数据后停止下拉刷新
    })
}
function getOrderData() {
  if (pageNo.value === 1) {
    if (itemType.value === 0) {
      carOrderLists.length = 0
    } else {
      lifeOrderLists.length = 0
    }
  }
  status.value === 0 ? getStatus0List() : getStatus1List()
}
</script>

<style lang="scss" scoped>
.sp-header-tabs {
  position: fixed;
  top: var(--window-top);
  width: 100%;
  z-index: 999;

  // height: 60rpx;
  // padding: 0 40rpx;
  background: #fff;
}

.tab ::v-deep .wuc-tab.fixed {
  box-shadow: none;
  border-bottom: none;
}

.tab ::v-deep .wuc-tab-item {
  margin: 0 20rpx;
  padding: 0 12rpx;
}

.no-more {
  text-align: center;
  font-size: 26rpx;
  font-weight: 400;
  color: #909ca8;
  padding-top: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
</style>
