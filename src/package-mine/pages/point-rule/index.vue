<template>
  <view>
    <rich-text :nodes="pointRule" />
  </view>
</template>

<script lang="ts" setup>
const pointRule = uni.getStorageSync('pointRule')
</script>

<style scoped lang="scss">
view {
  padding: 0 40rpx;
}
</style>
