<template>
  <view class="all-topic">
    <topic-list :list="topicLists" :is-end="isEnd" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { getTopicsList } from '@src/api/community'
import topicList from '../../components/topic-list/topic-list.vue'

export default defineComponent({
  name: 'AllTopic',
  components: {
    'topic-list': topicList
  },
  setup() {
    /**
     * 获取话题数据
     */
    let topicLists: Array<TopicInfo> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)
    async function getTopics() {
      const { data, total } = (await getTopicsList({ pageNo: pageNo.value, pageSize: 15 })) as AnyObject
      pageNo.value === 1 && topicLists.splice(0)
      topicLists.push(...data)
      isEnd.value = topicLists.length === total
    }

    onMounted(() => {
      getTopics()
    })
    return {
      topicLists,
      isEnd,
      pageNo,
      getTopics
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
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
