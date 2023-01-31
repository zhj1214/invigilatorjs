<template>
  <view class="assess-product">
    <image class="assess-product-img" :src="item.itemImage" mode="aspectFill" />
    <view class="assess-product-info">
      <view class="assess-product-info-name ellipsis-2">{{ item.itemName }}</view>
      <view class="assess-product-info-text assess-product-info-attributes ellipsis-2">
        {{ attributesString }}
      </view>
      <view class="assess-product-info-text assess-product-info-amount">x {{ item.quantity }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="EvaluationPublishedProduct">
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const attributesString = computed(() => {
  const { attributeMaps } = props.item
  let attrStr = ''
  attributeMaps.map((el: { attrVal: string }) => {
    attrStr += el.attrVal
  })
  return attrStr
})
</script>

<style scoped lang="scss">
.assess {
  padding: 23rpx 41rpx;

  &-product {
    padding: 28rpx;
    display: flex;
    align-items: center;
    border-radius: 4rpx;
    border: 1rpx solid #e4e7ea;

    &-img {
      width: 140rpx;
      height: 140rpx;
    }

    &-info {
      flex: 1;
      margin-left: 24rpx;

      &-name {
        height: 41rpx;
        font-size: 28rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 41rpx;
      }

      &-text {
        height: 38rpx;
        font-size: 26rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #909ca8;
        line-height: 38rpx;
      }

      &-attributes {
        margin-bottom: 16rpx;
      }
    }
  }
}
</style>
