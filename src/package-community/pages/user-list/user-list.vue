<template>
  <view class="user-list">
    <template v-if="userList.length == 0">
      <view class="follow-none">
        <image :src="followNoneIcon" />
        <view class="tip">{{ userType === 'follow' ? '还没有关注的人' : '还没有粉丝' }}</view>
      </view>
    </template>
    <view v-for="(item, index) in userList" :key="item.id" class="user-list-item justify-between">
      <view class="user-info" @click="goUserHome(item)">
        <sp-avatar-info :src="item.avatarUrl" :title="item.displayName" />
      </view>
      <view v-if="loginUserId !== item.accountId" class="follow-btn" :class="{ follow: item.followStatus && item.followStatus !== 1 }" @click="updateFollow(item, index)">
        {{ formatText(item) }}
      </view>
    </view>
    <view v-if="userList.length && isEnd" class="user-list-no-more font-normal">-已无更多好友-</view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, inject, onMounted } from 'vue'
import { getFollowList, toFollowUser, toUnfollowUser } from '@api/community'
import { relogin } from '@src/api/request'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

export default defineComponent({
  name: 'UserList',
  // eslint-disable-next-line max-lines-per-function
  setup() {
    // 登录信息
    const isLogin = computed(() => useAppStore().isLogin)

    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [followNoneIcon] = gdp(['follow-none-icon.png'])

    /**
     * 获取用户信息
     */
    let loginUserId = ref('')
    async function getUserInfo() {
      const user = await useUserStore().getUserInfo()
      loginUserId.value = user.accountId
    }

    let userId = ref('')
    let userType = ref('')

    const formatText = (item: User.Info) => {
      return item.followStatus === 3 ? '互相关注' : item.followStatus === 2 ? '已关注' : '关注'
    }
    /**
     * 获取用户列表
     */
    let userList: Array<User.Info> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)

    async function getUserList() {
      try {
        const res = (await getFollowList(userId.value, userType.value, {
          pageNo: pageNo.value,
          pageSize: 20
        })) as AnyObject
        pageNo.value === 1 && userList.splice(0)
        userList.push(...res.data)
        isEnd.value = userList.length === res.total
      } catch (error) {}
    }

    /**
     * 关注人
     * followStatus: 1：关注 2：已关注 3：互相关注
     */
    async function updateFollow(user: User.Info, index: number) {
      if (!isLogin.value) {
        relogin()
        return
      }
      const { followStatus, accountId } = user
      if (followStatus === 1) {
        const res = (await toFollowUser({ followAccountId: accountId })) as number
        uni.showToast({
          title: '关注成功'
        })
        user.followStatus = res
      } else {
        uni.showModal({
          title: '提示',
          content: '确定取消关注Ta吗',
          confirmColor: '#292c2e',
          success: async (result) => {
            if (result.confirm) {
              const res = (await toUnfollowUser({ followAccountId: user.accountId })) as AnyObject
              user.followStatus = 1
              uni.showToast({
                title: '取消关注成功'
              })

              // 我的关注页面 取消关注 删除数据
              if (loginUserId.value === userId.value && userType.value === 'follow') {
                userList.splice(index, 1)
              }
            }
          }
        })
      }
    }

    /**
     * 跳转用户首页
     */
    const goUserHome = (user: { accountId: string }) => {
      uni.navigateTo({
        url: `/package-community/pages/user-home/user-home?id=${user.accountId}`
      })
    }

    onMounted(() => {
      isLogin.value && getUserInfo()
      getUserList()
    })

    return {
      isLogin,
      formatText,
      loginUserId,
      getUserInfo,
      userId,
      userType,
      userList,
      pageNo,
      isEnd,
      getUserList,
      updateFollow,
      goUserHome,
      followNoneIcon
    }
  },
  onLoad(option: { id: string; type: string }) {
    this.userId = option.id
    this.userType = option.type.includes('关注') ? 'follow' : 'fans'
    uni.setNavigationBarTitle({ title: option.type.length === 2 ? `Ta的${option.type}` : option.type })
  },
  onPullDownRefresh() {
    this.isEnd = false
    this.pageNo = 1
    this.getUserList()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getUserList()
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
