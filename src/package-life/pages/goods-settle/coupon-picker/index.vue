<template>
  <uni-popup ref="couponPicker" type="bottom" @change="changeVisible">
    <view class="picker-container">
      <view class="tab flex-row">
        <view class="tab-item items-center" :class="[actived === 0 ? 'active' : '']" @click="changeTab(0)" />
        可用优惠券 {{ availableList.length || '' }}
      </view>
      <view class="tab-item items-center" :class="[actived === 1 ? 'active' : '']" @click="changeTab(1)">不可用优惠券 {{ unavailableList.length || '' }}</view>
    </view>
    <view v-if="isEmpty" class="empty flex-col items-center justify-center">
      <image class="image" :src="couponEmpty" />
      <text>{{ actived === 0 ? '无可用优惠券' : '无不可用优惠券' }}</text>
    </view>
    <template v-else>
      <view class="picker-counter items-center">
        您已选中优惠券
        <text class="num">{{ selectedCode ? 1 : 0 }}</text>
        张，共可抵扣
        <text class="num">￥{{ discount }}</text>
      </view>
      <scroll-view scroll-y :scroll-top="scrollTop" class="scroll-content" @scroll="scroll">
        <view class="coupon-list">
          <view v-for="coupon in couponList" :key="coupon.couponAccountCode" class="coupon-item items-center" @click="checkChange(coupon.couponAccountCode)">
            <image class="bg-image" :src="actived == 0 ? couponBg : couponBgDisabled" mode="scaleToFill" />
            <view class="coupon-info items-center">
              <!-- 左侧金额 -->
              <view class="left items-center justify-center" :class="[setGeneratorNumSizeClass(coupon.worth / 100)]">
                <text class="symbol">¥</text>
                <text class="num ellipsis">{{ coupon.worth / 100 }}</text>
              </view>
              <!-- 右侧内容 -->
              <view class="right items-center justify-between">
                <view class="info">
                  <view v-if="coupon.threshold === 0" class="title ellipsis">无门槛({{ coupon.applicability }})</view>
                  <view v-else class="title ellipsis">满{{ coupon.threshold / 100 }}可用 ({{ coupon.applicability }})</view>
                  <view class="limit">{{ formatDate(coupon.effectiveStartTime) }}至{{ formatDate(coupon.effectiveEndTime) }}</view>
                </view>
                <view v-if="actived === 0" class="operate">
                  <sp-checkbox :checked="selectedCode === coupon.couponAccountCode" round size="large" @change="checkChange(coupon.couponAccountCode)" @click.stop />
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>
    <view class="footer items-center justify-center">
      <view class="btn items-center justify-center" @click="close">关闭</view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup name="CouponPicker">
import { PropType, inject, watch, ref, computed, nextTick, Ref } from 'vue'
import { formatDate } from '@util/date-time'

const props = defineProps({
  modelValue: Boolean,
  initCode: {
    type: String,
    default: ''
  },
  availableList: {
    type: Array as PropType<Coupon.Item[]>,
    default: () => []
  },
  unavailableList: {
    type: Array as PropType<Coupon.Item[]>,
    default: () => []
  },
  discount: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue', 'selected', 'input'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [couponEmpty, couponBg, couponBgDisabled] = gdp(['coupon-empty.png', 'bg-coupon.png', 'bg-coupon-disabled.png'])

const couponPicker: Ref<SpPopup | null> = ref(null)

const open = () => {
  couponPicker.value?.open()
}
const close = () => {
  couponPicker.value?.close()
}

const selectedCode = ref('')

const checkChange = (couponCode: string) => {
  if (actived.value === 1) {
    return
  }
  selectedCode.value = selectedCode.value === couponCode ? '' : couponCode
  emit('selected', selectedCode.value)
}

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      selectedCode.value = props.initCode
      open()
    } else {
      close()
    }
  }
)

const changeVisible = (data: { show: boolean; type: string }) => {
  emit('update:modelValue', data.show)
  // #ifdef MP-WEIXIN
  // vue3 小程序 update:modelValue 不生效的临时方案
  emit('input', data.show)
  // #endif
}

/**
 * 页面滚动条处理
 */
let oldScrollTop = 0
const scrollTop = ref(0)
// 滚动
const scroll = (e: ScrollEvent) => {
  oldScrollTop = e.detail.scrollTop
}
// 返回顶部
const goTop = () => {
  scrollTop.value = oldScrollTop
  nextTick(() => {
    scrollTop.value = 0
  })
}

const actived = ref(0)

const changeTab = (index: number) => {
  actived.value = index
  goTop()
}

// 根据金额长度调整字体样式
const setGeneratorNumSizeClass = (num: number) => {
  const len = String(num).length
  return len > 7 ? 'size-mini' : len > 5 ? 'size-small' : len > 4 ? 'size-middle' : ''
}

const isEmpty = computed(() => {
  return actived.value === 0 ? !props.availableList.length : !props.unavailableList.length
})

const couponList = computed(() => (actived.value === 0 ? props.availableList : props.unavailableList))
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
