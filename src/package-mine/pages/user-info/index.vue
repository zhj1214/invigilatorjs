<template>
  <view class="edit">
    <view class="edit-header">
      <view class="status-bar" :style="'height:' + statusHeight + 'px'" />
      <view class="edit-header-content">
        <image class="edit-header-content-icon" :src="iconBack" mode="aspectFill" @click="handleBackClick" />
        <view class="edit-header-content-title">编辑资料</view>
      </view>
    </view>
    <view class="edit-avatar" @click="changeAvatar">
      <image class="edit-avatar-img" :src="userInfo.avatarUrl ? userInfo.avatarUrl : mineAvatar" alt="" />
      <view class="edit-avatar-btn">点击更换头像</view>
    </view>
    <view class="user-info">
      <view class="user-info-item">
        <text class="user-info-item-left">用户ID</text>
        <text class="user-info-item-right">{{ userInfo.accountId }}</text>
      </view>
      <view class="user-info-item" @click="handleNameClick">
        <text class="user-info-item-left">用户名</text>
        <view class="user-info-item-right">
          <view class="right ellipsis">{{ userInfo.displayName }}</view>
          <image class="user-info-item-right-img" :src="arrowRight" alt="" />
        </view>
      </view>
    </view>
    <avatar-cropper v-if="imageUrl" :url="imageUrl" @is-ok="onok" @oncancel="oncancel" />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUserInfo, uploadAvatar } from '@api/user'
import { pureAssign } from '@util/common'
import { useOssStore } from '@src/pinia/oss'
import AvatarCropper from '@src/package-mine/components/avatar-cropper/avatar-cropper.vue'
import { useAppStore } from '@src/pinia/app'

interface UserInfoEdit extends User.Info {
  birthday: string
}

const ossStore = useOssStore()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const arrowRight = gdp('icon-arrow-right.png')
const mineAvatar = gdp('icon-default-avatar.png')
const iconBack = gdp('icon-default-back.png')
const statusHeight = computed(() => useAppStore().statusBarHeight)
const userInfo: UserInfoEdit = reactive({
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
  mobile: '',
  birthday: '',
  followStatus: 0
})

onShow(() => {
  initUserInfo()
})

function handleNameClick() {
  uni.navigateTo({
    url: `/package-mine/pages/edit-username/index?name=${userInfo.displayName}`
  })
}
async function toMyUpload(rsp: { path: any }) {
  try {
    const res = (await uploadAvatar({
      fileType: 'image',
      // #ifdef MP-WEIXIN
      filePath: rsp.path,
      // #endif
      name: 'file',
      // #ifdef H5
      file: rsp.path,
      // #endif
      hideLoading: true
    })) as string
    userInfo.avatarUrl = res
    oncancel()
  } catch (error) {}
}
const imageUrl = ref('')
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (rst) => {
      // 设置url的值，显示控件
      imageUrl.value = rst.tempFilePaths[0]
    }
  })
}
const onok = async (data: { path: string }) => {
  // #ifdef MP-WEIXIN
  toMyUpload(data)
  // #endif
  // #ifdef H5
  const url = await ossStore.uploadFileToOSSH5({ name: 'png' }, data.path)
  const blob = await ossStore.toBlobURL2File(url as string)
  toMyUpload({ path: blob })
  uni.hideLoading()
  // #endif
}
const oncancel = () => {
  imageUrl.value = ''
}
async function initUserInfo() {
  try {
    const res = await getUserInfo()
    pureAssign(userInfo, res)
  } catch (err) {
    uni.showToast({
      title: '获取用户信息失败'
    })
  }
}
function handleBackClick() {
  uni.switchTab({
    url: '/pages/mine/index'
  })
}
</script>

<style lang="scss" scoped>
.edit {
  &-header {
    box-sizing: border-box;
    width: 100%;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 9999;

    .status-bar {
      width: 100%;
    }

    &-content {
      display: flex;
      margin-top: 20rpx;
      align-items: center;

      &-icon {
        width: 48rpx;
        height: 48rpx;
      }

      &-title {
        flex: 1;
      }
    }
  }

  &-avatar {
    width: 100%;
    text-align: center;
    margin-bottom: 90rpx;
    padding-top: 252rpx;

    &-img {
      margin: 0 auto;
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
    }

    &-btn {
      margin-top: 28rpx;
      height: 38rpx;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #495056;
      line-height: 38rpx;
    }
  }

  .user-info {
    &-item {
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #1a1a1a;
      height: 94rpx;
      padding: 0rpx 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-left {
        font-size: 30rpx;
        line-height: 45rpx;
      }

      &-right {
        display: flex;
        align-items: center;

        .right {
          padding-right: 10rpx;
          max-width: 500rpx;
        }

        &-img {
          position: relative;
          top: 2rpx;
          height: 32rpx;
          width: 32rpx;
        }
      }
    }
  }
}
</style>
