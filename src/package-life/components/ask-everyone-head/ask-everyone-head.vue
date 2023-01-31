<template>
  <view class="question-head">
    <view class="question-head-left">
      <image class="question-head-left-img" :src="img" />
    </view>
    <view class="question-head-right" :class="{ 'singe-line': total === undefined }">
      <view class="question-head-right-title ellipsis">{{ title }}</view>
      <view v-if="total != undefined" class="question-head-right-total">共{{ total }}个问题</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
defineProps<{
  img: string
  total?: number
  title: string
}>()
</script>

<style lang="scss" scoped>
.question-head {
  background-color: #ffff;
  padding: 32rpx;
  display: flex;

  &-left {
    margin-right: 24rpx;
    width: 100rpx;
    height: 100rpx;

    &-img {
      width: 100%;
      height: 100%;
    }
  }

  &-right {
    margin-left: 24rpx;

    &-title {
      max-width: 540rpx;
      height: 41rpx;
      line-height: 41rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #292c2e;
      margin: auto 0;
    }

    &-total {
      margin-top: 18rpx;
      height: 41rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #92969a;
      line-height: 41rpx;
    }
  }

  .singe-line {
    display: flex;
    align-items: center;
  }
}
</style>
