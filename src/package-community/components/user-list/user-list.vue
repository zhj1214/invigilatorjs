<template>
  <view class="user-list">
    <view v-for="item in list" :key="item.id" class="user-item">
      <sp-avatar-info :src="item.avatarUrl" :title="item.accountName">
        <template #btn>
          <view class="follow-btn" :class="{ followed: item.follow }">{{ item.follow ? '已关注' : '关注' }}</view>
        </template>
      </sp-avatar-info>
    </view>
  </view>
</template>

<script>
import defineComponent from './index'
export default defineComponent
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
