import { getUserInfo } from '@src/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      accountId: '',
      mobile: '',
      displayName: '',
      avatarUrl: ''
    }
  },
  actions: {
    async getUserInfo() {
      if (this.accountId) {
        return this.$state
      }
      const user = await getUserInfo()
      this.$patch({
        accountId: user.accountId,
        mobile: user.mobile,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl
      })
      return this.$state
    }
  }
})
