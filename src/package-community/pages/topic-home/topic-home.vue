<template>
  <view class="topic-home">
    <view class="topic-home-header">
      <page-header :is-transparent="isTransparent" :title="!isTransparent ? topicDetail.topicName : ''" @back="toBackTo" />

      <!-- 背景 -->
      <view class="topic-home-header-bg"><image class="bg-img" :src="topicDetail.logoUrl" mode="aspectFill" /></view>
      <view class="topic-home-header-content filter-box">
        <view class="topic-title font-medium"># {{ topicDetail.topicName }} #</view>
        <view class="topic-subtitle">
          <view class="topic-description font-regular">{{ topicDetail.description }}</view>
          <view class="topic-follow-btn font-normal" :class="{ followed: topicDetail.follow }" @click="updateFollow">
            {{ topicDetail.follow ? '已关注' : '关注话题' }}
          </view>
        </view>
      </view>
    </view>
    <view class="topic-home-main">
      <view v-if="topicDetail.actualStartTime && topicDetail.actualEndTime" class="topic-date font-regular">
        <image class="date-icon" :src="iconDate" mode="aspectFill" />
        <text>{{ topicDetail.actualStartTime.slice(0, 10) }} 一 {{ topicDetail.actualEndTime.slice(0, 10) }}</text>
        <view class="rule-btn" @click="toShowRule">
          规则说明
          <image :src="iconRight" class="icon" mode="aspectFill" />
        </view>
      </view>

      <view v-if="isStart" class="topic-content-title">
        <text class="title font-bold">相关帖子</text>
        <view class="btn font-normal" :class="isFinish ? 'gray-style' : ''" @click="addContent">{{ btnText }}</view>
      </view>
      <view v-if="topicContents.length === 0" class="topic-content-none font--normal">{{ note }}</view>
      <view class="topic-content-list">
        <view v-for="item in topicContents" :key="item.id" class="topic-content-item">
          <content-card :info="item" show-address />
        </view>
      </view>
      <view v-show="isEnd" class="topic-content-none font--normal">-没有更多内容了哦-</view>
    </view>

    <uni-popup ref="popup" type="bottom">
      <view class="pop-class" style="background: #fff">
        <view class="pop-header">
          <view class="title">话题说明</view>
          <image class="icon-x" :src="closeIcon" mode="aspectFit" @click="closePopup" />
        </view>
        <scroll-view scroll-y class="module">
          <rich-text :nodes="topicDetail.explain" class="text" />
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, reactive, Ref } from 'vue'
import { getTopicsDetail, getHotContentList, getFollowTopic, setUnfollowTopic } from '@api/community'
import PageHeader from '../../components/page-header/page-header.vue'
import contentCard from '@src/pages/community/components/content-card/content-card.vue'
import { relogin } from '@src/api/request'
import { useUserStore } from '@src/pinia/user'
import { useAppStore } from '@src/pinia/app'

export default defineComponent({
  name: 'TopicHome',
  components: {
    PageHeader,
    contentCard
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const appStore = useAppStore()

    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [iconDate, iconRight, closeIcon] = gdp(['icon-date.png', 'icon-right.png', 'icon-square-close.png'])

    // 登录信息
    const isLogin = computed(() => appStore.isLogin)
    /**
     * 用户信息
     */
    let userId = ref('')
    async function getUserInfo() {
      const user = await useUserStore().getUserInfo()
      userId.value = user.accountId
    }

    // 没有滚动到下方时，page-header透明
    let isTransparent = ref(true)

    let topicId = ref('')

    let isStart = ref(true)
    let isFinish = ref(false)
    let note = ref('暂无帖子，点击参与抢沙发')
    let btnText = ref('发帖参与')

    /**
     * 获取话题信息
     */
    let topicDetail: AnyObject = reactive({})
    async function getDetail() {
      try {
        const res = (await getTopicsDetail(topicId.value)) as AnyObject
        Object.keys(res).forEach((key) => {
          topicDetail[key] = res[key]
        })

        let endTime = res.actualEndTime.replace(/-/g, '/')
        endTime = new Date(endTime).getTime()
        let startTime = res.actualStartTime.replace(/-/g, '/')
        startTime = new Date(startTime).getTime()
        let currentDate = new Date().getTime()
        if (startTime > currentDate) {
          isStart.value = false
          note.value = '活动未开始'
        }
        if (endTime < currentDate) {
          isFinish.value = true
          btnText.value = '活动结束'
          note.value = '活动已结束'
        }
        pageNo.value = 1
        isEnd.value = false
        if (isStart.value) {
          getTopicContents()
        }
      } catch (error) {}
    }

    /**
     * 获取话题动态
     */
    let pageNo = ref(1)
    let isEnd = ref(false)
    let topicContents: Array<TopicInfo> = reactive([])
    async function getTopicContents() {
      try {
        let params = {
          contentType: 2,
          like: true,
          follow: true,
          topicId: topicId.value,
          pageSize: 10,
          pageNo: pageNo.value
        }
        const res = (await getHotContentList({ ...params })) as AnyObject
        pageNo.value === 1 && topicContents.splice(0)
        topicContents.push(...res.data)
        isEnd.value = topicContents.length === res.total
      } catch (error) {}
    }

    /**
     * 返回
     */
    // 暂时简单处理
    function toBackTo() {
      uni.navigateBack({
        delta: 1
      })
    }

    /**
     * 关注话题
     */
    async function updateFollow() {
      if (!isLogin.value) {
        relogin()
        return
      }
      if (!topicDetail.follow) {
        await getFollowTopic(userId.value, topicId.value)
        topicDetail.follow = true
        uni.showToast({
          title: '关注成功',
          duration: 1000,
          icon: 'none'
        })
      } else {
        uni.showModal({
          title: '提示',
          content: '确认不再关注了吗？',
          confirmColor: '#000',
          success: async (res) => {
            if (res.confirm) {
              await setUnfollowTopic(userId.value, topicId.value)
              topicDetail.follow = false
              uni.showToast({
                title: '取消关注成功',
                duration: 1000,
                icon: 'none'
              })
            }
          }
        })
      }
    }

    /**
     * 发帖参与
     */
    function addContent() {
      if (!isLogin.value) {
        relogin()
        return
      }
      if (isFinish.value) {
        return
      }
      uni.navigateTo({
        url: `/package-community/pages/content-launch/content-launch?topicName=${topicDetail.topicName}&topicId=${topicDetail.id}&from=topic`
      })
    }
    const popup: Ref<SpPopup | null> = ref(null)

    /**
     * 查看规则说明
     */
    function toShowRule() {
      popup.value?.open()
    }
    function closePopup() {
      popup.value?.close()
    }

    return {
      isLogin,
      topicId,
      isStart,
      isFinish,
      note,
      btnText,
      topicDetail,
      isTransparent,
      isEnd,
      pageNo,
      topicContents,
      iconDate,
      closeIcon,
      iconRight,
      getUserInfo,
      getDetail,
      toBackTo,
      addContent,
      updateFollow,
      toShowRule,
      closePopup
    }
  },
  onLoad(option: { id: string }) {
    this.topicId = option.id
    this.isLogin && this.getUserInfo()
  },
  onShow() {
    this.pageNo = 1
    this.getDetail()
  },
  onPullDownRefresh() {
    this.getDetail()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getDetail()
    }
  },
  onPageScroll(e: { scrollTop: number }) {
    this.isTransparent = e.scrollTop < 100
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
