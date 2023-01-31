<template>
  <view class="sp-avatar-info-wrapper" :class="size">
    <view class="avatar-info-left">
      <image :src="src || defaultAvatarImg" class="avatar" mode="aspectFill" :class="shape" />
      <view class="info">
        <view class="title">{{ title }}</view>
        <view class="subtitle">
          <slot>{{ subtitle }}</slot>
        </view>
      </view>
    </view>
    <!-- <view class="avatar-info-right">
      <slot name="btn"></slot>
    </view> -->
  </view>
</template>

<script setup lang="ts" name="SpAvatarInfo">
import { inject } from 'vue'

defineProps({
  src: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'circle'
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default'
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [defaultAvatarImg] = gdp(['icon-default-avatar.png'])
</script>

<style lang="scss" scoped>
.sp-avatar-info-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .avatar-info-left {
    display: inline-flex;
    align-items: center;
    width: 55%;

    .avatar {
      width: 88rpx;
      height: 88rpx;
      margin-right: 20rpx;

      &.circle {
        border-radius: 50%;
      }
    }

    .info {
      width: 100%;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 28rpx;
        color: #1a1a1a;
        font-weight: bold;
        white-space: pre-wrap;
        word-break: break-all;
      }

      .subtitle {
        font-size: 26rpx;
        color: #909ca8;
        font-weight: 400;
      }
    }
  }

  &.large {
    .avatar {
      width: 64rpx;
      height: 64rpx;
      margin-right: 35rpx;
    }

    .info {
      .title {
        font-size: 42rpx;
      }
    }
  }
}
</style>
