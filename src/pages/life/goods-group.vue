<template>
  <view class="goods-group">
    <view v-if="frontCategory.level > 1" class="wrap-title">
      <text class="title">{{ frontCategory.name }}</text>
      <view v-if="hasMore" class="more-btn">
        <text @click="goMore">更多</text>
        <image :src="iconRight" class="icon" />
      </view>
    </view>
    <view class="wrap-goods-card">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts" name="GoodsGroup">
import { inject } from 'vue'

const props = defineProps<{
  frontCategory: {
    id: string
    level: number
    name: string
  }
  hasMore?: boolean
}>()

// 跳转-更多商品页面
const goMore = () => {
  const { id, name } = props.frontCategory
  uni.navigateTo({
    url: `/package-life/pages/goods-list/index?id=${id}&title=${name}`
  })
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const iconRight = gdp('icon-right.png')
</script>

<style lang="scss" scoped>
.goods-group {
  margin: 56rpx 32rpx 0;

  .wrap-title {
    margin: 0 0 32rpx;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;

    .title {
      font-size: 36rpx;
      color: #292c2e;
      font-weight: bold;
    }

    .more-btn {
      font-size: 28rpx;
      color: #92969a;

      > .icon {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }

  // 包裹所有的商品card
  .wrap-goods-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
