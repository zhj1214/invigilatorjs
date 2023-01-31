<template>
  <!-- 自定义头部 -->
  <view class="sp-header" :class="[position]">
    <view :class="['status-bar', statusBarBg]" :style="{ height: statusBarHeight + 'px' }"><!-- 这里是状态栏 --></view>
    <slot />
  </view>
</template>

<script lang="ts" setup name="SpHeader">
import { computed } from 'vue'
import { useAppStore } from '@src/pinia/app'

defineProps({
  position: {
    type: String,
    default: 'fixed',
    validator: function (val) {
      return val === 'fixed' || val === 'relative'
    }
  },
  statusBarBg: {
    type: String,
    default: ''
  }
})
const statusBarHeight = computed(() => useAppStore().statusBarHeight)
</script>

<style lang="scss" scoped>
.sp-header {
  top: 0;
  width: 100%;
  z-index: 999;

  &.fixed {
    position: fixed;
  }

  &.relative {
    position: relative;
  }

  .status-bar {
    width: 100%;

    &.white {
      background-color: white;
    }
  }
}
</style>
