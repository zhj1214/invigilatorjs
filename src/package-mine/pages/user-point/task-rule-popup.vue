<template>
  <uni-popup ref="taskRulePopupModel" type="bottom" @touchmove.stop.prevent>
    <view class="content-box">
      <view class="popup-header">
        <text class="title">任务规则</text>
        <uni-icons type="closeempty" size="48" color="#939EAA" @click="close" />
      </view>
      <scroll-view scroll-y class="popup-content">
        <view>
          <view class="rule-title">1、签到奖励</view>
          任务有效期内，用户第1天签到可获得1积分，连续第2天签到可获得2积分，连续第3天签到可获得3积分，连续第4天签到可获得4积分，连续第5天签到可获得5积分，连续第6天签到可获得6积分，连续≥7天时，每天签到可获得7积分。
        </view>
        <view>
          <view class="rule-title">2、连续签到说明</view>
          任务有效期内，连续N天每天签到，中间没有间断的日期，视为连续签到N天。
        </view>
        <view>
          <view class="rule-title">3、签到中断说明</view>
          任务有效期内，某一天没有进行签到时，第二天重新按照第1天开始计算连续签到天数和奖励。
        </view>
        <view>
          <view class="rule-title">4、任务结束说明</view>
          任务结束后，不可继续通过连续签到获得奖励。
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts" name="TaskRulePopup">
import { ref, Ref } from 'vue'
const taskRulePopupModel: Ref<SpPopup | null> = ref(null)
const open = () => {
  taskRulePopupModel.value?.open()
}
const close = () => {
  taskRulePopupModel.value?.close()
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  padding: 0 32rpx calc(18rpx + env(safe-area-inset-bottom));
  height: 55vh;

  .popup-header {
    width: 100%;
    height: 100rpx;
    position: fixed;
    top: 0;
    left: 0;
    padding: 22rpx 32rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;

    .title {
      font-weight: bold;
      color: #292c2e;
      font-size: 40rpx;
    }
  }

  .popup-content {
    height: calc(100% - 100rpx);
    padding-top: 122rpx;
    font-size: 24rpx;
    color: #92969a;
    line-height: 48rpx;

    .rule-title {
      font-size: 26rpx;
      color: #1a1a1a;
    }
  }
}
</style>
