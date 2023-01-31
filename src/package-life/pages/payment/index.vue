<template>
  <view class="page">
    <!-- 订单支付倒计时 -->
    <view v-if="payLeftSeconds > 0" class="pay-info flex-col items-center justify-center">
      <view class="pay-left flex-row items-center">
        <text>支付剩余时间</text>
        <uni-countdown :show-day="false" :show-colon="false" :second="payLeftSeconds" color="#92969A" splitor-color="#92969A" @timeup="setTimeup" />
      </view>
      <view class="pay-fee items-center">
        <text class="mark">￥</text>
        <text class="fee">{{ fee }}</text>
      </view>
    </view>
    <!-- 订单超时 -->
    <view v-else-if="loaded" class="out-date items-center justify-center">订单已超时</view>
    <view v-if="Number(fee) > 0" class="pay-type">
      <view v-if="payTypeList.length > 1" class="pay-type-title">选择支付方式</view>
      <view v-for="item in payTypeList" :key="item.value" class="pay-item items-center justify-between" @click="payType = item.value">
        <view class="items-center justify-between">
          <image class="icon" :src="item.icon" mode="asceptFit" />
          <text class="pay-text">{{ item.text }}</text>
        </view>
        <sp-checkbox v-model="payType" size="small" :true-value="item.value" @change="change" />
      </view>
    </view>
    <!-- 底部支付按钮 -->
    <view class="footer">
      <view class="btn items-center justify-center" :class="{ disabled: payLeftSeconds <= 0 }" @click="toPay">立即支付</view>
    </view>
    <!-- #ifdef H5 -->
    <uni-popup ref="payPopup" :mask-click="false">
      <view class="pay-confirm flex-col items-center">
        <view class="title items-center justify-center">请确认是否已完成支付</view>
        <view class="confirm-footer justify-between">
          <view class="cancel items-center justify-center" @click="toRePay">重新支付</view>
          <view class="confirm items-center justify-center" @click="checkPay">已完成支付</view>
        </view>
      </view>
    </uni-popup>
    <view class="alipay" v-html="alipay" />
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup name="Payment">
import { ref, inject, nextTick, Ref } from 'vue'
import { getOrderInfo } from '@api/order'
import { getPayOrder } from '@api/pay'
import { formatMoney } from '@src/util/money'
import { isInWechat } from '@src/util/common'
import { onLoad, onShow } from '@dcloudio/uni-app'

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface PaymentOption {
  orderId: string
  type: string
  isFromPaid?: string
}

const orderId = ref('')
const type = ref(0)
const isFromPaid = ref(false)

onLoad((option: OnLoadOption<PaymentOption>) => {
  const { orderId: id, type: t, isFromPaid: fromPaid } = option
  orderId.value = id || ''
  type.value = Number(t || 0)
  // 微信支付返回
  isFromPaid.value = !!fromPaid
})
onShow(() => {
  if (!orderId.value) {
    return
  }
  isFromPaid.value ? checkPay() : getOrder()
})
// 静态图片
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const wechatImg = gdp('icon-wechat.png')

const loaded = ref(false)

const fee = ref('')
const payLeftSeconds = ref(0)

const payTypeList = [
  {
    value: 'wechat',
    text: '微信支付',
    icon: wechatImg
  }
]

// #ifdef H5
const alipayImg = gdp('icon-alipay.png')
if (!isInWechat) {
  payTypeList.push({
    value: 'alipay',
    text: '支付宝支付',
    icon: alipayImg
  })
}
const alipay = ref('')
// #endif

const payType = ref('')

payType.value = payTypeList[0].value

function change(val: string, oldVal: string) {
  console.log(val, oldVal)
  nextTick(() => {
    if (!val) {
      payType.value = oldVal
    }
  })
}

function setTimeup() {
  payLeftSeconds.value = 0
}

async function getOrder() {
  uni.showLoading({
    mask: true,
    title: '支付信息获取中'
  })
  try {
    const { order } = (await getOrderInfo(orderId.value)) as AnyObject
    if (order.payTime) {
      uni.hideLoading()
      uni.redirectTo({
        url: `/package-life/pages/payment-success/index?type=${type.value}&orderId=${orderId.value}`
      })
      return
    }
    loaded.value = true
    const { totalAmount, payLeftTime } = order
    fee.value = Number(totalAmount) > 0 ? formatMoney(totalAmount) : '0'
    payLeftSeconds.value = payLeftTime / 1000
    uni.hideLoading()
    return order
  } catch (error) {
    uni.hideLoading()
  }
}
// #ifdef MP-WEIXIN
async function toPayWechat() {
  // 支付前先静默登录再调用支付接口
  uni.showLoading({
    mask: true,
    title: '支付中...'
  })
  uni.login({
    success: async (res) => {
      const code = res.code
      try {
        const payOrder = (await getPayOrder({
          orderId: orderId.value,
          agencyCode: '02',
          channelCode: '08',
          vmId: 1,
          code
        })) as AnyObject
        if (payOrder) {
          uni.requestPayment({
            provider: 'wxpay',
            orderInfo: '',
            timeStamp: payOrder.timeStamp,
            nonceStr: payOrder.nonceStr,
            package: payOrder.package,
            signType: payOrder.signType,
            paySign: payOrder.paySign,
            success: () => {
              uni.hideLoading()
              uni.redirectTo({
                url: `/package-life/pages/payment-success/index?type=${type.value}&orderId=${orderId.value}`
              })
            },
            fail: (e) => {
              uni.hideLoading()
              uni.showToast({
                title: '支付异常，请重新支付',
                icon: 'none'
              })
            }
          })
        } else {
          uni.hideLoading()
          // 无需第三方支付,直接跳转至支付成功
          uni.redirectTo({
            url: `/package-life/pages/payment-success/index?type=${type.value}&orderId=${orderId.value}`
          })
        }
      } catch (error) {}
    }
  })
}
// #endif
// #ifdef H5
async function toPayH5() {
  uni.showLoading({
    mask: true,
    title: '支付中...'
  })
  try {
    const payOrder = (await getPayOrder({
      orderId: orderId.value,
      agencyCode: payType.value === 'wechat' ? '02' : '01',
      channelCode: payType.value === 'wechat' ? (isInWechat ? '05' : '07') : '15',
      vmId: 1,
      returnUrl: location.href + '&isFromPaid=1'
    })) as AnyObject
    if (payOrder) {
      // 支付宝支付
      if (payType.value === 'alipay') {
        alipay.value = payOrder.body
        nextTick(() => {
          document.forms[0].submit()
        })
        return
      }
      // const { appId, nonce_str, prepay_id, sign } = payOrder
      // 微信支付
      if (isInWechat) {
        uni.showToast({
          icon: 'none',
          title: '暂不支持微信公众网页支付，请在浏览器进行支付'
        })
      } else {
        window.location.href = payOrder.mweb_url + '&redirect_url=' + encodeURIComponent(`${location.href}&isFromPaid=1`)
      }
      uni.hideLoading()
    } else {
      uni.hideLoading()
      // 无需第三方支付,直接跳转至支付成功
      uni.redirectTo({
        url: `/package-life/pages/payment-success/index?type=${type.value}&orderId=${orderId.value}`
      })
    }
  } catch (error) {
    uni.hideLoading()
  }
}
// #endif
async function toPay() {
  if (payLeftSeconds.value <= 0) {
    uni.showToast({
      title: '订单已超时',
      icon: 'none'
    })
    return
  }
  // #ifdef H5
  toPayH5()
  // #endif
  // #ifdef MP-WEIXIN
  toPayWechat()
  // #endif
}

const payPopup: Ref<SpPopup | null> = ref(null)

function toRePay() {
  payPopup.value?.close()
}

async function checkPay() {
  payPopup.value?.open()
  const order = await getOrder()
  if (order.payTime) {
    uni.redirectTo({
      url: `/package-life/pages/payment-success/index?type=${type.value}&orderId=${orderId.value}`
    })
  } else {
    uni.showToast({
      icon: 'none',
      title: '未查到支付信息，请重新支付'
    })
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
