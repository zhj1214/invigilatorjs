<template>
  <view class="card-list">
    <view v-for="(item, index) in list" :key="index" class="list-item" @click="goToCardDetail(item.code)">
      <view class="list-item-info">
        <view class="list-item-info-head">
          <view class="list-item-info-head-name">{{ item.name }}</view>
        </view>
        <view class="list-item-info-time">
          <view v-if="item.validEndDate" class="time">{{ formatDate(item.validBeginDate) }}-{{ formatDate(item.validEndDate) }}</view>
          <view v-else class="time">永久有效</view>
          <text v-if="item.status === 1" class="list-item-info-time-play">立即使用</text>
        </view>
      </view>
      <view class="list-item-icon">
        <image class="icon" :src="getImgSrc(item)" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OfflineCouponList">
import { inject } from 'vue'
import { formatDate } from '@util/date-time'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [cardUsed, cardExpired, cardInvalid] = gdp(['card-used.png', 'card-expired.png', 'card-invalid.png'])

defineProps<{
  list: CouponInfo[]
}>()

// 跳转卡券详情页
function goToCardDetail(id: string) {
  uni.navigateTo({
    url: `/package-mine/pages/card-detail/index?id=${id}`
  })
}

function getImgSrc(item: CouponInfo) {
  item.status === 3 ? cardUsed : item.status === 4 ? cardExpired : item.status === 5 || item.status === 6 ? cardInvalid : ''
}
</script>

<style lang="scss" scoped>
.card-list {
  padding: 0 40rpx;
  margin-top: 120rpx;

  .list-item {
    padding: 42rpx 48rpx 48rpx 40rpx;
    height: 352rpx;
    border: 1rpx solid #e4e7ea;
    box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 17%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    position: relative;

    .list-item-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 256rpx;

      &-head {
        display: flex;
        flex: 1;

        &-name {
          width: 410rpx;
          height: 104rpx;
          font-size: 38rpx;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 52rpx;
        }
      }

      &-time {
        color: #92969a;
        display: flex;
        justify-content: space-between;

        .time {
          // flex: 1;
          width: 350rpx;
        }

        &-play {
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          color: #4e6175;

          // margin-left: 120rpx;
        }
      }
    }

    &-icon {
      width: 148rpx;
      height: 148rpx;
      position: absolute;
      top: 0;
      right: 0;

      .icon {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
