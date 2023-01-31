<template>
  <view class="information-page">
    <view class="news-tab-box">
      <sp-tabs underline :menus="newsCategory" @on-click="handleTabChange" />
    </view>
    <scroll-view :refresher-triggered="isRefresh" scroll-y :refresher-enabled="true" class="scroll-list" @refresherrefresh="onRefresh" @scrolltolower="onScrolltolower">
      <view class="list">
        <view v-if="newsList.length">
          <view v-for="(item, i) in newsList" :key="i" class="list-item justify-center" @click="gotoDetail(item)">
            <view v-if="i < 3" class="big-card">
              <image :src="item.pictures.lifeImg" class="image" />
              <view v-if="item.labelName" class="label font-medium">
                {{ item.labelName }}
              </view>
              <text class="title">{{ item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title }}</text>
            </view>

            <sp-image-card v-else :title="item.title" :subtitle="item.readNum" :icon="eyeIcon" :image="item.pictures.lifeImg" />
          </view>
          <view v-if="newsList.length && isEnd" class="news-list-nomore">到底啦～</view>
        </view>
        <view v-else class="news-list-none">
          <!-- <image class="news-list-none-image" :src="imgUrl.empty" /> -->
          <view class="news-list-none-text">暂无相关内容</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, reactive, watch, inject } from 'vue'
import { getNewsCategory, getNewsList, getContentsRecommendList, getContentsFeedlist } from '@api/community'

/**
 * 资讯分类列表
 */
let currentTypeId: Ref<string> = ref('0')
let newsCategory: Array<{ name: string; value: string }> = reactive([{ value: '0', name: '推荐' }])

const getNewsCategoryList = async () => {
  const res = (await getNewsCategory({
    pageSize: 2147483647,
    pageNo: 1
  })) as { data: Array<NewsTypeInfo> }
  newsCategory.splice(1, newsCategory.length)
  res.data.forEach((i: NewsTypeInfo) => {
    newsCategory.push({
      name: i.name,
      value: i.id
    })
  })
  currentTypeId.value = newsCategory[0].value
  getNewsData()
}

/**
 * 获取分类下数据
 */
let currentTab = ref(0)
let newsList: Array<NewsInfo> = reactive([])
let pageNo = ref(1)
let isEnd = ref(false)
let isRefresh = ref(false)
const getNewsData = async () => {
  // 推荐资讯数据
  let list = []
  if (currentTypeId.value === '0') {
    const recommendListRes =
      pageNo.value === 1 ? ((await getContentsRecommendList({ pageNo: 1, pageSize: 3 })) as { data: Array<NewsInfo> }) : ({ data: [] } as { data: Array<NewsInfo> })
    const feedlistRes = (await getContentsFeedlist({ pageNo: pageNo.value, pageSize: 10 })) as { data: Array<NewsInfo> }
    list = [...recommendListRes.data, ...feedlistRes.data]
  } else {
    const res = (await getNewsList({ typeId: currentTypeId.value, pageSize: 10, pageNo: pageNo.value })) as { data: Array<NewsInfo>; total: number }
    list = [...res.data]
    isEnd.value = res.total === newsList.length + list.length
  }
  if (!list.length) {
    return
  }
  pageNo.value === 1 && newsList.splice(0, newsList.length)
  list.forEach((i: NewsInfo) => {
    newsList.push(i)
  })
}

export default defineComponent({
  name: 'CommunityInformation',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [eyeIcon] = gdp(['icon-eye.png'])

    /**
     * 切换资讯类型
     * @return {*}
     */
    function handleTabChange(id: string) {
      currentTypeId.value = id
    }

    watch(currentTypeId, () => {
      newsList.splice(0, newsList.length)
      pageNo.value = 1
      isEnd.value = false
      getNewsData()
    })

    onMounted(() => {
      getNewsCategoryList()
    })

    const onRefresh = async () => {
      pageNo.value = 1
      isRefresh.value = true
      isEnd.value = false
      await getNewsData()
      isRefresh.value = false
    }
    const onScrolltolower = () => {
      if (!isEnd.value) {
        pageNo.value++
        getNewsData()
      }
    }

    // 跳转详情页
    const gotoDetail = (news: NewsInfo) => {
      uni.navigateTo({
        url: `/package-community/pages/news-detail/news-detail?id=${news.id}&title=${news.title}`
      })
    }

    return {
      newsCategory,
      newsList,
      currentTypeId,
      isEnd,
      isRefresh,
      onRefresh,
      onScrolltolower,
      gotoDetail,
      eyeIcon,
      currentTab,
      handleTabChange
    }
  },
  onShow() {
    document.body.style.overflow = 'hidden'
  },
  onHide() {
    document.body.style.overflow = ''
  },
  // #ifdef  H5
  mounted() {
    // 解决safari浏览器底部操作栏遮挡问题
    document.body.style.overflow = 'hidden'
    function onSafariHacks() {
      let windowsVH = window.innerHeight
      ;(document.querySelector('.information-page') as HTMLElement)?.style.setProperty('--vh', windowsVH + 'px')
    }
    onSafariHacks()
    window.addEventListener('resize', function () {
      onSafariHacks()
    })
  },
  onUnload() {
    document.body.style.overflow = ''
  }
  // #endif
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
