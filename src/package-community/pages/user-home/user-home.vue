<template>
  <view class="user-home">
    <view class="user-home-header">
      <page-header :is-transparent="isTransparent" :title="!isTransparent ? userDetail.displayName : ''" @back="toBackTo" />

      <!-- 背景 -->
      <view class="user-home-header-bg"><image class="bg-img" :src="bgH5" mode="aspectFill" /></view>
      <view class="user-home-header-content">
        <view class="user-info justify-between">
          <sp-avatar-info class="user-info-card" :src="userDetail.avatarUrl" :title="userDetail.displayName" size="large">
            <view v-if="medalCount > 0" class="medal" @click="goToMedal">
              <image :src="medal" class="medal-icon" />
              <text>{{ loginUserId !== userDetail.accountId ? 'Ta的徽章' : '我的徽章' }}</text>
              <image :src="medalLeftIcon" class="left-icon" />
            </view>
          </sp-avatar-info>
          <view v-if="loginUserId !== userDetail.accountId" class="follow-btn" :class="{ follow: userDetail.follow }" @click="updateFollow">
            {{ userDetail.follow ? '已关注' : '关注' }}
          </view>
        </view>
      </view>
    </view>

    <view v-if="loginUserId !== userDetail.accountId" class="user-home-main">
      <!-- 用户 -->
      <view v-if="loginUserId !== userDetail.accountId" class="user-data-tab">
        <view class="tab-item" @click="goUserListPage('关注')">
          <text class="num">{{ userDetail.followerCount }}</text>
          <text class="label">关注</text>
        </view>
        <view class="tab-item" @click="goUserListPage('粉丝')">
          <text class="num">{{ userDetail.fansCount }}</text>
          <text class="label">粉丝</text>
        </view>
      </view>

      <!-- 用户数据列表 -->
      <view class="user-data-list">
        <sp-title-bar class="sp-title-bar" title="Ta的圈子" btn-text="更多" @on-click="goUserGroupListPage" />
        <view v-if="!userGroups.length" class="group-list-none font-normal">暂无圈子</view>
        <scroll-view v-else scroll-x class="group-scroll" @touchmove.stop>
          <view class="group-list">
            <view v-for="item in userGroups" :key="item.id" class="sp-title-image" @click="goCurrentGroup(item.id)">
              <title-image :title="item.groupName" :image="item.logoUrl" />
            </view>
          </view>
        </scroll-view>

        <view class="content-list-title font-bold">
          Ta的动态
          <text class="user-content-count">{{ userContentInfo.total }}</text>
        </view>
        <view class="user-content-list">
          <view v-for="item in userContentInfo.list" :key="item.id" class="user-content-item">
            <content-card :info="item" class="user-content-card" :show-follow-btn="false" type="userHome" @get-user-contents="getUserContents" />
          </view>
          <view v-if="userContentInfo.list.length && isEnd" class="user-content-no-more font-normal">-没有更多内容了哦-</view>
          <view v-if="userContentInfo.list.length === 0" class="user-content-none font-normal">暂无更多内容</view>
        </view>
      </view>
    </view>

    <!-- 我的 -->
    <view v-else class="user-home-main my">
      <view class="user-data-tab">
        <view class="tab-item" @click="goMyContensPage">
          <text class="num">{{ userDetail.contentCount }}</text>
          <text class="label">我的发布</text>
        </view>
        <view class="tab-item" @click="goUserListPage('我的关注')">
          <text class="num">{{ userDetail.followerCount }}</text>
          <text class="label">我的关注</text>
        </view>
        <view class="tab-item" @click="goUserListPage('我的粉丝')">
          <text class="num">{{ userDetail.fansCount }}</text>
          <text class="label">我的粉丝</text>
        </view>
      </view>
      <view class="tab-title font-bold">我的应用</view>
      <view class="user-data-tab">
        <view class="tab-item" @click="goUserGroupListPage">
          <view class="num">
            <image class="tab-item-icon" :src="myGroupIcon" mode="aspectFill" />
          </view>
          <text class="label">我的圈子</text>
        </view>
        <view class="tab-item" @click="goMyFollowsPage">
          <view class="num">
            <image class="tab-item-icon" :src="myFollowIcon" mode="aspectFill" />
          </view>
          <text class="label">我的关注</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, reactive } from 'vue'
import { getUserDetail, getGroupList, getContentList, toFollowUser, toUnfollowUser, getMultiVote, toFindUserMedal, toFindLocalUserMedal } from '@api/community'
import TitleImage from '@src/pages/community/components/title-image/title-image.vue'
import ContentCard from '@src/pages/community/components/content-card/content-card.vue'
import PageHeader from '../../components/page-header/page-header.vue'
import { relogin } from '@src/api/request'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const defaultUserInfo = {
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
  follow: false,
  followStatus: 0
}

export default defineComponent({
  name: 'UserHome',
  components: {
    TitleImage,
    ContentCard,
    PageHeader
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    // 登录信息
    const isLogin = computed(() => useAppStore().isLogin)
    // 没有滚动到下方时，page-header透明
    let isTransparent = ref(true)

    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [bgH5, bgWechat, myGroupIcon, myFollowIcon, medal, medalLeftIcon] = gdp([
      'mine-bg-h5.png',
      'mine-bg-wechat.png',
      'my-group-icon.png',
      'my-follow-icon.png',
      'medal.png',
      'icon-medal-left.png'
    ])

    let userId = ref('')

    /**
     * 获取登录信息
     */
    let loginUserId = ref('')
    async function getLoginInfo() {
      const user = await useUserStore().getUserInfo()
      loginUserId.value = user.accountId
    }

    /**
     * 获取用户信息
     */
    let userDetail: Record<string, any> = reactive({ ...defaultUserInfo })
    async function getUserInfo() {
      try {
        const res = await getUserDetail(userId.value)
        Object.keys(res).forEach((key) => {
          userDetail[key] = res[key]
        })

        if (loginUserId.value !== userDetail.accountId) {
          getUserGroups()
          pageNo.value = 1
          getUserContents()
        }
        getUserMedal()
      } catch (error) {}
    }

    /**
     * 获取用户圈子
     */
    let userGroups: GroupInfo[] = reactive([])
    async function getUserGroups() {
      try {
        const res = (await getGroupList(userId.value, { pageNo: 1 })) as AnyObject
        userGroups.splice(0)
        userGroups.push(...res.data)
      } catch (error) {}
    }

    /**
     * 获取用户动态
     */
    let pageNo = ref(1)
    let isEnd = ref(false)
    const userContentInfo: { total: number; list: Array<AnyObject> } = reactive({ total: 1, list: [] })
    async function getUserContents() {
      try {
        let params = {
          // contentType: 2,
          like: true,
          pageSize: 10,
          pageNo: pageNo.value
        }
        const res = (await getContentList(userId.value, { ...params })) as AnyObject
        userContentInfo.total = res.total
        pageNo.value === 1 && userContentInfo.list.splice(0)
        userContentInfo.list.push(...res.data)
        let contentIds: string[] = []
        userContentInfo.list.forEach((item: AnyObject) => {
          if (item.contentType === 5) {
            contentIds.push(item.id)
          }
        })
        if (contentIds.length > 0) {
          getVote(contentIds)
        }
        isEnd.value = userContentInfo.list.length === res.total
      } catch (error) {}
    }

    async function getVote(ids: string[]) {
      try {
        const data = (await getMultiVote({ contentIds: ids.toString() })) as AnyObject
        let idList: string[] = []
        for (let key in data) {
          idList.push(key)
          for (let o in data[key]) {
            if (o === 'options') {
              data[key][o].map((item: AnyObject) => {
                item.checked = false
              })
            }
          }
        }
        userContentInfo.list.forEach((item: AnyObject) => {
          for (var key in data) {
            if (item.id === key) {
              item.vote = data[key]
            }
          }
        })
      } catch {}
    }

    /**
     * 跳转用户关注、粉丝列表
     */
    function goUserListPage(type: string) {
      uni.navigateTo({
        url: `/package-community/pages/user-list/user-list?id=${userId.value}&type=${type}`
      })
    }

    /**
     * 跳转用户圈子列表页面
     */
    function goUserGroupListPage() {
      uni.navigateTo({
        url: `/package-community/pages/user-groups/user-groups?id=${userId.value}`
      })
    }

    /**
     * 关注、取消关注用户
     */
    async function updateFollow() {
      if (!isLogin.value) {
        relogin()
        return
      }
      const { follow, accountId } = userDetail
      if (!follow) {
        const res = (await toFollowUser({ followAccountId: accountId })) as boolean
        uni.showToast({
          title: '关注成功'
        })
        userDetail.follow = res
      } else {
        uni.showModal({
          title: '提示',
          content: '确定取消关注Ta吗',
          confirmColor: '#292c2e',
          success: async (result) => {
            if (result.confirm) {
              const res = (await toUnfollowUser({ followAccountId: accountId })) as AnyObject
              userDetail.follow = false
              uni.showToast({
                title: '取消关注成功'
              })
            }
          }
        })
      }
    }

    /**
     * 跳转圈子首页
     */
    const goCurrentGroup = (groupId: string) => {
      uni.navigateTo({
        url: `/package-community/pages/group-home/group-home?groupId=${groupId}`
      })
    }

    /**
     * 去我的发布页面
     */
    const goMyContensPage = () => {
      uni.navigateTo({
        url: `/package-community/pages/my-content-list/my-content-list`
      })
    }

    /**
     * 去我的关注页面
     */
    const goMyFollowsPage = () => {
      uni.navigateTo({
        url: `/package-community/pages/my-follow/my-follow`
      })
    }

    /**
     * 返回
     */
    // 暂时简单处理
    function toBackTo() {
      uni.navigateBack({
        delta: 1
      })
    }

    function goToMedal() {
      uni.navigateTo({
        url: `/package-mine/pages/medal/index?accountId=${userDetail.accountId}&ifCurUser=${loginUserId.value === userDetail.accountId}`
      })
    }

    let medalCount = ref(0)
    async function getUserMedal() {
      if (loginUserId.value === userDetail.accountId) {
        const data = (await toFindLocalUserMedal()) as AnyObject
        medalCount.value = data.medalCount
      } else {
        const data = (await toFindUserMedal({ accountId: userDetail.accountId })) as AnyObject
        medalCount.value = data.parentCategoryList.length
      }
    }
    return {
      medalCount,
      medal,
      medalLeftIcon,
      isLogin,
      userId,
      bgH5,
      bgWechat,
      myGroupIcon,
      myFollowIcon,
      userDetail,
      getUserInfo,
      getUserGroups,
      userGroups,
      pageNo,
      // eslint-disable-next-line max-lines
      isEnd,
      getUserContents,
      userContentInfo,
      goUserGroupListPage,
      goUserListPage,
      toBackTo,
      updateFollow,
      getLoginInfo,
      loginUserId,
      goCurrentGroup,
      isTransparent,
      goMyContensPage,
      goMyFollowsPage,
      goToMedal,
      getUserMedal
    }
  },
  onLoad(option: { id: string }) {
    this.userId = option.id
  },
  onShow() {
    this.isLogin && this.getLoginInfo()
    this.getUserInfo()
  },
  onPullDownRefresh() {
    this.getUserInfo()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getUserContents()
    }
  },
  onPageScroll(e: { scrollTop: number }) {
    this.isTransparent = e.scrollTop < 100
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
