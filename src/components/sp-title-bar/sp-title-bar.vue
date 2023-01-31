<template>
  <view class="title-bar">
    <text class="title-text font-bold">{{ propsTitle }}</text>
    <view v-if="!hidenBtn" class="title-slot font-medium" @click="onClick">
      <text>{{ propsBtnText }}</text>
      <image :src="rightIcon" class="icon" mode="aspectFill" />
    </view>
  </view>
</template>

<script lang="ts" setup name="SpTitleBar">
import { inject, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true
  },
  fontSize: {
    type: Number,
    default: 36
  },
  color: {
    type: String,
    default: '#292C2E'
  },
  btnFontSize: {
    type: Number,
    default: 28
  },
  btnTextColor: {
    type: String,
    default: '#92969A'
  },
  btnText: {
    type: String,
    default: '更多'
  },
  hidenBtn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['on-click'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
// 右箭头图片
const rightIcon = gdp('icon-right.png')
const propsTitle = ref(props.title)
const propsBtnText = ref(props.btnText)

function onClick() {
  emit('on-click')
}
</script>

<style lang="scss" scoped>
.title-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 118rpx;
  line-height: 118rpx;

  .title-text {
    font-weight: bold;
    color: #292c2e;
    font-size: 36rpx;
  }

  .title-slot {
    font-weight: 500;
    color: #92969a;
    font-size: 28rpx;

    .icon {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
</style>
