<template>
  <view class="grade-detail">
    <view class="top">
      <scroll-view scroll-x class="grade-list" :scroll-into-view="curRightsId" :scroll-left="scrollLeft" @scroll="onScroll">
        <view v-for="(item, index) in allGradeList" :id="'id' + item.rightsId" :key="index" class="item" @click="getDetail(item)">
          <image :src="item.logoImg" class="img" />
          <view class="name" :class="item.rightsId === rightsId ? 'active' : ''">{{ item.rightsName }}</view>
        </view>
      </scroll-view>
    </view>
    <view class="content">
      <view class="grade-dec">
        <view class="title">{{ gradeDetail.rightsName }}</view>
        <view class="explain">
          <view class="text">权益说明</view>
          <text>{{ gradeDetail.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { getAllGrade } from '@api/member'
import { onLoad } from '@dcloudio/uni-app'
import { pureAssign } from '@util/common'

const accountId = ref('')
const systemId = ref('')
const rightsId = ref('')
const index = ref(0)
const deviceWidth = ref(0)
onLoad((option) => {
  accountId.value = option.accountId || ''
  systemId.value = option.systemId || ''
  rightsId.value = option.rightsId || ''
  index.value = Number(option.index)
  deviceWidth.value = uni.getSystemInfoSync().windowWidth
  queryAllGrade()
})

const allGradeList: Member.VipRightInfo[] = reactive([])
const curRightsId = ref('')
const gradeDetail: Member.GradeDetail = reactive({
  rightsName: '',
  description: ''
})
async function queryAllGrade() {
  try {
    const list = (await getAllGrade(systemId.value)) as Array<Member.VipRightInfo>
    allGradeList.push(...list)
    allGradeList.map((item) => {
      if (item.rightsId === rightsId.value) {
        pureAssign(gradeDetail, item)
      }
    })
    nextTick(() => {
      curRightsId.value = 'id' + rightsId.value
    })
  } catch (error) {}
}
function getDetail(item: Member.VipRightInfo) {
  rightsId.value = item.rightsId
  pureAssign(gradeDetail, item)
}

const scrollLeft = ref(0)
let ifFirst = ref(true)
function onScroll(e: AnyObject) {
  if (ifFirst.value) {
    if (
      allGradeList[index.value].rightsId === allGradeList.slice(-1)[0].rightsId ||
      allGradeList[index.value].rightsId === allGradeList.slice(-2)[0].rightsId ||
      allGradeList[index.value].rightsId === allGradeList.slice(-3)[0].rightsId
    ) {
      return
    } else {
      scrollLeft.value = e.detail.scrollLeft - deviceWidth.value / 2 + 40
      ifFirst.value = false
      return
    }
  } else {
    ifFirst.value = false
  }
}
</script>

<style lang="scss" scoped>
.grade-detail {
  background: #f2f3f3;
  height: 100vh;

  .top {
    padding: 48rpx 0 24rpx 40rpx;
    background: #fff;

    .grade-list {
      display: flex;
      align-items: center;
      white-space: nowrap;
      width: 100%;
      overflow-x: auto;

      .item {
        text-align: center;
        margin-right: 46rpx;
        display: inline-block;

        // width: 144rpx;
        .img {
          vertical-align: middle;
          width: 94rpx;
          height: 94rpx;
        }

        .name {
          font-size: 24rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
          white-space: nowrap;

          &.active {
            font-size: 24rpx;
            font-family: SourceHanSansSC-Bold, SourceHanSansSC;
            font-weight: bold;
            color: #292c2e;
          }
        }
      }
    }
  }

  .content {
    padding: 40rpx;

    .grade-dec {
      background: #fff;
      box-shadow: 0rpx 15rpx 33rpx 0rpx rgb(111 111 111 / 24%);
      border-radius: 4rpx;
      padding: 48rpx 56rpx;

      .title {
        font-size: 48rpx;
        font-family: SourceHanSansSC-Bold, SourceHanSansSC;
        font-weight: bold;
        color: #292c2e;
      }

      .dec {
        margin: 16rpx 0 32rpx;
        font-size: 26rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #909ca8;
      }

      .img {
        width: 561rpx;
        height: 420rpx;
      }

      .explain {
        margin-top: 40rpx;
        padding-top: 48rpx;
        border-top: 1rpx solid #e4e7ea;

        .text {
          margin-bottom: 24rpx;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #292c2e;
        }
      }
    }
  }
}
</style>
