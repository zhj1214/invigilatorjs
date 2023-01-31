<template>
  <view class="group-member-list">
    <view class="search">
      <view class="search-bar flex jc aic" @click="toSearchPage">
        <image :src="searchIcon" />
        <text>搜索好友</text>
      </view>
    </view>

    <scroll-view class="scroll" scroll-y @scrolltolower="onScrolltolower">
      <view class="list">
        <view class="group-leader">
          <view class="title">圈主</view>
          <view class="item flex aic jsb">
            <view class="left flex aic" @click="toUserHome(groupLeader.accountId)">
              <image class="logo" :src="groupLeader.avatarUrl || defaultAvatarIcon" />
              <view class="name">{{ groupLeader.accountName }}</view>
            </view>
            <view class="right">
              <view v-if="!groupLeader.follow" class="btn" @click.stop="handleFollow(groupLeader)">关注</view>
              <view v-else class="btn follow-single" @click.stop="handleUnFollow(groupLeader)">已关注</view>
            </view>
          </view>
        </view>
        <view class="group-member">
          <view class="title">圈内成员</view>

          <view class="member-list">
            <view v-for="(item, index) of memberList" :key="item.id">
              <view v-if="index === 0 || (index > 0 && memberList[index - 1].first != item.first)" class="word-index">
                {{ item.first }}
              </view>
              <view class="item flex aic jsb" @click="toUserHome(item.accountId)">
                <view class="left flex aic">
                  <image class="logo" :src="item.avatarUrl || defaultAvatarIcon" />
                  <view class="name">{{ item.accountName }}</view>
                </view>
                <view v-if="item.accountId != userId" class="right">
                  <view v-if="!item.follow" class="btn" @click.stop="handleFollow(memberList[index])">关注</view>
                  <view v-else class="btn follow-single" @click.stop="handleUnFollow(memberList[index])">已关注</view>
                </view>
              </view>
            </view>
            <view v-if="isEnd" class="list-no-more">-没有更多内容了哦-</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="GroupMembers">
import { ref, inject, reactive, computed } from 'vue'
import { getGroupDetail, getMemberList, toFollowUser, toUnfollowUser } from '@api/community'
import { pureAssign } from '@util/common'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const appStore = useAppStore()
const userStore = useUserStore()

const groupId = ref('')
const toSearchPage = async () => {
  uni.navigateTo({ url: `/package-community/pages/group-members-search/group-members-search?groupId=${groupId.value}` })
}
/**
 * 跳转用户首页
 */
const toUserHome = async (accountId: string) => {
  uni.navigateTo({
    url: `/package-community/pages/user-home/user-home?id=${accountId}`
  })
}

/**
 * 用户信息
 */
const userId = ref('')
const isLogin = computed(() => appStore.isLogin)
async function getUserInfo() {
  const user = await userStore.getUserInfo()
  userId.value = user.accountId
}

type PageOptions = 'groupId'

onLoad((options: Record<PageOptions, string | undefined>) => {
  groupId.value = options.groupId as string
  isLogin.value && getUserInfo()
})

onShow(() => {
  isEnd.value = false
  pageNo.value = 1
  getMembers()
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [searchIcon, defaultAvatarIcon] = gdp(['icon-search.png', 'icon-default-avatar.png'])

// 获取成员
const groupMembers: { leader: GroupMemberInfo; members: Array<AnyObject> } = reactive({
  leader: { id: '', accountId: '', accountName: '', follow: false, avatarUrl: '', accountNamePinyin: '', first: '', groupId: '' },
  members: []
})
const groupLeader = groupMembers.leader
const memberList = groupMembers.members as GroupMemberInfo[]

/**
 * 获取圈子成员
 */
const pageNo = ref(1)
const isEnd = ref(false)
async function getMembers() {
  if (pageNo.value === 1) {
    const detail = await getGroupDetail(groupId.value)
    const { data = [], total: memberTotal } = await getMemberList(groupId.value, { orderBy: 2 })
    const members = [detail.groupLeader, ...data]
    groupMembers.members.splice(0)
    pureAssign(groupMembers.leader, members[0])

    members.slice(1).forEach((item: GroupMemberInfo) => {
      groupMembers.members.push({ ...item, first: /[a-z]/.test(item.accountNamePinyin[0]) ? item.accountNamePinyin[0] : '#' })
    })
    isEnd.value = groupMembers.members.length === memberTotal
  } else {
    const { data, total } = (await getMemberList(groupId.value, { orderBy: 2, pageNo: pageNo.value })) as AnyObject
    data.forEach((item: GroupMemberInfo) => {
      groupMembers.members.push({ ...item, first: /[a-z]/.test(item.accountNamePinyin[0]) ? item.accountNamePinyin[0] : '#' })
    })
    isEnd.value = groupMembers.members.length === total
  }
}

/**
 * 关注人
 */
async function handleFollow(user: GroupMemberInfo) {
  if (!isLogin.value) {
    return uni.navigateTo({ url: '/pages/login/index' })
  }
  await toFollowUser({ followAccountId: user.accountId })
  uni.showToast({
    title: '关注成功'
  })
  user.follow = true
}
/**
 * 取消关注人
 */
function handleUnFollow(user: GroupMemberInfo) {
  if (!isLogin.value) {
    return uni.navigateTo({ url: '/pages/login/index' })
  }
  uni.showModal({
    title: '提示',
    content: '确定取消关注Ta吗',
    confirmColor: '#292c2e',
    success: async (res) => {
      if (res.confirm) {
        await toUnfollowUser({ followAccountId: user.accountId })
        user.follow = false
        uni.showToast({
          title: '取消关注成功'
        })
      }
    }
  })
}

async function onScrolltolower() {
  if (!isEnd.value) {
    pageNo.value++
    getMembers()
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;

  &.aic {
    align-items: center;
  }

  &.jsb {
    justify-content: space-between;
  }

  &.jc {
    justify-content: center;
  }
}

image {
  display: block;
}

.search {
  padding: 20rpx 40rpx;

  .search-bar {
    width: 100%;
    height: 80rpx;
    background: #f2f3f3;
    border-radius: 4rpx;
    position: relative;

    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 8rpx;
    }

    text {
      font-size: 30rpx;
      color: #bababa;
    }

    .input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
    }
  }
}

.group-member-list {
  .group-leader {
    padding-bottom: 16rpx;
    border-bottom: 1px solid #e4e7ea;
    margin-bottom: 56rpx;
  }

  .scroll {
    height: calc(100vh - 120rpx - var(--window-top));
  }

  .list {
    width: 100%;
    padding: 20rpx 40rpx;
  }

  .title {
    font-size: 28rpx;
    color: #696b6c;
    padding-bottom: 8rpx;
  }

  .word-index {
    line-height: 69rpx;
    color: #292c2e;
    font-size: 28rpx;
  }

  .item {
    padding: 16rpx 0;
    margin-bottom: 16rpx;

    .logo {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .name {
      color: #1a1a1a;
      font-size: 28rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 400rpx;
    }

    .btn {
      width: 124rpx;
      height: 56rpx;
      font-size: 26rpx;
      line-height: 56rpx;
      text-align: center;
      background-color: #4e6175;
      color: #fff;

      &.follow-single,
      &.follow-mutual {
        background-color: #fff;
        color: #909ca8;
        border: 1px solid #f2f3f3;
      }
    }
  }

  .list-no-more {
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #909ca8;
    padding-bottom: 40rpx;
  }
}
</style>
