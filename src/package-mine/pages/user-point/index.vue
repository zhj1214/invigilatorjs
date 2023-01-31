<template>
  <view class="user-point">
    <view class="page-header-box">
      <view class="page-header-outer" :style="{ backgroundImage: 'url(' + headerBgImg + ')' }">
        <page-header :is-transparent="isTransparent" :title="'我的积分'" :icon-right="iconArrowLeftWhite" @back="toBackTo" />
        <view class="point-relative-box">
          <view class="point-total">{{ pointNum }}</view>
          <view class="info-box">
            <text @click="gotoDetail">积分明细</text>
            <text class="line" />
            <text @click="goToPointRule">积分规则</text>
          </view>
        </view>
      </view>
      <!-- 签到 -->
      <sign-in-box />
    </view>
    <view class="content">
      <view v-for="(item, key) in userTaskList.data" :key="key" class="point-task">
        <view class="title">
          {{ item['name'] }}
        </view>
        <view class="list">
          <task-list :task-list="item['tasks']" />

          <view v-if="item['tasks'] && item['tasks'].length === 0" class="no-more">暂无任务</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { getVipUserPoint } from '@api/user'
import { getTaskType, getUserTask } from '@api/member'
import { inject, ref, reactive } from 'vue'
import { onLoad, onShow, onPageScroll, onReachBottom, onUnload } from '@dcloudio/uni-app'
import pageHeader from '../../components/page-header/page-header.vue'
import signInBox from './sign-in-box.vue'
import TaskList from '../../components/task-list/index.vue'

interface UserTaskItem {
  id: string
  name: string
  tasks: Member.TaskInfo[]
}

onLoad((options: AnyObject) => {
  accountId.value = options.accountId
  systemId.value = options.systemId

  // 获取用户任务信息
  getTaskTypesList()
})
onShow(() => {
  //获取用户积分
  getVipUserPointFn()
})
onReachBottom(() => {
  loadMore.value && getTaskTypesList()
})
onUnload(() => {
  uni.removeStorageSync('pointRule')
})
// 没有滚动到下方时，page-header透明
let isTransparent = ref(true)
onPageScroll((e: { scrollTop: number }) => {
  isTransparent.value = e.scrollTop < 40
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [headerBgImg, iconArrowLeftWhite] = gdp(['point-page-header-bgImg.png', 'icon-arrow-left-white.png'])
let accountId = ref('')
let pointNum = ref('0')
let userTaskList = reactive({
  data: [] as UserTaskItem[]
})
let loadMore = ref(false)
let systemId = ref('')

// 跳转积分明细
const gotoDetail = () => {
  uni.navigateTo({
    url: `/package-mine/pages/point-detail/index?accountId=${accountId.value}&systemId=${systemId.value}`
  })
}

// 获取积分详情
const getVipUserPointFn = async () => {
  try {
    const resData = await getVipUserPoint(accountId.value, systemId.value)
    pointNum.value = resData.point
    uni.setStorageSync('pointRule', resData.description)
  } catch {}
}

// 获取任务类型
const getTaskTypesList = async () => {
  try {
    const resData = await getTaskType({
      taskSceneCode: 'commPointScene'
    })
    resData.map((item: { id: string; name: string }, index: number) => {
      let params = { taskTypeId: item.id }
      let obj = {} as UserTaskItem
      userTaskList.data.push(obj)
      // 获取用户任务列表
      getUserTask(params).then((res: any) => {
        obj = {
          id: item.id,
          name: item.name,
          tasks: res
        }
        userTaskList.data.splice(index, 1, obj)
      })
    })
  } catch {}
}

const goToPointRule = () => {
  uni.navigateTo({
    url: `/package-mine/pages/point-rule/index`
  })
}

const toBackTo = () => {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style lang="scss" scoped>
.user-point {
  height: 100%;
  background: #f7f7f7;
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom));

  .page-header-box {
    .page-header-outer {
      width: 100%;
      height: 620rpx;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;

      .point-relative-box {
        padding: 217rpx 32rpx 0;

        .point-total {
          font-size: 80rpx;
          font-weight: bolder;
          color: #fff;
        }

        .info-box {
          display: flex;
          align-items: center;
          color: #d6e0ff;
          font-size: 26rpx;

          .line {
            width: 1rpx;
            height: 24rpx;
            border: 1rpx solid #7c96e3;
            margin: 0 12rpx;
          }
        }
      }
    }
  }

  .content {
    padding-bottom: 60rpx;

    .point-task {
      border-radius: 8rpx;
      padding: 0rpx 32rpx;
      margin: 0 auto;

      .title {
        margin: 54rpx 0 24rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #292c2e;
      }

      .list {
        background: #fff;
        box-shadow: 0rpx 15rpx 33rpx 0rpx rgb(111 111 111 / 24%);

        ::v-deep .task-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #292c2e;
          margin-bottom: 11rpx;
        }
      }

      .no-more {
        // margin-top: 200rpx;
        text-align: center;
        font-size: 26rpx;
        color: #909ca8;
        padding: 20rpx;
      }

      .change-list {
        height: 100rpx;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        color: #92969a;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        vertical-align: baseline;
        box-shadow: 0rpx 15rpx 33rpx 0rpx rgb(111 111 111 / 24%);

        .refresh {
          width: 36rpx;
          height: 36rpx;
          margin: 4rpx 0 0 2rpx;
        }
      }
    }
  }
}
</style>
