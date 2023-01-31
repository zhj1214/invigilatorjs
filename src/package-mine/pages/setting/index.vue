<template>
  <view class="page-setting">
    <!-- 标题 -->
    <view class="title font-medium">
      <text>设置</text>
    </view>
    <!-- 设置菜单 -->
    <view class="menu font-regular flex-col items-center">
      <view v-for="item in menus" :key="item.name" class="menu-item flex-row items-center justify-between" @click="goToPage(item.link)">
        <text>{{ item.name }}</text>
        <image class="right-icon" :src="rightIcon" mode="asceptFit" />
      </view>
    </view>
    <view class="logout font-regular items-center justify-center" @click="handleLogout">退出登录</view>
  </view>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { logout } from '@src/api/user'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'
const appStore = useAppStore()
const userStore = useUserStore()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const rightIcon = gdp('icon-right.png')

const menus = [
  {
    name: '收货地址',
    link: '/package-mine/pages/address-list/index'
  },
  {
    name: '隐私条款',
    link: '/package-mine/pages/agreement/privacy-agreement'
  },
  {
    name: '用户协议',
    link: '/package-mine/pages/agreement/user-agreement'
  }
]

const goToPage = (url: string) => {
  uni.navigateTo({
    url
  })
}

const handleLogout = async () => {
  uni.showModal({
    title: '提示',
    confirmColor: '#292c2e',
    content: '确认要退出吗？',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({
          mask: true
        })
        try {
          await logout()
          uni.hideLoading()
          appStore.setLoginStatus(false)
          userStore.$reset()
          uni.removeStorageSync('token')
          uni.navigateBack({
            delta: 1
          })
        } catch {
          uni.hideLoading()
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-setting {
  padding: 8rpx 40rpx;
}

.title {
  font-size: 56rpx;
  font-weight: 500;
  color: #292c2e;
  padding: 28rpx 0 24rpx;
}

.menu-item {
  width: 100%;
  height: 126rpx;
  border-bottom: 1rpx solid #e4e7ea;
}

.right-icon {
  width: 32rpx;
  height: 32rpx;
}

.logout {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border-radius: 1rpx;
  border: 2rpx solid #1a1a1a;
  font-size: 28rpx;
  color: #1a1a1a;
  margin-top: 152rpx;
}
</style>
