<template>
  <view class="all-group" :class="{ 'vh-hight': currentRoute === 'package-community/pages/all-group/all-group' }">
    <!-- 左侧圈子类型列表 -->
    <group-types-list class="type-list" :class="{ 'is-show-dialog': isShowDialog }" :group-types="data.groupTypes" :height="height" @on-click="updateGroupType" />
    <!-- 右侧圈子列表 -->
    <group-list
      ref="group-list"
      class="group-list"
      is-all-group
      :is-recommond="isRecommond"
      :group-list="data.groupList"
      :is-end="isEnd"
      :show-follow-btn="currentTypeCode !== '0'"
      :group-follow-status="groupFollowStatus"
      :height="height"
      :list-type="listType"
      :selected-id="selectedId"
      @on-refresh="onRefresh"
      @on-scrolltolower="onScrolltolower"
      @selected-group="toSelectGroup"
      @show-dialog="toShowDialog"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, getCurrentInstance } from 'vue'
import groupTypesList from '@src/package-community/components/group-types-list/group-types-list.vue'
import groupList from '@src/package-community/components/group-list/group-list.vue'
import { getGroupTypes, getAllGroupList, getMyGroupList, getGroupFollowStatus } from '@src/api/community'
import { useAppStore } from '@src/pinia/app'

export default defineComponent({
  name: 'AllGroupList',
  components: {
    groupTypesList,
    groupList
  },
  props: {
    height: {
      type: String,
      default: '100%'
    },
    listType: {
      // 列表类型 show: 展示 choose: 选择
      type: String,
      default: 'show'
    },
    // 选中的圈子ID
    selectedId: {
      type: String,
      default: ''
    },
    // 是否为推荐圈子
    isRecommond: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectedGroup'],
  // eslint-disable-next-line max-lines-per-function
  setup(props, { emit }) {
    let isLogin = computed(() => useAppStore().isLogin)
    let instance = getCurrentInstance()

    //获取当前页面信息
    const pages = getCurrentPages()
    const currentRoute = pages[pages.length - 1].route

    let data: { groupTypes: Array<AnyObject>; groupList: Array<GroupInfo> } = reactive({ groupTypes: [], groupList: [] })
    let currentTypeCode = ref('')
    /**
     * 获取圈子类型数据
     */
    async function getGroupTypeList() {
      // 全部圈子页面登陆状态显示我加入的
      const groupTypes = isLogin.value && currentRoute === 'package-community/pages/all-group/all-group' ? [{ groupTypeName: '我加入的', groupTypeCode: '0' }] : []
      const types = (await getGroupTypes()) as Array<AnyObject>
      data.groupTypes = [...groupTypes, ...types]
      currentTypeCode.value = data.groupTypes[0].groupTypeCode
      getGroupList()
    }
    /**
     *  修改圈子类型
     */
    function updateGroupType(code: string) {
      currentTypeCode.value = code
      isEnd.value = false
      pageNo.value = 1
      getGroupList()
    }

    /**
     * 获取圈子列表
     */
    let pageNo = ref(1)
    let isEnd = ref(false)
    let groupFollowStatus: { [key: string]: number } = reactive({})
    async function getGroupList() {
      let list = null
      // 获取我加入的圈子
      if (currentTypeCode.value === '0') {
        list = (await getMyGroupList({ pageNo: pageNo.value })) as AnyObject
      } else {
        list = (await getAllGroupList({ pageNo: pageNo.value, groupTypeCode: currentTypeCode.value })) as AnyObject
        // 获取圈子关注状态
        const status = isLogin.value ? await getGroupFollowStatus({ groupIds: list.data.map((item: GroupInfo) => item.id).join(',') }) : []
        groupFollowStatus = Object.assign(groupFollowStatus, status)
      }
      pageNo.value === 1 && data.groupList.splice(0)
      data.groupList.push(...list.data)
      isEnd.value = data.groupList.length === list.total
    }
    /**
     * 加载更多
     */
    async function onScrolltolower() {
      if (!isEnd.value) {
        pageNo.value++
        getGroupList()
      }
    }

    /**
     * 刷新
     */
    async function onRefresh() {
      pageNo.value = 1
      await getGroupList()
      const updateRefresh = instance?.refs['group-list'] as { updateRefresh: (arg: boolean) => void }
      updateRefresh.updateRefresh(false)
    }

    /**
     * 选择圈子
     */
    function toSelectGroup(info: GroupInfo) {
      emit('selectedGroup', info)
    }

    let isShowDialog = ref(false)
    function toShowDialog(bool: boolean) {
      isShowDialog.value = bool
    }

    getGroupTypeList()
    return {
      data,
      currentTypeCode,
      updateGroupType,
      getGroupTypeList,
      isEnd,
      groupFollowStatus,
      onRefresh,
      onScrolltolower,
      currentRoute,
      toSelectGroup,
      toShowDialog,
      isShowDialog
    }
  },
  onHide() {
    document.body.style.overflow = ''
  },
  activated() {
    this.getGroupTypeList()
    // #ifdef  H5
    document.body.style.overflow = 'hidden'
    // #endif
  },
  // #ifdef  H5
  mounted() {
    // 解决safari浏览器底部操作栏遮挡问题
    if (this.currentRoute === 'package-community/pages/all-group/all-group') {
      document.body.style.overflow = 'hidden'
      function toSafariHacks() {
        let windowsVH = window.innerHeight
        const allGroup = document.querySelector('.all-group') as AnyObject
        allGroup?.style.setProperty('--vh', windowsVH + 'px')
      }
      toSafariHacks()
      window.addEventListener('resize', function () {
        toSafariHacks()
      })
    }
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
