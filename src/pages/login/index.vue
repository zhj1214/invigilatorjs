<template>
  <view class="flex-col items-center">
    <view class="flex-col items-center logo">
      <image :src="logoImg" mode="aspectFill" />
      <text class="font-medium">欢迎来到数跑</text>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <!-- 微信小程序登录 -->
    <button v-if="loginBtnEnable" open-type="getPhoneNumber" class="login-btn items-center justify-center" @getphonenumber="handleWxLogin">
      <image :src="wechatImg" mode="aspectFit" class="wechat" />
      <text>微信登录</text>
    </button>
    <button v-else class="login-btn items-center justify-center disable">
      <image :src="wechatImg" mode="aspectFit" class="wechat" />
      <text>微信登录</text>
    </button>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <!-- H5登录 -->
    <view class="login-form-item border-bottom-2">
      <input v-model="mobile" type="text" maxlength="11" class="login-input font-regular" placeholder="手机号" placeholder-style="{ color: #D8D8D8; }" />
    </view>
    <view class="flex-row items-center login-form-item border-bottom-2">
      <input v-model="code" class="login-input login-code font-regular" type="number" maxlength="6" placeholder="验证码" placeholder-style="{ color: #D8D8D8; }" />
      <view class="code-btn items-center justify-end" @click="getCode">{{ smsText }}</view>
    </view>
    <view class="login-btn items-center justify-center" :class="[loginBtnEnable ? '' : 'disable']" @click="handleLogin">登 录</view>
    <!-- #endif -->
    <view class="login-agreement" @click="checkChange">
      <sp-checkbox v-model="checked" class="checkbox" size="small" />
      <text class="login-agreement-pre">已阅读并同意</text>
      <view class="login-agreement-agreement">
        <view class="login-agreement-agreement-item" @click.stop="goToPrivacyAgreement">《隐私条款》</view>
        <view class="login-agreement-agreement-item" @click.stop="goToUserAgreement">《用户协议》</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="Login">
import { inject, ref, computed, ComputedRef } from 'vue'
import { isCorrectMobile } from '@src/util/common'
import { getSmsCode, login, doWxLogin } from '@api/user'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const appStore = useAppStore()
const userStore = useUserStore()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const logoImg = gdp('logo-big.png')

// #ifdef MP-WEIXIN
const wechatImg = gdp('wechat.png')
// #endif

onLoad(() => {
  appStore.setLoginStatus(false)
  userStore.$reset()
  uni.removeStorageSync('token')
  // #ifdef MP-WEIXIN
  uni.login({})
  // #endif
})

// #ifdef H5
const mobile = ref('')
const code = ref('')
const smsText = ref('获取验证码')

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
// #endif
// #ifdef H5
const handleLogin = async () => {
  if (!loginBtnEnable.value) {
    return
  }
  if (!checkMobile()) {
    return
  }
  if (code.value === '') {
    uni.showToast({
      icon: 'none',
      title: '请输入验证码'
    })
    return
  }
  try {
    uni.showLoading({
      mask: true,
      title: '登录中'
    })
    const tokenInfo = await login({
      mobile: mobile.value,
      verificationCode: code.value,
      isCreatePassword: false
    })
    uni.setStorageSync('token', (tokenInfo as { accessToken: string }).accessToken)
    appStore.setLoginStatus(true)
    const pages = getCurrentPages()
    if (pages.length === 1) {
      uni.switchTab({
        url: '/pages/mine/index'
      })
    } else {
      uni.navigateBack({
        delta: 1
      })
    }
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
  }
}
// #endif
// #ifdef MP-WEIXIN
const handleUaaLogin = async (data: { jsCode: string; encryptedData: string; iv: string; source: number }) => {
  const res = (await doWxLogin(data)) as { hasReg: boolean; openId: string; accessToken: { accessToken: string }; mobile: string }
  const { hasReg, openId, accessToken, mobile: mobilePhone } = res
  if (hasReg) {
    uni.setStorageSync('token', accessToken.accessToken)
    userStore.$patch({
      mobile: mobilePhone
    })
    appStore.setLoginStatus(true)
    uni.navigateBack({
      delta: 1
    })
  } else {
    // 去注册
    uni.redirectTo({
      url: `/pages/register/register?mobile=${mobilePhone}&openId=${openId}`
    })
  }
}
const handleWxLogin = (e: GetPhoneNumberEvent) => {
  const { iv, encryptedData } = e.detail
  if (iv && encryptedData) {
    uni.login({
      scopes: 'auth_user',
      async success(data) {
        handleUaaLogin({
          jsCode: data.code,
          encryptedData,
          iv,
          source: 2 // 注册来源 2-小程序
        })
      }
    })
  }
}
// #endif

const checked = ref(false)

let loginBtnEnable: ComputedRef<boolean>

// #ifdef H5
loginBtnEnable = computed(() => !!mobile.value && !!code.value && checked.value)
// #endif

// #ifdef MP-WEIXIN
loginBtnEnable = computed(() => checked.value)
// #endif

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
.logo {
  padding-top: 184rpx;
  padding-bottom: 80rpx;

  image {
    width: 114rpx;
    height: 114rpx;
  }

  text {
    font-size: 37rpx;
    font-weight: 500;
    color: #292c2e;
  }
}

.login-agreement {
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

  /*  #ifdef  MP-WEIXIN  */
  margin-top: 200rpx;

  .checkbox {
    width: 28rpx;
    height: 28rpx;
  }
  /*  #endif  */
}

.login-btn {
  width: 560rpx;
  height: 90rpx;
  border-radius: 2rpx;
  font-size: 30rpx;
  color: #fff;
  background: #1a1a1a;
  margin-top: 114rpx;

  &.disable {
    background: #bababa;
  }

  /*  #ifdef  MP-WEIXIN  */
  &::after {
    border: none;
  }

  .wechat {
    width: 40rpx;
    height: 40rpx;
    margin-right: 6rpx;
  }
  /*  #endif  */
}

/*  #ifdef  H5  */
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

.login-form-item {
  position: relative;
  height: 130rpx;
  width: 560rpx;

  .login-input {
    width: 100%;
    height: 100%;
    font-size: 30rpx;
    color: #1a1a1a;
  }

  .login-code {
    width: 340rpx;
  }

  .code-btn {
    width: 220rpx;
    height: 100%;
  }
}
/*  #endif  */
</style>
