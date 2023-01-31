<template>
  <view class="reg-success">
    <image class="reg-success-icon" :src="registerSuccessImg" mode="aspectFill" />
    <view class="reg-success-text font-medium">成功创建账号</view>
    <view class="reg-success-tips font-regular">点击下方按钮登录数字商城</view>
    <button class="reg-success-button" @click="goBack">进入使用</button>
  </view>
</template>

<script lang="ts" setup name="RegisterSuccess">
import { inject } from 'vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const registerSuccessImg = gdp('icon-success.png')

const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style lang="scss" scoped>
.reg-success {
  text-align: center;
  padding-top: 200rpx;

  &-icon {
    width: 164rpx;
    height: 164rpx;
  }

  &-text {
    height: 83rpx;
    font-size: 56rpx;
    font-weight: 500;
    color: #292c2e;
    line-height: 83rpx;
    margin: 32rpx auto 8rpx;
  }

  &-tips {
    height: 36rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #92969a;
    line-height: 36rpx;
  }

  &-button {
    margin-top: 174rpx;
    width: 564rpx;
    height: 96rpx;
    line-height: 96rpx;
    background: #1a1a1a !important;
    border-radius: 1rpx;
    text-align: center;
    color: #fff;
  }
}
</style>
