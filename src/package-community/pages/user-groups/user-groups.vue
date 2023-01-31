<template>
  <view class="user-groups">
    <sp-tabs underline :menus="tabs" @on-click="handleTabChange" />
    <view class="user-groups-content" :class="{ 'has-footer': currentTab !== 3 }">
      <group-list
        v-show="currentTab === 1"
        ref="groupListRef"
        class="group-list"
        :group-list="userGroups"
        :is-end="isEnd"
        :group-follow-status="groupFollowStatus"
        :list-type="pageType"
        :selected-id="selectedGroupId"
        @selected-group="handleSelectedGroup"
        @on-refresh="onRefresh"
        @on-scrolltolower="onScrolltolower"
        @un-follow-group="handleUnFollowGroup"
      />

      <group-list
        v-if="pageType !== 'choose'"
        v-show="currentTab === 2"
        ref="manageGroupListRef"
        :group-list="myManageGroups"
        :is-end="myManagePageNoIsEnd"
        @on-refresh="onRefreshMyManageGroups"
        @on-scrolltolower="onScrolltolowerMyManageGroups"
      />

      <all-group-list
        v-show="currentTab === 3"
        ref="allGroupRef"
        class="all-group"
        :list-type="pageType"
        :is-recommond="true"
        :selected-id="selectedGroupId"
        @selected-group="handleSelectedGroup"
      />
    </view>

    <view v-if="pageType !== 'choose' && currentTab !== 3 && userId === loginUserId" class="footer">
      <view class="footer-btn" @click="goToRecord">查看申请记录</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, inject, Ref } from 'vue'
import { getGroupList, getGroupFollowStatus, getManagePaging } from '@api/community'
import GroupList from '../../components/group-list/group-list.vue'
import AllGroupList from '@src/package-community/components/all-group-list/all-group-list.vue'
import { useUserStore } from '@src/pinia/user'
import { useAppStore } from '@src/pinia/app'

export default defineComponent({
  name: 'UserGroups',
  components: {
    GroupList,
    AllGroupList
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
    const notChooseIcon = gdp('not-choose-group.png')

    // 页面模式 choose --> 选择圈子
    let pageType = ref('')
    let selectedGroupId = ref('') //选中的圈子id

    let userId = ref('')
    let isLogin = computed(() => useAppStore().isLogin)
    let tabs = computed(() => {
      if (userId.value === loginUserId.value) {
        return pageType.value === 'choose'
          ? [
              { name: '我加入的', value: 1 },
              { name: '推荐圈子', value: 3 }
            ]
          : [
              { name: '我加入的', value: 1 },
              { name: '我管理的', value: 2 },
              { name: '推荐圈子', value: 3 }
            ]
      } else {
        return [
          { name: 'Ta加入的', value: 1 },
          { name: '推荐圈子', value: 3 }
        ]
      }
    })
    /**
     * 用户信息
     */
    let loginUserId = ref('')
    async function getUserInfo() {
      const user = await useUserStore().getUserInfo()
      loginUserId.value = user.accountId
      if (userId.value === loginUserId.value && pageType.value !== 'choose') {
        getMyManageGroups()
      }
    }

    let currentTab = ref(1)
    function handleTabChange(type: number) {
      currentTab.value = type
    }

    /**
     * 获取圈子列表
     */
    let userGroups: Array<GroupInfo> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)
    let groupFollowStatus: { [key: string]: number } = reactive({})
    async function getUserGroupList() {
      let list = (await getGroupList(userId.value, { pageNo: pageNo.value })) as AnyObject
      // 获取圈子关注状态
      const status = isLogin.value ? await getGroupFollowStatus({ groupIds: list.data.map((item: GroupInfo) => item.id).join(',') }) : []
      groupFollowStatus = Object.assign(groupFollowStatus, status)
      if (pageNo.value === 1) {
        userGroups.splice(0)
        pageType.value === 'choose' &&
          userGroups.push({
            id: '0',
            groupName: '不发布到圈子',
            logoUrl: notChooseIcon,
            approvalWay: 0,
            introduction: '',
            follow: false,
            groupLeader: {
              id: '',
              accountId: '',
              accountName: '',
              follow: false,
              avatarUrl: '',
              accountNamePinyin: '',
              first: '',
              groupId: ''
            }
          })
      }

      // 我加入的圈子过滤掉我管理的圈子
      if (userId.value === loginUserId.value && pageType.value !== 'choose') {
        userGroups.push(...list.data.filter((i: AnyObject) => i.groupLeader.accountId !== loginUserId.value))
      } else {
        userGroups.push(...list.data)
      }
      isEnd.value = userGroups.length === list.total
    }

    /**
     * 加载更多
     */
    async function onScrolltolower() {
      if (!isEnd.value) {
        pageNo.value++
        getUserGroupList()
      }
    }

    const groupListRef: Ref<typeof GroupList | null> = ref(null)
    const manageGroupListRef: Ref<typeof GroupList | null> = ref(null)
    const allGroupRef: Ref<typeof AllGroupList | null> = ref(null)

    /**
     * 刷新
     */
    async function onRefresh() {
      pageNo.value = 1
      await getUserGroupList()
      groupListRef.value?.updateRefresh(false)
    }

    /**
     * 获取我管理的圈子列表
     */
    let myManagePageNo = ref(1)
    let myManagePageNoIsEnd = ref(false)
    let myManageGroups: Array<GroupInfo> = reactive([])
    async function getMyManageGroups() {
      try {
        const res = (await getManagePaging({ pageNo: myManagePageNo.value, pageSize: 20 })) as AnyObject
        myManagePageNo.value === 1 && myManageGroups.splice(0)
        myManageGroups.push(...res.data)
        myManagePageNoIsEnd.value = myManageGroups.length === res.total
      } catch (error) {}
    }

    /**
     * 加载更多
     */
    async function onScrolltolowerMyManageGroups() {
      if (!myManagePageNoIsEnd.value) {
        myManagePageNo.value++
        getMyManageGroups()
      }
    }

    /**
     * 刷新
     */
    async function onRefreshMyManageGroups() {
      myManagePageNo.value = 1
      await getMyManageGroups()
      manageGroupListRef.value?.updateRefresh(false)
    }

    /**
     * 跳转我的审核记录页面
     */
    function goToRecord() {
      uni.navigateTo({ url: `/package-community/pages/group-record/group-record` })
    }

    /**
     * 退出圈子 我加入的圈子 退出圈子删除数据
     */
    async function handleUnFollowGroup(groupId: string) {
      if (userId.value === loginUserId.value && pageType.value !== 'choose') {
        const targetIndex = userGroups.findIndex((i) => i.id === groupId)
        userGroups.splice(targetIndex, 1)
      }
    }

    onMounted(() => {
      getUserGroupList()
      // #ifdef  MP-WEIXIN
      allGroupRef.value?.getGroupTypeList()
      // #endif
    })

    /**
     * 选择圈子 退出上一页
     */
    function handleSelectedGroup(info: GroupInfo) {
      uni.setStorageSync('currentGroupId', info.id)
      uni.setStorageSync('currentGroupName', info.groupName)
      uni.navigateBack({ delta: 1 })
    }

    return {
      pageType,
      selectedGroupId,
      isLogin,
      userId,
      loginUserId,
      tabs,
      currentTab,
      userGroups,
      isEnd,
      getUserInfo,
      onRefresh,
      onScrolltolower,
      handleTabChange,
      groupFollowStatus,
      myManageGroups,
      myManagePageNoIsEnd,
      onScrolltolowerMyManageGroups,
      onRefreshMyManageGroups,
      goToRecord,
      handleUnFollowGroup,
      handleSelectedGroup
    }
  },
  async onLoad(option: { id: string; type?: string; selected?: string }) {
    this.userId = option.id
    this.pageType = option.type || ''
    this.selectedGroupId = option.selected || ''

    this.isLogin && (await this.getUserInfo())
    uni.setNavigationBarTitle({
      title: this.userId === this.loginUserId ? '我的圈子' : 'Ta的圈子'
    })
  },
  onShow() {
    document.body.style.overflow = 'hidden'
  },
  onHide() {
    document.body.style.overflow = ''
  },
  // #ifdef  H5
  mounted() {
    // 解决safari浏览器底部操作栏遮挡问题
    document.body.style.overflow = 'hidden'
    function toSafariHacks() {
      let windowsVH = window.innerHeight
      const node = document.querySelector('.user-groups') as AnyObject
      node?.style.setProperty('--vh', windowsVH + 'px')
    }
    toSafariHacks()
    window.addEventListener('resize', function () {
      toSafariHacks()
    })
  },
  onUnload() {
    document.body.style.overflow = ''
  }
  // #endif
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
