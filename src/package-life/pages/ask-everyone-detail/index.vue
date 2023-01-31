<template>
  <view class="question">
    <view class="question-head">
      <ask-everyone-head ref="head" :total="questionCount" :title="headTitle" :img="headImg" />
    </view>
    <view class="question-body">
      <view class="question-body-question">
        <view class="question-body-question-title">{{ questionInfo.questionDetails }}</view>
        <view class="question-body-question-content">
          <view class="question-body-question-content-user">
            <view class="avatar"><image class="img" :src="questionInfo.userAvatar ? questionInfo.userAvatar : userPortraitImg" /></view>
            <view class="name">{{ questionInfo.userName }}</view>
          </view>
          <view class="question-body-question-content-time">提问于{{ formatDate(questionInfo.createTime, 'YYYY.MM.DD') }}</view>
        </view>
      </view>
      <template v-if="answerList.length > 0">
        <view class="question-body-answer">
          <view class="question-body-answer-count">共{{ questionInfo.showAnswerCount }}个回答</view>
          <view v-for="item in answerList" :key="item.answerId" class="question-body-answer-item">
            <view class="question-body-answer-item-head">
              <view class="question-body-answer-item-head-user">
                <view class="question-body-answer-item-head-user-avatar">
                  <image :src="item.userAvatar ? item.userAvatar : userPortraitImg" class="img" />
                </view>
                <text class="user-name">{{ item.userName }}</text>
                <view class="question-body-answer-item-head-user-card">
                  <image :src="item.replyType === 1 ? customer : business" class="img" />
                </view>
              </view>
              <view class="question-body-answer-item-head-time">{{ formatDate(item.createTime, 'YYYY.MM.DD') }}</view>
            </view>
            <view class="question-body-answer-item-content">{{ item.answerDetails }}</view>
          </view>
        </view>
      </template>
    </view>
    <view v-if="answerList.length === 0" class="question-none">
      <view class="question-none-img">
        <image class="question-none-img-content" :src="noneQuestion" />
      </view>
      <view class="question-none-text">当前暂无回答</view>
    </view>
    <view v-if="questionCount > 1" class="question-list">
      <view class="question-more">--- 更多问答 ---</view>
      <ask-everyone-list-item
        v-for="(item, index) in questionList"
        :key="index"
        :question-item="item.questionVO"
        :answer-item="item.answerVOList"
        @reflash="deleteItem"
        @go-to-detail="goToDetail"
      />
    </view>
    <view class="question-bottom" :style="style">
      <input
        v-if="replyFlag"
        v-model="answerDetails"
        adjust-position="{{ false }}"
        maxlength="300"
        class="question-bottom-input"
        :placeholder="placeholder"
        @click="handleClick"
        @focus="toInputFocus"
        @blur="toInputBlur"
      />
      <input
        v-if="!replyFlag"
        v-model="answerDetails"
        disabled
        adjust-position="{{ false }}"
        maxlength="300"
        class="question-bottom-input"
        :placeholder="placeholder"
        @click="handleClick"
        @focus="toInputFocus"
        @blur="toInputBlur"
      />
      <view class="question-bottom-btn uni-input" :class="{ 'question-bottom-btn-disable': !replyFlag }" @click="answerCommit">发送</view>
    </view>
  </view>
</template>
<script lang="ts" setup name="AskEveryDetail">
import { inject, ref, reactive } from 'vue'
import { getAskEveryoneDetail, getAskEveryoneList, answerPublished, answerJudge } from '@api/question'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import AskEveryoneHead from '../../components/ask-everyone-head/ask-everyone-head.vue'
import { pureAssign } from '@util/common'
import { formatDate } from '@util/date-time'
import AskEveryoneListItem from '../../components/ask-everyone-list-item/ask-everyone-list-item.vue'

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface LoadOptions {
  id: string
  title: string
  img: string
  questionCount: string
  itemId: string
}
const questionId = ref('')
const headTitle = ref('')
const headImg = ref('')
const questionCount = ref(0) // 问题数量
onLoad((_options: OnLoadOption<LoadOptions>) => {
  questionId.value = _options.id || '' // 问答列表的id
  headTitle.value = _options.title || '' // 问答列表的标题
  headImg.value = _options.img || '' // 问答列表的图片
  questionCount.value = Number(_options.questionCount)
})
onShow(() => {
  getQuestiondetail(questionId.value, date.value)
})
onReachBottom(() => {
  if (!isEnd.value) {
    pageNo++
    getQuestiondetail(questionId.value, date.value)
  } else if (!questionIsEnd.value) {
    questionList.length && questionPageNo.value++
    getQuestionList()
  }
})
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const noneQuestion = gdp('none-question.png')
const customer = gdp('icon-customer.png')
const business = gdp('icon-business.png')
const userPortraitImg = gdp('icon-default-avatar.png')

const style = ref('')

function toInputFocus(e: AnyObject) {
  // console.log(e.detail.height)
  style.value = 'bottom:' + e.detail.height + 'px;' + ' padding-bottom: 9px'
}
function toInputBlur() {
  style.value = 'bottom: 0'
}
// 提交回答
const answerDetails = ref('')
async function answerCommit() {
  if (!replyFlag.value) {
    return
  }
  if (answerDetails.value === '' && replyFlag.value) {
    uni.showToast({
      title: '请输入回答',
      icon: 'none'
    })
    return
  }
  try {
    await answerPublished({
      questionId: questionId.value,
      answerDetails: answerDetails.value
    })
    answerDetails.value = ''
    answerList.length = 0
    questionList.length = 0
    questionPageNo.value = 1
    pageNo = 1
    questionIsEnd.value = false
    isEnd.value = false
    getQuestiondetail(questionId.value)
  } catch (error) {
    console.log(error)
  }
}
// 判断是否能回答
const showPop = ref(false)
const replyFlag = ref(false) // 是否禁用
function handleClick() {
  if (!replyFlag.value) {
    uni.showToast({
      title: '买过的用户才能回答哦~',
      icon: 'none'
    })
    return
  }
  showPop.value = true
}
async function toJudgeAnswer() {
  try {
    const res = await answerJudge(questionInfo.itemId)
    if (res) {
      replyFlag.value = true
    }
    !replyFlag.value && (placeholder.value = '买过的用户才能回答哦~')
  } catch (error) {
    console.log(error)
  }
}
// 获取问题列表
const questionList: Qa.QuestionItem[] = reactive([]) // 问题列表

const questionPageSize = 20
const questionPageNo = ref(1)
const questionIsEnd = ref(false)
const date = ref(new Date().valueOf())
async function getQuestionList() {
  try {
    const res = await getAskEveryoneList(questionInfo.itemId, {
      pageSize: questionPageSize,
      pageNo: questionPageNo.value,
      createEndTime: date.value
    })
    res.data.forEach((item: Qa.QuestionItem) => {
      item.questionVO.questionDetails = item.questionVO.questionDetails.replace(/[\r\n]/g, ' ') //去掉回车换行
      if (item.answerVOList.length > 0) {
        item.answerVOList[0].answerDetails = item?.answerVOList[0].answerDetails.replace(/[\r\n]/g, ' ') //去掉回车换行
      }
    })
    questionCount.value = res.total
    questionList.push(...res.data)

    questionList.forEach((item, index: number) => {
      if (item.questionVO.questionId === questionInfo.questionId) {
        questionList.splice(index, 1)
      }
    })
    questionIsEnd.value = questionCount.value === questionList.length + 1 || questionCount.value === 0
  } catch (error) {
    console.log(error)
  }
}

// 获取问答详情
const questionInfo: Qa.QuestionVO = reactive({
  answerCount: 0,
  createTime: 0,
  itemId: '',
  questionDetails: '',
  questionId: '',
  replyFlag: 0,
  showAnswerCount: 0,
  updateTime: 0,
  userAvatar: '',
  userId: '',
  userName: ''
})
const placeholder = ref('你的回答将匿名展示')
const answerList: any = reactive([]) // 回答列表
const answerCount = ref(0) // 问题数量
let pageNo = 1
const pageSize = 20
const isEnd = ref(false)
async function getQuestiondetail(itemId: string, time?: number) {
  try {
    let param = {
      pageNo,
      pageSize
    } as AnyObject as { pageNo: number; pageSize: number; createEndTime: unknown }
    time && (param.createEndTime = time)
    const res = (await getAskEveryoneDetail(itemId, param)) as AnyObject
    res.questionVO.questionDetails = res.questionVO.questionDetails.replace(/[\r\n]/g, ' ')
    pureAssign(questionInfo, res.questionVO)
    answerList.push(...res.answerVOPaging.data)
    answerCount.value = res.answerVOPaging.total
    if (answerCount.value === answerList.length || answerCount.value === 0) {
      isEnd.value = true
    }
    if (!time) {
      date.value = new Date().valueOf()
    }
    if (pageNo === 1) {
      toJudgeAnswer()
      if (isEnd.value) {
        questionList.length = 0
        getQuestionList()
      }
    }
  } catch (error) {
    console.log(error)
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
    url: `/package-life/pages/ask-everyone-detail/index?id=${id}&title=${headTitle.value}&img=${headImg.value}`
  })
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
