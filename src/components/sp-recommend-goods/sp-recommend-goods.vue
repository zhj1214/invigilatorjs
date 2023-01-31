<template>
  <view v-if="recommendList.length" class="recommend-goods" :class="{ 'has-title': hasTitle }">
    <view v-if="hasTitle" class="title">—— 猜你喜欢 ——</view>
    <view class="wrap-recommend-goods">
      <sp-goods-card v-for="item in recommendList" :key="'recommend' + item.id" :goods-detail="item" :point-ratio="pointRatio" />
    </view>
    <view v-if="noMore" class="recommend-footer items-center justify-center">- 没有更多了 -</view>
  </view>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  recommendList: {
    type: Array as PropType<Goods.Item[]>,
    default: () => []
  },
  pointRatio: Number,
  hasTitle: {
    type: Boolean,
    default: true
  },
  noMore: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
