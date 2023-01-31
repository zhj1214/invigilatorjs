<template>
  <!-- 外观、轮圈图片 -->
  <view class="view-img" @touchstart="touchstart" @touchmove="touchmove">
    <image
      v-for="(img, index) in showImg360"
      :key="index"
      class="img-item"
      :class="{ active: index === 3, 'no-rotatable': !rotatable && index === 3 }"
      :src="img"
      mode="scaleToFill"
    />
    <image v-if="rotatable" class="icon" :src="car360Img" mode="aspectFit" />
  </view>
</template>

<script lang="ts" setup name="ExteriorRimImg.vue">
import { ref, computed, inject, watch, nextTick } from 'vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
// 页面主图片
const car360Img = gdp('car360-Img.png')
// 触摸标识
let touching = ref(false)
// 触摸开始的位置
let clientX = ref(0)
let clientY = ref(0)
// 可切换图片360标识
const rotatable = ref(true)
// 是否是下拉的标识
let disabledPull = ref(false)

const props = defineProps({
  active: {
    type: Number,
    default: 0
  },
  setImgData: {
    type: Object,
    default: () => ({
      value: []
    })
  }
})

let startIndex = ref(0)
let imgIndex = ref(0)

/**
 * 360度图片数据
 */
const car360 = computed(() => {
  return props.setImgData.value
})
/**
 * 获取开始位置，图片位置
 */
watch(
  () => car360.value,
  (newVal) => {
    if (!newVal.length) return
    startIndex.value = Math.floor((28 / 36) * newVal.length) - 1
    imgIndex.value = startIndex.value
  },
  {
    deep: true,
    immediate: true
  }
)

/**
 * 页面渲染图片数据
 */
const showImg360 = computed(() => {
  if (!car360.value.length) return []
  const moreImg = [...car360.value.slice(-4), ...car360.value, ...car360.value.slice(0, 8)]
  return moreImg.slice(imgIndex.value, imgIndex.value + 8)
})

watch(
  () => props.active,
  (newVal, oldValue?: number) => {
    if (newVal === 0) {
      rotatable.value = true
    } else if (newVal === 1) {
      nextTick(() => {
        toDealShowImg(oldValue)
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

let unit = ref(1)
const toDealShowImg = (oldValue?: number) => {
  const num = imgIndex.value - startIndex.value
  let gtH = Math.abs(num) > car360.value.length / 2
  if (oldValue === 0 && num !== 0) {
    unit.value = 1
    if (num > 0) {
      unit.value = gtH ? 1 : -1
    } else if (num < 0) {
      unit.value = gtH ? -1 : 1
    }
    toRotate()
  } else {
    rotatable.value = false
  }
}

let timeOut: any = ref(null)
const setTimeoutFn = () => {
  timeOut.value = setTimeout(() => {
    let imgIndexTemp = imgIndex.value
    imgIndexTemp += unit.value
    if (imgIndexTemp > car360.value.length - 1) {
      imgIndexTemp = 0
    } else if (imgIndexTemp < 0) {
      imgIndexTemp = car360.value.length - 1
    }
    if (imgIndexTemp === startIndex.value) {
      imgIndexTemp = startIndex.value
      rotatable.value = false
      timeOut = null
    } else {
      imgIndex.value = imgIndexTemp
      toRotate()
    }
  }, 50)
}

const toRotate = () => {
  timeOut?.value && (timeOut.value = null)
  setTimeoutFn()
}

/**
 *  360 触摸开始
 */
const touchstart = (e: AnyObject) => {
  touching.value = true
  const touches = e.touches[0]
  clientX.value = touches.clientX
  clientY.value = touches.clientY
}

/**
 * 360 触摸滑动
 */
let touchStep = ref(0)
const touchmove = (e: AnyObject) => {
  if (!touching.value || !rotatable.value) {
    return
  }
  touchStep.value++
  if (touchStep.value % 4 !== 0) {
    return
  }
  const touches = e.touches[0]
  const clientXTemp = touches.clientX
  const clientYTemp = touches.clientY
  disabledPull.value = Math.abs(clientXTemp - clientX.value) > Math.abs(clientYTemp - clientY.value)
  if (!disabledPull.value) {
    return
  }
  let step = clientXTemp - clientX.value > 0 ? 1 : -1
  imgIndex.value += step
  if (imgIndex.value > car360.value.length - 1) {
    imgIndex.value = 0
  }
  if (imgIndex.value < 0) {
    imgIndex.value = car360.value.length - 1
  }
  clientX.value = clientXTemp
  clientY.value = clientYTemp
}
</script>

<style lang="scss" scoped>
.view-img {
  width: 100%;
  height: 420rpx;
  // background: #fff;
  position: relative;
  overflow: hidden;

  image.img-item {
    width: 100%;
    height: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: transform 0.6s;

    &.active {
      z-index: 9;
    }

    &.no-rotatable {
      transform: translate(65%, -18%) scale(3);
    }
  }

  .icon {
    width: 100%;
    height: 240rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 10;
  }
}
</style>
