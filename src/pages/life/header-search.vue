<template>
  <sp-header status-bar-bg="white">
    <view class="header-search" @click="handleSearch">
      <view class="fake-input">
        <image :src="iconSearch" class="icon" />
        <text class="separator" />
        <text>搜索产品</text>
      </view>
    </view>
  </sp-header>
</template>

<script setup lang="ts" name="HeaderSearch">
import { inject } from 'vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const iconSearch = gdp('icon-search-black.png')

const handleSearch = () => {
  uni.navigateTo({
    url: '/package-life/pages/goods-search/index'
  })
}
</script>

<style lang="scss" scoped>
.header-search {
  width: 100%;

  /* #ifdef H5 */
  height: 100rpx;
  /* #endif */

  /* #ifdef MP-WEIXIN */
  height: 80rpx;
  /* #endif */
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0 40rpx;

  .fake-input {

    /* #ifdef H5 */
    width: 100%;
    /* #endif */

    /* #ifdef MP-WEIXIN */
    width: 370rpx;
    /* #endif */
    height: 66rpx;
    line-height: 66rpx;
    background-color: #f2f3f3;
    border-radius: 33rpx;
    color: #d8d8d8;
    font-size: 30rpx;

    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-left: 20rpx;
      position: relative;
      top: 8rpx;
    }

    .separator {
      font-size: 24rpx;
      margin: 0 16rpx;
      border: none;
      border-left: 1px solid #d8d8d8;
    }
  }
}
</style>
