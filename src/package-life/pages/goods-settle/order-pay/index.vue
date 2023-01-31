<template>
  <!-- 订单基础信息 -->
  <view class="order-base-info padding-40">
    <view class="item items-center">
      <text class="left">商品金额</text>
      <view class="right items-center">
        <text v-if="fee">￥{{ fee }}</text>
        <template v-if="necessaryPoint > 0">
          <text v-if="fee > 0">+</text>
          <image class="price-points-icon" :src="iconPoint" />
          <text>{{ necessaryPoint }}</text>
        </template>
      </view>
    </view>
    <view class="item items-center">
      <text class="left">运费金额</text>
      <text class="right">￥{{ shipAmount }}</text>
    </view>
    <view class="item items-center">
      <text class="left">优惠券</text>
      <view v-if="couponAccountCode" class="right items-center" @click="openCouponPicker">
        <text>-￥{{ recordDiscount / 100 }}</text>
        <image class="img" :src="iconRight" mode="scaleToFill" />
      </view>
      <view v-else class="right items-center" @click="openCouponPicker">
        <text v-if="coupon.availableLength === 0">无可用优惠券</text>
        <text v-else>{{ coupon.availableLength }}张可用</text>
        <image class="img" :src="iconRight" />
      </view>
    </view>
  </view>
  <!-- 订单基础信息 end -->
  <!-- 订单支付方式 -->
  <view v-if="hasPayMethods" class="pay-methods">
    <view class="pay-header items-center justify-between">
      <text class="title font-medium">订单支付方式选择</text>
      <text class="desc">你有{{ userUsablePoint }}积分可用</text>
    </view>
    <view class="pay-methods-box">
      <view class="pay-methods-item" :class="[payMethod === 'DEFAULT' ? 'selected' : '']" @click="changePayMethod('DEFAULT')">
        <text v-if="defaultFee">￥{{ formatMoney(defaultFee) }}</text>
        <template v-if="defaultPoint">
          <text v-if="defaultFee">+</text>
          <image class="price-points-icon" :src="payMethod === 'DEFAULT' ? iconPointSelected : iconPointDisabled" />
          <text>{{ defaultPoint }}</text>
        </template>
      </view>
      <view class="pay-methods-item" :class="[payMethod === 'CUSTOM-POINT' ? 'selected' : '']" @click="changePayMethod('CUSTOM-POINT')">
        <text v-if="payMethod === 'DEFAULT'">自定义积分支付</text>
        <template v-else>
          <text v-if="customFee">￥{{ formatMoney(customFee) }}+</text>
          <image class="price-points-icon" :src="payMethod === 'CUSTOM-POINT' ? iconPointSelected : iconPointDisabled" />
          <input
            v-model="customInputVal"
            class="custom-input"
            cursor-spacing="30"
            type="number"
            placeholder-class="custom-input-placeholder"
            placeholder="请输入使用积分"
            :max="userUsablePoint"
            :min="necessaryPoint"
            :focus="customInputFocus"
          />
        </template>
      </view>
    </view>
    <view v-if="customError.show && hasInputVal" class="custom-error-tip">{{ customError.msg }}</view>
  </view>
  <view v-if="userUsablePoint < necessaryPoint" class="error-tip items-center justify-center">当前仅{{ userUsablePoint }}积分可用 至少需用{{ necessaryPoint }}积分</view>
  <!-- 底部合计与操作按钮 -->
  <view class="footer">
    <view class="left">
      <view class="label">合计：</view>
      <view class="money items-center">
        <template v-if="payMethod === 'DEFAULT'">
          <text v-if="defaultFee" class="price">￥{{ formatMoney(defaultFee) }}</text>
          <template v-if="defaultPoint">
            <text v-if="defaultFee" class="symbol">+</text>
            <image class="point-icon" :src="iconPointDark" mode="aspectFit" />
            <text class="point">{{ defaultPoint }}</text>
          </template>
        </template>
        <template v-if="payMethod === 'CUSTOM-POINT'">
          <text v-if="customFee" class="price">￥{{ formatMoney(customFee) }}</text>
          <template v-if="customPoint">
            <text v-if="customFee" class="symbol">+</text>
            <image class="point-icon" :src="iconPointDark" mode="aspectFit" />
            <text class="point">{{ customPoint }}</text>
          </template>
        </template>
      </view>
    </view>
    <view class="right" :class="[submitDisabled ? 'disabled' : '']" @click="handleSubmit">提交订单</view>
  </view>
  <coupon-picker
    v-model="couponPickerVisible"
    :init-code="couponAccountCode"
    :available-list="coupon.availableList"
    :unavailable-list="coupon.unavailableList"
    :discount="recordDiscount / 100"
    @selected="toSelectCoupon"
  />
</template>
<script lang="ts" setup>
import { computed, ComputedRef, inject, onMounted, PropType, ref, watch } from 'vue'
import CouponPicker from '../coupon-picker/index.vue'
import { formatMoney } from '@src/util/money'
import Decimal from '@src/lib/decimal' // 处理精度丢失
import { useUser } from '../user'
import { useUserStore } from '@src/pinia/user'

interface CustomErrorInfo {
  show: boolean
  msg: string
}
type PayType = 'DEFAULT' | 'CUSTOM-POINT'

// 静态图片
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconRight, iconPoint, iconPointDisabled, iconPointSelected, iconPointDark] = gdp([
  'icon-right-new.png',
  'icon-point-settle.png',
  'icon-point-disabled.png',
  'icon-point-actived.png',
  'icon-point-dark.png'
])

const userStore = useUserStore()
const { userUsablePoint, coupon, getUsablePoint, getCoupon } = useUser()

onMounted(async () => {
  const userInfo = await userStore.getUserInfo()
  getUsablePoint()
})

const props = defineProps({
  orderDetail: {
    type: Object as PropType<Order.PreviewOrderInfo>,
    default: null
  }
})

// 商品列表
const goodsList = computed(() => props.orderDetail?.itemList || [])

watch(
  () => props.orderDetail,
  (detail) => {
    getCoupon(detail)
  }
)

const emit = defineEmits(['refresh', 'submit'])

const payMethod = ref('DEFAULT')

const changePayMethod = (method: PayType) => {
  payMethod.value = method
  if (method === 'CUSTOM-POINT') {
    customInputFocus.value = true
  }
}

const couponPickerVisible = ref(false)
// 打开卡券选择弹窗
const openCouponPicker = () => {
  couponPickerVisible.value = true
}
// 运费
const shipAmount = computed(() => Number(props.orderDetail?.shipAmount) / 100)
// 选中的卡券编码
const couponAccountCode = ref('')
// 总价值，单位分，不包含运费
const total = computed(() => Number(props.orderDetail.subtotalAmount))

// 总价值，单位分，不包含运费
const totalWithShip = computed(() => Number(props.orderDetail.totalAmount))

// 优惠券优惠金额， 单位分
const recordDiscount = computed(() => Number(props.orderDetail.totalCouponAmount))

// 必要积分
const necessaryPoint = computed(() => Number(props.orderDetail.necessaryPointNum))

// 可用积分支付总额
const availablePoint = computed(() => Number(props.orderDetail.availablePointNum))

// 默认支付方式积分值
const defaultPoint = computed(() => {
  if (necessaryPoint.value > userUsablePoint.value) {
    return necessaryPoint.value
  }
  if (availablePoint.value > userUsablePoint.value) {
    return userUsablePoint.value
  }
  return availablePoint.value
})

// 默认支付方式金额
const defaultFee = computed(() => {
  if (necessaryPoint.value > userUsablePoint.value) {
    return totalWithShip.value - necessaryPoint.value
  }
  if (availablePoint.value > userUsablePoint.value) {
    return totalWithShip.value - userUsablePoint.value
  }
  return totalWithShip.value - availablePoint.value
})

const customInputVal = ref('')

const customPoint = computed(() => Number(customInputVal.value))

// 是否输入自定义积分
const hasInputVal = ref(false)

// 去除首位0
watch(customInputVal, (val) => {
  hasInputVal.value = true
  if (val.length > 1 && val.startsWith('0')) {
    customInputVal.value = val.substring(1)
  }
})

const customInputFocus = ref(false)

const customError: ComputedRef<CustomErrorInfo> = computed(() => {
  if (payMethod.value === 'DEFAULT') {
    return {
      show: false,
      msg: ''
    }
  }
  let show = false
  let msg = ''
  if (customInputVal.value === '') {
    show = true
    msg = '请输入使用积分'
  }
  if (customPoint.value > availablePoint.value) {
    show = true
    msg = '超出订单可用积分'
  }
  if (customPoint.value < necessaryPoint.value) {
    show = true
    msg = '少于订单需使用积分'
  }
  if (customPoint.value > userUsablePoint.value) {
    show = true
    msg = `仅${userUsablePoint.value}积分可用`
  }
  return {
    show,
    msg
  }
})

const submitDisabled = computed(() => userUsablePoint.value < necessaryPoint.value || customError.value.show)

const customFee = computed(() => {
  if (Number(customPoint.value) > defaultPoint.value) {
    return 0
  }
  const pointNum = Number(customPoint.value) > necessaryPoint.value ? Number(customPoint.value) : necessaryPoint.value
  const num = (total.value - recordDiscount.value - pointNum) / 100
  const finnalNew = new Decimal(num).add(new Decimal(shipAmount.value)).toNumber() * 100
  return Math.max(finnalNew, 0)
})
// 是否有多种支付方式
const hasPayMethods = computed(() => {
  const { necessaryPointNum } = props.orderDetail
  return !!(goodsList.value.some((item: AnyObject) => item.payType === 4) && userUsablePoint.value && Number(necessaryPointNum) < userUsablePoint.value)
})
// 默认面值最大的卡券
watch(
  () => coupon,
  (val) => {
    couponAccountCode.value = val.availableList && val.availableList.length ? val.availableList[0].couponAccountCode : ''
    couponAccountCode.value && emit('refresh', couponAccountCode.value)
  }
)
// 选择卡券
const toSelectCoupon = async (code: string) => {
  couponAccountCode.value = code
  emit('refresh', couponAccountCode.value)
}

// 展示金额
const fee = computed(() => (total.value - necessaryPoint.value) / 100)

function handleSubmit() {
  if (submitDisabled.value) {
    return
  }
  emit('submit', payMethod.value, defaultPoint.value, customPoint.value, couponAccountCode.value)
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
