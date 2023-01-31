<template>
  <view class="life-page">
    <!-- 带搜索的头部 -->
    <header-search />

    <!-- 可切换的tabs -->
    <view class="fix-tab">
      <sp-tabs id="tab-content" ref="spTabsRef" :init-scroll-page="true" :active-tab="activeTab" :menus="menus" @active-index="setActiveTab" @change="handleToggleTab" />
    </view>

    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      scroll-with-animation
      refresher-enabled
      :refresher-triggered="isRefresh"
      class="body-scroll-view"
      :lower-threshold="100"
      @scroll="scroll"
      @refresherrefresh="onRefresh"
      @scrolltolower="getMoreRecommendItems"
    >
      <!-- 轮播图 -->
      <view class="wrap-swiper">
        <sp-swiper :img-list="tenantId === deaultTanent.tenantId ? supaurImgList : huaxiaImgList" :control-bottom="20" />
      </view>
      <!-- 商品列表占位骨架 -->
      <view v-if="isGoodsLoading && !categoryItems.id" class="life-skeleton item-center justify-between">
        <goods-skeleton />
        <goods-skeleton />
        <goods-skeleton />
        <goods-skeleton />
      </view>
      <!-- 一级类目下的商品列表 -->
      <template v-if="categoryItems.leafFlag">
        <goods-group :front-category="getFrontCategory(categoryItems)">
          <view class="goods-contain">
            <sp-goods-card v-for="item in categoryItems.itemDTOList" :key="item.itemBasicVO.id" :point-ratio="pointRatio" :goods-detail="item" />
          </view>
        </goods-group>
      </template>
      <!-- 二级类目及三级类目的商品列表 -->
      <template v-else>
        <goods-group v-for="child in categoryItems.children" :key="child.id" :front-category="getFrontCategory(child)" :has-more="child.itemDTOList.length > 4">
          <view class="goods-contain">
            <sp-goods-card v-for="item in child.itemDTOList" :key="item.itemBasicVO.id" :point-ratio="pointRatio" :goods-detail="item" />
          </view>
        </goods-group>
      </template>
      <!-- 商品为空 -->
      <view v-if="!isGoodsLoading && !categoryItems.id" class="empty">敬请期待</view>
      <!-- 推荐商品列表 -->
      <sp-recommend-goods :recommend-list="recommendItems" :point-ratio="pointRatio" :no-more="noMoreRecommendItems" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="LifeIndex">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { reactive, inject, ref, computed, Ref } from 'vue'

import GoodsGroup from './goods-group.vue'
import HeaderSearch from './header-search.vue'
import GoodsSkeleton from './goods-skeleton.vue'

import { useGoods } from './goods'
import { useConfigStore } from '@src/pinia/config'
import { useGoodsStore } from '@src/pinia/goods'
import { useScrollTop } from '@src/hooks/scroll-top'

const configStore = useConfigStore()
const goodsStore = useGoodsStore()
const { categoryList, frontCategoryId, categoryItems, recommendItems, noMoreRecommendItems, refreshPage, refreshRecommendItems, getMoreRecommendItems, refreshCategoryItems } =
  useGoods()
// 滚动顶部
const { scrollTop, scroll, goTop } = useScrollTop()

onLoad(async () => {
  goodsStore.getPointRatio()
  // 获取deaultTanent配置
  const feConfigInfo = await configStore.getFeConfig()
  deaultTanent.tenantId = feConfigInfo.deaultTanent.tenantId
  deaultTanent.tenantName = feConfigInfo.deaultTanent.tenantName

  const l = '121'
  console.log('main --  a.b', l.eee.ff)
})

onShow(async () => {
  await refreshPage()
  validFrontCategortId()
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
// 多租户轮播图
const supaurImgList = gdp(['banner-001.png', 'banner-001.png'])
const huaxiaImgList = gdp(['banner-003.png', 'banner-004.png'])

// 租户信息
const tenantId = uni.getStorageSync('currentTenant').tenantId
let deaultTanent = reactive({
  tenantId: '',
  tenantName: ''
})

// 积分货币兑换比例
const pointRatio = computed(() => goodsStore.pointRatio)

// 子组件tab
const spTabsRef: Ref<SpTabs | null> = ref(null)
// 记录上次激活的tab
let lastActiveTab = 0
const activeTab = ref(0)
// tab menus
const menus = computed(() => {
  return categoryList.map((item) => {
    return {
      name: item.name,
      value: String(item.id)
    }
  })
})

const setActiveTab = (index: number) => {
  lastActiveTab = activeTab.value
  activeTab.value = index
}

// 下拉刷新触发标识
const isRefresh = ref(false)
// 商品刷新标识
const isGoodsLoading = ref(true)

/**
 * 验证当前选中前台类目有效性
 * 若当前选中类目不存在 frontCategoryId 设置为第一个前台类目id，tab需滚动到顶部（最左侧）
 */
function validFrontCategortId() {
  const index = categoryList.findIndex((item) => item.id === frontCategoryId.value)
  if (index > -1) {
    activeTab.value = index
  } else {
    activeTab.value = 0
    spTabsRef.value?.goLeft()
    goTop()
  }
}

/**
 * 下拉刷新
 */
async function onRefresh() {
  // 刷新全部数据
  isRefresh.value = isGoodsLoading.value = true
  await refreshPage()
  isRefresh.value = isGoodsLoading.value = false
  validFrontCategortId()
}

/**
 * 切换tab
 * @param id
 */
async function handleToggleTab(id: string) {
  uni.showLoading({
    title: ''
  })
  isGoodsLoading.value = true
  try {
    await refreshCategoryItems(id)
    // 推荐下个版本做
    // await refreshRecommendItems({
    //   recType: 2,
    //   excludeFontCategoryId: frontCategoryId.value
    // })
    goTop()
  } catch (error) {
    // 类目不存在，切换回上一个 ActiveTab
    activeTab.value = lastActiveTab
    // uni.showToast({
    //   title: '商品类目不存在，请重新操作'
    // })
  }
  isGoodsLoading.value = false
  uni.hideLoading()
}
const getFrontCategory = (categoryItems: Goods.CategoryItems) => {
  return {
    id: categoryItems.id,
    level: categoryItems.level,
    name: categoryItems.name
  }
}
</script>

<style lang="scss" scoped>
$header-mp: 88px;
$header-h5: calc(var(--status-bar-height) + 100rpx);
$top-tab: 110rpx;
$bottom-tab: 100rpx;

.life-page {
  /* #ifdef H5 */
  padding-top: calc($top-tab + $header-h5);
  /* #endif */

  /* #ifdef MP-WEIXIN */
  padding-top: calc($top-tab + $header-mp);

  /* #endif */
  .wrap-swiper {
    width: 100vw;
    height: 548rpx;
  }

  .body-scroll-view {
    /* #ifdef H5 */
    height: calc(100vh - env(safe-area-inset-bottom) - $bottom-tab - $top-tab - $header-h5);
    /* #endif */

    /* #ifdef MP-WEIXIN */
    height: calc(100vh - $top-tab - $header-mp);

    /* #endif */
    .goods-contain {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}

.empty {
  width: 100%;
  padding: 100rpx 0;
  font-size: 24rpx;
  color: #92969a;
  text-align: center;
}

.fix-tab {
  position: fixed;

  /* #ifdef H5 */
  top: $header-h5;
  /* #endif */

  /* #ifdef MP-WEIXIN */
  top: $header-mp;
  /* #endif */
  left: 0;
  width: 100%;
  z-index: 10;
}

.life-skeleton {
  margin: 80rpx 32rpx 0;
  flex-wrap: wrap;
}
</style>
