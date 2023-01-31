<template>
  <view class="choose-location">
    <view v-for="(item, index) in poisList" :key="index" class="item" @click="toChoose(item)">
      <view class="location-info">
        <view class="title" :style="index === 0 ? 'color:#4E6175 ' : ''">{{ item.name }}</view>
        <view v-if="item.address" class="address">{{ item.pname + item.cityname + item.adname + item.address }}</view>
      </view>
      <view class="img">
        <image :src="locationId !== item.id ? iconRadio : iconRadioChecked" mode="" class="radio-icon" />
      </view>
    </view>
    <view v-if="poisList.length === 1" class="no-topic">
      <view class="text">您未授权获取当前位置</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject } from 'vue'
export default defineComponent({
  name: 'ChooseLocation',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [iconRadio, iconRadioChecked] = gdp(['icon-radio.png', 'icon-radio-checked.png'])

    /**
     * 获取地址列表
     */
    let pageNo = ref(1)
    let loadMore = ref(true)
    let poisList: Array<{ name: string; id: string; address: string; pname: string; cityname: string; adname: string }> = reactive([])
    // 当前选中地址
    let locationId = ref('')
    // 当前经纬度
    let longitude = ref('')
    let latitude = ref('')
    async function getLocation() {
      uni.request({
        url: 'https://restapi.amap.com/v3/place/around',
        data: {
          key: '2e5d90fe8e40741c8f13346ea0dede44',
          location: `${longitude.value},${latitude.value}`,
          extensions: 'all',
          s: 'rsx',
          sdkversion: '',
          logversion: '',
          radius: '3000',
          page: pageNo.value,
          types:
            '010000|020000|030000|040000|050000|060000|070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000|180000|190000|200000|220100|220200|970000|990000|991000'
        },
        success: function (ops) {
          let { pois } = ops.data as AnyObject
          if (pageNo.value === 1) {
            poisList.splice(0)
            poisList.unshift({
              name: '不显示位置',
              id: '',
              address: '',
              pname: '',
              cityname: '',
              adname: ''
            })
          }
          poisList.push(...pois)
          pageNo.value++
          loadMore.value = !(poisList.length - 1 === pois.length)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }

    /**
     * 选取地址
     */
    function toChoose(item: AnyObject) {
      console.log(item)
      let obj = {
        geoPosition: item.id ? `${item.cityname.replace('市', '')} ${item.name}` : item.name,
        locationId: item.id,
        longitude: item.location ? item.location.split(',')[0] : '',
        latitude: item.location ? item.location.split(',')[1] : ''
      }
      locationId.value = item.id
      uni.setStorageSync('currentLocation', obj)
      uni.navigateBack({ delta: 1 })
    }

    return {
      iconRadio,
      iconRadioChecked,
      poisList,
      locationId,
      longitude,
      latitude,
      addressText: '',
      getLocation,
      toChoose
    }
  },
  onLoad(params: { longitude: string; locationId: string; latitude: string }) {
    if (params.longitude) {
      this.locationId = params.locationId
      this.longitude = params.longitude
      this.latitude = params.latitude
      this.getLocation()
    } else {
      this.poisList.unshift({
        name: '不显示位置',
        id: '0',
        address: '',
        pname: '',
        cityname: '',
        adname: ''
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
