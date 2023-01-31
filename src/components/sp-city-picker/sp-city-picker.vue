<template>
  <uni-popup ref="cityPicker" type="bottom" @change="changeVisible">
    <view class="picker-container font-regular">
      <view class="header justify-between items-center">
        <text>选择城市</text>
        <image class="icon-close" :src="closeIcon" mode="aspectFill" @click="close" />
      </view>
      <view v-if="hasLocation" class="location items-center">
        <text>当前定位</text>
        <text>定位失败</text>
      </view>
      <view class="mark">
        <scroll-view scroll-x class="mark-scroll" @touchmove.stop>
          <view class="mark-content flex-row">
            <view v-for="(city, index) in selectedCity" :key="city.id" class="items-center" @click="changeLevel(index)">
              <text class="active">{{ city.name }}</text>
              <image v-if="handlePleaseSelect || index < selectedCity.length - 1" class="icon-right" :src="rightIcon" mode="aspectFit" />
            </view>
            <view v-if="handlePleaseSelect" class="items-center">
              <text>请选择</text>
              <image class="icon-right" :src="rightIcon" mode="aspectFit" />
            </view>
          </view>
        </scroll-view>
      </view>
      <scroll-view scroll-y :class="['city-list', hasLocation ? 'has-location' : '']" :scroll-top="scrollTop" @scroll="scroll">
        <view v-for="city in cityArray[level]" :key="city.id" class="city-item items-center" @click="onSelect(city)">
          <text :class="{ active: selectedCity[level] && selectedCity[level].code === city.code }">{{ city.name }}</text>
          <image v-if="selectedCity[level] && selectedCity[level].code === city.code" class="icon-checked" :src="checkedIcon" mode="scaleToFill" />
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup name="SpCityPicker">
import { watch, inject, reactive, ref, computed, toRaw, PropType, ComputedRef, Ref } from 'vue'
import { getDistrict, getOrgDistrict } from '@api/user'
import { useScrollTop } from '@src/hooks/scroll-top'

// 滚动顶部
const { scrollTop, scroll, goTop } = useScrollTop()

const props = defineProps({
  modelValue: Boolean,
  pickLevel: {
    type: Number,
    default: 3,
    validator: (val: number) => {
      return [1, 2, 3].includes(val)
    }
  },
  hasLocation: Boolean,
  value: {
    type: Array as PropType<User.CityInfo[]>,
    default: Array
  },
  isOrg: Boolean
})

const emit = defineEmits<{
  (e: 'update:modelValue', show: boolean): void
  (e: 'input', show: boolean): void
  (e: 'change', data: User.CityInfo[]): void
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const closeIcon = gdp('icon-square-close.png')
const rightIcon = gdp('icon-right.png')
const checkedIcon = gdp('checked.png')

const cityPicker: Ref<SpPopup | null> = ref(null)

const open = () => {
  cityPicker.value?.open()
}
const close = () => {
  cityPicker.value?.close()
}

const changeVisible = (data: { show: boolean; type: string }) => {
  emit('update:modelValue', data.show)
  // #ifdef MP-WEIXIN
  // vue3 小程序 update:modelValue 不生效的临时方案
  emit('input', data.show)
  // #endif
}

const level = ref(0)

const selectedCity: User.CityInfo[] = reactive([])

const cityArray: User.CityInfo[][] = reactive([
  [], // 省份
  [], // 市区
  [] // 城镇
])

const handlePleaseSelect: ComputedRef<boolean> = computed(
  () => selectedCity.length === 0 || !!(selectedCity[selectedCity.length - 1].children && selectedCity.length < props.pickLevel)
)

/**
 * 更新页面城市数据
 * @param index 层级
 * @param data 数据
 */
const setCityValue = (index: number, data: User.CityInfo[]) => {
  cityArray[index].splice(0, 999)
  cityArray[index].push(...data)
}

const getCityList = async (cityCode?: string) => {
  let list = []
  try {
    const data = await (props.isOrg ? getOrgDistrict(cityCode) : getDistrict(cityCode || 'cn-org'))
    const arr = !cityArray[0].length ? data : data.children
    list = arr.map((item: AnyObject) => {
      const { name, children, code, id } = item
      return { name, children, code, id }
    })
    return list
  } catch (error) {
    console.log('sp-city-picker：地区信息获取处理失败', error)
    return list
  }
}

const changeLevel = async (index: number) => {
  level.value = index
  if (!cityArray[index].length) {
    setCityValue(level.value, await getCityList(selectedCity[index - 1]?.code))
  }
  goTop()
}

/**
 * 点击省市区选择
 * @param city
 * @returns
 */
const onSelect = async (city: User.CityInfo) => {
  selectedCity.splice(level.value, 999)
  selectedCity.push(city)
  const list = await getCityList(city.code)
  if (list.length === 0 || level.value === props.pickLevel - 1) {
    emit('change', JSON.parse(JSON.stringify(toRaw(selectedCity))))
    close()
    return
  }
  level.value++
  setCityValue(level.value, list)
  goTop()
}

// 初始化value
watch(
  () => props.value,
  async (value) => {
    if (value && value.length) {
      selectedCity.splice(0, 999)
      selectedCity.push(...value)
      level.value = value.length > props.pickLevel ? props.pickLevel : value.length - 1
      const param = value.length === 1 ? 'cn-org' : value[level.value - 1]?.code
      setCityValue(level.value, await getCityList(param))
    }
  },
  {
    deep: true
  }
)

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      open()
      cityArray[level.value].length === 0 && setCityValue(0, await getCityList('cn-org'))
    } else {
      close()
    }
  }
)
</script>

<style lang="scss" scoped>
.picker-container {
  position: relative;
  width: 100%;
  height: 70vh;
  font-size: 30rpx;
  background-color: #fff;

  .header {
    height: 120rpx;
    font-size: 34rpx;
    padding: 0 40rpx;
    border-bottom: 1rpx solid #e4e7ea;

    .icon-close {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .location {
    height: 80rpx;
    color: #92969a;
    background: rgba($color: #e4e7ea, $alpha: 20%);
    padding: 0 40rpx;
  }

  .mark {
    width: auto;
    padding: 0 40rpx;
    color: #4e6175;

    .mark-scroll {
      border-bottom: 1rpx solid #e4e7ea;
    }

    .mark-content {
      height: 88rpx;

      .mark-item {
        height: 100%;
      }

      .active {
        color: #292c2e;
        font-weight: bold;
      }
    }

    .icon-right {
      width: 32rpx;
      height: 32rpx;
      margin: 0 16rpx;
    }
  }

  .city-list {
    position: absolute;
    top: 208rpx;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    padding: 0 40rpx;

    &.has-location {
      top: 288rpx;
    }

    .city-item {
      height: 96rpx;

      .active {
        color: #4e6175;
      }
    }

    .icon-checked {
      width: 32rpx;
      height: 32rpx;
      margin-left: 8rpx;
    }
  }
}
</style>
