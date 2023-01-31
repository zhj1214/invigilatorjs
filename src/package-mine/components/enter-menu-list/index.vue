<template>
  <view class="order-type">
    <view class="order-type-text">{{ title }}</view>
    <view class="order-type-content">
      <view v-for="(item, index) in menus" :key="index" class="order-type-content-item" @click="goToItem(item.link)">
        <view class="order-type-content-item-left item-center">
          <text>{{ item.name }}</text>
        </view>
        <view class="order-type-content-item-right item-center">
          <image :src="iconOrderRight" mode="asceptFit" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="EnterMenuList">
import { inject, defineProps } from 'vue'

interface Items {
  name: string
  link: string
}

defineProps<{
  title: string
  menus: Items[]
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let iconOrderRight: string = gdp('icon-order-right.png')

const goToItem = (link: string) => {
  uni.navigateTo({
    url: link
  })
}
</script>

<style lang="scss" scoped>
.order-type {
  height: 100%;
  padding: 0 40rpx;

  &-text {
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #292c2e;
    line-height: 83rpx;
    padding: 48rpx 0;
  }

  &-content {
    background: #fff;

    &-item {
      display: flex;
      justify-content: space-between;
      padding: 40rpx;
      height: 130rpx;
      align-items: center;
      background: #fff;
      border-radius: 2rpx;
      border: 1rpx solid #dbdcdd;
      margin-bottom: 24rpx;

      &-left {
        text {
          font-size: 32rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #292c2e;
          line-height: 47rpx;
        }
      }

      &-right {
        image {
          height: 32rpx;
          width: 32rpx;
        }
      }

      .item-center {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
