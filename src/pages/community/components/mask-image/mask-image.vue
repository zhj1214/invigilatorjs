<template>
  <view class="mask-image">
    <image class="image" :src="image" mode="aspectFill" />
    <view class="mask">
      <text class="title">{{ title }}</text>
      <text class="subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MaskImage',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: '',
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
