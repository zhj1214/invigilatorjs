<template>
  <view class="my-content-list">
    <view id="tab" class="sp-header-tabs">
      <sp-tabs underline :menus="tabs" :active-tab="currentTab" @on-click="handleTabChange" />
    </view>

    <!-- 我发布的内容列表 -->
    <view v-show="currentTab === 0" class="my-content">
      <view v-if="contentList.length === 0 && contentIsEnd" class="my-content-none font-normal">
        <image :src="contentNoneIcon" />
        <text>发布第一条动态吧</text>
      </view>

      <view class="my-content-list">
        <view v-for="item in contentList" :key="item.id" class="my-content-item">
          <content-card class="content-card" :info="item" type="myContentList" @get-my-contents="getMyContents">
            <image :src="iconMore" class="more-icon" @click.stop="openPopup(item.id)" />
          </content-card>
        </view>
        <view v-if="contentList.length && contentIsEnd" class="no-more font-normal">-没有更多内容了哦-</view>
      </view>
    </view>

    <!-- 我发布的评论列表 -->
    <view v-show="currentTab === 1" class="my-comment">
      <view v-if="commentList && commentList.length === 0" class="my-comment-none">
        <image :src="contentNoneIcon" />
        <text>快去写一条评论吧</text>
      </view>

      <view class="my-comment-list">
        <view v-for="item in commentList" :key="item.id" class="my-comment-item">
          <view class="my-comment-item-header justify-between">
            <view class="user-info">
              <image :src="item.commenterAvatar || defaultAvatar" class="user-info-avatar" />
              <view class="user-info-center">
                <text class="user-info-name">{{ item.commenterName }}</text>

                <!--approvalStatus   0-待提交 1-待审批 2-审批通过 3-审批驳回-->
                <view v-if="item.approvalStatus === 1" class="comment-status0">审核中，请耐心等待</view>
                <view v-else-if="item.approvalStatus === 3" class="comment-status2" @click.stop="goToReson(item.id)">
                  审核未通过，查看原因 >
                  <!-- <navigator  url="/package-comunity/pages/audit-rejection" hover-class="none">审核未通过，查看原因  ></navigator> -->
                </view>
              </view>
            </view>
            <view class="right-btn">
              <image :src="iconMore" class="more-icon" @click="openPopup(item.id)" />
            </view>
          </view>

          <!-- 评论内容 -->
          <view class="my-comment-item-detail font-normal">
            {{ item.commentContent }}
          </view>

          <!-- 原帖 -->
          <view class="my-comment-item-content" :class="{ gray: !!item.pcomment }">
            <!-- 存在上级评论 -->
            <view v-if="item.pcomment" class="has-pcomment">
              <view v-if="item.pcomment.commentContent" class="pcomment">
                <view class="name">{{ item.pcomment.commenterName }}：</view>
                <view class="content">{{ item.pcomment.commentContent }}</view>
              </view>
              <view v-else class="content-has-delete">该内容已被删除</view>
            </view>

            <view :class="{ 'innder-box': !!item.pcomment }" @click="goToContentDetail(item.contentId)">
              <!-- 原文内容 -->
              <view v-if="item.content">
                <view class="content-header font-normal">
                  <text>原文 |</text>
                  <text v-if="item.content.topicName" class="topic-name" @click.stop="goToTopic(item.content.topicId)"># {{ item.content.topicName }} #</text>
                  <text class="content-detail">{{ item.content.detail }}</text>
                </view>
                <view class="content-date">{{ item.content.releaseTime }}</view>
                <view v-if="item.content.thumbUrls && item.content.thumbUrls.length" class="content-pic">
                  <image :src="item.content.thumbUrls[0]" class="content-image" @click.stop="handleImagePreview(item.content.thumbUrls)" />
                </view>
              </view>

              <view v-else class="content-has-delete">该内容已被删除</view>
            </view>
          </view>

          <!-- 评论时间 -->
          <view class="my-comment-item-footer font-regular">
            <view class="time">{{ formatTime(item.releaseTime) }}</view>
          </view>
        </view>
        <view v-if="commentList.length && commentIsEnd" class="no-more font-normal">-没有更多内容了哦-</view>
      </view>
    </view>

    <!-- 底部功能选择 -->
    <uni-popup ref="popupRef" class="uni-popup" type="bottom" pop-style="z-index:2000" @touchmove.stop.prevent="() => {}">
      <view class="pop-select">
        <view class="list">
          <view class="item" @click="deleteHandler">删除</view>
        </view>
        <view class="line" />
        <view class="cancel item" @click="closePopup">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, Ref } from 'vue'
import { getMyContentList, getMyCommentList, deleteContent, deleteComment, getMultiVote } from '@src/api/community'
import { formatTime } from '@src/util/date-time'
import ContentCard from '@src/pages/community/components/content-card/content-card.vue'
import { throttle } from '@src/lib/lodash'
import { onLoad, onShow, onHide, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

onLoad((options: any) => {
  currentTab.value = Number(options.currentTab)
})

// #ifdef H5
const resize = throttle(
  () => {
    const $header = document.getElementsByClassName('uni-page-head')[0] as HTMLElement
    const top = $header.offsetHeight + $header.offsetTop
    ;(document.getElementById('tab') as HTMLElement).style.top = `${top}px`
  },
  300,
  {
    trailing: false
  }
)
// #endif

onShow(() => {
  refreshList()
  // #ifdef H5
  window.addEventListener('resize', resize, false)
  // #endif
})

// #ifdef H5
onHide(() => {
  window.removeEventListener('resize', resize)
})
// #endif

onPullDownRefresh(refreshList)

onReachBottom(() => {
  if (currentTab.value === 0 && !contentIsEnd.value) {
    contentPageNo.value++
    getMyContents()
  }
  if (currentTab.value === 1 && !commentIsEnd.value) {
    commentPageNo.value++
    getMyComments()
  }
})

const popupRef: Ref<SpPopup | null> = ref(null)

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [contentNoneIcon, defaultAvatar, iconMore] = gdp(['content-none.png', 'icon-default-avatar.png', 'icon-more.png'])

const tabs = [
  { name: '动态', value: 0 },
  { name: '评论', value: 1 }
]

function closePopup() {
  popupRef.value?.close()
}
/**
 * 切换tab
 */
let currentTab = ref(0)
function handleTabChange(value: number) {
  currentTab.value = value
  refreshList()
}

/**
 * 获取我的发布内容
 */
let contentList: Array<AnyObject> = reactive([])
let contentPageNo = ref(1)
let contentIsEnd = ref(false)
async function getMyContents() {
  try {
    const { total, data } = (await getMyContentList({
      pageNo: contentPageNo.value,
      like: true
    })) as AnyObject
    contentPageNo.value === 1 && contentList.splice(0)
    contentList.push(...data)
    let contentIds: string[] = []
    contentList.forEach((item: AnyObject) => {
      if (item.contentType === 5) {
        contentIds.push(item.id)
      }
    })
    if (contentIds.length > 0) {
      getVote(contentIds)
    }
    contentIsEnd.value = contentList.length === total
  } catch (error) {}
}

async function getVote(ids: string[]) {
  try {
    const data = (await getMultiVote({ contentIds: ids.toString() })) as AnyObject
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
    contentList.forEach((item: AnyObject) => {
      for (var key in data) {
        if (item.id === key) {
          item.vote = data[key]
        }
      }
    })
    console.log(contentList, 'contentList')
  } catch {}
}

/**
 * 获取我的发布评论
 */
let commentList: Array<AnyObject> = reactive([])
let commentPageNo = ref(1)
let commentIsEnd = ref(false)
async function getMyComments() {
  try {
    const { total, data } = (await getMyCommentList({
      pageNo: commentPageNo.value,
      like: true
    })) as AnyObject
    commentPageNo.value === 1 && commentList.splice(0)
    commentList.push(...data)
    commentIsEnd.value = commentList.length === total
  } catch (error) {}
}

/**
 * 删除我的发布、评论
 */
let currentCotentId = ref('')
let currentCommentId = ref('')

function openPopup(id: string) {
  currentTab.value === 0 ? (currentCotentId.value = id) : (currentCommentId.value = id)
  popupRef.value?.open()
}

async function deleteHandler() {
  try {
    currentTab.value === 0 ? await deleteContent(currentCotentId.value) : await deleteComment(currentCommentId.value)
    uni.showToast({
      title: '删除成功'
    })
    closePopup()
    currentTab.value === 0
      ? contentList.splice(
          contentList.findIndex((i) => i.id === currentCotentId.value),
          1
        )
      : commentList.splice(
          commentList.findIndex((i) => i.id === currentCommentId.value),
          1
        )
  } catch (error) {}
}

/**
 * 预览图片
 */
function handleImagePreview(pics: string[]) {
  uni.previewImage({
    current: 0,
    urls: pics //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
  })
}

/**
 * 跳转内容详情
 */
function goToContentDetail(id: string) {
  uni.navigateTo({
    url: `/package-community/pages/content-detail/content-detail?id=${id}&type=content`
  })
}

/**
 * 跳转话题详情
 */
function goToTopic(id: string) {
  uni.navigateTo({
    url: `/package-community/pages/topic-home/topic-home?id=${id}`
  })
}

/**
 * 跳转我的评论被驳回理由页面
 */
function goToReson(id: string) {
  uni.navigateTo({
    url: `/package-community/pages/audit-rejection/audit-rejection?id=${id}&type=comments`
  })
}

/**
 * 刷新数据
 */
function refreshList() {
  if (currentTab.value === 0) {
    contentPageNo.value = 1
    contentIsEnd.value = false
    getMyContents()
  } else {
    commentPageNo.value = 1
    commentIsEnd.value = false
    getMyComments()
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
