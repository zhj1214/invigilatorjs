<template>
  <view>
    <view class="news-detail">
      <!-- 视频 -->
      <video v-if="firstVideoSrc" id="myVideo" class="news-detail-video" :src="firstVideoSrc" :poster="firstVideoPoster" controls show-fullscreen-btn />

      <!-- 详情 -->
      <view class="news-detail-main">
        <view class="news-detail-title">
          <text v-if="newsDetail.labelName" class="label-name">{{ newsDetail.labelName }}</text>
          {{ newsDetail.title }}
        </view>
        <view v-if="newsDetail.author" class="news-detail-info-others">
          <view class="news-detail-info-others-views">来源：{{ newsDetail.author }}</view>
        </view>
        <view class="news-detail-info-others">
          <view class="news-detail-info-others-views">{{ readingNum }}次阅读</view>
          <view class="news-detail-info-others-time">{{ publishTime }}发布</view>
        </view>
        <view v-if="newsDetail.addressDetail && newsDetail.addressDetail.address" class="news-detail-info-location">
          <image class="news-detail-info-location-img" :src="locationIcon" />
          <view class="news-detail-info-location-text">{{ newsDetail.addressDetail.address + newsDetail.addressDetail.detail }}</view>
        </view>

        <!-- 富文本内容 -->
        <rich-text :nodes="nodes" class="detail-content" preview @itemclick="handleRichTextClick" @click="handleRichTextClick" />

        <!-- tag -->
        <template v-if="newsDetail.tagList && newsDetail.tagList.length">
          <view v-for="(tag, index) in newsDetail.tagList" :key="index" class="news-detail-tags">#{{ tag }}</view>
        </template>
      </view>
    </view>
    <!-- 相关推荐 -->
    <view class="recommend-box">
      <text class="title">相关推荐</text>
      <view class="list">
        <view v-for="item in recommendData" :key="item.id" class="recommend-item" @click="gotoDetail(item)">
          <sp-image-card :image="item.pictures.lifeImg" :title="item.title" :subtitle="item.readNum" :icon="eyeIcon" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, inject, onMounted } from 'vue'
import { getNewsDetail, getRecommendIDLists, getRecommendLists, getReadingQuantity, toNewsRead } from '@api/community'
import { pureAssign } from '@util/common'
import parser from '@src/lib/html-parser'

let newsId = ref('')
let pageTitle = ref('')
let firstVideoPoster = ref('')
let isLeave = ref(false)

export default defineComponent({
  name: 'NewsDetail',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [locationIcon, eyeIcon] = gdp(['icon-location-gray.png', 'icon-eye.png'])

    /**
     * 获取详情
     */
    let newsDetail: NewsInfo = reactive({
      id: '',
      title: '',
      author: '',
      labelName: '',
      addressDetail: {},
      contentType: 1,
      pictures: {
        lifeImg: ''
      },
      readNum: 1,
      readAdjustNum: 1,
      originalContent: '',
      publishTime: '',
      tagList: []
    })
    async function getDetail() {
      const detail = (await getNewsDetail(newsId.value)) as AnyObject
      pureAssign(newsDetail, detail)
    }

    /**
     * 解析富文本
     */
    const nodes = computed(() => {
      return parser(newsDetail.originalContent)
    })

    /**
     * 阅读次数
     */
    let readingCount = ref(0)
    async function getReadNum(contentIds: string[]) {
      const res = (await getReadingQuantity({ contentIds: contentIds.join(',') })) as AnyObject
      recommendData.forEach((i: NewsInfo) => {
        i.readNum = res[i.id]
      })
      readingCount.value = res[newsId.value]
    }

    /**
     * 发布时间
     */
    const publishTime = computed(() => {
      return newsDetail.publishTime && newsDetail.publishTime.split(' ')[0]
    })

    /**
     * 相关推荐
     */
    let recommendData: NewsInfo[] = reactive([])
    async function getRecommendData() {
      const { data } = (await getRecommendIDLists({
        contentId: newsId.value,
        algorithm: 2,
        backup: 1,
        pageNo: 1,
        pageSize: 4 // 推荐4条
      })) as AnyObject
      const res = (await getRecommendLists({ ids: data.map((i: NewsInfo) => i.id).toString() })) as AnyObject
      recommendData.push(...res.data)
      getReadNum([newsId.value, ...res.data.map((i: NewsInfo) => i.id)])
    }

    // 视频链接
    const firstVideoSrc = computed(() => {
      const { componentList } = newsDetail
      let videoSrc = ''
      if (componentList && componentList.length) {
        const [{ type, contentDetail }] = componentList
        videoSrc = type === 3 ? contentDetail : ''
      } else if (nodes.value && nodes.value.length) {
        const [{ children }] = nodes.value as Array<AnyObject>
        const videoNode = children?.find((v: any) => v.name === 'video')
        if (videoNode) {
          const {
            attrs: { poster },
            children: [
              {
                attrs: { src }
              }
            ]
          } = videoNode
          // console.log('poster: ', poster, src)
          firstVideoPoster.value = poster || ''
          videoSrc = src || ''
        }
      } else {
        videoSrc = ''
      }
      return videoSrc
    })

    // 阅读次数
    const readingNum = computed(() => {
      let num: number | string = readingCount.value + newsDetail.readAdjustNum
      if (num >= 10000) {
        num = (num / 10000).toFixed(1) + 'w'
      }
      return num
    })

    // 点击富文本
    function handleRichTextClick(e: Event) {
      let href = ''
      // #ifdef MP-WEIXIN
      const nodesValue = nodes?.value?.[0] as AnyObject
      href = nodesValue?.children?.[0]?.attrs?.href
      href && uni.navigateTo({ url: `/package-community/pages/web-view/index?url=${encodeURIComponent(href)}` })
      return
    }

    // 跳转推荐详情
    const gotoDetail = (news: NewsInfo) => {
      uni.navigateTo({
        url: `/package-community/pages/news-detail/news-detail?id=${news.id}&title=${news.title}`
      })
    }

    // 阅读数+1
    async function handleNewsRead() {
      await toNewsRead(newsId.value)
    }

    onMounted(() => {
      getDetail()
      handleNewsRead()
      getRecommendData()
    })
    return {
      newsDetail,
      publishTime,
      getDetail,
      handleNewsRead,
      firstVideoSrc,
      firstVideoPoster,
      readingNum,
      locationIcon,
      eyeIcon,
      recommendData,
      isLeave,
      nodes,
      handleRichTextClick,
      gotoDetail
    }
  },
  onLoad(option: { id: string; title: string }) {
    newsId.value = option.id
    pageTitle.value = option.title
    uni.setNavigationBarTitle({
      title: decodeURI(option.title)
    })
  },
  onShow() {
    isLeave.value = false
  },
  onHide() {
    // 防止富文本解析器内容过长
    isLeave.value = true
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
