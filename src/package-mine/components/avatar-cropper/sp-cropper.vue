<template>
  <view class="bt-container">
    <view class="main-content">
      <image :src="imageSrc" mode="aspectFit" class="image" />
      <view
        v-if="imageSrc && imageInfo.path"
        class="cropper"
        :style="{
          width: setCropperPosition.width + 'px',
          height: setCropperPosition.height + 'px',
          left: setCropperPosition.left - 1 + 'px',
          top: setCropperPosition.top - 1 + 'px',
          transform: setCropperPosition.transform,
          transition: animate ? '0.2s' : 'none'
        }"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
      >
        <template v-if="showGrid">
          <view class="line row row1" />
          <view class="line row row2" />
          <view class="line col col1" />
          <view class="line col col2" />
        </template>
        <view class="controler controler-left-top" @touchmove.stop.prevent="onHandleResize(-1, -1, $event)" />
        <view class="controler controler-right-top" @touchmove.stop.prevent="onHandleResize(1, -1, $event)" />
        <view class="controler controler-left-bottom" @touchmove.stop.prevent="onHandleResize(-1, 1, $event)" />
        <view class="controler controler-right-bottom" @touchmove.stop.prevent="onHandleResize(1, 1, $event)" />
      </view>
    </view>
    <view class="slot">
      <slot />
    </view>
    <!-- #ifdef H5 -->
    <canvas
      canvas-id="bt-canvas"
      class="bt-canvas"
      :style="{
        width: getDSize.width + 'px',
        height: getDSize.height + 'px'
      }"
    />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      type="2d"
      class="bt-canvas"
      :style="{
        width: getDSize.width + 'px',
        height: getDSize.height + 'px'
      }"
    />
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup name="SpCropper">
import { ref, reactive, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import { pureAssign } from '@util/common'

const instance = getCurrentInstance()

var X = 0,
  Y = 0,
  dX = 0,
  dY = 0,
  dW = 0,
  dH = 0,
  cW = 0,
  cH = 0,
  timer: NodeJS.Timer
/**
 * better-cropper 图片裁切插件
 */

const props = defineProps({
  // 图片路径，支持网络路径和本地路径
  imageSrc: {
    type: String,
    default: ''
  },
  // 输出图片的格式，默认jpg
  fileType: {
    type: String,
    default: 'jpg'
  },
  // 生成的图片的宽度
  dWidth: {
    type: Number,
    default: 1000
  },
  // 裁切比例，0表示自由
  ratio: {
    type: Number,
    default: 0
  },
  // 是否展示网格
  showGrid: {
    type: Boolean,
    default: false
  },
  // 图片质量，0-1 越大质量越好
  quality: {
    type: Number,
    default: 1
  }
})

let imageInfo: UniApp.GetImageInfoSuccessData = reactive({
  width: 0,
  height: 0,
  path: ''
})
let containerRect = reactive({ width: 0, height: 0 })
const startClientX = ref(0)
const startClientY = ref(0)
const startOffsetX = ref(0)
const startOffsetY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const startChangeWidth = ref(0)
const startChanaeHeight = ref(0)
const changeWidth = ref(0)
const changeHeight = ref(0)
const windowWidth = ref(375)
const startCenter = reactive([0, 0])
const forceChangeWidth = ref(0)
const forceChangeHeight = ref(0)
const animate = ref(false)

const getImagePosition = computed(() => {
  if (imageInfo.path && containerRect) {
    let imageAsp = imageInfo.width / imageInfo.height
    let containerAsp = containerRect.width / containerRect.height
    if (imageAsp < containerAsp) {
      // 廋图
      return {
        left: (containerRect.width - containerRect.height * imageAsp) / 2,
        top: 0,
        width: containerRect.height * imageAsp,
        height: containerRect.height
      }
    } else {
      // 胖图
      return {
        left: 0,
        top: (containerRect.height - containerRect.width / imageAsp) / 2,
        width: containerRect.width,
        height: containerRect.width / imageAsp
      }
    }
  } else {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }
  }
})

const setCropperPosition = computed(() => {
  let imagePosition = getImagePosition.value
  const position = {
    width: imagePosition.width + changeWidth.value + forceChangeWidth.value || 0,
    height: imagePosition.height + changeHeight.value + forceChangeHeight.value || 0,
    left: imagePosition.left || 0,
    top: imagePosition.top || 0,
    transform: 'translate(' + offsetX.value + 'px, ' + offsetY.value + 'px)' || 'none'
  }
  return position
})

// 展示比例
const getShowRatio = computed(() => {
  return getImagePosition.value.width / (imageInfo?.width || 1)
})

// 生成图片的大小
const getDSize = computed(() => {
  return {
    width: props.dWidth,
    height: props.dWidth * (setCropperPosition.value.height / setCropperPosition.value.width)
  }
})

watch(
  () => props.imageSrc,
  () => {
    getImageInfo()
  },
  {
    immediate: true
  }
)

watch(
  () => props.ratio,
  () => {
    clearTimeout(timer)
    animate.value = true
    resetRatio()
    timer = setTimeout(() => {
      animate.value = false
    }, 200)
  }
)

watch(
  () => getImagePosition,
  () => {
    resetRatio()
  }
)

onMounted(() => {
  windowWidth.value = uni.getSystemInfoSync().windowWidth
  getContainer()
})

function getContainer() {
  uni
    .createSelectorQuery()
    .in(instance)
    .select('.main-content')
    .boundingClientRect(({ width, height }) => {
      containerRect.width = width as number
      containerRect.height = height as number
    })
    .exec()
}

function getImageInfo() {
  uni.getImageInfo({
    src: props.imageSrc,
    success: (res: UniApp.GetImageInfoSuccessData) => {
      pureAssign(imageInfo, res)
    },
    fail: (err) => {
      console.error(err)
      imageInfo = {
        width: 0,
        height: 0,
        path: ''
      }
      uni.showToast({
        title: '下载图片失败',
        icon: 'none'
      })
    }
  })
}

function resetRatio() {
  nextTick(() => {
    if (imageInfo && props.ratio !== 0) {
      let imageRatio = imageInfo.width / imageInfo.height
      changeWidth.value = 0
      changeHeight.value = 0
      if (props.ratio != 0) {
        if (props.ratio > imageRatio || (Math.abs(imageRatio - props.ratio) < 0.1 && imageRatio < 1)) {
          forceChangeHeight.value = -(getImagePosition.value.height - getImagePosition.value.width / props.ratio)
          offsetY.value = -forceChangeHeight.value / 2
          offsetX.value = 0
        } else {
          forceChangeWidth.value = -(getImagePosition.value.width - getImagePosition.value.height * props.ratio)
          offsetX.value = -forceChangeWidth.value / 2
          offsetY.value = 0
        }
      } else {
        forceChangeWidth.value = 0
        forceChangeHeight.value = 0
      }
    }
  })
}

function onTouchStart(e: TouchEvent) {
  startClientX.value = e.touches[0].clientX
  startClientY.value = e.touches[0].clientY
  startOffsetX.value = offsetX.value
  startOffsetY.value = offsetY.value
  startChangeWidth.value = changeWidth.value
  startChanaeHeight.value = changeHeight.value
  startCenter.length = 0
  startCenter.concat([setCropperPosition.value.width / 2 + offsetX.value, setCropperPosition.value.height / 2 + offsetY.value])
}

function onTouchMove(e: TouchEvent) {
  X = startOffsetX.value + (e.touches[0].clientX - startClientX.value)
  Y = startOffsetY.value + (e.touches[0].clientY - startClientY.value)

  let cropperPosition = setCropperPosition.value
  if (X >= 0) {
    if (X + cropperPosition.width < getImagePosition.value.width) {
      offsetX.value = X
    } else {
      offsetX.value = getImagePosition.value.width - cropperPosition.width
    }
  } else {
    offsetX.value = 0
  }
  if (Y >= 0) {
    if (Y + cropperPosition.height < getImagePosition.value.height) {
      offsetY.value = Y
    } else {
      offsetY.value = getImagePosition.value.height - cropperPosition.height
    }
  } else {
    offsetY.value = 0
  }
}

// eslint-disable-next-line max-lines-per-function
function onHandleResize(pX: number, pY: number, $event: TouchEvent) {
  dX = $event.touches[0].clientX - startClientX.value
  dY = $event.touches[0].clientY - startClientY.value
  if (pX == 1) {
    dW = startChangeWidth.value + dX
    cW = getImagePosition.value.width + forceChangeWidth.value + dW
    if (cW > 0) {
      if (cW + offsetX.value <= getImagePosition.value.width) {
        if (props.ratio !== 0) {
          dH = dW / props.ratio
          cH = getImagePosition.value.height + dH + forceChangeHeight.value
          if (cH > 0) {
            if (cH <= getImagePosition.value.height - offsetY.value) {
              changeWidth.value = dW
              changeHeight.value = dH
            } else {
              // 高度触底
              changeHeight.value = -offsetY.value - forceChangeHeight.value
              changeWidth.value = (-offsetY.value - forceChangeHeight.value) * props.ratio
            }
            // eslint-disable-next-line max-lines
          }
        } else {
          changeWidth.value = dW
        }
      } else {
        if (cH <= getImagePosition.value.height) {
          // 碰到右边缘
          if (props.ratio == 0) {
            changeWidth.value = -(offsetX.value + forceChangeWidth.value)
          } else {
            if (getImagePosition.value.height - offsetY.value - cW / props.ratio > 0) {
              changeWidth.value = -(offsetX.value + forceChangeWidth.value)
              changeHeight.value = changeWidth.value / props.ratio
            }
          }
        }
      }
    }
  }
  if (pX == -1) {
    dW = startChangeWidth.value - dX
    cW = getImagePosition.value.width + forceChangeWidth.value + dW
    if (cW > 0) {
      if (startOffsetX.value + dX > 0) {
        if (props.ratio !== 0) {
          cH = cW / props.ratio
          if (getImagePosition.value.height - cH - offsetY.value > 0) {
            changeHeight.value = dW / props.ratio
            changeWidth.value = dW
            offsetX.value = startOffsetX.value + dX
          } else {
            // 触底
            changeHeight.value = -offsetY.value - forceChangeHeight.value
            changeWidth.value = (-offsetY.value - forceChangeHeight.value) * props.ratio
            offsetX.value = startOffsetX.value - (changeWidth.value - startChangeWidth.value)
          }
        } else {
          offsetX.value = startOffsetX.value + dX
          changeWidth.value = dW
        }
      } else {
        // 超出左边界
        if (props.ratio !== 0) {
          cH = cW / props.ratio
          if (getImagePosition.value.height - cH - offsetY.value > 0) {
            offsetX.value = 0
            changeWidth.value = startChangeWidth.value + startOffsetX.value
            changeHeight.value = (startChangeWidth.value + startOffsetX.value) / props.ratio
          }
        } else {
          offsetX.value = 0
          changeWidth.value = startChangeWidth.value + startOffsetX.value
        }
      }
    }
  }
  if (props.ratio !== 0) {
    return
  }
  if (pY == 1) {
    dH = startChanaeHeight.value + dY
    cH = getImagePosition.value.height + forceChangeHeight.value + dH
    if (cH > 0) {
      if (cH + offsetY.value < getImagePosition.value.height) {
        changeHeight.value = dH
      } else {
        changeHeight.value = -offsetY.value
      }
    }
  }
  if (pY == -1) {
    cH = getImagePosition.value.height + startChanaeHeight.value - dY
    if (cH > 0) {
      if (startOffsetY.value + dY > 0) {
        offsetY.value = startOffsetY.value + dY
        changeHeight.value = startChanaeHeight.value - dY
      }
    }
  }
}

// 开始裁切
// eslint-disable-next-line max-lines-per-function
async function toCrop() {
  let canvas: any, image: any, ctx: UniApp.CanvasContext, err: any, res: UniApp.CanvasToTempFilePathRes | null
  // #ifdef MP-WEIXIN
  canvas = await new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .in(instance)
      .select('.bt-canvas')
      .node((result) => {
        resolve(result.node)
      })
      .exec()
  })
  image = canvas.createImage()
  image.src = props.imageSrc
  await new Promise((resolve) => (image.onload = resolve))
  canvas.width = getDSize.value.width
  canvas.height = getDSize.value.height
  ctx = canvas.getContext('2d')
  // #endif
  // #ifdef H5
  image = props.imageSrc
  ctx = uni.createCanvasContext('bt-canvas', instance)
  // #endif
  let { width, height } = setCropperPosition.value
  ctx.drawImage(
    image,
    offsetX.value / getShowRatio.value,
    offsetY.value / getShowRatio.value,
    width / getShowRatio.value,
    height / getShowRatio.value,
    0,
    0,
    getDSize.value.width,
    getDSize.value.height
  )
  // #ifdef H5
  await new Promise((resolve) => ctx.draw(true, resolve))
  // #endif
  // 在vue3里面，只能写成这种回调形式，否则报错
  ;[err, res] = await new Promise((resolve) => {
    uni.canvasToTempFilePath({
      // #ifdef MP-WEIXIN
      canvas,
      // #endif
      // #ifdef H5
      canvasId: 'bt-canvas',
      // #endif
      fileType: props.fileType,
      destWidth: getDSize.value.width,
      destHeight: getDSize.value.height,
      quality: props.quality,
      success(result) {
        resolve([null, result])
      },
      fail(error) {
        resolve([error, null])
      }
    })
  })
  return [err, res]
}

defineExpose({ toCrop })
</script>

<style lang="scss" scoped>
.bt-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: #0e1319;
  padding-top: 30rpx;
  position: relative;
  overflow: hidden;

  .bt-canvas {
    position: absolute;
    left: 100%;
    top: 0;
    width: 300px;
    height: 300px;
  }

  .main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 30rpx;
    position: relative;

    .image {
      width: 100%;
      height: 100%;
    }

    .cropper {
      position: absolute;
      border: 1px solid #eee;
      box-sizing: content-box;
      transform-origin: center center;
      outline: 999px solid rgb(0 0 0 / 50%);
      will-change: transform;

      // will-change: transfrom;

      .line {
        position: absolute;

        // background-color: #eee;
      }

      .row {
        width: 100%;
        height: 0;
        left: 0;
        border-top: 1px dashed #007aff;
      }

      .col {
        height: 100%;
        width: 0;
        border-left: 1px dashed #007aff;
      }

      .row1 {
        top: 33%;
      }

      .row2 {
        top: 66%;
      }

      .col1 {
        left: 33%;
      }

      .col2 {
        left: 66%;
      }

      .controler {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        background-color: #e4e7ed;
        border-radius: 99px;
        z-index: 99;
        box-shadow: 0 0 10rpx #333;
      }

      .controler-left-top {
        left: -20rpx;
        top: -20rpx;
      }

      .controler-right-top {
        right: -20rpx;
        top: -20rpx;
      }

      .controler-left-bottom {
        left: -20rpx;
        bottom: -20rpx;
      }

      .controler-right-bottom {
        right: -20rpx;
        bottom: -20rpx;
      }
    }
  }

  .slot {
    position: relative;
    padding-top: 20rpx;
  }
}
</style>
