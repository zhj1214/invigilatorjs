<template>
  <view class="packages">
    <!-- 外饰 -->
    <view class="package items-center justify-between">
      <view class="package-image flex-col items-center justify-center">
        <image class="image" mode="aspectFit" :src="vehicle.outColor.image" />
        <image class="image" mode="aspectFit" :src="vehicle.outPainting.image" />
      </view>
      <view class="package-info flex-col">
        <view class="package-name">外饰</view>
        <view class="package-content ellipsis-2">
          {{ `${vehicle.outColor.name || ''}${vehicle.outColor.name && vehicle.outPainting.name ? '+' : ''}${vehicle.outPainting.name || ''}` }}
        </view>
        <view class="package-price">
          <template v-if="model.showPriceFlag">
            <text v-if="vehicle.outPrice">￥{{ formatMoney(vehicle.outPrice, 0, 0) }}</text>
            <text v-else>价格已包含</text>
          </template>
          <text v-else>价格待定</text>
        </view>
      </view>
      <view v-if="!readOnly" class="action items-center justify-center" @click="handleEdit(0)">更改</view>
    </view>
    <!-- 轮圈 -->
    <view class="package items-center justify-between">
      <view class="package-image flex-col items-center justify-center">
        <image class="image" mode="aspectFit" :src="vehicle.rim.image" />
      </view>
      <view class="package-info flex-col">
        <view class="package-name">轮圈</view>
        <view class="package-content ellipsis-2">{{ vehicle.rim.name || '' }}</view>
        <view class="package-price">
          <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
            <text v-if="vehicle.rimPrice">￥{{ formatMoney(vehicle.rimPrice, 0, 0) }}</text>
            <text v-else>价格已包含</text>
          </template>
          <text v-else>价格待定</text>
        </view>
      </view>
      <view v-if="!readOnly" class="action items-center justify-center" @click="handleEdit(1)">更改</view>
    </view>
    <!-- 内饰 -->
    <view class="package items-center justify-between">
      <view class="package-image flex-col items-center justify-center">
        <image class="image" mode="aspectFit" :src="vehicle.innerColor.image" />
        <image class="image" mode="aspectFit" :src="vehicle.innerMaterial.image" />
      </view>
      <view class="package-info flex-col">
        <view class="package-name">内饰</view>
        <view class="package-content ellipsis-2">
          {{ `${vehicle.innerColor.name || ''}${vehicle.innerColor.name && vehicle.innerMaterial.name ? '+' : ''}${vehicle.innerMaterial.name || ''}` }}
        </view>
        <view class="package-price">
          <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
            <text v-if="vehicle.innerPrice">￥{{ formatMoney(vehicle.innerPrice, 0, 0) }}</text>
            <text v-else>价格已包含</text>
          </template>
          <text v-else>价格待定</text>
        </view>
      </view>
      <view v-if="!readOnly" class="action items-center justify-center" @click="handleEdit(2)">更改</view>
    </view>
    <!-- 选装 -->
    <view v-for="pk in packages" :key="pk.id" class="package items-center justify-between">
      <view class="package-image flex-col items-center justify-center">
        <image class="image" mode="aspectFit" :src="pk.image" />
      </view>
      <view class="package-info flex-col">
        <view class="package-name">选装</view>
        <view class="package-content ellipsis-2">{{ pk.name || '' }}</view>
        <view class="package-price">
          <template v-if="vehicle.skuData.itemPreSaleVO.showPriceFlag">
            <text v-if="pk.price">￥{{ formatMoney(pk.price, 0, 0) }}</text>
            <text v-else>价格已包含</text>
          </template>
          <text v-else>价格待定</text>
        </view>
      </view>
      <view v-if="!readOnly" class="action items-center justify-center" @click="handleEdit(3)">更改</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="ConfigInfo">
import { formatMoney } from '@util/money'
import { PropType } from 'vue'

defineProps({
  vehicle: {
    type: Object,
    default: () => ({})
  },
  model: {
    type: Object,
    default: () => ({})
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  packages: {
    type: Array as PropType<Array<Car.Packages>>,
    default: () => []
  }
})
const emit = defineEmits(['btnEdit'])

const handleEdit = (val: number) => {
  emit('btnEdit', val)
}
</script>

<style lang="scss" scoped>
.packages {
  width: 100%;
  padding: 0 40rpx;

  .package {
    width: 100%;
    height: 234rpx;
    border-bottom: 1rpx solid #e4e7ea;
  }

  .package-image {
    flex-basis: 76rpx;
    height: 100%;

    .image:first-of-type {
      border-radius: 50%;
      width: 76rpx;
      height: 76rpx;
      margin-bottom: 8rpx;
    }

    .image:last-of-type {
      border-radius: 4rpx;
      width: 70rpx;
      height: 70rpx;
      margin-bottom: 0;
    }
  }

  .package-info {
    flex: 1;
    padding: 0 40rpx;
    font-size: 30rpx;
    line-height: 45rpx;

    .package-name {
      color: #909ca8;
    }

    .package-content {
      color: #292c2e;
      margin-bottom: 19rpx;
    }

    .package-price {
      color: #92969a;
    }
  }

  .action {
    flex-basis: 70rpx;
    height: 100%;
    font-size: 30rpx;
    color: #4e6175;
  }
}
</style>
