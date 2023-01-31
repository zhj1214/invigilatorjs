<template>
  <view class="group-member-list" style="height: 100vh; overflow-y: auto">
    <view class="list">
      <view v-for="(item, key) of userList" :key="key">
        <view v-if="userList[key - 1]?.first != item.first" class="word-index">
          {{ item.first }}
        </view>
        <view class="item flex aic jsb" @click="toUserHome(item.accountId)">
          <view class="left flex aic">
            <image class="logo" :src="item.avatarUrl || mineAvatar" />
            <view class="name">{{ item.accountName }}</view>
          </view>
          <view class="right">
            <view v-if="key !== 0" class="btn remove" @click.stop="remove(item)">移出圈子</view>
          </view>
        </view>
      </view>
      <!-- <view class="list-no-more" v-if="!loadMore">-没有更多内容了哦-</view> -->
    </view>
    <!-- <user-list :userList="userList" from="manage" @remove="remove"></user-list> -->
    <!-- <view class="user-list-no-more" v-if="!loadMore">-没有更多内容了哦-</view> -->

    <view class="foot" @click="getRecord">
      <view class="btn">审核记录</view>
    </view>
    <uni-popup ref="popup" type="center" @touchmove.stop.prevent>
      <pop-dialog :content="'确认要移除该用户吗'" @confirm="toUnfollowTa" @cancel="closePop" />
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { inject, defineComponent, ref, reactive } from 'vue'
import { removeUser, getMemberList, getManagePaging } from '@api/community'

export default defineComponent({
  name: '',

  components: {},

  props: {},

  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
    const mineAvatar = gdp('avatar.png')
    // 群员列表
    let userList = reactive([]) as Array<GroupMemberInfo>
    let pageNo = ref(1)
    let loadMore = ref(false)
    let groupLeader = reactive({}) as GroupMemberInfo // 群主信息
    let groupId = ref('')
    function toUnfollowTa() {
      console.log('do something')
    }

    function closePop() {
      console.log('do something')
    }

    function getRecord() {
      uni.navigateTo({
        url: `/package-community/pages/manage-record/manage-record?groupId=${groupId.value}`
      })
    }
    // 移出圈子
    function remove(item: GroupMemberInfo) {
      uni.showModal({
        title: '',
        content: '确定要移除该用户吗',
        confirmColor: '#000',
        success: (result) => {
          if (result.confirm) {
            removeUser({ accountId: item.accountId, groupId: item.groupId }).then((res: any) => {
              if (res === true) {
                let index = userList.findIndex((el) => el.accountId === item.accountId)
                userList.splice(index, 1)
                uni.showToast({
                  title: '移除成功',
                  duration: 1000,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
    function toGetManagePaging(id: string) {
      getManagePaging({
        pageNo: 1,
        pageSize: 999
      }).then((res: any) => {
        res.data.map((group: GroupInfo) => {
          if (group['id'] === id) {
            groupLeader = group['groupLeader']
          }
        })
        getUserList(id)
      })
    }
    function getUserList(id: string) {
      let sendData = {
        orderBy: 2,
        pageNo: pageNo.value,
        pageSize: 15
      }
      getMemberList(id, sendData).then((res: any) => {
        res.data.forEach((item: GroupMemberInfo) => {
          if (/[a-z]/.test(item.accountNamePinyin[0])) {
            item.first = item.accountNamePinyin[0]
          } else {
            item.first = '#'
          }
          userList.push(item)
        })
        // userList = userList.concat(res.data.data)
        if (pageNo.value === 1) {
          userList.unshift(groupLeader)
        }
        pageNo.value++
        loadMore.value = !(userList.length - 1 === res.data.total)
      })
    }

    // 跳至用户详情
    function toUserHome(accountId: string) {
      uni.navigateTo({ url: `/package-community/pages/user-home/user-home?id=${accountId}` })
    }

    return {
      mineAvatar,
      userList,
      pageNo,
      loadMore,
      groupLeader,
      groupId,
      getRecord,
      remove,
      getUserList,
      toGetManagePaging,
      toUnfollowTa,
      closePop,
      toUserHome
    }
  },

  onLoad(option: { groupId: string }) {
    this.groupId = option.groupId
  },

  onShow() {
    this.pageNo = 1
    this.userList.length = 0
    this.toGetManagePaging(this.groupId)
  },

  onReachBottom() {
    if (this.loadMore) {
      this.getUserList(this.groupId)
    }
  }
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
