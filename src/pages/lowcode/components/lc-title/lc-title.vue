<template>
  <view class="componet-title" :style="styleBg">
    <view v-if="title" class="title-main" v-html="title" />
    <view v-if="subtitle" class="title-sub" v-html="subtitle" />
  </view>
</template>

<script lang="ts" setup name="SpSearchHeader">
import { computed, inject, useAttrs } from 'vue'

interface PropsType {
  title: string
  subtitle?: string
  bgColor?: string
  bgImg?: string
}

const props = withDefaults(defineProps<PropsType>(), {
  title: '',
  subtitle: '',
  bgColor: 'rgba(255, 255, 255, 1)',
  bgImg: ''
})

const styleBg = computed(() => {
  let style = ''
  if (props.bgColor) {
    style += `background-color: ${props.bgColor};`
  }
  if (props.bgImg) {
    style += `background-image: url('${props.bgImg}')`
  }
  return style
})
</script>

<style lang="scss" scoped>
.componet-title {
  padding: 28rpx 30rpx;
  background-repeat: no-repeat;
  background-size: cover;
  .title-main {
    margin-bottom: 2rpx;
  }
}
</style>
