<template>
  <view class="test-drive-iinerary">
    <view class="title">试驾行程单</view>
    <view class="iinerary-list">
      <view v-for="(item, index) in itineraryList" :key="index" class="iinerary-item" @click="goToDetail(item.id)">
        <view class="iinerary-item-img">
          <image class="img" :src="item.image[0].path" mode="aspectFit" />
        </view>
        <view class="iinerary-item-info">
          <view class="iinerary-item-info-title ellipsis">{{ item.seriesName }}试驾行程单</view>
          <view class="iinerary-item-info-time">时间：{{ formatDate(item.reservationTime) }}</view>
          <view class="iinerary-item-info-carSerise">车型：{{ item.modelName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getRecord } from '@api/car'
import { formatDate } from '@util/date-time'

interface ItineraryListIfo {
  id: string
  image: [File]
  modelCode: string
  modelName: string
  reservationTime: number
  seriesCode: string
  seriesName: string
}

onLoad(() => {
  getList()
})
//上拉加载
onReachBottom(() => {
  if (loadMore.value) {
    pageNo.value++
    getList()
  }
})

const itineraryList: ItineraryListIfo[] = reactive([])
const pageNo = ref(1)
// 获取行程单列表
const loadMore = ref(false)
async function getList() {
  try {
    const res = (await getRecord({ pageNo: pageNo.value, pageSize: 10 })) as AnyObject
    res.data.forEach((item: { image: string }) => {
      item.image = JSON.parse(item.image)
    })
    itineraryList.push(...res.data)
    loadMore.value = !(itineraryList.length === res.total)
    console.log(itineraryList)
  } catch {}
}
// 跳转行程单详情
function goToDetail(id: string) {
  uni.navigateTo({
    url: `/package-mine/pages/itinerary-detail/index?id=${id}`
  })
}
</script>

<style lang="scss" scoped>
.test-drive-iinerary {
  height: 100%;
  padding: 0 40rpx;
  background: #fff;

  .title {
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #292c2e;
    line-height: 83rpx;
    padding: 48rpx 0;
  }

  .iinerary-list {
    .iinerary-item {
      padding: 55rpx 33rpx;
      margin-bottom: 40rpx;
      background: #fff;
      box-shadow: 0rpx 15rpx 33rpx 0rpx rgb(111 111 111 / 17%);
      border: 1rpx solid #e4e7ea;
      display: flex;
      align-items: center;

      &-img {
        width: 237rpx;
        height: 132rpx;

        .img {
          width: 100%;
          height: 100%;
        }
      }

      &-info {
        width: calc(100% - 237rpx);
        padding-left: 16rpx;

        &-title {
          width: 100%;
          font-size: 38rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #4e6175;
        }

        &-time {
          font-size: 28rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
        }

        &-carSerise {
          display: flex;
          flex-wrap: wrap;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
        }
      }
    }
  }
}
</style>
