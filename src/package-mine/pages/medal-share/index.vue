<template>
  <view class="medal-share">
    <view class="medal-share-header">
      <page-header :is-transparent="isTransparent" :title="'分享图预览'" :icon-right="medalRightIcon" @back="toBackTo" />
      <view class="medal-share-header-bg"><image class="bg-img" :src="bgMedal" mode="aspectFill" /></view>
    </view>
    <view id="posterContent" class="medal-share-content">
      <view class="name">{{ medalInfo.medalName }}</view>
      <rich-text :nodes="medalInfo.description" class="desc" />
      <image :src="medalInfo.medalIconUrl" class="medal-img" />
      <view class="time">{{ formatDate(medalInfo.gainTime) }}获得</view>
      <view class="avatar">
        <image :src="userInfo.avatarUrl || userPortraitImg" class="avatar-img" />
        <view class="nick">{{ userInfo.displayName }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import pageHeader from '../../components/page-header/page-header.vue'
import { inject, ref, reactive } from 'vue'
import { onPageScroll, onLoad } from '@dcloudio/uni-app'
import { pureAssign } from '@util/common'
import { getMedalDetails } from '@src/api/community'
import { formatDate } from '@util/date-time'
import { useUserStore } from '@src/pinia/user'

const userStore = useUserStore()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [bgMedal, medalRightIcon, userPortraitImg] = gdp(['bg-medal.png', 'icon-medal-right.png', 'icon-default-avatar.png'])
// 没有滚动到下方时，page-header透明
let isTransparent = ref(true)
onPageScroll((e: { scrollTop: number }) => {
  isTransparent.value = e.scrollTop < 100
})
let medalId = ref('')
let accountId = ref('')
onLoad((option) => {
  medalId.value = option.medalId as string
  accountId.value = option.accountId as string
  getUserInfo()
  getMedalDetail()
})
// 用户信息
const userInfo: User.Info = reactive({
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
  follow: false,
  followStatus: 0
})

/**
 * 获取用户信息、会员信息
 */
const getUserInfo = async () => {
  try {
    // 获取用户信息
    userStore.$reset()
    const user = await userStore.getUserInfo()
    pureAssign(userInfo, user)
  } catch {}
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

let medalInfo: MedalInfo = reactive({
  id: '',
  medalName: '',
  ifLightUp: false,
  medalIconUrl: '',
  gainTime: '',
  description: '',
  gainPopupDescription: ''
})
const getMedalDetail = async () => {
  const data = (await getMedalDetails({ medalId: medalId.value, accountId: accountId.value })) as AnyObject
  pureAssign(medalInfo, { ...data })
  console.log(data)
}
</script>

<style scoped lang="scss">
.medal-share {
  background: #31383c 100% 100%;
  height: 100vh;

  &-header {
    height: 489rpx;
    position: relative;

    &-bg {
      width: 100%;
      height: 100%;

      .bg-img {
        width: 100%;
        height: 100%;
      }
    }

    &-content {
      position: absolute;
      top: 110rpx;
      left: 40rpx;
      display: flex;
      align-items: center;

      .img {
        width: 128rpx;
        height: 128rpx;
        border: 2rpx solid #edeff1;
        border-radius: 50%;
      }

      .user {
        margin-left: 33rpx;

        .name {
          font-size: 40rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #fff;
          margin-bottom: 20rpx;
        }

        .member-level {
          font-size: 24rpx;
          padding: 2rpx 6rpx;
          color: #fff;
          border-radius: 3px;
          margin-right: 16rpx;
        }
      }
    }
  }

  &-content {
    position: relative;
    top: -250rpx;
    padding-top: 53rpx;
    margin: 0 88rpx;
    background: #1d2228;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 70%;

    .name {
      font-size: 40rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      color: #fff;
      margin-bottom: 10rpx;
    }

    .desc {
      padding: 0 108rpx;
      font-size: 26rpx;
      color: #8e8e8e;
    }

    .medal-img {
      margin-top: 84rpx;
      width: 360rpx;
      height: 360rpx;
      margin-bottom: 33rpx;
    }

    .time {
      font-size: 26rpx;
      color: #bdbdbd;
      margin-bottom: 142rpx;
    }

    .avatar {
      height: 216rpx;
      background: #fff;
      width: 100%;
      position: absolute;
      bottom: 0;

      .avatar-img {
        position: absolute;
        top: -64rpx;
        width: 128rpx;
        height: 128rpx;
        border: 2rpx solid #edeff1;
        border-radius: 50%;
        left: calc(50% - 60rpx);
      }

      .nick {
        text-align: center;
        margin-top: 76rpx;
        font-size: 36rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        color: #292c2e;
      }
    }
  }

  &-foot {
    position: relative;
    top: -120rpx;
    margin: 0 88rpx;
    height: 108rpx;
    line-height: 108rpx;
    background: #2a7cf3;
    border-radius: 4rpx;
    text-align: center;
    font-size: 36rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    color: #fff;
  }
}
</style>
