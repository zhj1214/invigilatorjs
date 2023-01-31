<template>
  <view class="vehicle-setting" @touchend="touchend">
    <view id="tab" class="sp-header-tabs">
      <sp-tabs underline car-list-header :menus="tabs" :active-tab="active" @on-click="handleTabChange" />
    </view>
    <!-- 占位元素 -->
    <view class="placeholder-label" />
    <view class="setting-main" :class="{ 'disabled-pull': disabledPull }">
      <!-- 外观、轮圈图片 -->
      <exterior-rim-img v-if="active === 0 || active === 1" :active="active" :out-car-data="outCarData" :set-img-data="setImgData" />
      <!-- 外饰配置 -->
      <exterior-setting v-if="outColor.data.name" :active="active" @set-out-data="setOutData" />
      <!-- 轮圈配置 -->
      <rim-setting v-if="rim.data.name" :vehicle="vehicle" :active="active" @set-out-data="setOutData" />
      <!-- 内饰配置 -->
      <inner-setting v-if="skus && innerImgList.data.length !== 0" :active="active" />
      <!-- 选装包配置 -->
      <packages-setting :packages-list="packagesList" :active="active" />
    </view>
    <price-btn-bottom ref="priceBtnBottom" :vehicle="vehicle" :btn-text="nextBtnText" @btn-click="toNext" />
  </view>
</template>
<script lang="ts" setup name="VehicleSetting">
import { ref, reactive, computed, watch, provide } from 'vue'
import { useCarStore } from '@src/pinia/car'
import { onLoad, onShow } from '@dcloudio/uni-app'
import ExteriorRimImg from './exterior-rim-img.vue'
import PriceBtnBottom from '../../components/price-btn-bottom/price-btn-bottom.vue'
import ExteriorSetting from './exterior-setting.vue'
import RimSetting from './rim-setting.vue'
import InnerSetting from './inner-setting.vue'
import PackagesSetting from './packages-setting.vue'
import useSetting from './setting'

const carStore = useCarStore()
// 上个页面传的参数
const itemId = ref('')
const hideWish = ref(false)
const cartWishId = ref('')
onLoad((options) => {
  itemId.value = options.itemId || ''
  hideWish.value = options.hideWish ? JSON.parse(options.hideWish) : false
  cartWishId.value = options.cartWishId || ''
  getSku()
})

onShow(() => {
  // 从选装包详情页面返回需要重新赋值
  vehicle.value.skuData && (packages.data = vehicle.value.packages)
})

/**
 * 定义skus
 */
const skus = reactive({
  data: [] as Car.CarSku[]
})

/**
 * 获取sku
 */
const getSku = async () => {
  uni.showLoading({
    title: '加载中'
  })
  await initSkus(itemId)
  getVehicleDeatil()
  initData()
  setData()
  uni.hideLoading()
}

provide('useSetting', useSetting())
const { innerImgList, vehicle, configActive, active, packagesList, packages, outColor, outCarData, rim, toRequireCheck, setData, initSkus, initData, getVehicleDeatil } =
  useSetting()
const tabList = [
  { name: '外饰', value: 0 },
  { name: '轮圈', value: 1 },
  { name: '内饰', value: 2 },
  { name: '选装', value: 3 }
]
const nextBtnText = computed(() => (packagesList.data.length ? ['轮圈', '内饰', '选装包', '预览配置'][active.value] : ['轮圈', '内饰', '预览配置'][active.value]))
const tabs = computed(() => (packagesList.data.length ? tabList : tabList.slice(0, 3)))

let car360 = reactive({
  value: {}
})
let setImgData: { value: string[] } = reactive({
  value: []
})
const setOutData = (val: Car.CarSku) => {
  setImgData.value = val ? val.carAssemblerMaterialVO?.imageList.map((img) => img.path) : []
}

/**
 * 触摸标识
 */
let touching = ref(false)
// 是否是下拉的标识
let disabledPull = ref(false)
const touchend = () => {
  touching.value = false
  disabledPull.value = false
}

let startIndex = ref(0)
let imgIndex = ref(0)
watch(
  () => car360.value,
  (newVal: any) => {
    startIndex.value = Math.floor((28 / 36) * newVal.length) - 1
    imgIndex.value = startIndex.value
  },
  {
    deep: true,
    immediate: true
  }
)

/**
 * 可切换图片360标识
 */
const rotatable = ref(true)
// 选中的tab
watch(
  () => active.value,
  (newVal, oldValue?: number) => {
    if (newVal === 0) {
      rotatable.value = true
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => configActive.value,
  (newVal) => {
    active.value = newVal
  }
)

/**
 * 切换tab
 */
const handleTabChange = (menuVal: number) => {
  if (!toRequireCheck(menuVal)) {
    return
  }
  active.value = menuVal
}

/**
 * 获取子组件
 */
const priceBtnBottom: AnyObject = ref(null)
// 点击按钮进行下一步
const toNext = () => {
  if (!toRequireCheck(active.value + 1)) {
    return
  }
  if ((packagesList.data.length && active.value === 3) || (!packagesList.data.length && active.value === 2)) {
    carStore.setConfigActive(active.value)
    const urlStr = `/package-car/pages/preview/index?hideWish=${hideWish.value}&cartWishId=${cartWishId.value}`
    hideWish.value ? uni.redirectTo({ url: urlStr }) : uni.navigateTo({ url: urlStr })
    const toPriceBtnBottom = priceBtnBottom.value as { cancelBtn: VoidFn }
    toPriceBtnBottom.cancelBtn() //调用子组件的方法
  } else {
    handleTabChange(active.value + 1)
  }
}
</script>

<style lang="scss" scoped>
.vehicle-setting {
  // 解决浏览器报错
  touch-action: none;

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

  .setting-main {
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
    overflow-y: scroll;

    &.disabled-pull {
      overflow: hidden;
    }
  }
}
</style>
