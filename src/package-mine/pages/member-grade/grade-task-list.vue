<template>
  <view class="grade-task">
    <view class="title">成长任务</view>
    <view class="task-tab">
      <view v-for="(item, index) in taskTabList" :key="index" class="text" :class="activeTab === item.value ? 'active' : ''" @click="toTabChange(item.value)">
        {{ item.name }}
      </view>
    </view>

    <task-list :task-list="taskListData" />
  </view>
</template>

<script setup lang="ts" name="GradeTaskList">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserTask, getTaskType } from '@api/member'
import taskList from '../../components/task-list/index.vue'

let taskTabList: Member.TabInfo[] = reactive([])
const taskListData: Member.TaskInfo[] = reactive([])
let activeTab = ref('')
let pageTaskNo = ref(1)

onLoad(() => {
  queryTaskType()
})

async function queryTaskType() {
  try {
    const data = await getTaskType({ taskSceneCode: 'commGrowthScene' })
    activeTab.value = data[0].id
    queryUserTask()
    taskTabList.push(
      ...data.map((item: AnyObject) => {
        return {
          name: item.name,
          value: item.id
        }
      })
    )
  } catch (error) {}
}

function toTabChange(value: string) {
  if (activeTab.value === value) {
    return
  }
  activeTab.value = value
  taskListData.splice(0)
  pageTaskNo.value = 1
  queryUserTask()
}

async function queryUserTask() {
  try {
    const data = await getUserTask({
      taskTypeId: activeTab.value
    })
    taskListData.push(...data)
  } catch (error) {}
}
</script>

<style scoped lang="scss">
.grade-task {
  .title {
    font-size: 36rpx;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
    margin-bottom: 41rpx;
    padding-left: 40rpx;
    margin-top: 56rpx;
  }

  .task-tab {
    background: rgb(242 243 243 / 40%);
    padding: 0 40rpx;
    height: 96rpx;
    line-height: 96rpx;

    .text {
      margin-right: 72rpx;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #92969a;
      display: inline-block;

      &.active {
        font-weight: bold;
        color: #4e6175;
        font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      }
    }
  }

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
}
</style>
