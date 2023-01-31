<template>
  <view class="order-car-card">
    <view class="order-car-card-info">
      <view class="order-car-card-info-name" @click.stop="type === 'afterSaleDetail' && goPreview()">
        <text v-if="preSaleFlag" class="advance">预售·</text>
        <text class="name ellipsis" :class="type === 'afterSaleDetail' ? 'wid' : ''">{{ orderItem.vehicleTitle }}</text>
        <image v-if="type === 'afterSaleDetail'" class="icon-img" :src="orderDetailRight" mode="asceptFit" />
      </view>
      <view class="order-car-card-info-configure">
        <text v-for="(attr, index) in (orderItem.saleAttrs || []).slice(0, 2)" :key="index">
          {{ attr }}
        </text>
      </view>
      <view class="order-car-card-info-configure">...</view>
      <view v-if="type !== 'list'" class="order-car-card-info-refundInfo">
        <view v-if="type !== 'afterSaleDetail'" class="status">{{ orderItem.type === 0 ? '退款' : '退货' }}</view>
        <view class="price">
          <text class="unit">￥</text>
          <text class="text">{{ formatMoney(orderItem.carVehiclePrice, 0, 0) }}</text>
        </view>
      </view>
    </view>
    <image :src="orderItem.carVehicleImg" mode="aspectFit" class="car-vehicle-img" />
  </view>
</template>

<script lang="ts" setup name="OrderCarCard">
import { inject } from 'vue'
import { formatMoney } from '@util/money'

const prop = defineProps({
  orderItem: {
    type: Object,
    default: () => ({})
  },
  preSaleFlag: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailRight = gdp('icon-after-sale-right.png')

function goPreview() {
  let pkIds = ''
  if (prop.type === 'afterSaleDetail') {
    pkIds = ((prop.orderItem.extraMap.optionalPackage && prop.orderItem.extraMap.optionalPackage.map((pk: AnyObject) => pk.id)) || []).join(',')
  } else {
    pkIds = ((prop.orderItem.optionalPackage && prop.orderItem.optionalPackage.map((pk: AnyObject) => pk.id)) || []).join(',')
  }
  uni.navigateTo({
    url: `/package-car/pages/preview/index?readOnly=true&skuId=${prop.orderItem.skuId}&hideWish=true&pkIds=${pkIds}`
  })
}
</script>

<style scoped lang="scss">
.order-car-card {
  padding: 36rpx;
  height: 343rpx;
  background: #f2f3f3;
  position: relative;

  &-info {
    position: relative;
    z-index: 2;

    &-name {
      font-size: 38rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #4e6175;
      line-height: 56rpx;
      margin-bottom: 7rpx;
      display: flex;
      align-items: center;

      .name {
        width: 100%;
      }

      .wid {
        width: calc(100% - 32rpx);
      }

      .advance {
        color: #7190b0;
      }

      .icon-img {
        width: 32rpx;
        height: 32rpx;
      }
    }

    &-configure {
      max-width: 230rpx;
      font-size: 24rpx;
      color: #92969a;
      line-height: 36rpx;
    }

    &-refundInfo {
      margin-top: 12rpx;
      color: #4e6175;

      .status {
        font-size: 22rpx;
      }

      .price {
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        position: relative;
        z-index: 2;

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
  }

  .car-vehicle-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 506rpx;
    height: 283rpx;
    z-index: 1;
  }
}
</style>
