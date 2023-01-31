<template>
  <view v-if="signInListData.data.length" class="sign-in-box">
    <view class="state-info">
      <!-- 今日已签到 -->
      <view v-if="todayCompletedFlag">
        已连续签到
        <text class="important-num">{{ continualDayNum }}</text>
        天 | 明天签到
        <text class="important-num">+{{ tomorrowPointNum }}</text>
        积分
      </view>
      <view v-else>您还未签到 | 连续签到可获得奖励</view>
      <image :src="iconHelpPoint" class="icon-help-point" @click="checkRules" />
    </view>
    <view class="flex-row inner-box">
      <view v-for="(item, index) in signInListData.data" :key="index" class="list-box">
        <view :class="['list-card', todayCompletedFlag && !index ? 'today-completed' : '']">
          <text class="point-num">+{{ item.worth }}</text>
          <image :src="todayCompletedFlag && !index ? iconSignedIn : iconGoldCoins" class="icon-gold-coins" />
        </view>
        <view class="date" :style="{ color: todayCompletedFlag && !index ? '#4E6175' : '' }">{{ item.currentTime }}</view>
      </view>
    </view>
    <view v-if="todayCompletedFlag" class="btn signed-in">已签到</view>
    <view v-else class="btn no-sign-in" @click="goCheckIn">签到</view>

    <!-- 任务规则弹窗 -->
    <task-rule-popup ref="taskRulePopupModel" />
  </view>
</template>

<script setup lang="ts" name="SignInBox">
import { inject, ref, reactive, Ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { formatDate } from '@util/date-time'
import taskRulePopup from './task-rule-popup.vue'
import { getUserData, setSignInEventStart, getTaskInfoData } from '@api/user'

interface SignInListData {
  worth: number
  currentTime: string
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconHelpPoint, iconSignedIn, iconGoldCoins] = gdp(['icon-help-point.png', 'icon-signed-in.png', 'icon-gold-coins.png'])

// 签到
let signInListData = reactive({
  data: [] as SignInListData[]
})
// 今日是否已完成
let todayCompletedFlag = ref(false)
// 连续签到天数
let continualDayNum = ref(0)
// 明天签到可得积分数
let tomorrowPointNum = ref(0)

onLoad((options: AnyObject) => {
  // 若当日未签到并且是点击签到进入的此页面，需要先调用签到接口
  // options.functionFlag // 判断是点击签到进入的此页面还是点击积分
  options.functionFlag === 'signIn' && goCheckIn()
  //获取用户任务信息
  getTaskInfo()
})

async function getTaskInfo() {
  try {
    const resData = await getTaskInfoData()
    const { id } = resData.taskInfo
    id && getUserTaskData(id)
  } catch {}
}

const getUserTaskData = async (id: string) => {
  // id：任务id
  try {
    const resData = await getUserData(id)
    const { continualDay, todayCompleted, taskEquityDataList } = resData
    todayCompletedFlag.value = todayCompleted
    continualDayNum.value = continualDay
    tomorrowPointNum.value = taskEquityDataList[1]?.worth || 0
    signInListData.data = taskEquityDataList.map((item: AnyObject, index: number) => {
      index === 0 && (item.currentTime = '今天')
      index > 0 && (item.currentTime = formatDate(item.currentTime, 'MM/DD'))
      return item
    })
  } catch {}
}

// 今日签到
const goCheckIn = async () => {
  try {
    const resData = await setSignInEventStart()
    if (resData) {
      //重新获取用户积分
      // getVipUserPointFn()
      getTaskInfo()
      uni.showToast({
        title: '签到成功',
        duration: 2500,
        icon: 'success'
      })
    }
  } catch {
    uni.showToast({
      title: '签到失败',
      duration: 2500,
      icon: 'none'
    })
  }
}

// 查看规则
const taskRulePopupModel: Ref<SpPopup | null> = ref(null)
const checkRules = () => {
  taskRulePopupModel.value?.open()
}
</script>

<style lang="scss" scoped>
.sign-in-box {
  width: calc(100% - 64rpx);
  background: $sa-button-color-plain-bg;
  margin: -170rpx auto 0;
  padding: 54rpx 27rpx;
  box-shadow: 0rpx 32rpx 48rpx -20rpx rgb(142 154 167 / 28%);

  .icon-help-point,
  .icon-gold-coins {
    width: 44rpx;
    height: 44rpx;
  }

  .state-info {
    font-size: 26rpx;
    color: #4e6175;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .important-num {
      font-size: 32rpx;
      font-weight: bolder;
    }
  }

  .inner-box {
    display: flex;
    justify-content: flex-start;
    margin-top: 33rpx;

    .list-box {
      width: calc((100% - 72rpx) / 7);
      margin-right: 12rpx;

      .list-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 120rpx;
        border-radius: 4rpx;
        background: rgb(142 154 167 / 28%);

        .point-num {
          font-size: 22rpx;
          color: #92969a;
          margin-bottom: 13rpx;
        }
      }

      .today-completed {
        background: #4e6175;

        .point-num {
          color: #fff;
        }
      }

      .date {
        text-align: center;
        font-size: 22rpx;
        color: #92969a;
        margin-top: 12rpx;
      }
    }
  }

  .btn {
    width: 540rpx;
    height: 84rpx;
    line-height: 84rpx;
    border-radius: 1rpx;
    text-align: center;
    margin: 54rpx auto 0;
    font-weight: bolder;
  }

  .signed-in {
    border: 2rpx solid #4e6175;
    color: #4e6175;
  }

  .no-sign-in {
    background: #4e6175;
    border: 2rpx solid #4e6175;
    color: #fff;
  }
}
</style>
