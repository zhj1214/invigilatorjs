<template>
  <view class="test-drive">
    <!-- 图片 -->
    <view class="image-box">
      <image class="test-drive-main-img" :src="testDriveMainImg" mode="aspectFit" />
    </view>
    <view class="form-box">
      <view class="title">预约试驾</view>
      <test-drive-form :form-data-list="formDataList" @reservation-time="getTime" />
      <view class="footer-box">
        <view class="clause-box">
          <view class="label-box" @click="isChecked = !isChecked">
            <image class="icon-checkbox" :src="isChecked ? iconChecked : iconNoChecked" mode="aspectFit" />
            已阅读并同意
          </view>
          <view class="link-view" @click="goToAgreement">《隐私条款》</view>
        </view>
        <view :class="['submit-btn', isDisabled && isChecked ? '' : 'disabled-btn']" @click="submitInfo">立即预约</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="TestDrive">
import { inject, ref, reactive, watch } from 'vue'
import { setReservation } from '@api/car'
import { throttle } from '@src/lib/lodash'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import TestDriveForm from './test-drive-form.vue'
import { useUserStore } from '@src/pinia/user'
import { useAddressStore } from '@src/pinia/address'

const userStore = useUserStore()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
/**
 * 页面主图片
 */
const testDriveMainImg = gdp('test-drive-main-img.png')
const iconChecked = gdp('icon-checked.png')
const iconNoChecked = gdp('icon-no-checked.png')

let isChecked = ref(false) // 复选框是否选中
let isDisabled = ref(false) // 判断“立即预约”按钮是否可点击
let reservationTime = ref('')

// 表单信息
const formDataList = reactive([
  {
    id: 'name',
    label: '真实姓名',
    placeholder: '请输入您的名字',
    type: 'text',
    maxlength: 20,
    disabled: false,
    rules: {
      rule: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      msg: '姓名格式错误，请重新输入'
    },
    value: ''
  },
  {
    id: 'mobileNum',
    label: '手机号码',
    placeholder: '请输入手机号码',
    type: 'number',
    maxlength: 11,
    disabled: false,
    rules: {
      rule: /^[1]([3-9])[\d]{9}$/,
      msg: '请输入正确的手机号码'
    },
    value: ''
  },
  {
    id: 'verificationCode',
    label: '验证码',
    placeholder: '请输入验证码',
    type: 'number',
    maxlength: 6,
    rules: {
      rule: /^\d{6}$/,
      msg: '验证码应由6位数字组成'
    },
    rightContentType: 'btn',
    disabled: false,
    value: ''
  },
  {
    id: 'carInfo',
    label: '试驾车型',
    code: '',
    placeholder: '请选择试驾车型',
    type: 'text',
    rightContentType: 'icon',
    disabled: true,
    value: ''
  },
  {
    id: 'storeInfo',
    label: '试驾门店',
    code: '',
    placeholder: '请选择试驾门店',
    type: 'text',
    rightContentType: 'icon',
    disabled: true,
    value: ''
  },
  {
    id: 'chooseDate',
    label: '选择日期',
    placeholder: '请选择日期',
    type: 'datePicker',
    rightContentType: 'icon',
    disabled: true,
    value: ''
  }
])

/**
 * 判断“立即预约”按钮是否可点击
 */
watch(
  () => formDataList,
  async (value) => {
    isDisabled.value = value.every((item) => {
      return !!item.value
    })
  },
  {
    deep: true
  }
)

const getTime = (val: string) => {
  reservationTime.value = val
}

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  try {
    let resData = await userStore.getUserInfo()
    getValue(resData.mobile, 1)
  } catch {}
}

function getValue(data: string, index: number, code?: string) {
  const currentInfoObj = formDataList[index]
  currentInfoObj.value = data
  code && (currentInfoObj.code = code)
}
function goToAgreement() {
  uni.navigateTo({
    url: '/package-car/pages/privacy-agreement/privacy-agreement'
  })
}
/**
 * 校验输入框内容
 */
function toFormValidate(): boolean {
  let dataArr = formDataList.slice(0, 3)
  let flag = true
  for (let item of dataArr) {
    if (!item.rules?.rule.test(item.value)) {
      uni.showToast({
        icon: 'none',
        title: item.rules?.msg
      })
      flag = false
      break
    }
  }
  return flag
}
/**
 * 表单提交
 */
const submitInfo = throttle(
  async () => {
    if (!isDisabled.value || !isChecked.value || !toFormValidate()) {
      return false
    }
    const params = {
      driverName: formDataList[0].value,
      mobile: formDataList[1].value,
      smsCaptcha: formDataList[2].value,
      modelCode: formDataList[3].code,
      dealerCode: formDataList[4].code,
      reservationTime: reservationTime.value,
      source: '1'
    }
    try {
      const resData = await setReservation(params)
      uni.redirectTo({
        url: `/package-car/pages/appointment-complete/index?id=${resData}`
      })
    } catch (error) {}
  },
  300,
  {
    trailing: false
  }
)
onLoad(() => {
  /**
   * 获取用户信息
   */
  uni.getStorageSync('token') && getUserInfo()
})
onUnload(() => {
  useAddressStore().$patch({ selectedDealer: null, selectedCity: null })
})
</script>

<style lang="scss" scoped>
.test-drive {
  .image-box {
    width: 100%;
    height: 725rpx;

    .test-drive-main-img {
      width: 100%;
      height: 100%;
    }
  }

  .form-box {
    position: relative;
    top: -100rpx;
    margin: 0 32rpx;
    padding: 56rpx 48rpx 64rpx;
    background: #fff;
    box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 17%);
    border-radius: 2rpx;

    .title {
      font-size: 48rpx;
      font-weight: 500;
      color: #292c2e;
    }

    .footer-box {
      margin-top: 64rpx;
      font-size: 24rpx;
      color: #fff;

      .clause-box {
        display: flex;
        align-items: center;
        color: #92969a;

        .label-box {
          display: flex;
          align-items: center;

          .icon-checkbox {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
          }
        }

        .link-view {
          color: #292c2e;
        }
      }

      .submit-btn {
        width: 100%;
        height: 92rpx;
        line-height: 92rpx;
        text-align: center;
        font-size: 30rpx;
        background: #1a1a1a;
        margin-top: 32rpx;
      }

      .disabled-btn {
        background: #92969a;
      }
    }
  }
}

.picker-view {
  width: 750rpx;
  height: 600rpx;
  margin-top: 20rpx;
}
</style>
