<template>
  <view class="task-list">
    <view v-for="(item, index) in taskList" :key="index" class="item">
      <image v-if="item.showFlag" :src="item.icon" class="icon" />
      <view class="task">
        <view class="task-name">
          {{ item.taskName }}
          <text v-if="item.completeTotalTimes > 1">({{ item.completedTimes }}/{{ item.completeTotalTimes }})</text>
        </view>
        <view v-if="item.taskDesc" class="task-des ellipsis-2">{{ item.taskDesc }}</view>
      </view>
      <view v-if="item.status === 3" class="com">已完成</view>
      <button
        v-else
        class="btn"
        :style="item.status === 2 || (nowDate > item.validityPeriodEnd && item.validityPeriodEnd) ? 'background: #BABABA;' : ''"
        @click="goToCom(item.terminalList, item.status, item.validityPeriodEnd, item.validityPeriodFlag)"
      >
        {{ btnText[item.status] }}
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup name="TaskList">
import { defineProps, reactive } from 'vue'

defineProps<{
  taskList: Member.TaskInfo[]
}>()

const nowDate = new Date().getTime()
const btnText = reactive({
  0: '去完成',
  1: '进行中',
  2: '已失效',
  3: '已完成'
}) as AnyObject
const platform = process.env.VUE_APP_PLATFORM as PlatformInfo
const TERMINAL_TYPE = {
  app: 4,
  'mp-weixin': 5,
  h5: 2
}

function goToCom(urlList: { redirectUrl: string; terminalType: number }[], taskStatus: number, endTime: number, flag: boolean) {
  if (taskStatus === 2 || taskStatus === 3 || (nowDate > endTime && !flag)) {
    return
  }
  let url = ''
  urlList.forEach((item: AnyObject) => {
    if (item.terminalType === TERMINAL_TYPE[platform]) {
      url = item.redirectUrl
    }
  })
  let arr = ['/pages/car/car', '/pages/life/life', '/pages/community/community', '/pages/mine/index']
  if (arr.includes(url)) {
    uni.switchTab({
      url: url
    })
  } else {
    uni.navigateTo({
      url: url
    })
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  .item {
    padding: 34rpx 0;
    margin: 0 40rpx;
    border-bottom: 1rpx solid #e4e7ea;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 16rpx;
    }

    .task {
      flex: 1;
      margin-right: 48rpx;

      .task-name {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #292c2e;
      }

      .task-des {
        margin-top: 16rpx;
        font-size: 26rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
        line-height: 38rpx;
      }
    }

    .com {
      text-align: center;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #4e6175;
      margin-right: 20rpx;

      image {
        margin-right: 6rpx;
        width: 28rpx;
        height: 28rpx;
        vertical-align: sub;
      }
    }

    .btn {
      background: #4e6175;
      border-radius: 2rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #fff;
      height: 64rpx;
      line-height: 64rpx;
      margin: 0;
    }
  }
}
</style>
