<template>
  <view class="audit-content">
    <view class="img-box"><image class="img" :src="auditRejectionIcon" /></view>
    <view class="page-title">审核未通过并被驳回</view>
    <view class="audit-content-item">
      <text class="label">驳回原因</text>
      <text class="value">{{ reason.remark }}</text>
    </view>
    <view class="audit-content-item">
      <text class="label">处理时间</text>
      <text class="value">{{ reason.createTime }}</text>
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
