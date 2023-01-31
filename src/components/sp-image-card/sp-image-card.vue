<template>
  <view class="image-card">
    <image :src="image" class="image" />
    <view class="info">
      <text class="title">{{ title }}</text>
      <view class="sub-title-view">
        <slot>
          <image :src="icon || locationIcon" class="icon" />
          <text class="sub-title">{{ subtitle }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SpImageCard">
import { inject } from 'vue'

defineProps({
  image: String,
  title: [String, Number],
  subtitle: [String, Number],
  icon: String
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [locationIcon] = gdp(['icon-location-gray.png'])
</script>

<style lang="scss" scoped>
.image-card {
  display: flex;
  justify-content: center;
  height: 190rpx;

  .image {
    border-radius: 4rpx;
    width: 286rpx;
    height: 190rpx;
  }

  .info {
    width: 343rpx;
    padding: 12rpx 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 24rpx;
    color: rgb(41 44 46);

    .title {
      font-size: 32rpx;
      font-weight: 500;
      display: flex;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .sub-title-view {
      font-size: 24rpx;
      font-weight: 400;
      color: #92969a;
      display: inline-flex;
      align-items: center;

      .sub-title {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        width: 28rpx;
        height: 28rpx;
        margin-right: 6rpx;
      }
    }
  }
}
</style>
