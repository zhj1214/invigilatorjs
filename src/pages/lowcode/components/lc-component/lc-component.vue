<template>
  <!-- 导航组件 -->
  <template v-if="props.isId === '0'">
    <!-- <navigation bg-type="1" color-type="1" title="哈哈哈哈哈哈" :show-title="true" :left-edits="[]" /> -->
    <navigation v-bind="props.propsItem" />
  </template>
  <!-- 标题组件 -->
  <template v-else-if="props.isId === '1'">
    <!-- <title subtitle="副标题" bg-color="rgba(255, 255, 255, 1)" bg-img="" /> -->
    <title v-bind="props.propsItem" />
  </template>
  <!-- 商品组件 -->
  <template v-else-if="props.isId === '2'">
    <goods :goods-ids="['2765879292750700553', '2765879292750700555']" sort-type="1" />
    <!-- <goods v-bind="props.propsItem" /> -->
  </template>
</template>

<script setup lang="ts" name="LifeIndex">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, inject, computed, Ref } from 'vue'
import Navigation from '../lc-navigation/lc-navigation.vue'
import Title from '../lc-title/lc-title.vue'
import Goods from '../lc-goods/lc-goods.vue'

interface IProps {
  isId: string
  propsItem?: { [key: string]: any }
}
const props = withDefaults(defineProps<IProps>(), {
  isId: '',
  propsItem: () => ({})
})
</script>

<style lang="scss" scoped></style>
