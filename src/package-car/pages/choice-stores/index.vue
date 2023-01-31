<template>
  <view class="choice-stores">
    <view class="amap-container">
      <map id="map" style="width: 100%; height: 100%" :latitude="currentLatitude" :longitude="currentLongitude" :scale="scale" show-location="true" :markers="markers" />
    </view>
    <view class="location" @click="openCityPicker">
      <text v-if="!scope && !currentCityText">请选择城市</text>
      <text v-else>{{ currentCityText }}</text>
      <image class="icon-arrow-down" :src="iconArrowDown" />
    </view>
    <!-- 经销商列表 -->
    <view class="store">
      <view class="store-list">
        <view v-for="(item, index) in dealerList" :key="index" class="store-item border-bottom-1" @click="toSelectItem(item)">
          <view class="information">
            <text class="row1">{{ item.name }}</text>
            <text class="row2">{{ item.details || '' }}</text>
            <text v-if="item.distance" class="row3">{{ item.distance }}km</text>
          </view>
          <view class="icon">
            <image :src="selectedDealer.id === item.id ? iconRadioChecked : iconRadioNoChecked" class="icon-img" />
          </view>
        </view>
      </view>
      <view v-if="!dealerList.length" class="no-data">该地区暂无经销商</view>
    </view>
    <view class="footer">
      <view class="btn" @click="toEmitSelectedDealer">确定</view>
    </view>
    <!-- 城市选择popup组件 -->
    <sp-city-picker v-model="cityPickerVisible" :value="cityValue" :pick-level="2" @change="handlePickerChange" />
  </view>
</template>

<script lang="ts" setup name="ChoiceStores">
import { inject, ref, reactive, computed } from 'vue'
import { getInstitution, getGps } from '@api/car'
import { useLocationStore } from '@src/pinia/location'
import { onLoad } from '@dcloudio/uni-app'
import { useAddressStore } from '@src/pinia/address'

type OnLoadOption<T> = Record<keyof T, string | undefined>

onLoad((Option: OnLoadOption<{ selectedDealer: string }>) => {
  if (Option.selectedDealer) {
    const data = JSON.parse(Option.selectedDealer) as Dealer.BizItem
    Object.assign(selectedDealer, data)
  }
  getLocation()
})

const addressStore = useAddressStore()
const locationStore = useLocationStore()
const latitude = computed(() => locationStore.latitude || 30.129506)
const longitude = computed(() => locationStore.longitude || 120.08217)
const location = computed(() => locationStore.cityInfo)
interface Markers {
  id: string
  iconPath: string
  width: number
  height: number
  longitude: number
  latitude: number
}
/**
 *  选中的经销商对象
 */
let selectedDealer = reactive({}) as Dealer.BizItem

const cityValue = computed(() => addressStore.selectedCity || [])
const cityCode = computed(() => {
  if (cityValue.value.length) {
    const province = cityValue.value[0]
    const city = cityValue.value[1]
    if (!city || city.name === province.name) {
      return province.code
    }
    return city.code
  }
  return location.value ? location.value.cityCode : ''
})

// 页面展示的地址
let currentCityText = computed(() => {
  if (cityValue.value.length) {
    const province = cityValue.value[0]
    const city = cityValue.value[1]
    if (!city || city.name === province.name) {
      return province.name
    }
    return city.name !== '市辖区' ? city.name : province.name
  }
  return location.value.city || ''
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
const [iconArrowDown, iconRadioChecked, iconRadioNoChecked] = gdp(['icon-arrow-down.png', 'icon-radio-checked.png', 'icon-radio-no-checked.png'])
const iconSignPath = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR+2XPWgTYRjH/8/17k2U4KKRJjQXRUs+yKJDi6BSZxGk2KJDu+nSVRddXHTRtYtu7aC0UgRxtqgg7VCXkA+qaC6lKVYXCZq8d71HLiqU0vS+iiDknY57/8//+d3zvDwvR/C5qilxmRUUyMYpJgw74cRYYgXvyUYxU5fP/ViSV3ExD6E1xQIDF/eKIeClGZOjhRKkF29PAKtp9YxlK6+JoHoxZYalKvb5wZr1zk3vCaCiC3Yz2m0/a0hXf1dBJSUegHAzCAAYD7N1eculZd23q7o2waCZQMn/BBF4MmOYs9089qxANS2eMONqKADC00xNXgsEUNHFBwAnwgAA+Jg15EnfAJ/TBxMtttZDJu+ER0lNHqv9aOzm1bUF1QFtiBVa2g8Asnk4s2Yu+wNI4girYnNfACwZz6zjqy8AR1zRhdOCREiIRtaQSd9n4DdA5A3AZ8MB0Nus0T4XEEBcATAfDgBjWUM+CwTgBJX1yCMCXw8CwaDHOaN9I/AkdAJLx6NpZcteAHDaJ8SK3aeM5j+1aqEAnOBiHLG+A2KagEkvEAzMbP2UU4VNNN30rpfRdoOyLu4CuERdqsHACoAXOUM6Ok/LF8Bfx9V+xG1NG2OiaecdMU8ppjk/uAHfcyMQQOdwDqgjpCivnGe27Qu5NWvR0yfvEPUAehXoVaBXgf+3Aov5xL3+5rfbzmDbiB2+P1Jq3Plnk3Aunxda1Gynvn/p5KwfOgqzpUXGSyVPP6TbQQO3YG4oN8OMic5lRJgdXy57uqp3VukXEcj6IcphUYYAAAAASUVORK5CYII=`
let cityPickerVisible = ref(false)
// 当前位置，默认中大银座
let currentLatitude = ref(30.129506)
let currentLongitude = ref(120.08217)

let dealerList: Dealer.BizItem[] = reactive([])

const markers = computed(() => {
  return dealerList.map((it) => {
    /**
     * 不授权不展示距离
     */
    if (scope.value) {
      it.distance = formatDistance(it)
    }
    let marker = {
      id: it.id as string,
      longitude: Number(it.gpsLongitude),
      latitude: Number(it.gpsLatitude)
    } as Markers
    // #ifdef H5
    /**
     * 小程序有默认的图标
     */
    marker.width = 30

    marker.height = 36

    marker.iconPath = iconSignPath
    // #endif
    return marker
  })
})
// 是否有定位权限
let scope = ref(false)
// 地图缩放级别
let scale = ref(14)

async function getLocation() {
  try {
    let res = await locationStore.getLocation()
    currentLatitude.value = res.latitude
    currentLongitude.value = res.longitude
    await locationStore.getCityCode()
    scope.value = true
    getDealerList()
  } catch {
    scope.value = false
  }
}
function handlePickerChange(cityData: User.CityInfo[]) {
  /**
   * 切换地址后相当于授权失效
   */
  scope.value = false // 不展示km
  addressStore.$patch({ selectedCity: cityData })
  getGpsCity()
}
/**
 * 获取城市经纬度
 */
async function getGpsCity() {
  const resData = await getGps({ cityCode: cityCode.value })
  const { gpsLatitude, gpsLongitude } = resData
  currentLatitude.value = gpsLatitude
  currentLongitude.value = gpsLongitude
  getDealerList()
}
function toSelectItem(item: Dealer.BizItem) {
  Object.assign(selectedDealer, item)
  item.gpsLatitude && (currentLatitude.value = Number(item.gpsLatitude))
  item.gpsLongitude && (currentLongitude.value = Number(item.gpsLongitude))
  scale.value = 12
}
/**
 * 根据cityCode获取门店列表
 */
async function getDealerList() {
  let resData = await getInstitution({ cityCode: cityCode.value })
  dealerList.length = 0
  dealerList.push(...resData)
  if (scope.value) {
    dealerList.sort(function (a, b) {
      return (a.distance as number) - (b.distance as number)
    })
  }
}

function toRadData(d: number) {
  return (d * Math.PI) / 180.0
}

/**
 * 根据目标点经纬度和当前点经纬度计算距离（单位km）
 */
function formatDistance(data: Dealer.BizItem) {
  let radLat1 = toRadData(latitude.value)
  let radLat2 = toRadData(data.gpsLatitude)
  let a = radLat1 - radLat2
  let b = toRadData(longitude.value) - toRadData(data.gpsLongitude)
  let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  distance = distance * 6378.137
  return (Math.round(distance * 10000) / 10000).toFixed(1)
}

function toEmitSelectedDealer() {
  addressStore.$patch({ selectedDealer })
  uni.navigateBack({
    delta: 1
  })
}
function openCityPicker() {
  cityPickerVisible.value = true
}
</script>

<style lang="scss" scoped>
.choice-stores {
  width: 100%;
  height: 100%;
  background: #fff;

  .amap-container {
    width: 100%;
    height: 520rpx;
  }

  .location {
    display: flex;
    align-items: center;
    height: 88rpx;
    border-bottom: 1px solid #f2f2f2;
    font-size: 32rpx;
    color: #4e6175;
    padding-left: 40rpx;

    .icon-arrow-down {
      width: 32rpx;
      height: 32rpx;
      margin-left: 7rpx;
    }
  }

  .store {
    width: 100%;
    height: calc(100% - 520rpx - 88rpx);
    padding-bottom: calc(128rpx + env(safe-area-inset-bottom));
    overflow-y: scroll;
    position: absolute;
    bottom: 0;

    .store-list {
      padding: 0 36rpx 0 40rpx;

      .store-item {
        display: flex;
        height: 218rpx;
        align-items: center;
        border-bottom: 1rpx solid rgb(111 111 111 / 17%);

        .information {
          flex: 1;
          display: flex;
          flex-direction: column;

          .row1 {
            font-size: 36rpx;
            color: #292c2e;
            line-height: 54rpx;
          }

          .row2 {
            font-size: 26rpx;
            color: #92969a;
            line-height: 36rpx;
          }

          .row3 {
            font-size: 26rpx;
            color: #909ca8;
            line-height: 38rpx;
          }
        }

        .icon {
          width: 48rpx;
          height: 48rpx;
          display: flex;
          align-items: center;

          .icon-img {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
    }

    .no-data {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      color: #909ca8;
    }
  }

  .footer {
    border-top: 1rpx solid #e4e7ea;
    position: fixed;
    padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));
    bottom: 0;
    width: 100%;
    box-shadow: 0 1px 0 0 #e4e7ea;
    background: #fff;

    .btn {
      line-height: 92rpx;
      background: #1a1a1a;
      color: #fff;
      font-size: 28rpx;
      text-align: center;
    }
  }
}
</style>
