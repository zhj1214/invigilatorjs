<template>
  <view class="page-header" :style="{ background: isTransparent ? 'transparent' : '#fff' }">
    <!-- 状态栏 -->
    <view class="status_bar" :style="'height:' + statusBarHeight + 'px'" />
    <view class="icons">
      <image class="back-icon" :src="isTransparent ? backIcon : iconRight" :style="{ transform: isTransparent ? `` : `rotate(180deg)` }" mode="aspectFill" @click="$emit('back')" />
      <!-- icon插槽 -->
      <slot />
      <!-- <image class="add-icon" :src="isTransparent ? addIcon : addBlackIcon" mode="aspectFill" @click="toAddContent"></image> -->

      <view class="title">
        <text class="mid">{{ title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import defineComponent from './index'
export default defineComponent
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
