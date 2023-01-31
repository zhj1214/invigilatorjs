<template>
  <view class="success">
    <image class="success-image" :src="assessSuccess" mode="aspectFill" />
    <view class="success-content">评价发布成功</view>
    <view class="success-buttons">
      <view class="success-buttons-btn success-buttons-view" @click="checkEvaluation">查看评价</view>
      <view class="success-buttons-btn success-buttons-back" @click="toReturnLifePage">返回首页</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

let itemType = ref(0) // 0 整车 1 生活

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let assessSuccess: string = gdp('assess-success.png')

function checkEvaluation() {
  uni.navigateTo({ url: `/package-mine/pages/evaluation-list/index?itemType=${itemType.value}&isFromSuccess=true` })
}

function toReturnLifePage() {
  uni.switchTab({ url: '/pages/life/index' })
}

onLoad((option: { itemType?: string }) => {
  itemType.value = Number(option.itemType)
})
</script>

<style scoped lang="scss">
.success {
  &-image {
    display: block;
    margin: 200rpx auto 32rpx;
    width: 164rpx;
    height: 164rpx;
  }

  &-content {
    height: 83rpx;
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #292c2e;
    line-height: 83rpx;
    text-align: center;
  }

  &-buttons {
    margin-top: 193rpx;
    text-align: center;

    &-btn {
      width: 75%;
      height: 96rpx;
      border-radius: 1rpx;
      text-align: center;
      line-height: 96rpx;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      margin: 0 auto;
    }

    &-view {
      background-color: #1a1a1a;
      color: #fff;
    }

    &-back {
      background: #fff;
      border: 1rpx solid #92969a;
      color: #292c2e;
      margin-top: 36rpx;
    }
  }
}
</style>
