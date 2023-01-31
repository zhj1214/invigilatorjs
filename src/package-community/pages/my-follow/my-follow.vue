<template>
  <view class="group-record">
    <view class="tabs">
      <sp-tabs underline :menus="tabs" @on-click="handleTabChange" />
    </view>

    <view class="tab-panel">
      <topic-list v-if="topicLists.length" :list="topicLists" :is-end="isEnd" btn-text="已关注" @btn-click="handleUnFollow" />
      <view v-if="topicLists.length === 0 && isEnd" class="no-topic">
        <image :src="noFollowIcon" />
        <view class="text">暂无关注内容</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, inject } from 'vue'
import { getMyTopic, setUnfollowTopic } from '@src/api/community'
import topicList from '../../components/topic-list/topic-list.vue'
import { useUserStore } from '@src/pinia/user'

export default defineComponent({
  name: 'MyFollow',
  components: {
    topicList
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
    const noFollowIcon = gdp('no-follow.png')

    /**
     * 用户信息
     */
    let loginUserId = ref('')
    async function getUserInfo() {
      const user = await useUserStore().getUserInfo()
      loginUserId.value = user.accountId
    }

    /**
     * 切换tab
     */
    let currentTab = ref(1)
    function handleTabChange(value: number) {
      currentTab.value = value
    }

    /**
     * 获取我关注的话题
     */
    let topicLists: Array<TopicInfo> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)
    async function getMyFollowTopic() {
      try {
        const res = (await getMyTopic(loginUserId.value, { pageNo: pageNo.value, pageSize: 15 })) as AnyObject
        pageNo.value === 1 && topicLists.splice(0)
        topicLists.push(...res.data)
        isEnd.value = topicLists.length === res.total
      } catch (error) {}
    }

    /**
     * 取消关注话题
     */
    async function handleUnFollow(topic: TopicInfo) {
      uni.showModal({
        title: '提示',
        content: '确认不再关注了吗？',
        confirmColor: '#000',
        success: async (res) => {
          if (res.confirm) {
            await setUnfollowTopic(loginUserId.value, topic.id)
            const targetIndex = topicList.findIndex((i: any) => i.id === topic.id)
            topicList.splice(targetIndex, 1)
            uni.showToast({
              title: '取消关注成功',
              duration: 1000,
              icon: 'none'
            })
          }
        }
      })
    }

    onMounted(async () => {
      await getUserInfo()
      await getMyFollowTopic()
    })

    return {
      getUserInfo,
      tabs: [{ name: '话题', value: 1 }],
      currentTab,
      handleTabChange,
      getMyFollowTopic,
      topicLists,
      isEnd,
      pageNo,
      handleUnFollow,
      noFollowIcon
    }
  },
  onPullDownRefresh() {
    this.isEnd = false
    this.pageNo = 1
    this.getMyFollowTopic()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getMyFollowTopic()
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
