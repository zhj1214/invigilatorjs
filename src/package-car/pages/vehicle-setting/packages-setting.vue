<template>
  <view v-if="active === 3" class="packages-setting">
    <view v-for="(item, index) in packagesList.data" :key="index" class="packages-item">
      <view class="img"><image :src="item.image" mode="aspectFill" /></view>
      <view class="info">
        <view class="text">
          <view class="title">
            <text>{{ item.name }}</text>
            <image mode="aspectFill" :src="iconHelp" @click.stop="goPackagesDetail(item)" />
          </view>
          <view v-if="item.price && showPriceFlag" class="price">￥{{ formatMoney(item.price, 0, 0) }}</view>
          <view v-if="!item.price && showPriceFlag" class="price">价格已包含</view>
          <!-- 价格待定 -->
          <view v-if="!showPriceFlag" class="price">价格待定</view>
        </view>
        <view class="select" @click="toSelectPackages(item)">
          <image :src="getImgSrc(item)" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="PackagesSetting">
import { formatMoney } from '@util/money'
import usePackageData from './package-data'

defineProps({
  active: {
    type: Number,
    default: 0
  },
  packagesList: {
    type: Object,
    default: () => ({})
  }
})

const { goPackagesDetail, toSelectPackages, getImgSrc, showPriceFlag, iconHelp } = usePackageData()
</script>

<style lang="scss" scoped>
.packages-setting {
  padding: 0 40rpx;

  .packages-item {
    margin-bottom: 40rpx;
    box-shadow: 0 5rpx 10rpx #ececec;

    view.img {
      width: 100%;
      height: 375rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      height: 143rpx;
      padding: 26rpx 40rpx 32rpx;
      display: flex;
      justify-content: space-between;

      > view.text {
        .title {
          line-height: 40rpx;

          text {
            vertical-align: middle;
            font-size: 32rpx;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 600;
            color: #292c2e;
            line-height: 40rpx;
          }

          image {
            vertical-align: middle;
            margin-left: 20rpx;
            width: 34rpx;
            height: 34rpx;
          }
        }

        .price {
          font-size: 24rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
        }
      }

      > view.select {
        width: 40rpx;
        display: flex;
        align-items: center;

        image {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
}
</style>
