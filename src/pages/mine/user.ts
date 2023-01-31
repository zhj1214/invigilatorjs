import { reactive, computed, ref } from 'vue'
import { getVipUser, getVipUserPoint, getSystemId } from '@api/user'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const userStore = useUserStore()

const defaultUserInfo = {
  id: '',
  mobile: '',
  accountId: '',
  displayName: '',
  avatarUrl: '',
  level: undefined,
  levelName: '',
  percent: 0,
  coverImg: '',
  growth: undefined,
  nextGrowth: undefined,
  point: 0,
  follow: false
}

// 用户信息
const userInfo: User.Info = reactive(Object.assign({}, defaultUserInfo))

const systemId = ref('')
const pointSysId = ref('')

const useUser = () => {
  // 登录状态
  const isLogin = computed(() => useAppStore().isLogin)

  /**
   * 跳转至登录页
   */
  const goToLogin = () => {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }

  /**
   * 清空用户信息
   */
  const resetUserInfo = () => {
    Object.assign(userInfo, defaultUserInfo)
  }

  /**
   * 刷新用户信息、会员信息
   */
  const refreshUserInfo = async () => {
    try {
      // 获取用户信息
      userStore.$reset()
      const user = await userStore.getUserInfo()
      userInfo.accountId = user.accountId
      userInfo.displayName = user.displayName
      userInfo.avatarUrl = user.avatarUrl
      // 获取用户会员id
      const { memberSystemId, pointSystemId } = await getSystemId()
      systemId.value = memberSystemId
      pointSysId.value = pointSystemId
      // 获取用户会员积分信息
      const { point } = await getVipUserPoint(user.accountId, pointSystemId)
      userInfo.point = point
      userInfo.percent = Math.round((Number(userInfo.growth) / Number(userInfo.nextGrowth)) * 100)
      // 获取用户会员信息
      const vipInfo: Member.VipUserInfo = await getVipUser(user.accountId, memberSystemId)
      userInfo.level = vipInfo.order
      userInfo.levelName = vipInfo.levelName
      userInfo.coverImg = vipInfo.coverImg
      userInfo.growth = vipInfo.growth
      userInfo.nextGrowth = vipInfo.nextGrowth

      uni.stopPullDownRefresh()
    } catch {
      uni.stopPullDownRefresh()
    }
  }

  return {
    isLogin,
    userInfo,
    systemId,
    pointSysId,
    goToLogin,
    refreshUserInfo,
    resetUserInfo
  }
}

export default useUser
