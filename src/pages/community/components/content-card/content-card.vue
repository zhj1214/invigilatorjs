<template>
  <view class="content-card" @click="toContentDetail">
    <!-- 头部 -->
    <view class="justify-between header">
      <view class="user-info" @click.stop="goUserHome">
        <sp-avatar-info :title="contentInfo.authorName" :src="contentInfo.authorAvatar">
          <!-- 审核状态 -->
          <view v-if="contentInfo.approvalStatus === 1 || contentInfo.approvalStatus === 3">
            <view v-if="contentInfo.approvalStatus === 1" class="content-item-header-user-status0">审核中，请耐心等待</view>
            <view v-else-if="contentInfo.approvalStatus === 3" class="content-item-header-user-status2" @click.stop="goToReson(contentInfo.id)">审核未通过，查看原因 ></view>
          </view>

          <view v-if="contentInfo.approvalStatus !== 1 && contentInfo.approvalStatus !== 3 && contentInfo.groupName" class="subtitle-group-name">
            来自圈子
            <text class="group-name" @click.stop="goCurrentGroup(contentInfo.groupId)">{{ contentInfo.groupName }}</text>
          </view>
        </sp-avatar-info>
      </view>
      <slot>
        <view v-if="showFollowBtn" class="follow-btn" :class="{ follow: contentInfo.follow }" @click.stop="updateFollow">
          {{ contentInfo.follow ? '已关注' : '关注' }}
        </view>
      </slot>
    </view>

    <!-- 内容区 -->
    <view class="sp-content-center">
      <!-- 文字段落 -->
      <view class="text">
        <text v-if="contentInfo.topicName" class="topic-name" @click.stop="goToTopic">#{{ contentInfo.topicName }}#</text>
        <text>{{ contentInfo.detail.length > 60 ? handleDetail(contentInfo.detail) : contentInfo.detail }}</text>
      </view>
      <!-- 图片 -->
      <view v-if="contentInfo.thumbUrls && contentInfo.thumbUrls.length" class="image-list" :class="imageListType">
        <image v-for="(picSrc, index) in contentInfo.thumbUrls" :key="picSrc" class="image-item" :src="picSrc" mode="aspectFill" @click.stop="handleImagePreview(index)" />
      </view>
    </view>

    <!-- 地址 -->
    <view v-if="showAddress" class="address font-regular">{{ contentInfo.geoPosition }}</view>

    <!-- 底部 -->
    <view v-if="showFooter" class="footer">
      <text class="left">{{ formatTime(contentInfo.releaseTime) }}</text>
      <view class="right flex-row">
        <sp-icon-number :icon="commentIcon">{{ contentInfo.commentCount }}</sp-icon-number>
        <view class="like-btn" @click.stop="handleLikeOrUnLike">
          <sp-icon-number :icon="contentInfo.like ? thumbUpActiveIcon : thumbUpIcon">
            {{ contentInfo.likeCount }}
          </sp-icon-number>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SpContentCard">
import { PropType, inject, reactive, computed, watch, ref, onMounted } from 'vue'
import { toFollowUser, setContentLike, toContentUnlike, getContentDetail } from '@src/api/community'
import { pureAssign } from '@util/common'
import { relogin } from '@src/api/request'
import { formatTime } from '@util/date-time'
import { useAppStore } from '@src/pinia/app'
import { useUserStore } from '@src/pinia/user'

const userStore = useUserStore()

const props = defineProps({
  info: {
    type: Object as PropType<AnyObject>,
    required: true
  },
  showFollowBtn: {
    type: Boolean,
    default: true
  },
  showAddress: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: ''
  },
  showMore: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateFollow', 'getDetail', 'getHostContentList', 'getUserContents', 'getMyContents', 'getContentList'])

onMounted(getUserInfo)

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
// 点赞图片 已点赞图片 评论图片
const [thumbUpIcon, thumbUpActiveIcon, commentIcon] = gdp([
  'icon-thumb-up.png',
  'icon-thumb-up-active.png',
  'icon-comment.png',
  'icon-vote-unfold.png',
  'icon-vote-check.png',
  'icon-vote-multi-check.png'
])
const imageListType = computed(() => {
  let type = 'images-col-1'
  if ((props.info as ContentInfo).thumbUrls?.length === 1) {
    type = 'images-col-1'
  } else if ((props.info as ContentInfo).thumbUrls?.length > 1 && (props.info as ContentInfo).thumbUrls?.length <= 4) {
    type = 'images-col-2'
  } else {
    type = 'images-col-3'
  }
  return type
})

// 获取用户信息
const accountId = ref('')
async function getUserInfo() {
  const user = await userStore.getUserInfo()
  accountId.value = user?.accountId
}

const ifUnfold = ref(false)

//获取当前页面信息
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]

// 登录信息
const isLogin = computed(() => useAppStore().isLogin)

//跳转圈子
const goCurrentGroup = (id: string) => {
  const { groupId, route, options } = currentPage as { groupId: string; route: string; options: { groupId: string }; [key: string]: any }
  if (route === 'package-community/pages/group-home/group-home') {
    // ifdef H5
    if (groupId === id) {
      return
    }
    // endif
    // ifdef MP-WEIXIN
    if (options.groupId === id) {
      return
    }
    // endif
  }
  uni.navigateTo({
    url: `/package-community/pages/group-home/group-home?groupId=${id}`
  })
}

// 跳转话题详情页
const goToTopic = () => {
  const { topicId, route, options } = currentPage as { id: string; route: string; options: { id: string }; [key: string]: any }
  if (route === 'package-community/pages/topic-home/topic-home') {
    // ifdef H5
    if (topicId === (props.info as ContentInfo).topicId) {
      return
    }
    // endif
    // ifdef MP-WEIXIN
    if (options.id === (props.info as ContentInfo).topicId) {
      return
    }
    // endif
  }
  uni.navigateTo({
    url: `/package-community/pages/topic-home/topic-home?id=${(props.info as ContentInfo).topicId}`
  })
}

// 预览图片
const handleImagePreview = (index: number) => {
  uni.setStorageSync('previewImage', true)
  console.log(index, props.info)
  uni.previewImage({
    current: index, //预览图片的下标
    urls: (props.info as ContentInfo).pictureUrls //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
  })
}

/**
 * 跳转用户首页
 */
const goUserHome = () => {
  uni.navigateTo({
    url: `/package-community/pages/user-home/user-home?id=${contentInfo.authorId}`
  })
}

/**
 * 跳转内容详情页面
 */
const toContentDetail = () => {
  const { options, route } = currentPage as { contentId: string; route: string; [key: string]: any }
  if (route === 'package-community/pages/content-detail/content-detail' && options.id === contentInfo.id) {
    return
  }
  uni.navigateTo({
    url: `/package-community/pages/content-detail/content-detail?id=${contentInfo.id}&type=content`
  })
}

/**
 * 跳转内容审核驳回页面
 */
function goToReson(id: string) {
  uni.navigateTo({
    url: `/package-community/pages/audit-rejection/audit-rejection?id=${id}&type=content`
  })
}

// 拷贝内容信息
let contentInfo: ContentInfo = reactive({
  id: '',
  authorId: '',
  authorName: '',
  authorAvatar: '',
  commentCount: 0,
  contentType: 1, // 1->内容,2->动态,3->视频,4-问答,5-投票,6-PK
  createTime: '',
  groupName: '',
  detail: '',
  likeCount: 0,
  like: false,
  pictureUrls: [],
  follow: false,
  groupId: '',
  topicId: '',
  topicName: '',
  thumbUrls: [],
  releaseTime: '',
  geoPosition: '',
  vote: {
    contentId: '',
    joinCount: 0,
    multiFlag: false,
    options: [{ count: '', desc: '', index: 0, selected: false, checked: false }],
    visibilityFlag: false,
    voteCount: 0,
    joined: false
  },
  title: '',
  realDeadline: '',
  approved: false,
  level: 0,
  approvalStatus: 0
})

watch(
  () => props.info,
  (newInfo) => {
    pureAssign(contentInfo, newInfo)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.type,
  (val) => {
    if (val === 'content') {
      ifUnfold.value = true
    }
  },
  { immediate: true }
)

/**
 * 关注人
 */
async function updateFollow() {
  if (!isLogin.value) {
    relogin()
    return
  }
  const { follow, authorId } = contentInfo
  if (!follow) {
    await toFollowUser({ followAccountId: authorId })
    uni.showToast({
      title: '关注成功'
    })
    contentInfo.follow = true
    emit('updateFollow', authorId, true)
  }
}

/**
 * 点赞、取消点赞
 */
async function handleLikeOrUnLike() {
  if (!isLogin.value) {
    relogin()
    return
  }
  const { id, like, likeCount } = contentInfo
  if (!isLogin.value) {
    return uni.navigateTo({ url: '/pages/login/index' })
  }
  like ? await toContentUnlike(id) : await setContentLike(id)
  contentInfo.likeCount = like ? likeCount - 1 : likeCount + 1
  contentInfo.like = !like
  updateContent(id)
}
/**
 * 更新内容点赞状态
 */
async function updateContent(id: string) {
  const { like, likeCount } = (await getContentDetail(id)) as { like: boolean; likeCount: number }
  contentInfo.likeCount = likeCount
  contentInfo.like = like
}

// 计算话题广场内容长度(处理表情符号)
function handleDetail(info: string) {
  const unicode = Array.from(info)[58]?.codePointAt(0)
  let index = unicode && unicode > 0xffff ? 58 + 1 : 58
  return info.slice(0, index) + '...'
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
