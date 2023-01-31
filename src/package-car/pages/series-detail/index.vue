<template>
  <view class="series-detail" :style="activeTab === 1 ? 'background-color: #F2F3F3;height: 100vh;' : ''">
    <view id="tab" class="sp-header-tabs">
      <sp-tabs underline :menus="tabs" :active-tab="activeTab" @on-click="handleTabChange" />
    </view>
    <!-- 占位元素 -->
    <view class="placeholder-label" />
    <view :class="['content', activeTab === 0 ? 'rich-text-content' : '']">
      <rich-text v-if="activeTab === 0" class="rich-text-box" :nodes="carDetail" />
      <sp-product-assess-list v-if="activeTab === 1" ref="productAssessList" :back-category-id="backCategoryId" :is-car-evaluation="true" />
    </view>
    <view class="footer-box">
      <view v-if="tempData.attrs.price" class="price">
        <text class="text1">￥</text>
        <text class="text2">{{ formatMoney(tempData.attrs.price, 0, 0) }}</text>
        <text class="text3">起</text>
      </view>
      <view v-else class="price price-none">价格已包含</view>
      <view class="btn" @click="checkSeries">立即订购</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SeriesDetail">
import { ref, getCurrentInstance, reactive, computed } from 'vue'
import { formatMoney } from '@util/money'
import { throttle } from '@src/lib/lodash'
import parseHtml from '@src/lib/html-parser'
import { onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { useCarStore } from '@src/pinia/car'

const carStore = useCarStore()
const instance = getCurrentInstance()
const vehicle = computed(() => carStore.vehicle)
const tempData = computed(() => carStore.tempData)
const carDetail = computed(() => {
  /**
   * 各个端的商品详情 （H5、PC、小程序）
   */
  let details = JSON.parse(tempData.value.attrs.detail)
  /**
   * 过滤出富文本内容
   */
  let richText = details?.filter((item: AnyObject) => item.type === 0) || {}
  return parseHtml(richText?.[0]?.text || '')
}).value
/**
 * 评价列表所需参数
 */
let backCategoryId = ref('')
/**
 * 选中的tab
 */
let activeTab = ref(0)
const handleTabChange = (menuVal: number) => {
  activeTab.value = menuVal
}
const checkSeries = () => {
  setVehicleInfo()
  uni.redirectTo({ url: `/package-car/pages/select-vehicle/index` })
}
const setVehicleInfo = () => {
  carStore.setModelActive(1)
  if (!vehicle.value.series || tempData.value.id !== vehicle.value.series.id) {
    const vehicleData = {
      series: tempData,
      model: null,
      outColor: null,
      outPainting: null,
      outPrice: 0,
      rim: null,
      rimPrice: 0,
      innerColor: null,
      innerMaterial: null,
      innerPrice: 0,
      packages: [],
      carPoster: '',
      skuData: null
    }
    carStore.setVehicle(vehicleData)
  }
}
const getMoreData = () => {
  const productAssessList = instance?.refs.productAssessList as { onloadMore: () => void }
  productAssessList.onloadMore()
}
// #ifdef H5
const resize = throttle(
  () => {
    const $header = document.getElementsByClassName('uni-page-head')[0] as HTMLElement
    const top = $header.offsetHeight + $header.offsetTop
    ;(document.getElementById('tab') as HTMLElement).style.top = `${top}px`
  },
  300,
  {
    trailing: false
  }
)
// #endif

const tabs = reactive([
  { name: '详情', value: 0 },
  { name: '评价', value: 1 }
])

onLoad((options: AnyObject) => {
  backCategoryId = options && options.id
  uni.pageScrollTo({
    scrollTop: 0
  })
})
onShow(() => {
  // #ifdef H5
  window.addEventListener('resize', resize, false)
  // #endif
}),
  // #ifdef H5
  onHide(() => {
    window.removeEventListener('resize', resize)
  }),
  // #endif
  onReachBottom(() => {
    activeTab.value === 1 && getMoreData()
  })
</script>

<style lang="scss" scoped>
.series-detail {
  .sp-header-tabs {
    position: fixed;
    top: var(--window-top);
    width: 100%;
    background: #fff;
    height: 110rpx;
    font-size: 28rpx;
    z-index: 999;
  }

  .placeholder-label {
    width: 100%;
    height: 110rpx;
  }

  .content {
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }

  .rich-text-content {
    padding: 0 40rpx calc(120rpx + env(safe-area-inset-bottom));
  }

  .footer-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));
    display: flex;
    justify-content: space-between;
    background: #fff;
    z-index: 100;
    border-top: 1rpx solid #e4e7ea;

    .price {
      height: 84rpx;
      line-height: 84rpx;
      font-size: 26rpx;

      &.price-none {
        color: #92969a;
      }

      text {
        color: #4e6175;
        line-height: 84rpx;
        vertical-align: middle;
      }

      .text2 {
        font-size: 40rpx;
        font-weight: bolder;
        margin-right: 4rpx;
      }
    }

    .btn {
      width: 232rpx;
      height: 84rpx;
      background: #1a1a1a;
      border-radius: 1rpx;
      color: #fff;
      line-height: 84rpx;
      text-align: center;
    }
  }
}
</style>
