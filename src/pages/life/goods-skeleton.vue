<template>
  <view class="goods-skeleton">
    <view class="goods-image" />
    <view class="goods-name" />
    <view class="goods-price" />
  </view>
</template>

<script setup name="GoodsSkeleton"></script>

<style lang="scss" scoped>
.goods-skeleton {
  width: 326rpx;
  padding-bottom: 48rpx;

  .goods-image {
    width: 326rpx;
    height: 326rpx;
    vertical-align: middle;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    background-color: #f4f5f6;
    animation: sp-skeleton-loading 1.4s ease infinite;
  }

  .goods-name {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    margin: 24rpx 0 10rpx;
    height: 40rpx;
    animation: sp-skeleton-loading 1.4s ease infinite;
  }

  .goods-price {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    height: 40rpx;
    animation: sp-skeleton-loading 1.4s ease infinite;
  }
}

@keyframes sp-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
