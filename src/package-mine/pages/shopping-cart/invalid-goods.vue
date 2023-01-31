<template>
  <view v-for="goods in goodsList" :key="goods.id" class="item disabled flex-row items-start">
    <!-- 勾选框 -->
    <view class="group items-center checkbox">
      <sp-checkbox round size="large" :disabled="!isManageState" :checked="checkedGoodsIds.includes(goods.id)" @change="$emit('changeGoodsCheck', goods.id)" />
    </view>
    <view class="flex-row items-start">
      <!-- 商品图 -->
      <view class="group items-center">
        <image class="thumbnail" :src="goods.thumbnail" mode="scaleToFill" />
      </view>
      <!-- 商品信息 -->
      <view class="info">
        <view class="name ellipsis">{{ goods.itemName }}</view>
        <view class="attr items-center">
          <view class="attr-text ellipsis">{{ toGeneratorSkuAttr(goods.skuAttr) }}</view>
        </view>
        <!-- 商品失效标志 -->
        <view class="disable-text">失效</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { toGeneratorSkuAttr } from './cart'

defineProps({
  isManageState: {
    type: Boolean,
    default: false
  },
  goodsList: {
    type: Array as PropType<Cart.Goods[]>,
    default: null
  },
  checkedGoodsIds: {
    type: Array,
    default: () => []
  }
})

defineEmits(['changeGoodsCheck'])
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 32rpx 40rpx;

  .group {
    height: 160rpx;
  }

  .checkbox {
    margin-right: 28rpx;
  }

  .thumbnail {
    width: 160rpx;
    height: 160rpx;
    background-color: #f4f5f6;
  }

  .info {
    position: relative;
    width: calc(100% - 160rpx);
    padding-left: 24rpx;
    flex-wrap: nowrap;
  }

  .name {
    width: 100%;
    margin-bottom: 16rpx;
    font-size: 28rpx;
  }

  .attr {
    display: inline-flex;
    padding: 0 2rpx 0 22rpx;
    background-color: #edeff1;
    color: #909ca8;
    font-size: 26rpx;
    max-width: 280rpx;

    .image {
      width: 48rpx;
      height: 48rpx;
    }

    .attr-text {
      max-width: 232rpx;
    }
  }

  &.disabled {
    .name {
      color: #909ca8;
    }

    .attr {
      padding-right: 22rpx;
    }
  }
}

.disable-text {
  border-radius: 2px;
  background: #edeff1;
  width: 64rpx;
  height: 36rpx;
  text-align: center;
  line-height: 36rpx;
  font-size: 24rpx;
  color: #909ca8;
  margin-top: 6rpx;
}
</style>
