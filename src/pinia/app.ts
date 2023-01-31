import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      isLogin: !!uni.getStorageSync('isLogin'),
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight || 0
    }
  },
  actions: {
    setLoginStatus(loginStatus: boolean) {
      this.isLogin = loginStatus
      try {
        uni.setStorageSync('isLogin', loginStatus)
      } catch (error) {
        console.log('登录状态保存失败')
      }
    }
  }
})
