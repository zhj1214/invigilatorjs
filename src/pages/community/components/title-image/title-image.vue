<template>
  <view class="title-image">
    <image class="image" :src="image" mode="aspectFill" />
    <text class="title-text">{{ title }}</text>
    <view class="filter-box" />
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TitleImage',
  props: {
    title: {
      type: String,
      default: '',
      required: true
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
