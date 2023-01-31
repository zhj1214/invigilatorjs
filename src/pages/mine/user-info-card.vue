<template>
  <view class="flex-row user-info">
    <!-- 用户头像，提供默认头像 -->
    <image :src="userInfo.avatarUrl || userPortraitImg" class="user-portrait" @click="goToInfoEdit" />
    <!-- 登录后用户详细信息 -->
    <view v-if="isLogin" class="flex-col vip-info-box">
      <view class="flex-row items-center user-name">
        <text class="content font-bold ellipsis" @click="goToInfoEdit">{{ userInfo.displayName }}</text>
        <template v-if="taskId">
          <view v-if="todayCompletedFlag" class="btn signed-in" @click="goToMyPoint('noSignIn')">已签{{ continualDayNum }}天</view>
          <view v-else class="btn no-sign-in" @click="goToMyPoint('signIn')">签到</view>
        </template>
      </view>
      <view @click="goToGrade">
        <progress :percent="userInfo.percent" stroke-width="3" border-radius="1" activeColor="#4E6175" backgroundColor="#fff" class="member-progress" />
        <view class="member-info items-center">
          <view
            v-if="userInfo.level"
            class="member-level font-medium"
            :style="'background:url(' + userInfo.coverImg + ') no-repeat;background-size: 100% 100%;height:auto;width:fit-content'"
          >
            <text style="font-style: italic">V</text>
            <text style="font-size: 12rpx">{{ userInfo.level }}</text>
            <text style="margin-left: 8rpx">{{ userInfo.levelName }}</text>
          </view>
          <text class="member-growth font-regular">
            成长值 {{ userInfo.growth !== undefined ? userInfo.growth : '' }}
            <text v-show="userInfo.nextGrowth">/{{ userInfo.nextGrowth }}</text>
          </text>
          <!-- 右侧箭头icon -->
          <image :src="rightIcon" :class="['icon-right', isLogin ? 'login-status' : '']" />
        </view>
      </view>
    </view>
    <!-- 未登录显示立即登录 -->
    <view v-else class="login-btn font-medium" @click="goToLogin">
      <text>立即登录</text>
    </view>
  </view>
</template>

<script setup lang="ts" name="UserInfoCard">
import { inject } from 'vue'
import useTask from './task'
import useUser from './user'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
// 默认头像 右箭头icon
const [userPortraitImg, rightIcon] = gdp(['icon-default-avatar.png', 'icon-right.png'])

/**
 * 用户信息
 */
const { isLogin, userInfo, pointSysId, systemId, goToLogin } = useUser()

/**
 * 签到信息
 */
const { taskId, validityFlag, validityEnd, continualDayNum, todayCompletedFlag } = useTask()

/**
 * 跳转至会员等级
 */
const goToGrade = () => {
  uni.navigateTo({
    url: `/package-mine/pages/member-grade/index?accountId=${userInfo.accountId}&systemId=${systemId.value}`
  })
}

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
 * 跳转至编辑信息
 */
const goToInfoEdit = () => {
  isLogin.value
    ? uni.navigateTo({
        url: '/package-mine/pages/user-info/index'
      })
    : uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<style scoped lang="scss">
.user-info {
  width: 100%;

  /*  #ifdef  H5  */
  height: 260rpx;
  /*  #endif  */

  /*  #ifdef  MP-WEIXIN  */
  height: 290rpx;
  /*  #endif  */
  align-items: center;
  padding: 52rpx 40rpx 0;

  .user-portrait {
    border-radius: 50%;
    width: 128rpx;
    height: 128rpx;
  }

  .vip-info-box {
    flex: 1;
    margin-left: 33rpx;
  }

  .user-name {
    display: flex;
    justify-content: space-between;

    .content {
      color: #292c2e;
      font-size: 40rpx;
      font-weight: bold;
      line-height: 62rpx;
      white-space: nowrap;
      max-width: 400rpx;
    }

    .btn {
      height: 56rpx;
      line-height: 56rpx;
      padding: 0 24rpx;
      border-radius: 28rpx;
      font-size: 26rpx;
    }

    .no-sign-in {
      color: #fff;
      background: #4e6175;
      border: 2rpx solid #4e6175;
    }

    .signed-in {
      border: 2rpx solid #4e6175;
      color: #4e6175;
    }
  }

  .member-progress {
    width: 383rpx;
    margin: 16rpx 0;
  }

  .member-info {
    display: inline-flex;
    vertical-align: middle;

    .member-level {
      font-size: 24rpx;
      padding: 2rpx 6rpx;
      color: #fff;
      border-radius: 3px;
      margin-right: 16rpx;
    }

    .member-growth {
      color: #909ca8;
      font-size: 24rpx;
      margin-right: 8rpx;
    }

    .icon-tip {
      width: 28rpx;
      height: 28rpx;
    }
  }

  .login-btn {
    font-size: 36rpx;
    color: #4e6175;
    font-weight: 500;
  }

  .icon-right {
    width: 24rpx;
    height: 24rpx;
    margin-left: 8rpx;

    &.login-status {
      width: 32rpx;
      height: 32rpx;
      margin-left: auto;
    }
  }
}
</style>
