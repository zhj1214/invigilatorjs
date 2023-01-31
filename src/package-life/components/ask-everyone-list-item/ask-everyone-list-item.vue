<template>
  <view class="ask-everyone-list-item" @click="goToDetail">
    <view class="ask-everyone-list-item-question">
      <image class="ask-everyone-list-item-question-img" :src="question" />
      <view class="ask-everyone-list-item-question-title ellipsis">{{ questionItem.questionDetails }}</view>
    </view>
    <template v-if="answerItem.length > 0">
      <view class="ask-everyone-list-item-answer">
        <image class="ask-everyone-list-item-answer-img" :src="answer" />
        <text class="ask-everyone-list-item-answer-username">{{ answerItem[0].userName }}：</text>
        <view class="ask-everyone-list-item-answer-title ellipsis">{{ answerItem[0].answerDetails }}</view>
      </view>
      <view class="ask-everyone-list-item-bottom">
        <text class="ask-everyone-list-item-bottom-title">全部{{ questionItem.showAnswerCount }}个回答</text>
        <image class="ask-everyone-list-item-bottom-img" :src="arrowRight" />
      </view>
    </template>
    <view v-else class="ask-everyone-list-item-none">暂无回答</view>
  </view>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import { getAskEveryoneDetail } from '@api/question'

const props = defineProps<{
  questionItem: Qa.QuestionVO
  answerItem: Qa.AnswerVOList[]
}>()

const emit = defineEmits(['goToDetail', 'reflash'])
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const arrowRight = gdp('icon-question-arrow-right.png')
const answer = gdp('icon-answer.png')
const question = gdp('icon-question.png')
async function goToDetail() {
  try {
    await getAskEveryoneDetail(props.questionItem.questionId, {
      pageNo: 1,
      pageSize: 20
    })
    emit('goToDetail', props.questionItem.questionId)
  } catch {
    emit('reflash', props.questionItem.questionId)
    return
  }
}
</script>

<style lang="scss" scoped>
.ask-everyone-list-item {
  padding: 24rpx 32rpx;
  background-color: #fff;
  margin: 32rpx;
  margin-bottom: 32rpx;

  &-question {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 32rpx;

    &-title {
      margin-left: 24rpx;
      font-size: 32rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;

      // word-break: break-all;
      // word-wrap: break-word;
      white-space: pre;

      // white-space: pre-line;
      width: 90%;
      color: #292c2e;
    }

    &-img {
      height: 38rpx;
      width: 38rpx;
    }
  }

  &-answer {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 10rpx;

    &-title {
      // margin-left: 10rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      width: 65%;

      // word-break: break-all;
      // word-wrap: break-word;
      white-space: pre;

      // white-space: pre-line;
      color: #292c2e;
    }

    &-username {
      margin-left: 24rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #92969a;
    }

    &-img {
      height: 38rpx;
      width: 38rpx;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-title {
      margin-left: 59rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #4e6175;
    }

    &-img {
      position: relative;
      top: 4rpx;
      height: 26rpx;
      width: 26rpx;
    }
  }

  &-none {
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #92969a;
    margin-left: 60rpx;
  }
}
</style>
