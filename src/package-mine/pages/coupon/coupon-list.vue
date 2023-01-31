<template>
  <view class="coupon-list">
    <view v-for="(item, key) of list" :key="key" class="coupon-item">
      <view class="item-content">
        <view class="item-content-top flex aic jsb">
          <view class="item-content-top-left">
            <view v-if="item.threshold === 0" class="title" :style="{ color: item.status !== 1 ? '#999999' : '' }">无门槛</view>
            <view v-else class="title" :style="{ color: item.status !== 1 ? '#999999' : '' }">满{{ item.threshold / 100 }}可用</view>
            <text class="type">{{ item.applicability }}</text>
          </view>
          <view class="item-content-top-right flex aic" :style="{ color: item.status !== 1 ? '#909CA8' : '' }">
            <text>¥</text>
            <text class="price-text">{{ item.worth / 100 }}</text>
          </view>
        </view>
        <view class="item-content-bottom flex aic jsb">
          <view class="left">有效期至{{ formatDate(item.validEndDate) }}</view>
          <view v-if="item.status === 1" class="right flex aic" @click="goToCouponGoods(item.id)">
            去使用
            <image class="icon-right" :src="couponArrowRight" mode="aspectFit" />
          </view>
        </view>
        <image class="icon" :src="getImgSrc(item)" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OfflineCouponList">
import { inject } from 'vue'
import { formatDate } from '@util/date-time'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [cardUsed, cardExpired, cardInvalid, couponArrowRight] = gdp(['card-used.png', 'card-expired.png', 'card-invalid.png', 'coupon-arrow-right.png'])

defineProps<{
  list: CouponInfo[]
}>()

// 跳转可用商品页
function goToCouponGoods(id: string) {
  uni.navigateTo({
    url: `/package-mine/pages/coupon-goods/index?id=${id}`
  })
}

function getImgSrc(item: CouponInfo) {
  item.status === 3 ? cardUsed : item.status === 4 ? cardExpired : item.status === 5 || item.status === 6 ? cardInvalid : ''
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;

  &.aic {
    align-items: center;
  }

  &.jsb {
    justify-content: space-between;
  }

  &.jc {
    justify-content: center;
  }
}

.coupon-list {
  margin-top: 120rpx;

  .coupon-item {
    padding: 20rpx 0;

    .item-content {
      width: 92%;
      margin: 0 auto;
      height: 290rpx;
      position: relative;
      background: radial-gradient(circle at left bottom, transparent 12rpx, #fff 0) top left / 51% 194rpx no-repeat,
        radial-gradient(circle at right bottom, transparent 12rpx, #fff 0) top right / 51% 194rpx no-repeat,
        radial-gradient(circle at left top, transparent 12rpx, #fff 0) bottom left / 51% 98rpx no-repeat,
        radial-gradient(circle at right top, transparent 12rpx, #fff 0) bottom right / 51% 98rpx no-repeat;
      filter: drop-shadow(1px 1rpx 15rpx rgb(111 111 111 / 30%));

      &-top {
        height: 194rpx;
        padding: 40rpx 40rpx 44rpx;
        position: relative;
        z-index: 2;

        &-left {
          .title {
            font-size: 38rpx;
            font-weight: 600;
            width: 260rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.5;
          }

          .type {
            padding: 1rpx 7rpx;
            background: #edeff1;
            border-radius: 2rpx;
            color: #909ca8;
            font-size: 22rpx;
            opacity: 0.7;
          }
        }

        &-right {
          color: #4e6175;
          font-size: 29rpx;
          align-items: baseline;
        }
      }

      &-bottom {
        border-top: 1px dashed #e4e7ea;
        height: 96rpx;
        padding-left: 29rpx;
        padding-right: 19rpx;
        font-size: 28rpx;

        .left {
          color: #909ca8;
        }

        .right {
          color: #4e6175;

          .icon-right {
            display: block;
            will-change: transform;
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

      .icon {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        width: 148rpx;
        height: 148rpx;
        display: block;
      }

      .price-text {
        font-size: 80rpx;
        font-weight: bold;
        margin-left: 6rpx;
      }
    }
  }
}
</style>
