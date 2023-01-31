<template>
  <view class="choose-topic">
    <view class="topic-list">
      <view v-for="(item, key) in topicList" :key="key" class="topic-item" @click="toTopicHome(item)">
        <image :src="item.logoUrl" mode="" class="topic-logo" />
        <view class="info">
          <view class="topic-name"># {{ item.topicName }} #</view>
          <view class="topic-sub">
            <image :src="iconEye" mode="" class="icon" />
            <text class="text">{{ item.peopleFollowCount }}</text>
            <image :src="iconComment" mode="" class="icon" />
            <text class="text">{{ item.contentCount }}</text>
          </view>
        </view>
        <view class="radio">
          <image :src="selectedId !== item.id ? iconRadio : iconRadioChecked" mode="" class="radio-icon" />
        </view>
      </view>
      <view v-if="topicList.length === 0 && isEnd" class="list-no">暂无话题</view>
      <view v-if="topicList.length && isEnd" class="list-no-more">-没有更多内容了哦-</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, inject } from 'vue'
import { getTopicsList } from '@src/api/community'

export default defineComponent({
  name: 'ChooseTopic',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [iconEye, iconComment, iconRadio, iconRadioChecked] = gdp(['icon-eye.png', 'icon-comment.png', 'icon-radio.png', 'icon-radio-checked.png'])

    // 选中的话题id
    let selectedId = ref('')

    /**
     * 获取话题数据
     */
    let topicList: Array<TopicInfo> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)
    async function getTopics() {
      const { data, total } = (await getTopicsList({ pageNo: pageNo.value, pageSize: 15, inProcessing: true })) as AnyObject
      pageNo.value === 1 && topicList.splice(0)
      topicList.push(...data)
      isEnd.value = topicList.length === total
    }

    /**
     * 跳转话题首页
     */
    const toTopicHome = (info: TopicInfo) => {
      uni.setStorageSync('currentTopicId', selectedId.value === info.id ? '' : info.id)
      uni.setStorageSync('currentTopicName', selectedId.value === info.id ? '' : info.topicName)
      uni.navigateBack({ delta: 1 })
    }

    onMounted(() => {
      getTopics()
    })
    return {
      selectedId,
      topicList,
      isEnd,
      pageNo,
      getTopics,
      toTopicHome,
      iconRadio,
      iconRadioChecked,
      iconEye,
      iconComment
    }
  },
  onPullDownRefresh() {
    this.isEnd = false
    this.pageNo = 1
    this.getTopics()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getTopics()
    }
  },
  onLoad(option: { selected: string }) {
    console.log(option.selected)
    this.selectedId = option.selected
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
