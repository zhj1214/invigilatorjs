<template>
  <view class="group-home" style="height: 100vh; overflow-y: auto">
    <page-header :is-transparent="isTransparent" :title="!isTransparent ? groupInfo.groupName : ''" class="page-header" @back="toBackTo">
      <view class="btn-area">
        <image class="add-icon" :src="isTransparent ? addIcon : addBlackIcon" mode="aspectFill" />
        <view class="add-icon-click-area" @click="toAddContent" />
      </view>
    </page-header>

    <scroll-view
      class="page-content"
      style="height: 100vh"
      scroll-y
      :refresher-triggered="isRefresh"
      refresher-enabled
      @scrolltolower="onScrolltolower"
      @scroll="onScroll"
      @refresherrefresh="onRefresh"
    >
      <view class="wallpaper">
        <image class="bg" mode="aspectFill" :src="groupInfo.wallpaperUrl" />
      </view>
      <view class="main">
        <view class="group-header">
          <view class="group-logo">
            <image mode="aspectFill" :src="groupInfo.logoUrl" />
          </view>
          <view class="group-title">
            <view class="title">{{ groupInfo.groupName }}</view>
            <view class="nums">
              <view class="item">
                <text style="color: #696b6c; margin-right: 11rpx">{{ groupInfo.contentCount }}</text>
                动态
              </view>
              <view class="item">
                <text style="color: #696b6c; margin-right: 11rpx">{{ groupInfo.peopleCount }}</text>
                圈友
              </view>
            </view>
          </view>
          <view v-if="isLogin" class="follow">
            <view v-if="groupInfo.approval === 2" class="btn isre">申请中</view>
            <view v-if="groupInfo.approval === 3 && userId !== groupInfo.groupLeader.accountId" class="btn isin">已加入</view>
            <view v-if="groupInfo.approval === 1 && userId !== groupInfo.groupLeader.accountId" class="btn" @click="toFollowGroupHandler">加入</view>
            <view v-if="userId === groupInfo.groupLeader.accountId" class="btn manage" @click="goToManage()">管理</view>
          </view>
          <view class="group-intro">
            <view class="intro" :class="introWrap ? 'intro-wrap' : 'intro-total'">{{ groupInfo.introduction }}</view>
            <view v-if="groupInfo.introduction.length > 20" class="intro-ctrl" @click="introWrap = !introWrap">{{ introWrap ? '详情' : '收起' }}</view>
          </view>
          <view class="group-member" @click="toMemberList">
            <view class="members">
              <image v-for="(item, key) of memberList" :key="key" :src="item.avatarUrl || defaultAvatar" mode="aspectFill" :style="{ 'z-index': 11 - key }" />
            </view>
            <image class="right-icon" mode="asceptFit" :src="iconRight" />
          </view>
        </view>

        <view class="group-content-list">
          <view v-for="item in contentList" :key="item.id" class="content-item">
            <content-card :info="item" type="groupHome" @update-follow="updateFollow" @get-content-list="getContentList" />
          </view>
          <view v-if="contentList && isEnd" class="list-no-more">-没有更多内容了哦-</view>
        </view>
      </view>
    </scroll-view>

    <approval-dialog ref="popupDialog" confirm="申请加入" confirm-color="#BABABA" title="加入理由" @confirm="toSubmitForm" @cancel="closePopup" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, reactive, inject, computed } from 'vue'
import contentCard from '@src/pages/community/components/content-card/content-card.vue'
import pageHeader from '@src/package-community/components/page-header/page-header.vue'
import { getHotContentList, getGroupFollowStatus, toFollowGroup, checkSubmitApproval, getMultiVote, getGroupDetail, getMemberList } from '@api/community'
import { pureAssign } from '@util/common'
import { relogin } from '@src/api/request'
import approvalDialog from '../../components/dialog/dialog.vue'
import { useUserStore } from '@src/pinia/user'
import { useAppStore } from '@src/pinia/app'

let groupId = ref('')
let introWrap = ref(true) // 简介是否收起

const toBackTo = () => {
  uni.navigateBack({
    delta: 1
  })
}

/**
 * 跳转圈内好友页面
 */
const toMemberList = () => {
  uni.navigateTo({ url: `/package-community/pages/group-members/group-members?groupId=${groupId.value}` })
}

export default defineComponent({
  name: 'GroupHome',
  components: {
    contentCard,
    pageHeader,
    approvalDialog
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const userStore = useUserStore()
    const appStore = useAppStore()
    // 没有滚动到下方时，page-header透明
    let isTransparent = ref(true)

    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [addIcon, iconRight, addBlackIcon, defaultAvatar] = gdp(['gray-add-icon.png', 'icon-right.png', 'add-btn-icon.png', 'icon-default-avatar.png'])

    /**
     * 用户信息
     */
    const isLogin = computed(() => appStore.isLogin)
    let userId = ref('')
    async function getUserInfo() {
      const user = await userStore.getUserInfo()
      userId.value = user.accountId
    }

    /**
     * 获取详情
     */
    let groupInfo: GroupInfo = reactive({
      id: '',
      groupName: '',
      logoUrl: '',
      contentCount: 0,
      peopleCount: 0,
      wallpaperUrl: '',
      introduction: '',
      groupLeader: {
        id: '',
        accountId: '',
        accountName: '',
        follow: false,
        avatarUrl: '',
        accountNamePinyin: '',
        first: '',
        groupId: ''
      },
      approval: 1,
      approvalWay: 1,
      follow: false
    })

    let memberList: Array<GroupMemberInfo> = reactive([])

    async function getDetail() {
      const detail = await getGroupDetail(groupId.value)
      const { data = [] } = await getMemberList(groupId.value, { orderBy: 2 })
      const members = [detail.groupLeader, ...data]
      pureAssign(groupInfo, { ...detail })
      if (isLogin.value) {
        const status = (await getGroupFollowStatus({ groupIds: groupId.value })) as AnyObject
        pureAssign(groupInfo, { approval: status[groupId.value] })
      }
      memberList.splice(0, memberList.length)
      memberList.push(...members)
    }

    /**
     * 获取圈子动态
     */
    let isEnd = ref(false)
    let isRefresh = ref(false)
    let pageNo: Ref<number> = ref(1)
    const contentList: ContentInfo[] = reactive([])
    const getContentList = async () => {
      const res = (await getHotContentList({
        // contentType: 2,
        like: true,
        follow: true,
        pageSize: 10,
        pageNo: pageNo.value,
        groupId: groupId.value
      })) as AnyObject
      pageNo.value === 1 && contentList.splice(0, contentList.length)
      contentList.push(...res.data)
      let contentIds: string[] = []
      contentList.forEach((item: AnyObject) => {
        if (item.contentType === 5) {
          contentIds.push(item.id)
        }
      })
      if (contentIds.length > 0) {
        getVote(contentIds)
      }
      isEnd.value = res.total === contentList.length
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
        contentList.forEach((item: AnyObject) => {
          for (var key in data) {
            if (item.id === key) {
              item.vote = data[key]
            }
          }
        })
      } catch {}
    }

    const onScrolltolower = () => {
      if (!isEnd.value) {
        pageNo.value++
        getContentList()
      }
    }
    const onRefresh = async () => {
      isRefresh.value = true
      pageNo.value = 1
      await getContentList()
      isRefresh.value = false
    }

    /**
     * 更新用户关注状态
     */
    async function updateFollow(id: string, status: boolean) {
      contentList.forEach((item: ContentInfo) => {
        item.authorId === id && (item.follow = status)
      })
    }

    /**
     * 管理圈子
     */
    function goToManage() {
      uni.navigateTo({ url: `/package-community/pages/group-manage/group-manage?groupId=${groupId.value}` })
    }

    const popupDialog: Ref<SpPopup | null> = ref(null)

    function openPopup() {
      popupDialog.value?.open()
    }
    function closePopup() {
      popupDialog.value?.close()
    }

    /**
     * 加入圈子
     */
    async function toFollowGroupHandler() {
      if (!isLogin.value) {
        relogin()
        return
      }
      // 申请加入
      if (groupInfo.approvalWay === 2) {
        openPopup()
        return
      }

      try {
        await toFollowGroup(groupInfo.id)
        uni.showToast({
          title: '成功加入圈子'
        })
        getDetail()
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 提交申请
     */
    async function toSubmitForm(reason: string) {
      if (reason.trim() === '') {
        uni.showToast({
          title: '请输入申请理由',
          duration: 1000,
          icon: 'none'
        })
        return
      }
      try {
        await checkSubmitApproval({ groupId: groupId.value, applyReason: reason })
        closePopup()
        groupInfo.approval = 2
        uni.showToast({
          title: '申请已提交'
        })
      } catch (error) {}
    }

    function toAddContent() {
      if (!isLogin.value) {
        relogin()
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/content-launch/content-launch?groupName=${groupInfo.follow ? groupInfo.groupName : ''}&groupId=${
          groupInfo.follow ? groupId.value : ''
        }&from=group`
      })
    }
    const onScroll = (e: { detail: { scrollTop: number } }) => {
      const scrollTop = e.detail.scrollTop
      isTransparent.value = scrollTop < 100
    }

    return {
      pageNo,
      groupId,
      groupInfo,
      isTransparent,
      addIcon,
      addBlackIcon,
      iconRight,
      defaultAvatar,
      isRefresh,
      isLogin,
      userId,
      introWrap,
      memberList,
      contentList,
      isEnd,
      toBackTo,
      toAddContent,
      onScrolltolower,
      onRefresh,
      onScroll,
      toMemberList,
      getUserInfo,
      updateFollow,
      getDetail,
      getContentList,
      goToManage,
      toFollowGroupHandler,
      toSubmitForm,
      closePopup
    }
  },
  // eslint-disable-next-line max-lines
  onLoad(option: { groupId: string }) {
    groupId.value = option.groupId
    this.isLogin && this.getUserInfo()
  },
  onShow() {
    this.getDetail()
    this.pageNo = 1
    this.getContentList()
  },
  beforeUnmount() {
    uni.removeStorage({ key: 'contentFrom' })
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
