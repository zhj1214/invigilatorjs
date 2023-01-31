<template>
  <view class="container">
    <!-- 头部背景图 -->
    <view class="top-layer">
      <image class="top-layer-bg" :src="mineBgImg" mode="asceptFill" />
    </view>
    <sp-header position="relative" />
    <!-- 用户信息 -->
    <user-info-card />

    <!-- 用户积分信息 -->
    <view v-if="isLogin" class="flex-row items-center user-point" @click="goToMyPoint('myPoint')">
      <text class="left font-medium">我的积分</text>
      <text class="point font-bold">{{ userInfo.point }}</text>
      <image class="icon-right" :src="rightIcon" mode="aspectFill" />
    </view>
    <!-- 菜单menu入口 -->
    <menu-list @click="goToMenuItem" />
  </view>
</template>

<script lang="ts" setup name="Mine">
import { inject } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import menuList, { MenuItem } from './menu-list.vue'
import userInfoCard from './user-info-card.vue'
import useTask from './task'
import useUser from './user'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>

const b = '121'
console.log('main --  a.b', b.ddd.ff)

// 头部背景图
let mineBgImg: string
// #ifdef H5
mineBgImg = gdp('mine-bg-h5.png')
// #endif
// #ifdef MP-WEIXIN
mineBgImg = gdp('mine-bg-wechat.png')
// #endif

// 右箭头icon
const rightIcon = gdp('icon-right.png')

/**
 * 用户信息
 */
const { isLogin, userInfo, pointSysId, goToLogin, refreshUserInfo, resetUserInfo } = useUser()

/**
 * 签到信息
 */
const { validityFlag, validityEnd, getTaskInfo } = useTask()

onShow(() => {
  isLogin.value ? refreshUserInfo() : resetUserInfo()
  getTaskInfo()
})
onPullDownRefresh(() => {
  if (isLogin.value) {
    refreshUserInfo()
  } else {
    uni.stopPullDownRefresh()
    goToLogin()
  }
})

/**
 * 跳转至我的积分
 */
const goToMyPoint = (flag: string) => {
  const nowTime = new Date().getTime()
  const endTime = new Date(validityEnd.value).getTime()
  if (flag === 'signIn' && !validityFlag.value && nowTime > endTime) {
    return uni.showToast({
      title: '任务已到期',
      duration: 2500,
      icon: 'none'
    })
  }
  uni.navigateTo({
    url: `/package-mine/pages/user-point/index?accountId=${userInfo.accountId}&systemId=${pointSysId.value}&functionFlag=${flag}`
  })
}

/**
 * menu跳转
 * @param menu
 * @returns
 */
const goToMenuItem = (menu: MenuItem) => {
  if (menu.link === '') {
    uni.showToast({
      icon: 'none',
      title: '功能开发中'
    })
    return
  }
  if (!isLogin.value) {
    return goToLogin()
  }
  uni.navigateTo({
    url: menu.link
  })
}
</script>

<style lang="scss" scoped>
.container {
  /*  #ifdef  H5  */
  padding-bottom: 150rpx;
  /*  #endif  */

  /*  #ifdef  MP-WEIXIN  */
  padding-bottom: 50rpx;
  /*  #endif  */
}

.top-layer {
  position: absolute;
  top: 0;
  width: 100%;

  /*  #ifdef  H5  */
  height: 260rpx;
  /*  #endif  */

  /*  #ifdef  MP-WEIXIN  */
  height: 420rpx;
  /*  #endif  */
  z-index: -1;

  &-bg {
    width: 100%;
    height: 100%;
  }
}

.user-point {
  height: 146rpx;
  padding: 0 48rpx 0 38rpx;
  border-bottom: 1rpx solid #e4e7ea;

  .left {
    margin-right: 16rpx;
    font-weight: 500;
    font-size: 32rpx;
  }

  .point {
    font-size: 36rpx;
    font-weight: bold;
    color: #4e6175;
  }

  .icon-right {
    width: 32rpx;
    height: 32rpx;
    margin-left: auto;
  }
}
</style>
