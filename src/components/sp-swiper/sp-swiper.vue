<template>
  <view class="sp-swiper">
    <view class="sp-swiper-control justify-center" :style="{ bottom: `${controlBottom}rpx` }">
      <view v-for="(v, index) in imgList" :key="index" class="sp-swiper-control-item" :class="{ active: currentDot === index }" @click="goToBanner(index)" />
    </view>
    <swiper class="swiper" circular :autoplay="autoplay" :current="currentSwiper" @change="handleChange">
      <swiper-item v-for="(src, index) in imgList" :key="index" @click="handleItemClick(index)">
        <image class="swiper-img" :src="src" mode="scaleToFill" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup name="SpSwiper">
import { EventHandle } from 'UniApp'
import { ref, Ref, PropType, computed } from 'vue'

type ImgListInfo = string[]

const props = defineProps({
  imgList: {
    type: Array as PropType<ImgListInfo>,
    default: () => []
  },
  controlBottom: {
    type: Number,
    default: 20
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'change'])

//指示面板对应的索引
const currentDot: Ref<number> = ref(0)
//用来记录当前swiper对应的索引
const currentSwiper: Ref<number> = ref(0)

// const controlWidth = computed(() => props.imgList.length * 80)

const handleChange = (e: EventHandle) => {
  currentDot.value = e.detail.current
  emit('change', e.detail.current)
}

const handleItemClick = (index: number) => {
  emit('click', index)
}

const goToBanner = (index: number) => {
  currentSwiper.value = currentDot.value = index
}
</script>

<style lang="scss" scoped>
.sp-swiper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;

  &-control {
    position: absolute;
    z-index: 1;
    bottom: 20rpx;
    left: 0;
    right: 0;

    &-item {
      cursor: pointer;
      display: inline-block;
      width: 80rpx;
      height: 2rpx;
      margin: 1rpx 0;
      background-color: #fff;
      opacity: 0.5;

      &.active {
        height: 4rpx;
        margin: 0;
        border-radius: 2rpx;
        opacity: 1;
      }
    }
  }
}

.swiper,
.swiper-img {
  width: 100%;
  height: 100%;
}
</style>
