<template>
  <view class="user-point">
    <view class="point-total">{{ totalPoint }}</view>
    <view class="content">
      <view class="inner-box">
        <view :class="['tab', isFixedTopFlag ? 'tab-fixed' : '']">
          <view v-for="(item, index) in tabList.data" :key="index" :class="['text', activeTab === item.value ? 'active' : '']" @click="toTabChange(item.value)">
            {{ item.name }}
          </view>
        </view>
        <!-- 占位标签 -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="isFixedTopFlag" class="empty-view" />
        <!-- #endif -->
        <view class="list">
          <view v-for="(item, index) in pointDetail.data" :key="index" class="item">
            <view class="task">
              <view class="task-name">{{ item.businessName }}</view>
              <view class="task-des">{{ item.createTime }}</view>
            </view>
            <view class="right">{{ toPointFilter(item) }}</view>
          </view>
          <view v-if="!loadMore && pointDetail.data.length" class="tips">-- 暂无更多 --</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onLoad, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { getVipUserPoint, getPointFlow } from '@api/user'

onLoad((option: AnyObject) => {
  accountId.value = option.accountId
  systemId.value = option.systemId
  getVipUserPointFn()
  getDetail()
})
let isFixedTopFlag = ref(false)
onPageScroll((e: { scrollTop: number }) => {
  console.log(e.scrollTop)
  isFixedTopFlag.value = e.scrollTop > 66
})
onReachBottom(() => {
  if (loadMore.value) {
    pageNo.value++
    getDetail()
  }
})
interface TabList {
  name: string
  value: number
}
interface PointDetail {
  businessName: ''
  createTime: ''
}
const tabList = reactive({
  data: [
    { name: '全部', value: 3 },
    { name: '收入', value: 1 },
    { name: '支出', value: 2 }
  ] as TabList[]
})

let activeTab = ref(3)
let accountId = ref('')
let pointDetail = reactive({
  data: [] as PointDetail[]
})
let pageNo = ref(1)
let totalPoint = ref(0)
let loadMore = ref(false)
let systemId = ref('')
const toPointFilter = (val: AnyObject) => {
  if (val.flowType === 1 || val.flowType === 18) {
    return '+' + val.point
  } else {
    return '-' + val.point
  }
}

const toTabChange = (value: number) => {
  if (activeTab.value === value) {
    return
  }
  activeTab.value = value
  pageNo.value = 1
  pointDetail.data = []
  getDetail()
}

const getDetail = async () => {
  let obj = {
    pageNo: pageNo.value,
    pageSize: 10,
    systemId: systemId.value,
    accountId: accountId.value,
    paymentType: activeTab.value === 3 ? '' : activeTab.value
  }
  try {
    const resData = await getPointFlow(obj)
    pointDetail.data = [...pointDetail.data, ...resData.data]
    loadMore.value = !(pointDetail.data.length === resData.total)
  } catch (err) {}
}

// 获取积分详情
const getVipUserPointFn = async () => {
  try {
    const resData = await getVipUserPoint(accountId.value, systemId.value)
    totalPoint.value = resData.point
  } catch (err) {}
}
</script>

<style lang="scss" scoped>
.user-point {
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));

  .point-total {
    line-height: 132rpx;
    font-size: 80rpx;
    font-weight: bold;
    color: #4e6175;
    padding-left: 56rpx;
  }

  .content {
    padding: 0 32rpx;
    border-radius: 8rpx;

    .inner-box {
      width: 100%;
      padding: 0 40rpx;
      box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 24%);
    }

    .tab {
      line-height: 109rpx;
      border-bottom: 1rpx solid #e4e7ea;

      .text {
        font-size: 30rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
        display: inline-block;
        margin-right: 72rpx;

        &.active {
          font-size: 30rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #4e6175;
        }
      }
    }

    .tab-fixed {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #fff;
      padding: 0 68rpx;
      z-index: 998;
      border-bottom: none;
    }

    .empty-view {
      width: 100%;
      height: 132rpx;
    }

    .list {
      .item {
        height: 160rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #e4e7ea;

        .task {
          .task-name {
            font-size: 32rpx;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: bold;
            color: #292c2e;
          }

          .task-des {
            font-size: 26rpx;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: #bababa;

            .icon {
              width: 28rpx;
              height: 28rpx;
              margin-right: 4rpx;
            }
          }
        }

        .right {
          font-size: 32rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #4e6175;
        }
      }

      .tips {
        width: 100%;
        line-height: 80rpx;
        margin-top: 20rpx;
        text-align: center;
        font-size: 24rpx;
        color: #bababa;
      }
    }
  }
}
</style>
