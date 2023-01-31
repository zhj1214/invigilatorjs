<template>
  <view class="flex-col items-center">
    <!-- 页面标题 -->
    <view class="reg-title font-medium">创建账号</view>
    <!-- 手机号 -->
    <view class="reg-form-item border-bottom-2">
      <input v-model="mobile" type="text" placeholder="手机号" maxlength="11" class="reg-input font-regular" />
    </view>
    <!-- 验证码 -->
    <view class="flex-row items-center reg-form-item border-bottom-2">
      <input v-model="code" class="reg-input reg-code font-regular" type="number" maxlength="6" placeholder="验证码" placeholder-style="{ color: #D8D8D8; }" />
      <view class="code-btn items-center justify-end" @click="getCode">{{ smsText }}</view>
    </view>
    <!-- 注册按钮 -->
    <view class="reg-btn items-center justify-center" :class="[regBtnEnable ? '' : 'disable']" @click="handleRegister">确 定</view>
    <!-- 注册协议 -->
    <view class="reg-agreement" @click="checkChange">
      <sp-checkbox v-model="checked" class="checkbox" size="small" />
      <text class="reg-agreement-pre">已阅读并同意</text>
      <view class="reg-agreement-agreement">
        <view class="reg-agreement-agreement-item" @click.stop="goToPrivacyAgreement">《隐私条款》</view>
        <view class="reg-agreement-agreement-item" @click.stop="goToUserAgreement">《用户协议》</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="Register">
import { ref, computed } from 'vue'
import { getSmsCode, register } from '@api/user'
import { isCorrectMobile } from '@src/util/common'
import { useAppStore } from '@src/pinia/app'
import { onLoad } from '@dcloudio/uni-app'

const appStore = useAppStore()

const openId = ref('')
const mobile = ref('')
const code = ref('')
const smsText = ref('获取验证码')

type PageOptions = 'mobile' | 'openId'

onLoad((option: Record<PageOptions, string | undefined>) => {
  console.log(1)
  mobile.value = option.mobile || ''
  openId.value = option.openId || ''
})

let countDownNum = 0
let countDownTimer: NodeJS.Timer

const checkMobile = () => {
  if (mobile.value === '') {
    uni.showToast({
      icon: 'none',
      title: '请输入手机号'
    })
    return false
  }
  if (!isCorrectMobile(mobile.value)) {
    uni.showToast({
      icon: 'none',
      title: '请检查手机号格式'
    })
    return false
  }
  return true
}

const getCode = async () => {
  if (countDownNum > 0) {
    return
  }
  if (!checkMobile()) {
    return
  }
  try {
    uni.showLoading({
      mask: true,
      title: '验证码获取中'
    })
    await getSmsCode('bigapp', {
      mobile: mobile.value,
      template: 'ASYNC_VERIFICATION_CODE'
    })
    uni.hideLoading()
    countDownNum = 60
    smsText.value = `${countDownNum}s后重新获取`
    countDownTimer = setInterval(() => {
      countDownNum--
      smsText.value = `${countDownNum}s后重新获取`
      if (countDownNum === 0) {
        clearInterval(countDownTimer)
        smsText.value = '获取验证码'
      }
    }, 1000)
  } catch (error) {
    uni.hideLoading()
  }
}

const checked = ref(false)

const regBtnEnable = computed(() => !!mobile.value && !!code.value && checked.value)

const handleRegister = () => {
  if (!regBtnEnable.value) {
    return
  }
  uni.getUserProfile({
    desc: '用于完善会员资料',
    lang: 'zh_CN',
    async success(user) {
      const { userInfo } = user
      uni.showLoading({
        mask: true,
        title: '注册中'
      })
      try {
        const res = await register({
          openId: openId.value,
          mobile: mobile.value,
          captcha: code.value,
          clientId: 'bigapp',
          source: 2,
          avatarUrl: userInfo.avatarUrl,
          sex: userInfo.gender,
          niceName: userInfo.nickName
        })
        uni.hideLoading()
        const { accessToken } = res as { accessToken: string }
        uni.setStorageSync('token', accessToken)
        appStore.setLoginStatus(true)
        uni.redirectTo({
          url: '/pages/register/register-success'
        })
      } catch (error) {
        uni.hideLoading()
      }
    }
  })
}

const checkChange = () => {
  checked.value = !checked.value
}

const goToPrivacyAgreement = () => {
  uni.navigateTo({
    url: '/package-mine/pages/agreement/privacy-agreement'
  })
}

const goToUserAgreement = () => {
  uni.navigateTo({
    url: '/package-mine/pages/agreement/user-agreement'
  })
}
</script>

<style lang="scss" scoped>
.reg-title {
  width: 652rpx;
  font-size: 56rpx;
  font-weight: 500;
  color: #292c2e;
  margin-top: 72rpx;
  margin-bottom: 60rpx;
}

.reg-agreement {
  margin: 48rpx auto 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &-pre {
    font-size: 24rpx;
    color: #92969a;
    margin-left: 5rpx;
  }

  &-agreement {
    color: #1a1a1a;
    font-size: 24rpx;
    font-weight: 400;
    display: flex;

    &-item {
      font-size: 24rpx;
    }
  }

  .checkbox {
    width: 28rpx;
    height: 28rpx;
  }
}

.reg-btn {
  width: 652rpx;
  height: 90rpx;
  border-radius: 2rpx;
  font-size: 30rpx;
  color: #fff;
  background: #1a1a1a;
  margin-top: 114rpx;

  &.disable {
    background: #bababa;
  }
}

.border-bottom-2 {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    background: #e4e7ea;
    width: 100%;
    height: 2rpx;
    border-radius: 1rpx;
  }
}

.reg-form-item {
  position: relative;
  height: 130rpx;
  width: 652rpx;

  .reg-input {
    width: 100%;
    height: 100%;
    font-size: 30rpx;
    color: #1a1a1a;
  }

  .reg-code {
    width: 432rpx;
  }

  .code-btn {
    width: 220rpx;
    height: 100%;
  }
}
</style>
