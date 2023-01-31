<template>
  <view class="wrap-single-goods">
    <view class="left">
      <image class="img" :src="goods.skuImage" mode="scaleToFill" />
    </view>
    <view class="right">
      <view class="name-quantity items-center justify-between">
        <view class="name font-medium ellipsis">{{ goods.itemName }}</view>
        <view class="quantity">x{{ goods.quantity }}</view>
      </view>
      <view class="sku ellipsis">
        {{ toGeneratorSkuAttr(goods.skuSaleAttributes) }}
      </view>
      <!-- 活动信息 -->
      <view v-if="goods.activityTypeList && goods.activityTypeList[0] === 5" class="activity-tag">限时抢购</view>
      <!-- 商品价格 -->
      <!-- payType = 1 只显示金钱 ￥10 -->
      <!-- payType = 2 只显示积分 1000 -->
      <!-- payType = 3 显示金钱+积分 ￥10+1000 -->
      <!-- payType = 4 显示金钱（积分） ￥10（1000） -->
      <view class="price items-center font-normal">
        <!-- 库存充足显示价格 -->
        <view v-if="formatedGoods.priceInfo.fee">
          <text>￥</text>
          <text>{{ formatedGoods.priceInfo.fee }}</text>
        </view>
        <view v-if="formatedGoods.priceInfo.point">
          <text v-if="goods.payType === 3">+</text>
          <text v-if="goods.payType === 4">（</text>
          <image class="point-icon" :src="iconPoint" mode="aspectFit" />
          <text>{{ formatedGoods.priceInfo.point }}</text>
        </view>
        <text v-if="goods.payType === 4">）</text>
      </view>
      <!-- 原价 -->
      <view v-if="goods.activityTypeList && goods.activityTypeList[0] === 5" class="origin-price items-center">
        <view class="line-through">
          <view v-if="formatedGoods.priceInfo.originFee">
            <text>￥</text>
            <text>{{ formatedGoods.priceInfo.originFee }}</text>
          </view>
          <view v-if="formatedGoods.priceInfo.originPoint">
            <text v-if="goods.payType === 3">+</text>
            <text v-if="goods.payType === 4">（</text>
            <image class="point-icon" :src="iconOrderPoint" mode="aspectFit" />
            <text>{{ formatedGoods.priceInfo.originPoint }}</text>
          </view>
          <text v-if="goods.payType === 4">）</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { formatPrice } from '@src/util/money'
import { PropType, computed, inject } from 'vue'
import { toGeneratorSkuAttr } from './order'

const props = defineProps({
  goods: {
    type: Object as PropType<Order.PreviewOrderItem>,
    default: null
  },
  pointRatio: {
    type: Number,
    default: 1
  }
})

// 静态图片
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconPoint, iconOrderPoint] = gdp(['icon-point-settle.png', 'order-detail-point-detail.png'])

const formatedGoods = computed(() => {
  const item = props.goods
  return {
    ...item,
    priceInfo: formatPrice({
      payType: item.payType,
      price: Number(item.retailPrice),
      pointPrice: Number(item.pointNum),
      pointRatio: props.pointRatio,
      maxPointPrice: Number(item.retailPrice),
      activityInfo: item.activityPrice
        ? {
            activityPrice: item.activityPrice,
            activityStatus: 1
          }
        : null
    })
  }
})
</script>

<style lang="scss" scoped>
// 商品行
.wrap-single-goods {
  display: flex;
  padding: 40rpx 40rpx 0;

  .left {
    display: flex;
    flex-basis: 160rpx;

    .img {
      width: 160rpx;
      height: 160rpx;
      background-color: #f4f5f6;
    }
  }

  .right {
    flex: 1;
    padding-left: 24rpx;
    padding-top: 11rpx;

    .name-quantity {
      font-size: 28rpx;

      .name {
        color: #1a1a1a;
        font-weight: 600;
        flex: 1;
        max-width: 420rpx;
      }

      .quantity {
        color: #292c2e;
        flex-basis: 60rpx;
        text-align: right;
        margin-left: auto;
      }
    }

    .sku {
      margin-top: 6rpx;
      font-size: 26rpx;
      color: #909ca8;
      max-width: 490rpx;
    }

    .activity-tag {
      box-sizing: border-box;
      color: #c14947;
      font-size: 22rpx;
      height: 36rpx;
      padding: 0 8rpx;
      border-radius: 4rpx;
      border: 1rpx solid #c14947;
      display: flex;
      align-items: center;
      width: fit-content;
      margin-top: 16rpx;
    }
  }

  .price {
    font-size: 28rpx;
    margin-top: 16rpx;
  }

  .point-icon {
    width: 24rpx;
    height: 24rpx;
    position: relative;
    top: 2rpx;
  }

  .origin-price {
    position: relative;
    font-size: 28rpx;
    color: #92969a;

    .line-through {
      display: inline-flex;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1rpx;
        background-color: #92969a;
        z-index: 5;
      }
    }
  }
}
</style>
