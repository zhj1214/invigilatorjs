<template>
  <view class="thumb-up-wrapper" :style="_style">
    <image :src="icon" mode="aspectFill" class="icon" :style="{ width: size + 'rpx', height: size + 'rpx' }" />
    <view class="number"><slot /></view>
  </view>
</template>

<script lang="ts" setup name="SpIconNumber">
import { computed } from 'vue'

const props = defineProps({
  icon: String,
  size: {
    type: Number,
    default: 26
  },
  color: {
    type: String,
    default: '#909CA8'
  },
  direction: {
    type: String,
    default: ''
  }
})

const _style = computed(() => `flex-direction: ${props.direction};font-size: ${props.size}rpx;color: ${props.color}`)
</script>

<style lang="scss" scoped>
.thumb-up-wrapper {
  display: inline-flex;
  align-items: center;

  .icon {
    display: inline-block;
  }

  .number {
    margin: 0 8rpx;
  }
}
</style>
