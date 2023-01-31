<template>
  <view>
    <rich-text :nodes="growthRule" class="content" />
  </view>
</template>

<script lang="ts" setup name="GrowthRule">
import parseHtml from '@src/lib/html-parser'
const growthRule = parseHtml(uni.getStorageSync('growthRule'))
</script>

<style scoped lang="scss">
view {
  padding: 0 40rpx;
}
</style>
