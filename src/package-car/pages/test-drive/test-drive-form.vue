<template>
  <view class="item-box">
    <view v-for="(item, index) in formDataList" :key="index" class="item">
      <view class="label">{{ item.label }}</view>
      <view class="value-box" @click="doSth(item)">
        <input
          v-if="item.type === 'text'"
          v-model="item.value"
          class="input-box"
          type="text"
          :disabled="item.disabled"
          :maxlength="item.maxlength"
          :placeholder="item.placeholder"
          placeholder-class="input-placeholder"
        />
        <input
          v-else-if="item.type === 'number'"
          v-model="item.value"
          class="input-box"
          type="number"
          :disabled="item.disabled"
          :maxlength="item.maxlength"
          :placeholder="item.placeholder"
          placeholder-class="input-placeholder"
        />
        <template v-else-if="item.type === 'datePicker'">
          <picker mode="date" :start="startDate" :end="endDate" :class="['picker-box', item.value ? '' : 'input-placeholder']" @change="toBindDateChange">
            {{ item.value ? item.value : item.placeholder }}
          </picker>
        </template>
        <template v-if="item.rightContentType">
          <view v-if="item.rightContentType === 'btn'" :class="['verification-code-btn', isDisabledCodeBtn ? '' : 'disabled-code-btn']" @click="getVerificationCode">
            {{ verificationCodeValue }}
          </view>
          <image v-else class="icon-arrow-right" :src="iconArrowRight" mode="aspectFit" />
        </template>
      </view>
    </view>
  </view>
  <choice-car-serise ref="choiceCarSerise" @car-info-name="getCarInfoName" />
</template>

<script lang="ts" setup name="TestDriveForm">
import { Ref, ref, getCurrentInstance, PropType, computed, inject, watch } from 'vue'
import { getCode } from '@api/car'
import choiceCarSerise from '../../components/choice-car-serise/choice-car-serise.vue'
import { useAddressStore } from '@src/pinia/address'

/**
 *表单信息
 */
interface FormItem {
  id: string
  label: string
  placeholder: string
  type: string
  maxlength?: number
  disabled: boolean
  rules?: Rules
  value: string
  rightContentType?: string
  code?: string
}

/**
 * 表单信息中验证规则
 */
interface Rules {
  rule: RegExp
  msg: string
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
const iconArrowRight = gdp('icon-arrow-right.png')

const date = new Date()
let year = ref(date.getFullYear())
let month: Ref<number | string> = ref(date.getMonth() + 1)
let day: Ref<number | string> = ref(date.getDate())
let currentdate = ref(`${year.value}-${month.value}-${day.value}`)
const startDate = currentdate.value
const endDate = ref(`${year.value + 1}-12-31`)

const instance = getCurrentInstance() // 获取主组件的实例

const props = defineProps({
  formDataList: {
    type: Array as PropType<FormItem[]>,
    default: () => []
  }
})

const emit = defineEmits(['reservationTime'])
const addressStore = useAddressStore()
/**
 *  已选中的门店`
 * 选中的经销商对象
 */
let selectedDealer = computed(() => addressStore.selectedDealer)

watch(
  () => selectedDealer.value,
  (dealer) => {
    dealer && getValue(dealer.name, 4, dealer.code)
  }
)

/**
 * 获取验证码
 */
async function getVerificationCode() {
  if (!isDisabledCodeBtn.value) {
    return false
  } // 正在倒计时
  const mobileNumObj = props.formDataList[1] // 取手机号那个对象
  if (!mobileNumObj.value) {
    return false
  } // 无手机号不处理
  if (mobileNumObj.rules && !mobileNumObj.rules.rule.test(mobileNumObj.value)) {
    uni.showToast({
      icon: 'none',
      title: mobileNumObj.rules.msg
    })
    return
  }
  const mobileNum = Number(mobileNumObj.value)
  const resData = await getCode({ mobile: mobileNum })
  resData && getCountDown()
}

/**
 * 获取试驾车型
 */
function getCarInfoName(data: Car.Model) {
  getValue(`${data.carSeriseName}/${data.carModelName}`, 3, data.code)
}

/**
 * 倒计时时间
 */
let countDown = ref(0)
const verificationCodeValue = computed(() => {
  return countDown.value === 0 ? '获取验证码' : countDown.value + 's'
})
/**
 * 发送验证码按钮是否可点击的标识
 */
const isDisabledCodeBtn = computed(() => {
  return verificationCodeValue.value === '获取验证码'
})
/**
 * 倒计时
 */
function getCountDown() {
  countDown.value = 60
  let codeTimer: NodeJS.Timeout | string | number | undefined
  clearInterval(codeTimer)
  codeTimer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(codeTimer)
    }
  }, 1000)
}

/**
 * 获取日期
 */
const toBindDateChange = (e: AnyObject) => {
  const changeDate = e.detail.value.split('-')
  const reservationTime = new Date(`${changeDate[0]}/${changeDate[1]}/${changeDate[2]}`).getTime()
  emit('reservationTime', reservationTime)
  getValue(`${changeDate[0]}年${changeDate[1]}月${changeDate[2]}日`, 5)
}

function getValue(data: string, index: number, code?: string) {
  const currentInfoObj = props.formDataList[index]
  currentInfoObj.value = data
  code && (currentInfoObj.code = code)
}

function doSth(item: FormItem) {
  if (item.id === 'carInfo') {
    const toChoiceCarSerise = instance?.refs.choiceCarSerise as { openPopup: () => void }
    toChoiceCarSerise.openPopup()
  } else if (item.id === 'chooseDate') {
    // instance.refs.pickerDate.openPopup()
  } else if (item.id === 'storeInfo') {
    const data = selectedDealer.value ? `?selectedDealer=${JSON.stringify(selectedDealer.value)}` : ''
    uni.navigateTo({
      url: `/package-car/pages/choice-stores/index${data}`
    })
  }
}
</script>

<style lang="scss" scope>
.item-box {
  font-size: 32rpx;

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 124rpx;
    border-bottom: 1px solid #e5e5e5;

    .label {
      width: 168rpx;
      text-align: left;
      color: #909ca8;
    }

    .value-box {
      width: calc(100% - 168rpx);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input-box,
      .picker-box {
        width: 86%;
        height: 60rpx;
        line-height: 60rpx;

        ::v-deep .uni-input-input {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      ::v-deep .input-placeholder {
        color: #bababa;
      }

      .verification-code-btn {
        width: 152rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: 24rpx;
        border: 2rpx solid #292c2e;
      }

      .disabled-code-btn {
        color: #bababa;
        border-color: #bababa;
      }

      .icon-arrow-right {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}
</style>
