<template>
  <view class="after-sale-amount">
    <view class="title">售后金额</view>
    <view class="content">
      <view v-if="changeAble" class="label">
        <view class="label-content">
          <template v-if="totalAmount > 0">
            <text v-if="skuPayMode != 2" class="label-content-text">￥</text>
            <input
              v-if="[1, 3].includes(afterSaleItem.payType)"
              v-model="customPayment"
              :focus="moneyFocus"
              type="digit"
              :maxlength="moneyLength"
              class="label-content-input"
              :style="{ width: inputWid }"
              @blur="handleCustomPaymentBlur"
              @input="checkPrice"
            />
          </template>
          <template v-if="afterSaleItem.totalPointAmount > 0">
            <text v-if="[3, 4].includes(payType) && totalAmount > 0" class="label-content-text" type="number">+</text>
            <image v-if="[2, 3, 4].includes(payType)" class="point-icon change" :src="pointIcon" />
            <input
              v-if="[2, 3].includes(afterSaleItem.payType)"
              v-model="customPoint"
              :focus="pointFocus"
              :style="{ width: inputWidPoint }"
              type="number"
              :maxlength="pointLength"
              class="label-content-input"
              @blur="handleCustomPointBlur"
              @input="checkPoint"
            />
          </template>
          <view class="edit" @click="handleIconClick"><image class="edit-icon" :src="editIcon" /></view>
        </view>
        <view class="label-bottom">
          <text>可修改，最多</text>
          <text v-if="skuPayMode != 2 && totalAmount > 0" class="label-content-text">￥{{ formatMoney(totalAmount) }}</text>
          <text v-if="[3, 4].includes(skuPayMode) && afterSaleItem.totalPointAmount > 0 && totalAmount > 0" class="label-content-text">+</text>
          <template v-if="[2, 3, 4].includes(skuPayMode) && afterSaleItem.totalPointAmount > 0">
            <image class="point-icon" :src="pointIcon" />
            <text class="label-content-text">{{ afterSaleItem.totalPointAmount }}</text>
          </template>
          <text>，含发货邮费￥{{ 0 }}</text>
        </view>
      </view>
      <view v-else class="label">
        <view class="label-content">
          <text v-if="afterSaleItem.totalAmount + afterSaleItem.shipAmount > 0" class="label-content-text">￥{{ formatMoney(afterSaleItem.totalAmount) }}</text>
          <template v-if="[2, 3, 4].includes(skuPayMode) && afterSaleItem.totalPointAmount > 0">
            <text v-if="afterSaleItem.totalAmount > 0" class="label-content-text">+</text>
            <image class="point-icon" :src="pointIcon" />
            <text class="label-content-text">{{ afterSaleItem.totalPointAmount }}</text>
          </template>
        </view>
        <view class="label-bottom">
          <text>不可修改，最多</text>
          <text v-if="afterSaleItem.totalAmount + afterSaleItem.shipAmount > 0" class="label-content-text">￥{{ formatMoney(afterSaleItem.totalAmount) }}</text>
          <template v-if="[2, 3, 4].includes(skuPayMode) && afterSaleItem.totalPointAmount > 0">
            <text v-if="afterSaleItem.totalAmount > 0" class="label-content-text">+</text>
            <image class="point-icon" :src="pointIcon" />
            <text class="label-content-text">{{ afterSaleItem.totalPointAmount }}</text>
          </template>
          <text>，含发货邮费￥{{ formatMoney(afterSaleItem.shipAmount) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { inject, onMounted, reactive, ref, nextTick } from 'vue'
import { pureAssign } from '@util/common'
import { formatMoney } from '@util/money'
import { getOrderInfo } from '@api/order'
interface AfterSaleItem {
  totalAmount: number
  totalPointAmount: number
  subtotalAmount: number
  skuPayMode: number
  payType: number
  couponAmount: number
  totalPointNum: number
  pointAmount: number
  shipAmount: number
  settlementAmount: number
  totalCouponAmount: number
  pointNum: number
}

const props = defineProps<{
  orderId: string
  itemId: string
}>()
const emit = defineEmits(['getAfterSaleAmout'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [pointIcon, editIcon] = gdp(['icon-point.png', 'icon-edit.png'])

const customPayment = ref('')
const customPoint = ref(0)
const changeAble = ref(false)
const payType = ref(0)
const skuPayMode = ref(0)
const totalAmount = ref(0)
const inputWid = ref('')
const inputWidPoint = ref('')
const pointLength = ref(0)
const moneyLength = ref(0)
let afterSaleItem: AfterSaleItem = reactive({
  totalAmount: 0,
  totalPointAmount: 0,
  subtotalAmount: 0,
  skuPayMode: 0, // sku支付模式(1:现金支付, 2:积分支付, 3:定额积分+现金, 4:自定义积分)
  payType: 0, // 实际支付方式(1:现金支付, 2:积分支付, 3:积分现金混合支付, 4:零现金零积分支付
  couponAmount: 0,
  totalPointNum: 0,
  pointAmount: 0,
  shipAmount: 0,
  settlementAmount: 0,
  totalCouponAmount: 0,
  pointNum: 0
})
async function getOrder() {
  try {
    const res = await getOrderInfo(props.orderId)
    res.orderItemDtoList.map((item: AnyObject) => {
      if (item.id === props.itemId) {
        pureAssign(afterSaleItem, item)
        item.itemType !== '0' && item.deliveryStatus === 2 ? (changeAble.value = true) : (changeAble.value = false)
        payType.value = item.payType
        skuPayMode.value = item.skuPayMode
      }
    })
    totalAmount.value = afterSaleItem.totalAmount - afterSaleItem.shipAmount
    customPoint.value = afterSaleItem.totalPointAmount
    customPayment.value = formatMoney(totalAmount.value)
    pointLength.value = String(afterSaleItem.totalPointAmount).length
    moneyLength.value = formatMoney(totalAmount.value).length + 1
    inputWid.value = String(customPayment.value).length * 18 + 'rpx'
    inputWidPoint.value = (String(customPoint.value).length + 1) * 19 + 'rpx'
    getAfterSaleAmout()
  } catch (error) {
    console.log(error)
  }
}

// 输入框输入事件
function checkPrice(e: AnyObject) {
  let price = e.detail.value
  let maxLength = price.indexOf('.')
  if (price.indexOf('.') < 0 && price !== '') {
    price = price.length > 9 ? price.substring(0, price.length - 1) : parseFloat(price)
  } else if (price.indexOf('.') == 0) {
    //'首位小数点情况'
    price = price.replace(/[^$#$]/g, '0.')
    price = price.replace(/\.{2,}/g, '.')
  } else if (!/^(\d?)+(\.\d{0,2})?$/.test(price)) {
    //去掉最后一位
    price = price.substring(0, price.length - 1)
  }
  nextTick(function () {
    //'有小数点时，最大长度为9位，没有则是11位'
    maxLength = maxLength == -1 ? 9 : 11
    customPayment.value = price
  })
}
function checkPoint(e: AnyObject) {
  var number = /^[0-9]*$/g
  const zero = /^[0]+[0-9]*$/
  let point = e.detail.value
  // 只能是数字，不能是其他输入
  while (zero.test(point) && point.length > 1) {
    point = point.substring(1, point.length)
  }
  if (!number.test(point)) {
    point = point.substring(0, point.length - 1)
  }
  nextTick(() => {
    customPoint.value = point
  })
}
// 点击显示输入框事件
const moneyFocus = ref(false)
const pointFocus = ref(false)
function handleIconClick() {
  totalAmount.value > 0 ? (moneyFocus.value = true) : (pointFocus.value = true)
}

// 输入框失焦事件
function handleCustomPaymentBlur(e: AnyObject) {
  if (e.detail.value * 100 > totalAmount.value) {
    customPayment.value = formatMoney(totalAmount.value)
  } else if (e.detail.value <= 0 || e.detail.value === '') {
    customPayment.value = formatMoney(0)
  }
  pointFocus.value = false
  moneyFocus.value = false
  getAfterSaleAmout()
}
function handleCustomPointBlur(e: AnyObject) {
  let point = e.detail.value
  const zero = /^[0]+[0-9]*$/
  while (zero.test(point)) {
    point = point.substring(1, point.length)
  }
  if (point > afterSaleItem.totalPointAmount) {
    point = afterSaleItem.totalPointAmount
  } else if (point < 0 || isNaN(point) || point === '') {
    point = '0'
  }
  nextTick(() => {
    customPoint.value = point
    getAfterSaleAmout()
  })
  pointFocus.value = false
  moneyFocus.value = false
}

function getAfterSaleAmout() {
  emit('getAfterSaleAmout', customPayment.value, customPoint.value, changeAble.value)
}
onMounted(() => {
  getOrder()
})
</script>
<style scoped lang="scss">
.after-sale-amount {
  display: flex;

  .title {
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    width: 200rpx;
    padding: 32rpx 0;
    color: #909ca8;
  }

  .content {
    flex: 1;
    height: 100%;
    padding: 32rpx 0;
    width: calc(100% - 200rpx);
    position: relative;
    font-size: 28rpx;
    color: #92969a;

    .label {
      width: 100%;

      &-content {
        display: flex;
        margin-bottom: 10rpx;
        width: 100%;

        // height: ;
        position: relative;

        // justify-content: space-between;
        .point-icon {
          width: 26rpx;
          height: 26rpx;
          position: relative;
          top: 8rpx;
        }

        .change {
          margin-left: 5rpx;
          top: 10rpx;
        }

        &-img {
          width: 26rpx;
          height: 26rpx;

          // background-color: aliceblue;
          // position: relative;
          // top: 19rpx;
        }

        .edit {
          position: absolute;
          right: 0;

          &-icon {
            width: 22rpx;
            height: 22rpx;
            margin-right: 5rpx;
          }

          &-text {
            font-size: 24rpx;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: #92969a;
          }
        }

        &-text {
          height: 44rpx;
          line-height: 44rpx;
        }
      }

      &-bottom {
        font-size: 24rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #bababa;

        .point-icon {
          width: 26rpx;
          height: 26rpx;
          position: relative;
          top: 3rpx;
        }
      }
    }
  }
}
</style>
