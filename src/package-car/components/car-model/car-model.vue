<template>
  <view class="car-model" :style="{ borderColor: modelId === modelItem.id ? '#1A1A1A' : '' }" @click="toSelectModel">
    <view class="car-info-box">
      <view class="card" :style="{ 'background-image': `url(${modelItem.attrs.poster})` }">
        <view class="title ellipsis">
          <text v-if="modelItem.itemPreSaleVO.preSaleFlag" class="advance">预售 ·</text>
          {{ modelItem.attrs.title }}
        </view>
        <view class="price">
          <template v-if="modelItem.itemPreSaleVO.showPriceFlag">
            <text>￥{{ formatMoney(modelItem.attrs.price, 0, 0) }}</text>
            <text>起</text>
          </template>
          <text v-else>价格待定</text>
        </view>
        <view class="attrs">
          <view v-for="(desc, j) in modelItem.attrs.desc" :key="j" class="attr">
            <text class="dot" />
            {{ desc }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="CarModel">
import { formatMoney } from '@util/money'
defineProps({
  modelItem: {
    type: Object,
    default: () => ({})
  },
  modelId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['selectModel'])
const toSelectModel = () => {
  emit('selectModel')
}
</script>

<style lang="scss" scoped>
.car-model {
  border: 1rpx solid #dbdcdd;
  margin-bottom: 32rpx;

  .car-info-box {
    width: 100%;
    height: 464rpx;
    padding: 30rpx 0 50rpx 30rpx;

    .card {
      width: 100%;
      height: 100%;
      font-size: 24rpx;
      color: #4e6175;
      background-size: 100%;
      background-position: center center;
      background-repeat: no-repeat;
      position: relative;

      .title {
        width: calc(100% - 40rpx);
        color: #4e6175;
        font-size: 36rpx;
        line-height: 90rpx;
        word-break: break-all;

        .advance {
          color: #7190b0;
        }
      }

      .price {
        line-height: 36rpx;

        & :first-child {
          font-weight: bolder;
        }
      }

      .attrs {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        position: absolute;
        bottom: 0;

        .attr {
          font-size: 20rpx;
          color: #92969a;

          .dot {
            display: inline-block;
            width: 6rpx;
            height: 6rpx;
            margin: 7rpx;
            border-radius: 50%;
            background: #495056;
          }
        }
      }
    }
  }
}
</style>
