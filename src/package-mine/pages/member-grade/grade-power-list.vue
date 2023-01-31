<template>
  <view class="grade-power">
    <view class="title">
      <view class="title-text">
        <text>{{ title }}</text>
      </view>
      <view v-if="rightList.length > 8" class="up" @click="isShow = !isShow">
        <text v-if="!isShow">展开</text>
        <text v-else>收起</text>
        <image :src="!isShow ? iconUp : iconDown" />
      </view>
    </view>
    <view class="power-list">
      <view v-for="(item, index) in rightList" :key="index" class="item" @click="goToRightDetail(item.rightsId)">
        <template v-if="isShow ? rightList.length : index < 8">
          <image :src="item.logoImg" class="icon" />
          <view class="name">{{ item.rightsName }}</view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="GradePowerList">
import { inject, ref, reactive, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAllGrade, getVipRights } from '@api/member'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconUp, iconDown] = gdp(['icon-up.png', 'icon-down.png'])

const props = defineProps<{
  levelId: string
  title: string
}>()

const accountId = ref('')
const systemId = ref('')

onLoad(async (options) => {
  accountId.value = options.accountId || ''
  systemId.value = options.systemId || ''
  queryAllGrade()
})

watch(
  () => props.levelId,
  () => {
    rightList.splice(0)
    queryVipRights(props.levelId)
  }
)

const isShow = ref(false)

const rightList: Member.VipRightInfo[] = reactive([])
async function queryVipRights(curLevelId: string) {
  console.log(111)
  try {
    const data = await getVipRights({
      systemId: systemId.value,
      levelId: curLevelId,
      pageNo: 1,
      pageSize: 999
    })
    rightList.push(...data.data)
  } catch (error) {}
}

const allGradeList: Member.VipRightInfo[] = reactive([])
async function queryAllGrade() {
  try {
    const list = await getAllGrade(systemId.value)
    allGradeList.push(...list)
  } catch (error) {}
}

function goToRightDetail(id: string) {
  let index = allGradeList.findIndex((value: AnyObject) => value.rightsId === id)
  uni.navigateTo({
    url: `/package-mine/pages/grade-detail/index?accountId=${accountId.value}&rightsId=${id}&systemId=${systemId.value}&index=${index}`
  })
}
</script>

<style lang="scss" scoped>
.grade-power {
  padding: 0 40rpx;

  .title {
    display: flex;
    justify-content: space-between;

    .title-text {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      margin-bottom: 41rpx;
    }

    .up {
      font-size: 28rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #92969a;

      image {
        margin-left: 8rpx;
        width: 24rpx;
        height: 24rpx;
      }
    }
  }

  .power-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .item {
      text-align: center;
      display: inline-block;
      margin-bottom: 40rpx;
      width: 25%;

      .icon {
        vertical-align: middle;
        width: 104rpx;
        height: 104rpx;
      }

      .name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 26rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
      }
    }

    .item:nth-child(4n) {
      margin-right: 0;
    }
  }

  .power-list::after {
    content: '';
    flex: auto;
  }
}
</style>
