<template>
  <view class="wrap-address padding-40" @click="goSelectAddress">
    <view v-if="selectedAddress" class="address-detail">
      <view class="left">
        <view class="name-mobile font-medium">
          <text class="receiver-name ellipsis">{{ selectedAddress.receiverName }}</text>
          <text>{{ selectedAddress.mobile }}</text>
        </view>
        <view class="detail ellipsis-2">{{ addressDetail }}</view>
      </view>
      <view class="right">
        <image class="icon-right" :src="iconRight" mode="scaleToFill" />
      </view>
    </view>
    <view v-else class="selcted-address">
      <text class="plus">+</text>
      <text class="txt">添加地址</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useAddressStore } from '@src/pinia/address'
import { computed, inject, watch } from 'vue'

// 静态图片
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const iconRight = gdp('icon-right-new.png')

const addressStore = useAddressStore()

const emit = defineEmits(['change'])
// 地址相关
const selectedAddress = computed(() => addressStore.selectedAddress)
const addressDetail = computed(() => {
  const { province, city, district, details } = selectedAddress.value || {}
  return province ? province + city + district + details : ''
})

watch(
  () => selectedAddress.value,
  (value) => {
    emit('change', value?.id || null)
  }
)

// 去选择地址
const goSelectAddress = () => {
  uni.navigateTo({ url: `/package-mine/pages/address-list/index?is-picker=1&isFromPage=goodsSettle` })
}
</script>
<style lang="scss" scoped>
.padding-40 {
  padding: 0 40rpx;
}

// 地址
.wrap-address {
  height: 180rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f2f3f3;
  border-top: 1rpx solid #f2f3f3;

  // 已选的地址详情
  .address-detail {
    flex: 1;
    display: flex;

    .left {
      flex: 1;

      .name-mobile {
        font-size: 32rpx;
        font-weight: 500;
        color: #1a1a1a;
      }

      .detail {
        font-size: 26rpx;
        color: #92969a;
        margin-top: 6rpx;
      }

      .receiver-name {
        display: inline-block;
        margin-right: 16rpx;
        max-width: 200rpx;
        vertical-align: bottom;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .icon-right {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  // 没有选择地址时
  .selcted-address {
    font-size: 34rpx;
    font-weight: 500;
    color: #1a1a1a;

    .plus {
      font-size: 60rpx;
      margin-right: 6rpx;
    }

    .txt {
      position: relative;
      top: -8rpx;
    }
  }
}
</style>
