<template>
  <view class="member-page">
    <image class="bg" :src="memberImg" mode="scaleToFill" />
    <sp-header>
      <view class="page-title">
        <image class="back-icon" :src="iconBack" mode="scaleToFill" @click="toBack" />
        <text>会员等级</text>
      </view>
    </sp-header>
    <view class="page-content">
      <!-- 会员卡列表 -->
      <grade-card-swiper :level-list="levelList" :level="level" :level-id="levelId" :vip-info="vipInfo" @change="toSwiperChange" />

      <!-- 会员特权列表 -->
      <grade-power-list :title="levelId === curLevelId ? '我的特权' : '等级特权'" :level-id="curLevelId" />

      <!-- 成长任务 -->
      <grade-task-list />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject, ref, reactive } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getLevelList } from '@api/member'
import { getVipUser } from '@api/user'
import { pureAssign } from '@util/common'
import GradeCardSwiper from './grade-card-swiper.vue'
import GradePowerList from './grade-power-list.vue'
import GradeTaskList from './grade-task-list.vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconBack, memberImg] = gdp(['icon-back.png', 'bg-member.png'])

const accountId = ref('')
const systemId = ref('')
const levelId = ref('')

const level = ref(0)
const curLevelId = ref('')
const levelList: Member.LevelInfo[] = reactive([])
const vipInfo: Member.CurLevelInfo = reactive({
  growth: 0,
  nextGrowth: null,
  levelId: '',
  description: '',
  order: 0,
  percent: 0
})

onLoad((options) => {
  accountId.value = options.accountId || ''
  systemId.value = options.systemId || ''
  levelId.value = options.levelId || ''
  queryVipUser()
})

onUnload(() => {
  uni.removeStorageSync('growthRule')
})

function toBack() {
  var pages = getCurrentPages()
  if (pages.length === 1) {
    uni.switchTab({
      url: '/pages/mine/index'
    })
  } else {
    uni.navigateBack({
      delta: 1
    })
  }
}

function toSwiperChange(currentLevel: number) {
  level.value = currentLevel
  curLevelId.value = levelList[level.value].id
}

async function queryVipUser() {
  try {
    const data = await getVipUser(accountId.value, systemId.value)
    pureAssign(vipInfo, data)
    levelId.value = data.levelId
    level.value = vipInfo.order - 1
    uni.setStorageSync('growthRule', vipInfo.description)
    let growth = vipInfo.nextGrowth as number
    vipInfo.percent = getPercent(vipInfo.growth, vipInfo.growth + growth)
    queryLevelList()
  } catch (error) {}
}

function getPercent(num: any, total: any) {
  num = parseFloat(num)
  total = parseFloat(total)
  if (isNaN(num) || isNaN(total)) {
    return '-'
  }
  return total <= 0 ? '0' : Math.round((num / total) * 10000) / 100.0
}

async function queryLevelList() {
  try {
    const list = await getLevelList(systemId.value)
    list.forEach((item: Member.LevelInfo, index: number) => {
      if (item.order === vipInfo.order) {
        item.growth = vipInfo.growth
        item.nextGrowth = vipInfo.nextGrowth as number
        vipInfo.percent = getPercent(vipInfo.growth, item.nextGrowth)
        item.percent = vipInfo.percent as number
      }
      if (item.order < vipInfo.order) {
        item.lastErcent = list[index + 1].riseValue
        item.percent = 100
      }
    })
    levelList.push(...list)
    curLevelId.value = levelList[0].id
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.member-page {
  padding-bottom: env(safe-area-inset-bottom);

  .bg {
    width: 100%;
  }

  .page-title {
    position: relative;
    width: 100%;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    font-weight: 500;

    .back-icon {
      position: absolute;
      left: 36rpx;
      width: 72rpx;
      height: 72rpx;
    }
  }

  .page-content {
    position: absolute;
    top: 200rpx;
    width: 100%;

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
    }
  }
}
</style>
