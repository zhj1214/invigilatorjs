<template>
  <view class="question">
    <view class="question-head" @click="goAskEveryone()">
      <view class="question-head-left">问答（{{ questionCount }}）</view>
      <view v-if="questionList.length > 0" class="question-head-right">
        <text class="text">更多</text>
        <image class="arrow" :src="arrowRight" />
      </view>
    </view>
    <view v-if="questionList.length > 0" class="question-list" @click="goAskEveryone()">
      <view v-for="item in questionList" :key="item.questionVO.questionId" class="question-list-item">
        <view class="question-list-item-left ellipsis">
          <image class="question-list-item-left-img" :src="question" />
          <view class="question-list-item-left-title ellipsis">{{ item.questionVO.questionDetails }}</view>
        </view>
        <view class="question-list-item-right">{{ formatFormAnswerCount(item.questionVO.showAnswerCount) }}个回答</view>
      </view>
    </view>
    <view v-else class="question-none">
      <view class="question-none-left">商品怎么样，去问问已买过的人？</view>
      <view class="question-none-right" @click="goAskEveryone()">去提问</view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { getAskEveryoneList } from '@api/question'
import { reactive, ref, inject } from 'vue'
import { onShow } from '@dcloudio/uni-app'
const props = defineProps<{
  itemId: string
  name: string
  imageInfos: string | string[]
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const arrowRight = gdp('icon-arrow-right.png')
const question = gdp('icon-question.png')

// 格式化处理问题数量
function formatFormAnswerCount(answerCount: number) {
  if (answerCount > 999) {
    return '999+'
  } else {
    return answerCount
  }
}

// 获取最新的两个问题
const questionList: any = reactive([]) // 问题列表
const questionCount = ref(0) // 问题数量
async function getQuestions() {
  try {
    questionList.length = 0
    const res = (await getAskEveryoneList(props.itemId, {
      pageNo: 1,
      pageSize: 2
    })) as { data: Array<AnyObject>; total: number }
    res.data.map((item: AnyObject, index: number) => {
      res.data[index].questionVO.questionDetails = item.questionVO.questionDetails.replace(/[\r\n]/g, ' ') //去掉回车换行
    })
    questionCount.value = res.total
    questionList.push(...res.data)
  } catch (error) {}
}
// 跳转问答列表
function goAskEveryone() {
  const headImg: string = Array.isArray(props.imageInfos) ? props.imageInfos[0] : props.imageInfos
  uni.navigateTo({
    url: `/package-life/pages/ask-everyone-list/index?id=${props.itemId}&title=${props.name}&img=${headImg}`
  })
}
// 从问答列表返回时需要重新更新数据
onShow(() => {
  getQuestions()
})
</script>
<style lang="scss" scoped>
.question {
  padding: 40rpx;
  background-color: #ffff;

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-left {
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #92969a;
    }

    &-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      color: #4e6175;

      .arrow {
        width: 48rpx;
        height: 48rpx;
      }

      .text {
        vertical-align: top;
      }
    }
  }

  &-list {
    margin-top: 30rpx;

    &-item {
      display: flex;
      margin-top: 15rpx;
      justify-content: space-between;

      &-left {
        width: 500rpx;
        display: flex;

        &-img {
          // margin-top: 5rpx;
          width: 34rpx;
          height: 34rpx;
        }

        &-title {
          margin-left: 6rpx;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          width: 90%;
          color: #292c2e;

          // word-break: break-all;
          // word-wrap: break-word;
          white-space: pre;
          vertical-align: top;
        }
      }

      &-right {
        font-size: 28rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
      }
    }
  }

  &-none {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-between;

    &-left {
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #292c2e;
    }

    &-right {
      width: 104rpx;
      height: 46rpx;
      text-align: center;
      line-height: 46rpx;
      font-size: 26rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #fff;
      background: #1a1a1a;
      border-radius: 2rpx;
    }
  }
}
</style>
