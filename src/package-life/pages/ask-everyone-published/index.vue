<template>
  <view class="question-published">
    <view class="question-published-head">
      <ask-everyone-head :img="headImg" :title="headTitle" />
    </view>
    <view class="question-published-body">
      <!-- #ifdef MP-WEIXIN-->
      <textarea
        class="question-published-body-content-text"
        placeholder-style="color:#BABABA;"
        placeholder="请写下你的问题，买过的人会为你解答。"
        maxlength="50"
        @blur="handleTextCount"
      />
      <!-- #endif -->
      <!-- #ifdef H5-->
      <textarea
        v-model="questionDetails"
        class="question-published-body-content-text"
        placeholder-style="color:#BABABA;"
        placeholder="请写下你的问题，买过的人会为你解答。"
        maxlength="50"
        @input="handleTextCount"
      />
      <!-- #endif -->
      <view class="question-published-body-content-count">{{ questionDetails.length }} / 50</view>
    </view>
    <view class="question-published-bottom">
      <view class="question-published-bottom-btn" @click="published">提交</view>
    </view>
  </view>
</template>
<script lang="ts" setup name="AskEveryonePublished">
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AskEveryoneHead from '../../components/ask-everyone-head/ask-everyone-head.vue'
import { publishQuestion } from '@api/question'

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface LoadOptions {
  id: string
  title: string
  img: string
}

onLoad((_options: OnLoadOption<LoadOptions>) => {
  itemId.value = _options.id || '' // 问答列表的id
  headTitle.value = _options.title || '' // 问答列表的标题
  headImg.value = _options.img || '' // 问答列表的图片
})
const itemId = ref('')
const headTitle = ref('')
const headImg = ref('')

// 提交问题
const questionDetails = ref('')
watch(
  () => questionDetails,

  () => {
    if (questionDetails.value.length > 50) {
      uni.showToast({
        title: '当前文案超出最多字数上限，将无法完全展示',
        icon: 'none'
      })
    }
  },
  {
    immediate: true, // 立即执行
    deep: true // 深度监听
  }
)
async function published() {
  if (questionDetails.value.length < 4) {
    uni.showToast({
      title: '至少输入4个中英文字符',
      icon: 'none'
    })
    return
  }
  try {
    questionDetails.value.replace(/[\r\n]/g, '')
    await publishQuestion({
      itemId: itemId.value,
      questionDetails: questionDetails.value.substring(0, 50)
    })
    // uni.navigateBack({
    //   delta: 1
    // })
    let pages = getCurrentPages() // 当前页面
    let beforePage = pages[pages.length - 2] // 上一页
    uni.navigateBack({})
    uni.showToast({
      title: '问题发布成功'
    })
  } catch (error: any) {
    uni.showToast({
      title: error.message,
      icon: 'none'
    })
  }
}
// 处理输入文字
function handleTextCount(e: AnyObject) {
  if (e.detail.value.length <= 50) {
    questionDetails.value = e.detail.value
  }
}
</script>
<style lang="scss" scoped>
.question-published {
  &-body {
    width: 100%;
    height: 100%;
    margin-top: 10rpx;
    padding: 32rpx;
    background-color: $uni-bg-color;

    &-content-text {
      height: 160rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #909ca8;
      line-height: 38rpx;
    }

    &-content-count {
      text-align: end;
      font-size: 28rpx;
      color: #d8d8d8;
    }
  }

  &-bottom {
    padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
    width: 100%;
    position: fixed;
    bottom: 0;

    &-btn {
      margin: 0 auto;
      width: 670rpx;
      height: 84rpx;
      background: #1a1a1a;
      border-radius: 1rpx;
      border: 2rpx solid #1a1a1a;
      line-height: 84rpx;
      text-align: center;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: $uni-text-color-inverse;
    }
  }
}
</style>
