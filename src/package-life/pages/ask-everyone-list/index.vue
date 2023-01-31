<template>
  <view class="ask-everyone-list">
    <view class="ask-everyone-list-head">
      <ask-everyone-head :total="questionCount" :title="headTitle" :img="headImg" />
    </view>
    <template v-if="questionList.length > 0">
      <view class="ask-everyone-list-body">
        <ask-everyone-list-item
          v-for="(item, index) in questionList"
          :key="index"
          :question-item="item.questionVO"
          :answer-item="item.answerVOList"
          @go-to-detail="goToDetail"
          @reflash="deleteItem"
        />
      </view>
      <view v-if="questionList.length === questionList.length" class="ask-everyone-list-nomore">-- 没有更多了 --</view>
    </template>
    <view v-if="questionList.length === 0" class="ask-everyone-list-none">
      <view class="ask-everyone-list-none-img">
        <image class="ask-everyone-list-none-img-content" :src="noneQuestion" />
      </view>
      <view class="ask-everyone-list-none-text">当前暂无问答</view>
    </view>
    <view class="ask-everyone-list-bottom">
      <view class="ask-everyone-list-bottom-btn" @click="goPublishQuestion">去提问</view>
    </view>
  </view>
</template>
<script lang="ts" setup name="AskEveryoneList">
import { inject, computed, ref, reactive } from 'vue'
import { getAskEveryoneList } from '@api/question'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import AskEveryoneHead from '../../components/ask-everyone-head/ask-everyone-head.vue'
import AskEveryoneListItem from '../../components/ask-everyone-list-item/ask-everyone-list-item.vue'
import { useAppStore } from '@src/pinia/app'

// 登录状态
const isLogin = computed(() => useAppStore().isLogin)

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
onShow(() => {
  questionList.length = 0
  pageNo = 1
  isEnd.value = false
  getQuestionList(itemId.value)
})
onReachBottom(() => {
  if (!isEnd.value) {
    pageNo++
    getQuestionList(itemId.value, date.value)
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const noneQuestion = gdp('none-question.png')

const itemId = ref('')
const headTitle = ref('')
const headImg = ref('')

// 获取问题列表
const questionList: Qa.QuestionItem[] = reactive([]) // 问题列表
const questionCount = ref(0) // 问题数量
const isEnd = ref(false)
const date = ref(new Date().valueOf())
let pageNo = 1
const pageSize = 20
async function getQuestionList(id: string, time?: number) {
  let param = {
    pageNo,
    pageSize
  } as { pageNo: number; pageSize: number; createEndTime: unknown }
  time && (param.createEndTime = time)
  const res = (await getAskEveryoneList(id, param)) as AnyObject
  res.data.map((item: AnyObject, index: number) => {
    console.log(res.data[index].questionVO)
    res.data[index].questionVO.questionDetails = item.questionVO.questionDetails.replace(/[\r\n]/g, ' ') //去掉回车换行
    if (res.data[index].answerVOList.length) {
      res.data[index].answerVOList[0].answerDetails = item?.answerVOList[0].answerDetails.replace(/[\r\n]/g, ' ') //去掉回车换行
    }
  })
  questionList.push(...res.data)
  questionCount.value = res.total
  if (questionCount.value === questionList.length || questionCount.value === 0) {
    isEnd.value = true
  }
  if (!time) {
    date.value = new Date().valueOf()
  }
}
// 处理隐藏问题
function deleteItem(id: string) {
  questionList.map((item: any, index: number) => {
    if (item.questionVO.questionId == id) {
      questionList.splice(index, 1)
      questionCount.value--
    }
  })
}

// 去问答详情
function goToDetail(id: string) {
  uni.navigateTo({
    url: `/package-life/pages/ask-everyone-detail/index?id=${id}&title=${headTitle.value}&img=${headImg.value}&questionCount=${questionCount.value}`
  })
}

// 去提问
function goPublishQuestion() {
  if (!isLogin.value) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return
  }
  uni.navigateTo({
    url: `/package-life/pages/ask-everyone-published/index?id=${itemId.value}&title=${headTitle.value}&img=${headImg.value}`
  })
}
</script>
<style lang="scss" scoped>
.ask-everyone-list {
  padding-bottom: 200rpx;

  &-head {
    margin-bottom: 32rpx;
  }

  &-bottom {
    position: fixed;
    display: flex;
    justify-content: center;
    width: 100%;
    bottom: 0;
    background: linear-gradient(180deg, rgb(255 255 255 / 90%) 0%, $uni-bg-color 100%);
    padding-top: 20rpx;
    padding-bottom: calc(18rpx + env(safe-area-inset-bottom));

    &-btn {
      background-color: #1a1a1aff;
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: $uni-text-color-inverse;
      text-align: center;
    }
  }

  &-nomore {
    text-align: center;
    font-size: 26rpx;
    color: #909ca8;
  }

  &-none {
    margin-top: 360rpx;

    &-img {
      margin: 0 auto;
      height: 144rpx;
      width: 144rpx;

      &-content {
        width: 100%;
        height: 100%;
      }
    }

    &-text {
      text-align: center;
    }
  }
}
</style>
