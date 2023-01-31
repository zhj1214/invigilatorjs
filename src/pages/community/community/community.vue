<template>
  <view>
    <sp-tabs v-show="tabFix" :menus="menus" underline :style="{ position: tabFix ? 'fixed' : '', top: tabFix ? `${fixTop}px` : '', zIndex: tabFix ? 999 : '', width: '100%' }" />
    <scroll-view :refresher-triggered="isRefresh" scroll-y refresher-enabled class="community-page" @refresherrefresh="onRefresh" @scrolltolower="onScrolltolower" @scroll="scroll">
      <sp-title-bar class="sp-title-bar" :title="groupTitle" :btn-text="groupTitle === '发现圈子' ? '更多' : '发现圈子'" @on-click="toAllGroupPage" />
      <scroll-view scroll-x class="group-scroll" @touchmove.stop>
        <view class="circle-list">
          <view v-for="item in groupList" :key="item.id" class="sp-title-image" @click="goCurrentGroup(item.id)">
            <title-image :title="item.groupName" :image="item.logoUrl" />
          </view>
        </view>
      </scroll-view>
      <sp-title-bar class="sp-title-bar" title="话题广场" @on-click="toAllTopicPage" />
      <scroll-view scroll-x class="topic-scroll" @touchmove.stop>
        <view class="topic-list">
          <view v-for="item in topicList" :key="item.id" class="sp-mask-image" @click="toTopicHome(item.id)">
            <mask-image :title="`# ${item.topicName} #`" :subtitle="`${item.contentCount}篇内容`" :image="item.logoUrl" />
          </view>
        </view>
      </scroll-view>

      <!-- 二级tab -->
      <view style="height: 98rpx">
        <sp-tabs v-show="!tabFix" id="tab-content" class="tab-content" :menus="menus" underline />
      </view>

      <sp-title-bar class="sp-title-bar" title="热门动态" hiden-btn />
      <view class="square-list">
        <view v-for="item in hostContentList" :key="item.id" class="square-list-item">
          <content-card :info="item" show-address type="hostContent" @update-follow="updateFollow" @get-host-content-list="getHostContentList" />
        </view>
        <view v-if="hostContentList.length === 0" class="comunity-content-none font--normal">暂无更多内容</view>
        <view v-if="hostContentList.length && isEnd" class="comunity-content-no-more font--normal">-没有更多内容了哦-</view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, computed } from 'vue'
import TitleImage from '../components/title-image/title-image.vue'
import MaskImage from '../components/mask-image/mask-image.vue'
import contentCard from '../components/content-card/content-card.vue'
import { getAllGroupList, getMyGroupList, getTopicsList, getHotContentList, getMultiVote } from '@api/community'
import { useAppStore } from '@src/pinia/app'

export interface Community {
  isRefresh: boolean
}

export default defineComponent({
  name: 'Community',
  components: {
    TitleImage,
    MaskImage,
    contentCard
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    const appStore = useAppStore()

    /**
     * 登录信息
     */
    const isLogin = computed(() => appStore.isLogin)

    /**
     * 圈子数据
     */
    let groupTitle: Ref<string> = ref('我的圈子')
    const groupList: GroupInfo[] = reactive([])
    const getMyGroups = async () => {
      try {
        const res = (await getMyGroupList({ pageNo: 1 })) as { data: Array<object> }
        const groups = res.data.map((i: AnyObject) => ({
          id: i.id,
          groupName: i.groupName,
          logoUrl: i.logoUrl
        })) as GroupInfo[]
        groupList.splice(0)
        groupList.push(...groups)
        if (!groups.length) {
          getAllGroup()
        } else {
          groupTitle.value = '我的圈子'
        }
      } catch (error) {}
    }
    const getAllGroup = async () => {
      groupTitle.value = '发现圈子'
      try {
        const res = (await getAllGroupList()) as { data: Array<object> }
        const groups = res.data.map((i: AnyObject) => ({
          id: i.id,
          groupName: i.groupName,
          logoUrl: i.logoUrl
        })) as GroupInfo[]
        groupList.splice(0)
        groupList.push(...groups)
      } catch (error) {}
    }

    /**
     * 话题广场
     */
    const topicList: TopicInfo[] = reactive([])
    const getTopicData = async () => {
      try {
        const res = (await getTopicsList({ pageNo: 1, pageSize: 10 })) as { data: Array<object> }
        const topics = res.data.map((i: AnyObject) => ({
          id: i.id,
          topicName: i.topicName,
          contentCount: i.contentCount,
          logoUrl: i.logoUrl
        })) as TopicInfo[]
        topicList.splice(0)
        topicList.push(...topics)
        topicList.splice(5)
      } catch (error) {}
    }

    /**
     * 广场---热门列表
     */
    let isEnd = ref(false)
    let pageNo: Ref<number> = ref(1)
    const hostContentList: ContentInfo[] = reactive([])
    const getHostContentList = async () => {
      try {
        const res = (await getHotContentList({
          // contentType: 2,
          like: true,
          follow: true,
          pageSize: hostContentList.length > 10 ? hostContentList.length : 10,
          pageNo: pageNo.value
        })) as {
          data: Array<ContentInfo>
          total: number
        }
        pageNo.value === 1 && hostContentList.splice(0)
        hostContentList.push(...res.data)
        let contentIds: string[] = []
        hostContentList.forEach((item: AnyObject) => {
          if (item.contentType === 5) {
            contentIds.push(item.id)
          }
        })
        if (contentIds.length > 0) {
          getVote(contentIds)
        }
        isEnd.value = hostContentList.length === res.total
      } catch (error) {}
    }

    async function getVote(ids: string[]) {
      try {
        const data = (await getMultiVote({ contentIds: ids.toString() })) as Array<Array<Array<object>>>
        let idList: string[] = []
        for (let key in data) {
          idList.push(key)
          for (let o in data[key]) {
            if (o === 'options') {
              data[key][o].map((item: AnyObject) => {
                item.checked = false
              })
            }
          }
        }
        hostContentList.forEach((item: AnyObject) => {
          for (var key in data) {
            if (item.id === key) {
              item.vote = data[key]
            }
          }
        })
      } catch {}
    }

    /**
     *  获取菜单栏距离文档顶部的距离
     */
    let tabTop = ref(0)
    const initClientRect = () => {
      // #ifdef H5
      tabTop.value = document.getElementById('tab-content')?.offsetTop || 298
      // #endif
      // #ifdef MP-WEIXIN
      tabTop.value = 298
      // #endif
    }

    /**
     * 监听滚动
     */
    let tabFix = ref(false)
    let fixTop = ref(0)
    const scroll = (e: AnyObject) => {
      let winWidth = uni.getSystemInfoSync().windowWidth
      const rpx = 750 / winWidth
      // 当页面滚动距离scrollTop > tabTop菜单栏距离文档顶部的距离时，菜单栏固定定位
      if (e.detail.scrollTop === tabTop.value) {
        return
      }
      if (e.detail.scrollTop >= tabTop.value) {
        tabFix.value = true
        fixTop.value = statusBarHeight.value + 168 / rpx
      } else {
        tabFix.value = false
        fixTop.value = 0
      }
    }

    /**
     * 跳转圈子首页
     */
    const goCurrentGroup = (groupId: string) => {
      uni.navigateTo({
        url: `/package-community/pages/group-home/group-home?groupId=${groupId}`
      })
    }

    /**
     * 跳转全部圈子页面
     */
    const toAllGroupPage = () => {
      uni.navigateTo({
        url: `/package-community/pages/all-group/all-group`
      })
    }

    /**
     * 跳转全部话题页面
     */
    const toAllTopicPage = () => {
      uni.navigateTo({
        url: `/package-community/pages/all-topic/all-topic`
      })
    }

    /**
     * 跳转话题首页
     */
    const toTopicHome = (id: string) => {
      uni.navigateTo({
        url: `/package-community/pages/topic-home/topic-home?id=${id}`
      })
    }

    const statusBarHeight = computed(() => appStore.statusBarHeight)
    onMounted(() => {
      tabFix.value = false
      initClientRect()
    })

    const menus = reactive([
      { name: '广场', value: '1' }
      // { name: '关注', value: '2' }
    ])
    const isRefresh: Ref<boolean> = ref(false)
    const onRefresh = async () => {
      isRefresh.value = true
      try {
        isLogin.value ? await getMyGroups() : await getAllGroup()
        await getTopicData()
        pageNo.value = 1
        await getHostContentList()
        isRefresh.value = false
      } catch (error) {
        isRefresh.value = false
      }
    }
    const onScrolltolower = async () => {
      if (!isEnd.value) {
        pageNo.value++
        getHostContentList()
      }
    }

    /**
     * 关注、取消关注后刷新列表数据
     */
    function updateFollow(authorId: string, follow: boolean) {
      hostContentList.forEach((item) => {
        item.authorId === authorId && (item.follow = follow)
      })
    }
    return {
      isLogin,
      groupTitle,
      menus,
      groupList,
      topicList,
      hostContentList,
      isRefresh,
      tabFix,
      fixTop,
      tabTop,
      isEnd,
      getHostContentList,
      onRefresh,
      onScrolltolower,
      goCurrentGroup,
      toAllGroupPage,
      toAllTopicPage,
      toTopicHome,
      scroll,
      updateFollow,
      getVote
    }
  },
  onShow() {
    document.body.style.overflow = 'hidden'
    const ooo = '121'
    console.log('main --  a.b', ooo.eee.ff)
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
      ;(document.querySelector('.community-page') as HTMLElement)?.style.setProperty('--vh', windowsVH + 'px')
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
