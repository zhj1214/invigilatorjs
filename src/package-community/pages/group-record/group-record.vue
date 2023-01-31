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
            <image mode="aspectFill" :src="item.groupLogoUrl" />
          </view>
          <view class="right">
            <view>
              <view class="title">{{ item.groupName }}{{ item.groupStatus === 2 ? '（已下架）' : '' }}</view>
              <view class="note">
                <view class="text">申请时间：{{ item.createTime }}</view>
              </view>
            </view>
            <view class="btn">
              <view class="apply" @click="openPopup(item.applyReason)">申请理由</view>
              <!-- <button class="follow">申请理由</button> -->
            </view>
          </view>
        </view>
        <view v-if="item.approvalStatus === 3" class="bottom">
          <view class="reason">
            <text class="title">驳回理由：</text>
            <text class="content">{{ item.remark }}</text>
          </view>
          <view class="time">
            <text class="title">驳回时间：</text>
            <text class="content">{{ item.finalApprovalTime }}</text>
          </view>
        </view>
        <view v-if="activeTab === 2" class="bottom">
          <view class="time">
            <text class="title">通过时间：</text>
            <text class="content">{{ item.finalApprovalTime }}</text>
          </view>
        </view>
      </view>
      <!-- <view class="no-more" v-if="!loadMore">-没有更多内容了哦-</view> -->
    </view>
    <uni-popup ref="popup" :pop-style="'z-index:2000'" class="uniPopup" type="center" @touchmove.stop.prevent="() => {}">
      <pop-dialog class="pop-dialog" :content="applyReason" :show-cancel="false" title="申请理由" @confirm="handleConfirm" />
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { getApprovalRecord } from '@api/community'
import popDialog from '../../components/pop-dialog/pop-dialog.vue'
export default defineComponent({
  name: 'GroupRecord',
  components: {
    'pop-dialog': popDialog
  },
  setup() {
    let activeTab = ref(2)
    let loadMore = ref(false)
    let pageNo = ref(1)
    let dataList = reactive([]) as Array<GroupRecordInfo>
    let applyReason = ref('')
    const instance = getCurrentInstance()

    function openPopup(reason: string) {
      applyReason.value = reason
      const popup = instance?.refs.popup as { open: Fn }
      popup.open()
    }
    // 菜单切换
    function handleTabChange(value: number) {
      if (activeTab.value === value) {
        return
      }
      activeTab.value = value
      pageNo.value = 1
      dataList.length = 0
      getApprovalRecordList()
    }
    // 弹框选择取消
    function handleConfirm() {
      const popup = instance?.refs.popup as { close: Fn }
      popup.close()
    }
    function getApprovalRecordList() {
      let obj = {
        approvalStatus: activeTab.value,
        pageNo: pageNo.value,
        pageSize: 10
      }
      getApprovalRecord(obj).then((res: any) => {
        dataList.push(...res.data)
        pageNo.value++
        loadMore.value = !(dataList.length === res.data.total)
      })
    }

    return {
      tabList: [
        { name: '已通过', value: 2 },
        { name: '申请中', value: 1 },
        { name: '已驳回', value: 3 }
      ],
      activeTab,
      loadMore,
      pageNo,
      dataList,
      applyReason,
      openPopup,
      handleTabChange,
      handleConfirm,
      getApprovalRecordList
    }
  },
  onLoad() {
    this.getApprovalRecordList()
  },
  onReachBottom() {
    if (this.loadMore) {
      this.getApprovalRecordList()
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
