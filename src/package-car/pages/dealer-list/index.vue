<template>
  <view class="dealer-list">
    <view>
      <sp-dealer-card v-for="dealer in dealerList" :key="dealer.code" class="item" :dealer="dealer" />
    </view>
    <view v-if="isEmpty" class="no-data">附近暂无经销商</view>
    <view v-if="dealerList.length && isLastPage" class="no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup name="DealerList">
import { ref, reactive } from 'vue'
import { getDealerList } from '@api/car'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const isRefresh = ref(false)
const pageNo = ref(1)
const pageSize = ref(10)
const isLastPage = ref(false)
const isLoading = ref(false)
const isEmpty = ref(false)

const dealerList: Dealer.Iteminfo[] = reactive([])

onShow(() => {
  getList()
})
onPullDownRefresh(() => {
  onRefresh()
})
onReachBottom(() => {
  onScrolltolower()
})

const onRefresh = async () => {
  pageNo.value = 1
  isRefresh.value = true
  isLastPage.value = false
  await getList()
  isRefresh.value = false
  uni.stopPullDownRefresh()
}

const onScrolltolower = () => {
  if (isLoading.value || isLastPage.value) {
    return
  }
  pageNo.value++
  getList()
}
async function getList() {
  isLoading.value = true
  try {
    const dealerData = await getDealerList({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    const { total, data } = dealerData
    if (!data || !data.length) {
      return
    }
    isEmpty.value = !total
    const dealers = dealerData.data.map((dealer: Dealer.BizItem) => {
      return {
        name: dealer.name,
        address: dealer.details,
        image: dealer.image
      }
    })

    /**
     * 下拉刷新先清空数据
     */
    if (isRefresh.value) {
      dealerList.splice(0, dealerList.length)
    }

    /**
     * 添加数据
     */
    dealerList.push(...dealers)

    /**
     * 判断数据是否已全部加载完成
     */
    if (total <= pageNo.value * pageSize.value || data.length < pageSize.value) {
      isLastPage.value = true
    }
  } catch (error) {}
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.dealer-list {
  padding: 24rpx 0;

  .item:last-of-type {
    margin-bottom: 0;
  }

  .no-data {
    padding: 75rpx 40rpx 124rpx;
    text-align: center;
    font-size: 26rpx;
    color: #909ca8;
  }

  .no-more {
    text-align: center;
    font-size: 26rpx;
    color: #909ca8;
    padding: 20rpx 20rpx calc(20rpx + env(safe-area-inset-bottom));
  }
}
</style>
