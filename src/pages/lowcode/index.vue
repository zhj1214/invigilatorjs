<template>
  <view v-if="materialConfigs.length" class="life-page">
    <lc-component v-for="item in materialConfigs" :key="item.id" :is-id="item.materialId" :props-item="item.props" />
    <LcTabs :list="list1" @click="click" :lineHeight="20">
      <template v-slot:content="item">
        <view>少时诵诗书所所所--{{item.current}}--</view>
      </template>
    </LcTabs>
  </view>
</template>

<script setup lang="ts" name="LifeIndex">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, inject, computed, Ref } from 'vue'
import { getPageConfig } from '@api/lowcode'
import lcComponent from './components/lc-component/lc-component.vue'
import LcTabs from '@src/components/lc-tabs/lc-tabs.vue'

const materialConfigs = ref<any>([])

const getPageConfigFn = async () => {
  const res = await getPageConfig({ position: 'home_page_boutique' })
  materialConfigs.value = res.materialConfigs && JSON.parse(res.materialConfigs)
  console.log('materialConfigs.value', materialConfigs.value)
}

onLoad(async () => {
  getPageConfigFn()
})

const list1 = [{
  name: '关注',
}, {
  name: '推荐',
}, {
  name: '电影'
}, {
  name: '科技'
}, {
  name: '音乐'
}, {
  name: '美食'
}, {
  name: '文化'
}, {
  name: '财经'
}, {
  name: '手工'
}]
const click = (item: any) => {
  console.log('item', item);
}

</script>

<style lang="scss" scoped>

</style>
