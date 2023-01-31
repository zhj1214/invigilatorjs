<template>
  <view class="order-detail-car-content">
    <view class="car-card" @click="goPreview(orderItemDetail)">
      <view class="info">
        <view class="title">
          <text class="uni-ellipsis">{{ orderItemDetail.carVehicle && orderItemDetail.carVehicle.name }}</text>
          <image :src="orderDetailRight" mode="asceptFit" />
        </view>
        <view v-if="orderItemDetail.carFacade" class="attr">
          <text>{{ orderItemDetail.carFacade.colorName }}+{{ orderItemDetail.carFacade.paintingName }}</text>
          <text>{{ orderItemDetail.carRim.rimName }}</text>
          <text>...</text>
        </view>
        <view v-if="showPriceFlag" class="price">
          <text class="unit">￥</text>
          <text class="text">{{ getTotalMoney(orderItemDetail) }}</text>
        </view>
        <!-- 价格待定 -->
        <view v-else class="price">
          <text class="text">价格待定</text>
        </view>
      </view>
      <view class="img">
        <image :src="orderItemDetail && orderItemDetail.materialImage && orderItemDetail.materialImage.path" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="CarInfo">
import { inject } from 'vue'
import useDetail from './detail'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailRight = gdp('order-detail-right.png')

const { orderItemDetail, showPriceFlag, getTotalMoney } = useDetail()

function goPreview(item: Order.CarDetailInfo) {
  let pkIds = ((item.optionalPackage && item.optionalPackage.map((pk: AnyObject) => pk.id)) || []).join(',')
  uni.navigateTo({
    url: `/package-car/pages/preview/index?readOnly=true&skuId=${item.skuId}&hideWish=true&pkIds=${pkIds}`
  })
}
</script>

<style scoped lang="scss">
.order-detail-car-content {
  padding: 0 40rpx;

  .car-card {
    position: relative;
    display: flex;
    height: 384rpx;
    background-color: #f2f3f3;
    padding: 40rpx;
    width: 100%;

    .info {
      position: relative;
      z-index: 2;
      width: 100%;

      .title {
        width: 100%;
        font-size: 42rpx;
        line-height: 62rpx;
        font-weight: bold;
        color: #4e6175;
        display: flex;
        align-items: center;

        text {
          vertical-align: middle;
          display: inline-block;
        }

        image {
          width: 32rpx;
          height: 32rpx;
          margin-left: 5rpx;
          vertical-align: middle;
        }
      }

      .attr {
        margin-top: 10rpx;

        text {
          font-size: 26rpx;
          line-height: 30rpx;
          color: #92969a;
          display: block;
          max-width: 240rpx;
          margin-bottom: 12rpx;
        }
      }

      .price {
        color: #4e6175;

        .unit {
          vertical-align: middle;
          font-size: 20rpx;
          line-height: 29rpx;
        }

        .text {
          vertical-align: middle;
          font-size: 30rpx;
          line-height: 45rpx;
        }
      }
    }

    .img {
      width: 506rpx;
      height: 283rpx;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
