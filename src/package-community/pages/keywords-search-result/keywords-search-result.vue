<template>
  <view class="search-content">
    <view class="search-content-box">
      <view class="box-fixed">
        <view class="search-box">
          <uni-search-bar v-model="searchValue" bg-color="#fff" :placeholder="placeholder" :is-show-icon="false" cancel-button="none" clear-button="auto" @confirm="handleSearch" />
        </view>
        <!-- 菜单 -->
        <view class="menus">
          <view v-for="(item, index) in menuList" :key="index" :class="activeMenu === item.value ? 'active' : ''" @click="handleMenuChange(item.value)">
            {{ item.name }}
          </view>
        </view>
      </view>
      <!-- 内容列表 -->
      <view v-for="(itemContent, index) in dataLists" :key="index" class="search-result">
        <view class="search-result-item">
          <view v-if="activeMenu === 'all'" class="search-result-item-header">
            <view>
              <text class="searchValue">{{ keywords + ' ' }}</text>
              <text>- {{ itemContent.name }}</text>
            </view>
            <view class="moreIcon" @click="checkMore(itemContent.value)">></view>
          </view>
          <!-- 咨讯 -->
          <template v-if="itemContent.value === 'news'">
            <view v-for="item in itemContent.newsDataLists" :key="item.id" class="search-result-item-content">
              <!--跳转到咨讯的详情页-->
              <navigator><news-item :item="item" /></navigator>
            </view>
          </template>
          <!-- 内容 -->
          <template v-if="itemContent.value === 'contents'">
            <view v-for="item in itemContent.contentDataLists" :key="item.id" class="search-result-item-content">
              <content-item :item="item" />
            </view>
          </template>
          <!-- 用户 -->
          <template v-if="itemContent.value === 'users'">
            <view v-for="item in itemContent.usersDataLists" :key="item.id" class="search-result-item-content">
              <!--跳转到用户的详情页，点人头像进入那个页面-->
              <navigator><users-item :item="item" /></navigator>
            </view>
          </template>
          <!-- 圈子 -->
          <template v-if="itemContent.value === 'circles'">
            <view v-for="item in itemContent.circlesDataLists" :key="item.id" class="search-result-item-content">
              <!--跳转到圈子的首页-->
              <navigator><circles-item :item="item" /></navigator>
            </view>
          </template>
          <!-- 话题 -->
          <template v-if="itemContent.value === 'topic'">
            <view v-for="item in itemContent.topicDataLists" :key="item.id" class="search-result-item-content">
              <!--跳转到话题的详情页-->
              <navigator><topic-item :item="item" /></navigator>
            </view>
          </template>
        </view>
      </view>
      <view v-if="dataLists.length === 0" class="noData">-- 暂无数据 --</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'KeywordsSearchResult',
  // eslint-disable-next-line max-lines-per-function
  setup() {
    let searchValue = ref('')
    let keywords = ref('') as any
    let placeholder = ref('请输入关键字')
    let activeMenu = ref('all') // 全部时每个tab只展示3条数据
    let dataLists = reactive([]) as AnyObject // 若某个tab标签下面无匹配到的内容，从此数组中移除即可
    let menuList = [
      {
        name: '全部',
        value: 'all'
      },
      {
        name: '咨讯',
        value: 'news'
      },
      {
        name: '内容',
        value: 'contents'
      },
      {
        name: '用户',
        value: 'users'
      },
      {
        name: '圈子',
        value: 'circles'
      },
      {
        name: '话题',
        value: 'topic'
      }
    ]

    function handleMenuChange(value: any) {
      activeMenu = value
      toDealDataList(value)
    }
    function toDealKeywords() {
      // 过滤敏感词
      dataLists.forEach((item: AnyObject, index: any) => {
        switch (item.value) {
          case 'news': // 针对资讯的标题进行关键词匹配
            item.newsDataLists.forEach((i: any) => {
              i.content = i.content.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
            })
            break
          case 'contents': // 针对内容文本进行关键词匹配
            item.contentDataLists.forEach((i: any) => {
              i.detail = i.detail.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
            })
            break
          case 'users': // 针对用户昵称进行匹配
            item.usersDataLists.forEach((i: any) => {
              i.nickname = i.nickname.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
            })
            break
          case 'circles': // 针对圈子名称，圈子简介进行匹配
            item.circlesDataLists.forEach((i: any) => {
              i.name = i.name.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
              i.profile = i.profile.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
            })
            break
          case 'topic': // 针对话题的名称进行匹配
            item.topicDataLists.forEach((i: any) => {
              i.title = i.title.replace(new RegExp(keywords, 'g'), `<span style="color: #537EAC;">${keywords.value}</span>`)
              i.title = `# ${i.title} #`
            })
            break
        }
      })
    }
    function handleSearch() {
      keywords = searchValue.value.trim()
      toDealKeywords()
    }
    function toDealDataList(value: any) {
      // 切换tab时直接处理dataLists即可
      dataLists = dataLists.filter((item: { value: any }) => {
        return item.value === value
      })
    }
    function checkMore(value: any) {
      activeMenu = value
      toDealDataList(value)
    }

    return {
      searchValue,
      keywords,
      placeholder,
      activeMenu,
      dataLists,
      menuList,
      handleMenuChange,
      toDealKeywords,
      handleSearch,
      toDealDataList,
      checkMore
    }
  },

  onLoad(option: AnyObject) {
    this.searchValue = option.keywords
    this.keywords = option.keywords
  },

  onShow() {
    this.dataLists[4].topicDataLists.forEach((i: { title: string }) => {
      i.title = `# ${i.title} #`
    })
    this.toDealKeywords()
  }
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
