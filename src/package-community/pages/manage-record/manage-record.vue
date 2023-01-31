<template>
  <view class="groupRecord">
    <view class="tab">
      <view v-for="(item, index) in tabList" :key="index" class="text" :class="activeTab === item.value ? 'active' : ''" @click="handleTabChange(item.value)">
        {{ item.name }}
        <view v-if="activeTab === item.value" class="line" />
      </view>
    </view>
    <view>
      <view v-for="(item, index) in dataList" :key="index" class="recordList">
        <view class="item">
          <view class="left">
            <image mode="aspectFill" :src="item.avatarUrl || mineAvatar" />
            <view class="name">{{ item.accountName }}</view>
          </view>
          <view class="right">
            <view v-if="item.approvalStatus === 1" class="btn">
              <view class="rejected" @click="handleRejectedAction(item.id)">驳回</view>
              <view class="pass" @click="handlePass(item.id)">通过</view>
            </view>
            <view v-if="item.approvalStatus === 2" class="time">于{{ item.finalApprovalTime }}通过</view>
          </view>
        </view>
        <view class="bottom" :style="styleChange(index)">
          <view class="time">
            <text class="title">申请理由：</text>
            <text class="content">{{ item.applyReason }}</text>
          </view>
        </view>
        <view v-if="activeTab === 3" class="bottom" :style="index === dataList.length - 1 ? '' : 'margin-bottom: 72rpx;'">
          <view class="reason">
            <text class="title">驳回理由：</text>
            <text class="content">{{ item.remark }}</text>
          </view>
          <view class="time">
            <text class="title">驳回时间：</text>
            <text class="content">{{ item.finalApprovalTime }}</text>
          </view>
        </view>
      </view>
      <!-- <view class="no-more" v-if="!loadMore">-没有更多内容了哦-</view> -->
    </view>
    <approval-dialog ref="popupDialog" confirm="确定" confirm-color="#BABABA" title="驳回理由" @confirm="handleConfirm" @cancel="close" />
  </view>
</template>

<script lang="ts">
import { inject, defineComponent, ref, reactive, computed, Ref } from 'vue'
import { toRejected, getGroupApprovalRecords, toApproved } from '@api/community'
import approvalDialog from '../../components/dialog/dialog.vue'

export default defineComponent({
  name: 'ManageRecord',
  components: {
    approvalDialog
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
    const mineAvatar = gdp('avatar.png')

    let tabList = [
      { name: '待审核', value: 1 },
      { name: '已通过', value: 2 },
      { name: '已驳回', value: 3 }
    ]
    let activeTab = ref(1)
    let height = '100vh'
    let loadMore = ref(false)
    let pageNo = ref(1)
    let dataList = reactive([]) as Array<GroupRecordInfo>
    let applyReason = ref('')
    let groupId = ref('')
    let id = ref('')
    const styleChange = computed(() => (index: any) => {
      return index === dataList.length - 1 ? '' : activeTab.value === 3 ? '' : 'margin-bottom: 72rpx;'
    })

    const popup: Ref<SpPopup | null> = ref(null)

    function openPopup(value: string) {
      applyReason.value = value
      popup.value?.open()
    }
    // 菜单切换
    function handleTabChange(value: number) {
      if (activeTab.value === value) {
        return
      }
      activeTab.value = value
      dataList.length = 0
      pageNo.value = 1
      handleApprovalRecord()
    }
    // 弹框选择取消
    function handleConfirm(e: string) {
      if (e === '') {
        uni.showToast({
          title: '请输入驳回理由',
          duration: 1000,
          icon: 'none'
        })
        return
      }
      let obj = {
        groupRecordIds: [id.value],
        remark: e || ''
      }
      toRejected(obj).then((res) => {
        if (res === 1) {
          uni.showToast({
            title: '审核已驳回',
            duration: 1000,
            icon: 'none'
          })
          pageNo.value = 1
          dataList.length = 0
          close()
          handleApprovalRecord()
        }
      })
    }
    function close() {
      popup.value?.close()
    }
    function handleApprovalRecord() {
      let obj = {
        approvalStatus: activeTab.value,
        groupId: groupId.value,
        pageNo: pageNo.value,
        pageSize: 10
      }
      getGroupApprovalRecords(obj).then((res: any) => {
        dataList.push(...res.data)
        pageNo.value++
        loadMore.value = !(dataList.length === res.data.total)
      })
    }
    // 通过
    function handlePass(val: string) {
      let obj = {
        groupRecordIds: [val]
      }
      toApproved(obj).then((res) => {
        if (res === 1) {
          uni.showToast({
            title: '审核已通过',
            duration: 1000,
            icon: 'none'
          })
          pageNo.value = 1
          dataList.length = 0
          handleApprovalRecord()
        }
      })
    }
    // 驳回
    function handleRejectedAction(accountId: string) {
      id.value = accountId
      popup.value?.open()
    }

    return {
      mineAvatar,
      tabList,
      activeTab,
      height,
      loadMore,
      pageNo,
      dataList,
      applyReason,
      groupId,
      id,
      openPopup,
      handleTabChange,
      handleConfirm,
      close,
      handlePass,
      styleChange,
      handleRejectedAction,
      handleApprovalRecord
    }
  },

  onLoad(option: { groupId: string }) {
    this.groupId = option.groupId
    this.handleApprovalRecord()
  },
  onReachBottom() {
    if (this.loadMore) {
      this.handleApprovalRecord()
    }
  }
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
