<template>
  <view class="manage">
    <view class="title">选择管理模块</view>
    <view class="content" @click="goTouserManage">
      <view class="text">圈内用户管理</view>
      <image :src="comunityRight" style="width: 32rpx; height: 32rpx" />
    </view>
  </view>
</template>

<script lang="ts">
import { inject, defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'GroupManage',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
    const comunityRight = gdp('right.png')
    let groupId = ref('')

    function goTouserManage() {
      uni.navigateTo({
        url: `/package-community/pages/group-user/group-user?groupId=${groupId.value}`
      })
    }

    return {
      comunityRight,
      groupId,
      goTouserManage
    }
  },
  onLoad(option: { groupId: string }) {
    this.groupId = option.groupId
  }
})
</script>

<style lang="scss" scoped>
.manage {
  padding: 0 40rpx;

  .title {
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #292c2e;
    margin: 48rpx 0;
  }

  .content {
    background: #fff;
    border-radius: 2rpx;
    border: 1rpx solid #dbdcdd;
    display: flex;
    padding: 41rpx 40rpx;
    justify-content: space-between;
    align-items: center;

    .text {
      font-size: 32rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #292c2e;
    }
  }
}
</style>
