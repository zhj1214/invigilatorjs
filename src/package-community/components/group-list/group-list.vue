<template>
  <scroll-view
    :scroll-y="scrollY"
    :style="{ height: height }"
    :refresher-triggered="isRefresh"
    refresher-enabled
    class="group-list-scroll"
    @scrolltolower="onScrolltolower"
    @refresherrefresh="onRefresh"
  >
    <view class="group-list" :class="{ 'all-group-page': isAllGroup }">
      <view v-if="groupList && groupList.length === 0" class="group-list-blank">暂无圈子</view>
      <view v-for="(item, key) in groupList" :key="key" class="group-item" @click="goGroupHome(item)">
        <image :src="item.logoUrl" mode="" class="group-logo" />
        <view class="info">
          <view class="group-name ellipsis-2">{{ item.groupName }}</view>
          <view v-show="listType !== 'choose'" class="group-member-num">
            <image :src="iconPersons" mode="" class="icon" />
            <text>{{ item.peopleCount }}</text>
          </view>
        </view>

        <!-- 选择 -->
        <view v-if="showFollowBtn && listType === 'choose'">
          <view v-if="selectedId === item.id" class="follow-btn selected">已选</view>
          <view v-else class="follow-btn" @click.stop="toSelectGroup(item)">
            {{ otherFollowStatus(item) }}
          </view>
        </view>

        <view v-if="showFollowBtn && listType !== 'choose'">
          <view v-if="item.groupLeader.accountId !== loginUserId" class="follow-btn" :class="{ follow: followStatus[item.id] === 3 }" @click.stop="toJoinOrOutGroup(item)">
            {{ setFollowStatus(item) }}
          </view>

          <!-- 我管理的圈子 -->
          <view v-if="item.groupLeader.accountId === loginUserId" class="follow-btn follow" @click.stop="toManageGroup(item.id)">{{ isRecommond ? '已加入' : '管理' }}</view>
        </view>
      </view>
      <view v-if="groupList.length && isEnd" class="group-list-no-more">-已无更多内容-</view>
    </view>

    <approval-dialog ref="popupDialog" confirm="申请加入" confirm-color="#BABABA" title="加入理由" @confirm="toSubmitForm" @cancel="close" />
  </scroll-view>
</template>

<script lang="ts">
import { defineComponent, inject, ref, reactive, watch, computed, getCurrentInstance, onMounted, PropType, Ref } from 'vue'
import { toFollowGroup, toUnfollowGroup, checkSubmitApproval } from '@src/api/community'
import { relogin } from '@src/api/request'
import ApprovalDialog from '../dialog/dialog.vue'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

export default defineComponent({
  name: 'GroupList',
  components: { ApprovalDialog },
  props: {
    groupList: {
      type: Array as PropType<Array<GroupInfo>>,
      default: Array
    },
    height: {
      type: String,
      default: '100%'
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    groupFollowStatus: {
      type: Object,
      default: () => ({})
    },
    showFollowBtn: {
      type: Boolean,
      default: true
    },
    // 列表类型 show: 展示 choose: 选择
    listType: {
      type: String,
      default: 'show'
    },
    // 选中的圈子ID
    selectedId: {
      type: String,
      default: ''
    },
    isAllGroup: {
      type: Boolean,
      default: false
    },
    // 是否为推荐圈子
    isRecommond: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onRefresh', 'onScrolltolower', 'unFollowGroup', 'selectedGroup', 'showDialog'],
  // eslint-disable-next-line max-lines-per-function
  setup(props, { emit }) {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
    const iconPersons = gdp('icon-persons.png')
    let isLogin = computed(() => appStore.isLogin)
    const instance = getCurrentInstance()

    const setFollowStatus = computed(() => (item: GroupInfo) => {
      return followStatus[item.id] === 3
        ? currentRoute.includes('user-groups')
          ? props.isRecommond
            ? '已加入'
            : '退出圈子'
          : '已加入'
        : followStatus[item.id] === 2
        ? '申请中'
        : '加入'
    })

    const otherFollowStatus = computed(() => (item: GroupInfo) => {
      return followStatus[item.id] === 3 || item.id === '0' ? '选择' : followStatus[item.id] === 2 ? '申请中' : '选择并加入'
    })

    //获取当前页面信息
    const pages = getCurrentPages()
    const currentRoute = pages[pages.length - 1].route as string
    let scrollY = ref(true)

    /**
     * 用户信息
     */
    let loginUserId = ref('')
    async function getUserInfo() {
      const user = await userStore.getUserInfo()
      loginUserId.value = user.accountId
    }

    /**
     * 加载更多
     */
    async function onScrolltolower() {
      emit('onScrolltolower')
    }

    /**
     * 刷新
     */
    let isRefresh = ref(false)
    async function onRefresh() {
      isRefresh.value = true
      emit('onRefresh')
    }

    /**
     * 更新刷新状态 解决父组件修改值
     */
    function updateRefresh(bool: boolean) {
      isRefresh.value = bool
    }

    watch(
      () => props.groupList,
      () => {
        isRefresh.value = false
      },
      { deep: true }
    )

    // 存储关注状态
    let followStatus: AnyObject = reactive({})
    watch(
      () => props.groupFollowStatus,
      (newVal) => {
        Object.keys(newVal).forEach((key) => {
          followStatus[key] = newVal[key]
        })
      },
      { deep: true }
    )
    const popupDialog: Ref<SpPopup | null> = ref(null)

    /**
     * 加入、退出圈子
     */
    let approvalId = ref('')
    async function toJoinOrOutGroup(info: GroupInfo) {
      if (!isLogin.value) {
        relogin()
        return
      }
      // 申请加入
      if (info.approvalWay === 2 && followStatus[info.id] === 1) {
        approvalId.value = info.id
        popupDialog.value?.open()
        scrollY.value = false
        emit('showDialog', true)
        return
      }
      if (followStatus[info.id] === 3 && currentRoute === 'package-community/pages/user-groups/user-groups' && !props.isRecommond) {
        uni.showModal({
          title: '提示',
          content: '确定退出圈子吗',
          confirmColor: '#292c2e',
          success: async (res) => {
            if (res.confirm) {
              await toUnfollowGroup(info.id)
              followStatus[info.id] = 1
              emit('unFollowGroup', info.id)
              uni.showToast({
                title: '已退出圈子'
              })
            }
          }
        })
        return
      }

      try {
        if (followStatus[info.id] === 1) {
          await toFollowGroup(info.id)
          uni.showToast({
            title: '成功加入圈子'
          })
          followStatus[info.id] = 3
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 跳转圈子首页
     */
    function goGroupHome(info: GroupInfo) {
      if (!info['id'] || info['id'] === '0') {
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/group-home/group-home?groupId=${info.id}`
      })
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
        await checkSubmitApproval({ groupId: approvalId.value, applyReason: reason })
        close()
        followStatus[approvalId.value] = 2
        uni.showToast({
          title: '申请已提交'
        })
      } catch (error) {}
    }

    function close() {
      popupDialog.value?.close()
      scrollY.value = true
      emit('showDialog', false)
    }

    /**
     * 管理圈子
     */
    function toManageGroup(id: string) {
      if (props.isRecommond) {
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/group-manage/group-manage?groupId=${id}`
      })
    }

    /**
     * 选择圈子
     */
    function toSelectGroup(info: GroupInfo) {
      if (info.id !== '0' && followStatus[info.id] !== 3) {
        toJoinOrOutGroup(info)
        return
      }
      emit('selectedGroup', info)
    }

    onMounted(() => {
      isLogin.value && getUserInfo()
    })
    return {
      onScrolltolower,
      onRefresh,
      iconPersons,
      isRefresh,
      followStatus,
      toJoinOrOutGroup,
      goGroupHome,
      toSubmitForm,
      close,
      isLogin,
      getUserInfo,
      loginUserId,
      toManageGroup,
      toSelectGroup,
      currentRoute,
      otherFollowStatus,
      updateRefresh,
      setFollowStatus,
      scrollY
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
