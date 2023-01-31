<template>
  <view class="username">
    <input v-model="displayName" class="username-input" :maxlength="32" focus placeholder="请输入用户名" />
    <view v-if="!displayName" class="username-error_tips">用户名不可为空</view>
    <view v-if="hasSpace" class="username-error_tips">用户名不可存在空格</view>
    <view class="username-button" @click="handleSubmit">保存</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { updateUserInfo } from '@api/user'
import { onLoad } from '@dcloudio/uni-app'

let displayName = ref('')
const hasSpace = ref(false)
const reg = /\s+/ // 匹配空格
watch(displayName, (newValue) => {
  hasSpace.value = false
  if (reg.test(newValue)) {
    hasSpace.value = true
  }
})
// 修改用户名
async function handleSubmit() {
  if (!displayName.value || hasSpace.value) {
    return
  }
  try {
    await updateUserInfo({ displayName: displayName.value })
    uni.navigateBack({})
  } catch (error) {}
}

onLoad((option: { name?: string }) => {
  displayName.value = option.name || ''
})
</script>

<style lang="scss">
.username {
  padding: 0 40rpx;

  &-input {
    padding: 31rpx 0 36rpx;
    height: 45rpx;
    font-size: 30rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 45rpx;
    border-bottom: 2rpx solid #e4e7ea;
  }

  &-error_tips {
    color: #e64340;
    line-height: 38rpx;
    margin-top: 4rpx;
  }

  &-button {
    width: 670rpx;
    height: 84rpx;
    line-height: 84rpx;
    background: #1a1a1a;
    border-radius: 1rpx;
    margin: 152rpx auto 0;
    font-size: 28rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #fff;
    text-align: center;
  }
}
</style>
