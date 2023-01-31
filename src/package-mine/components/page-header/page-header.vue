<template>
  <view class="page-header" :style="{ background: isTransparent ? 'transparent' : '#fff' }">
    <!-- 状态栏 -->
    <view class="status_bar" :style="'height:' + statusBarHeight + 'px'" />
    <view class="icons">
      <image class="back-icon" :src="iconRight" mode="aspectFill" @click="$emit('back')" />
      <!-- icon插槽 -->
      <slot />

      <view class="title">
        <text class="mid" :style="{ color: isTransparent ? `` : `#000` }">{{ title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="PageHeader">
import { computed } from 'vue'
import { useAppStore } from '@src/pinia/app'

defineProps({
  isTransparent: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  }
})
const statusBarHeight = computed(() => useAppStore().statusBarHeight)
</script>

<style lang="scss" scoped>
.page-header {
  position: fixed;
  z-index: 999;
  background: transparent;
  width: 100vw;

  .icons {
    padding-left: 36rpx;
    position: relative;
    padding-top: 10rpx;

    .back-icon {
      width: 64rpx;
      height: 64rpx;
      z-index: 1000;
      position: relative;
      margin-right: 24rpx;
    }

    .add-icon {
      width: 64rpx;
      height: 64rpx;
      z-index: 1000;
      position: relative;
    }

    .title {
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 10rpx;
      width: 100vw;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .mid {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 300rpx;
        color: #fff;
        font-size: 34rpx;
        text-align: center;
      }
    }
  }
}
</style>
