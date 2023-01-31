<template>
  <view class="flex-col container">
    <sp-header status-bar-bg="white">
      <view class="community-header">
        <view class="community-header-avator" @click="handleAvatorClick">
          <image class="image-round" :src="isLogin ? userInfo.avatarUrl || defaultAvatarImg : defaultAvatarImg" mode="aspectFill" />
        </view>
        <view class="community-header-search">
          <view class="search-bar" @click="toSearch">
            <image :src="searchICon" mode="aspectFill" class="search-icon" />
            <text>功能开发中</text>
          </view>
        </view>
      </view>
      <sp-tabs :menus="rootMenu" @on-click="changeTab">
        <image :src="addBtnIcon" mode="aspectFill" class="add-btn" @click="toAddContent" />
      </sp-tabs>
    </sp-header>

    <view class="flex-col group-4">
      <view class="flex-col line-tabs">
        <!-- 社群 -->
        <community-page v-if="activeMenu === '1'" ref="communityPage" />

        <!-- 资讯 -->
        <information-page v-if="activeMenu === '2'" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, Ref, reactive, defineComponent, inject, computed, getCurrentInstance, nextTick } from 'vue'
import community, { Community } from './community/community.vue'
import information from './information/information.vue'
import { getUserDetail } from '@api/community'
import { relogin } from '@src/api/request'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const userStore = useUserStore()

const defaultUserInfo = {
  mobile: '',
  id: '',
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
  followStatus: 0,
  follow: false
}

export default defineComponent({
  name: 'CommunityTab',
  components: {
    'community-page': community,
    'information-page': information
  },
  props: {
    name: String
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [defaultAvatarImg, addBtnIcon, searchICon] = gdp(['icon-default-avatar.png', 'add-btn-icon.png', 'icon-search.png'])

    const a = '121'
    console.log('const .a.b', a.b.c)

    const instance = getCurrentInstance()
    /**
     * 初始化数据
     */
    async function initData() {
      nextTick(() => {
        const communityInstance = instance?.refs.communityPage as Community
        communityInstance.isRefresh = true
      })
    }

    const isLogin = computed(() => useAppStore().isLogin)
    let userInfo: User.Info = reactive({ ...defaultUserInfo })
    /**
     * 获取用户信息
     */
    async function getUserInfo() {
      const user = await userStore.getUserInfo()
      getCommunityUserDetail(user.accountId)
    }

    async function getCommunityUserDetail(accountId: string) {
      try {
        const res = await getUserDetail(accountId)
        userInfo = Object.assign(userInfo, res)
      } catch {
        userInfo = { ...defaultUserInfo }
      }
    }

    /**
     * 点击用户头像
     */
    async function handleAvatorClick() {
      if (!isLogin.value) {
        relogin()
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/user-home/user-home?id=${userInfo.accountId}`
      })
    }

    /**
     * 跳转搜索页
     */
    function toSearch() {
      uni.showToast({
        icon: 'none',
        title: '功能开发中'
      })
    }

    /**
     * 跳转发布动态页
     */
    function toAddContent() {
      if (!isLogin.value) {
        relogin()
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/content-launch/content-launch`
      })
    }

    const rootMenu = reactive([
      { name: '社群', value: '1' },
      { name: '资讯', value: '2' }
    ])
    const activeMenu: Ref<string> = ref(rootMenu[0].value)

    const changeTab = (menuVal: string) => {
      activeMenu.value = menuVal
    }

    return {
      isLogin,
      defaultAvatarImg,
      addBtnIcon,
      searchICon,
      userInfo,
      activeMenu,
      rootMenu,
      getUserInfo,
      toSearch,
      toAddContent,
      changeTab,
      initData,
      handleAvatorClick
    }
  },
  onShow() {
    this.isLogin && this.getUserInfo()
    const previewImage = uni.getStorageSync('previewImage')
    !previewImage ? this.initData() : uni.setStorageSync('previewImage', false)
  },
  onHide() {
    uni.setStorageSync('previewImage', false)
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
