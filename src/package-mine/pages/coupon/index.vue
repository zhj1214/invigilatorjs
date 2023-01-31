<template>
  <view class="card-content">
    <view class="tab-content">
      <sp-tabs id="tab-content" :menus="tabList" @on-click="toTabChange" />
    </view>
    <!-- 优惠券 -->
    <coupon-list v-if="tabStatus === '0'" :list="couponListData" />

    <!-- 线下券 -->
    <offline-coupon-list v-if="tabStatus === '2'" :list="cardList" />

    <view v-if="isEnd && !loading" class="no-more">{{ tabStatus === '0' ? '- 暂无卡券 -' : '- 没有更多了 -' }}</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getCardList, getUserCoupon } from '@api/card'
import offlineCouponList from './offline-coupon-list.vue'
import couponList from './coupon-list.vue'

const tabList = [
  { name: '优惠券', value: '0' },
  { name: '红包', value: '1' },
  { name: '线下券', value: '2' }
]
const couponListData: CouponInfo[] = reactive([]) // 优惠券列表
const cardList: CouponInfo[] = reactive([]) // 卡券列表
const pageNo = ref(1) // 当前页数
const loading = ref(false)
const pageSize = 10 // 分页大小
let total = 0
const isEnd = ref(false)
const tabStatus = ref('0') // tab栏状态 0：优惠券 1：红包 2：线下券

// 初始化
function init() {
  pageNo.value = 1
  isEnd.value = false
  cardList.length = 0
  couponListData.length = 0
}
function getListInfo() {
  switch (tabStatus.value) {
    case '0': {
      getCouponListInfo()
      break
    }
    case '1': {
      return
    }
    case '2': {
      getCardListInfo()
      break
    }
  }
}

// 切换tab栏
function toTabChange(index: string) {
  tabStatus.value = index
  init()
  getListInfo()
}
// 获取优惠券信息
async function getCouponListInfo() {
  if (tabStatus.value !== '0') {
    return
  }
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  try {
    const res = await getUserCoupon({ pageNo: pageNo.value, pageSize: pageSize })
    const coupon: CouponInfo[] = res.data
    uni.stopPullDownRefresh()
    uni.hideLoading()
    pageNo.value === 1 && couponListData.splice(0)
    total = res.total
    couponListData.push(...coupon)
    if (total === couponListData.length || total === 0) {
      isEnd.value = true
    }
    loading.value = false
  } catch (err) {
    uni.hideLoading()
  }
}
// 获取卡券信息
async function getCardListInfo() {
  if (tabStatus.value !== '2') {
    return
  }
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  try {
    const res = await getCardList({ pageNo: pageNo.value, pageSize: pageSize })
    const card: CouponInfo[] = res.data
    uni.stopPullDownRefresh()
    uni.hideLoading()
    pageNo.value === 1 && cardList.splice(0)
    total = res.total
    cardList.push(...card)
    if (total === cardList.length || total === 0) {
      isEnd.value = true
    }
    loading.value = false
  } catch (err) {
    uni.hideLoading()
  }
}

onLoad(() => {
  getListInfo()
})
// 下拉刷新
onPullDownRefresh(() => {
  init()
  getListInfo()
})
//上拉加载
onReachBottom(() => {
  if (!isEnd.value) {
    pageNo.value++
    getListInfo()
  }
})
</script>

<style lang="scss" scoped>
.card-content {
  .tab-content {
    position: fixed;
    width: 750rpx;
    z-index: 10;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  }

  .no-more {
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #909ca8;
    padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
  }
}

.tab-content {

  /* #ifdef MP-WEIXIN */
  top: 0;
  /* #endif */

  /* #ifdef H5 */
  top: calc(44px + env(safe-area-inset-top));
  /* #endif */
}
</style>
