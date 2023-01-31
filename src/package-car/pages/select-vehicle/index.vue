<template>
  <view class="select-vehicle">
    <view id="tab" class="sp-header-tabs">
      <sp-tabs id="tab" underline car-list-header fixed :menus="tabs" :active-tab="activeTab" @on-click="handleTabChange" />
    </view>
    <!-- 占位元素 -->
    <view class="placeholder-label" />
    <view :class="['inner-box', activeTab === 1 ? 'padding-bottom' : '']">
      <!-- 车系 -->
      <template v-if="activeTab === 0">
        <car-series
          v-for="(seriesItem, index) in seriesList.data"
          :key="seriesItem.id"
          :series-data="seriesItem"
          :index="index"
          :series-id="series.data.id"
          @select-series="toSelectSeries(seriesItem)"
        />
      </template>

      <!-- 车型 -->
      <template v-if="activeTab === 1">
        <car-model
          v-for="modelItem in modelList.data"
          :key="modelItem.id"
          :model-item="modelItem"
          :model-id="model.data.id"
          @select-model="toSelectModel(modelItem)"
          @clear-model="toClearModel"
        />
      </template>
    </view>
    <view v-if="activeTab === 1" class="btn-box">
      <view class="setting-btn" :style="{ background: model.data?.id ? '#1a1a1a' : '#BABABA' }" @click="goSetting">前往个性化配置</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SelectVehicle">
import carSeries from '../../components/car-series/car-series.vue'
import carModel from '../../components/car-model/car-model.vue'
import { getCarSeries } from '@api/car'
import { computed, ref, reactive } from 'vue'
import { throttle } from '@src/lib/lodash'
import { useCarStore } from '@src/pinia/car'
import { onShow, onHide } from '@dcloudio/uni-app'
interface ResItem {
  attrs: {
    [key: string]: any
  }
  groupedCustomAttributes: any[]
}
const carStore = useCarStore()
const vehicle = computed(() => carStore.vehicle)
const modelActive = computed(() => carStore.modelActive)
/**
 * 选中的tab
 */
let activeTab = ref(-1)
activeTab.value = modelActive.value
const handleTabChange = (menuVal: number) => {
  if (menuVal === 1) {
    if (!series.data) {
      uni.showToast({
        title: '请选择车系',
        icon: 'none',
        duration: 1000
      })
      return
    }
  }
  activeTab.value = menuVal
  carStore.setModelActive(menuVal)
}
let seriesList = reactive({
  data: [] as Car.Series[]
})
let modelList = reactive({
  data: [] as Car.Model[]
})
let series = reactive({
  data: {} as Car.Series
})
let model = reactive({
  data: {} as Car.Model
})

/**
 * 获取车系列表
 */
const getCarSeriesList = async () => {
  uni.showLoading({
    title: '加载中'
  })
  const resData = await getCarSeries()
  resData.forEach((item: ResItem) => {
    item.attrs = {}
    let groupedCustomAttributes = item.groupedCustomAttributes || []
    groupedCustomAttributes.forEach((attr: any) => {
      item.attrs[attr.attrKey] = carStore.handleData(attr)
    })
  })
  seriesList.data = resData
  if (series.data) {
    getModelList(series.data.id)
  } else {
    toSelectSeries(resData[0])
    toSelectModel(modelList.data[0])
  }
  uni.hideLoading()
}
/**
 * 选中车系
 */
const toSelectSeries = (seriesObj: Car.Series) => {
  if (seriesObj && series.data?.id === seriesObj.id) {
    activeTab.value = 1
    carStore.setModelActive(1)
    return
  }
  series.data = seriesObj
  toClearModel()
  setVehicle()
  getModelList(series.data.id)
  activeTab.value = 1
  carStore.setModelActive(1)
}
/**
 * 清空model.data
 */
const toClearModel = () => {
  model.data = {} as Car.Model
}
/**
 * 选中车型
 */
const toSelectModel = (modelObj: Car.Model) => {
  if (modelObj && model.data?.id === modelObj.id) {
    return
  }
  model.data = modelObj
  setVehicle()
}
/**
 * 获取车型列表
 */
const getModelList = (id: string) => {
  let dataList = seriesList.data.find((item: any) => item.id === id)?.vehicles
  dataList?.forEach((i: any) => {
    i.attrs = {}
    const groupedCustomAttributes = i.groupedCustomAttributes || []
    groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => {
      if (attr.attrKey === 'desc') {
        i.attrs[attr.attrKey] = attr.attrVal.split('\\n')
      } else {
        i.attrs[attr.attrKey] = carStore.handleData(attr)
      }
    })
  })
  modelList.data = dataList || []
}
const setVehicle = () => {
  carStore.setVehicle({
    series: series.data,
    model: model.data,
    outColor: null,
    outPainting: null,
    rim: null,
    innerColor: null,
    innerMaterial: null,
    packages: [],
    carPoster: '',
    skuData: null
  })
}
const goSetting = () => {
  if (!model.data.itemId) {
    uni.showToast({
      title: '请选择车型',
      icon: 'none',
      duration: 1000
    })
    return
  }
  uni.navigateTo({
    url: `/package-car/pages/vehicle-setting/index?itemId=${vehicle.value.model.itemId}`
  })
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
  { name: '车系', value: 0 },
  { name: '车型', value: 1 }
])
onShow(() => {
  // #ifdef H5
  window.addEventListener('resize', resize, false)
  // #endif
  getCarSeriesList()
  series.data = vehicle.value.series
  if (!vehicle.value.model && series.data) {
    getModelList(series.data.id)
  } else {
    model.data = vehicle.value.model
  }
  activeTab.value = modelActive.value
})
// #ifdef H5
onHide(() => {
  window.removeEventListener('resize', resize)
})
// #endif
</script>

<style lang="scss" scoped>
.select-vehicle {
  width: 100%;

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

  .inner-box {
    padding: 0 32rpx env(safe-area-inset-bottom);
  }

  .padding-bottom {
    padding-bottom: calc(130rpx + env(safe-area-inset-bottom));
  }

  .btn-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    border-top: 1rpx solid #e4e7ea;
    padding: 18rpx 0 calc(18rpx + env(safe-area-inset-bottom));
  }

  .setting-btn {
    width: 526rpx;
    height: 84rpx;
    line-height: 84rpx;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
    border-radius: 1rpx;
    background: #1a1a1a;
  }
}
</style>
