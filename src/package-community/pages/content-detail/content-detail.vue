<template>
  <view class="content-detail">
    <view class="content-detail-header">
      <view class="justify-between">
        <content-card
          class="content-card"
          :show-more="true"
          :info="detailObj.info"
          :show-footer="false"
          show-address
          :show-follow-btn="detailObj.type !== 'comment'"
          :type="detailObj.type"
          @get-detail="getDetail"
        />
        <view class="like-btn" @click="handleCommentLike(detailObj.info)">
          <sp-icon-number v-if="detailObj.type === 'comment'" :icon="detailObj.info.like ? thumbUpActiveIcon : thumbUpIcon">
            {{ detailObj.info.likeCount }}
          </sp-icon-number>
        </view>
      </view>
      <view class="date">{{ detailObj.info.releaseTime && formatTime(detailObj.info.releaseTime) }}</view>
    </view>

    <view class="content-detail-comment">
      <text class="comment-list-header font-medium">全部回复</text>
      <view class="content-detail-comment-list">
        <view v-if="commentList.length">
          <view v-for="item in commentList" :key="item.id" class="comment-item" @click="!item.pcomment && openPop(item)">
            <view class="justify-between">
              <sp-avatar-info class="user-info" :src="item.commenterAvatar" :title="item.commenterName" :subtitle="formatTime(item.createTime)" />
              <view class="like-btn" @click.stop="handleCommentLike(item)">
                <sp-icon-number :icon="item.like ? thumbUpActiveIcon : thumbUpIcon" direction="row-reverse">
                  {{ item.likeCount }}
                </sp-icon-number>
              </view>
            </view>
            <view class="comment-content">
              {{ item.commentContent }}
            </view>
            <!-- 内容页面评论的评论 -->
            <view v-if="detailObj.type === 'content' && item.commentCount" class="comment-content-comment" @click.stop="goDeepCommentPage(item)">
              {{ item.commentCount }} 回复
              <image :src="rightIcon" class="icon" />
            </view>

            <!-- 二级评论的原文内容 -->
            <view v-if="detailObj.type === 'comment' && item.pcomment" class="comment-parent-info font-regular">
              <template v-if="item.pcomment.commentStatus === 1">
                <text class="name">{{ item.pcomment.commenterName }}:</text>
                {{ item.pcomment.commentContent }}
              </template>
              <text v-else class="name">该评论已被删除</text>
            </view>
          </view>

          <view v-show="isEnd" class="content-detail-comment-list-no-more">-已无更多评论-</view>
        </view>
        <view v-else class="no-comment">暂无评论，立刻写回复抢沙发</view>
      </view>
    </view>

    <view class="content-detail-footer">
      <view class="content-detail-footer-main">
        <view class="content-detail-footer-input" @click="openPop()">
          <input class="uni-input" maxlength="140" placeholder="发表想法..." disabled />
        </view>
        <view class="content-detail-footer-icons">
          <view class="content-detail-footer-icons-comment" @click="openPop()">
            <view v-if="detailObj.info.commentCount" class="badge font-regular">{{ detailObj.info.commentCount }}</view>
            <image class="content-detail-footer-icon" :src="commentIcon" mode="aspectFill" />
          </view>
          <view class="content-detail-footer-icons-like" @click="detailObj.type === 'content' ? handleLikeOrUnLike() : handleCommentLike(detailObj.info)">
            <image class="content-detail-footer-icon" :src="detailObj.info.like ? thumbUpActiveIcon : thumbUpIcon" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>

    <!-- 评论弹框 -->
    <transition name="fade">
      <view v-if="showPop" class="shade" @click="showPop = false">
        <view class="comment" :class="{ showComment: showPop }" @click.stop>
          <view class="innerBox">
            <editor v-show="!isShowTextArea" id="editor" class="comment-detail" @ready="onEditorReady" @input="getEditorContent" />
            <textarea
              v-if="isShowTextArea"
              v-model="comment"
              class="comment-detail"
              :show-confirm-bar="false"
              :auto-focus="true"
              :cursor-spacing="90"
              :maxlength="700"
              :placeholder="placeholder"
              placeholder-style="color:#bababa;font-size: 28rpx;"
              @input="setTextAreaValue"
            />
            <view class="btns">
              <view :class="[!isTureContent ? 'jcsb' : '']">
                <view v-if="!isTureContent" class="tips">内容涉及违规用词，请修改</view>
                <view class="btn" :class="{ disabled: comment.length === 0 }" @click.stop="handleSubmit">发布</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, inject, computed, nextTick } from 'vue'
import {
  getContentDetail,
  setContentLike,
  toContentUnlike,
  getCommentList,
  setCommentLike,
  setCommentunLike,
  toGreenCheck,
  toSensitiveWordCheck,
  toSubmitComment,
  getCommentDetail,
  getSingleVote
} from '@api/community'
import contentCard from '@src/pages/community/components/content-card/content-card.vue'
import { relogin } from '@src/api/request'
import { formatTime } from '@util/date-time'
import { useAppStore } from '@src/pinia/app'

interface CommentsParams {
  pageNo: number
  contentId?: string
  topPid?: string
  like: boolean
  level?: number
}

export default defineComponent({
  name: 'ContentDetail',
  components: {
    contentCard
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    let detailId = ref('')
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [thumbUpIcon, thumbUpActiveIcon, commentIcon, rightIcon] = gdp(['icon-thumb-up.png', 'icon-thumb-up-active.png', 'icon-comment.png', 'icon-right.png'])

    // 登录信息
    const isLogin = computed(() => useAppStore().isLogin)

    /**
     * 查询详情
     */
    const detailObj: { type: string; info: AnyObject } = reactive({
      type: '', //详情类型 content(内容)/comment(评论)
      info: {}
    })
    async function getDetail() {
      if (detailObj.type === 'content') {
        const res = (await getContentDetail(detailId.value)) as AnyObject
        detailObj.info = { ...res }
        if (detailObj.info.contentType === 5) {
          getVote()
        }
      } else {
        const res = await getCommentDetail(detailId.value)
        const { id, contentId, commenterName, commenterAvatar, commentContent, like, likeCount, createTime, commentCount } = res as AnyObject
        const dataObj = {
          id,
          contentId,
          authorName: commenterName,
          authorAvatar: commenterAvatar,
          detail: commentContent,
          like,
          likeCount,
          releaseTime: createTime,
          commentCount: commentCount
        }
        detailObj.info = { ...dataObj }
      }

      //加载评论列表
      pageNo.value = 1
      getComments()
    }

    async function getVote() {
      try {
        const data = (await getSingleVote({ contentId: detailObj.info.id })) as AnyObject
        data.options.map((item: AnyObject) => {
          item.checked = false
        })
        detailObj.info = { ...detailObj.info, vote: { ...data } }
      } catch {}
    }

    /**
     * 获取评论列表
     */
    let commentList: Array<AnyObject> = reactive([])
    let pageNo = ref(1)
    let isEnd = ref(false)
    async function getComments() {
      if (!detailObj.info.id) {
        return
      }
      let params: CommentsParams = {
        pageNo: pageNo.value,
        like: true
      }
      if (detailObj.type === 'content') {
        params['contentId'] = detailObj.info.id
        params['level'] = 1
      } else {
        params['topPid'] = detailObj.info.id
      }

      try {
        const res = (await getCommentList({ ...params })) as AnyObject
        pageNo.value === 1 && commentList.splice(0)
        commentList.push(...res.data)
        isEnd.value = commentList.length === res.total
      } catch (error) {}
    }

    /**
     * 内容点赞、取消点赞
     */
    async function handleLikeOrUnLike() {
      if (!isLogin.value) {
        relogin()
        return
      }
      const { like, likeCount } = detailObj.info
      let id = detailId.value
      like ? await toContentUnlike(id) : await setContentLike(id)
      detailObj.info.likeCount = like ? likeCount - 1 : likeCount + 1
      detailObj.info.like = !like
    }

    /**
     * 评论点赞、取消点赞
     */
    async function handleCommentLike(comment: AnyObject) {
      if (!isLogin.value) {
        relogin()
        return
      }
      const { id, like, likeCount } = comment
      like ? await setCommentunLike(id) : await setCommentLike(id)
      comment.likeCount = like ? likeCount - 1 : likeCount + 1
      comment.like = !like
    }

    /**
     * 打开评论弹框
     */
    let showPop = ref(false)
    let isShowTextArea = ref(true) // 隐藏editor
    let comment = ref('') // 用户填写的评论内容
    let isTureContent = ref(true) // 文本检测结果
    let placeholder = ref('写点什么吧')
    let pid = ref('')
    async function openPop(obj?: AnyObject) {
      if (!isLogin.value) {
        relogin()
        return
      }
      if (obj) {
        pid.value = obj.id
        placeholder.value = `回复@${obj.commenterName}`
      } else {
        pid.value = ''
        placeholder.value = '写点什么吧'
      }
      showPop.value = true
      isShowTextArea.value = true
      comment.value = ''
      isTureContent.value = true
    }

    /**
     * 编辑器初始化完成时触发
     */
    let editorCtx: AnyObject | undefined = {}
    function onEditorReady(this: unknown) {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#editor')
        .context((res) => {
          res.context && (editorCtx = res.context)
        })
        .exec()
    }
    // 获取评论内容
    function getEditorContent() {
      editorCtx?.getContents({
        success: (res: AnyObject) => {
          comment.value = res.text.substring(0, res.text.length - 1) // 删除最后一个换行符,否则会影响长度的判断
          editorHtml.value = res.html
        }
      })
    }
    let editorHtml = ref('')
    function setTextAreaValue() {
      editorHtml.value = `<p>${comment.value}</p>`
    }

    /**
     * 提交评论
     */
    async function handleSubmit() {
      if (comment.value.length) {
        if (comment.value.length > 700) {
          uni.showToast({
            icon: 'none',
            title: '您输入的内容过长，不能超过700字符'
          })
          return
        }
        uni.showLoading({
          title: '检测中...',
          mask: true
        })
        const {
          contentCheckResult: { checkResults, details }
        } = (await toGreenCheck({ text: comment.value })) as AnyObject
        isTureContent.value = checkResults === 1 // 1-文本正常 2-文本违规 3-需要人工审核
        isTureContent.value ? toSensitiveWordCheckHandler() : toDealEditHtml(details, 'level1', checkResults)
        uni.hideLoading()
      }
    }
    // 敏感词预审核
    async function toSensitiveWordCheckHandler() {
      uni.showLoading({
        title: '检测中...',
        mask: true
      })
      const res = (await toSensitiveWordCheck({ text: comment.value })) as Array<{ level: number }>
      uni.hideLoading()
      if (res && res.length > 0) {
        let levelArr = res.map((item: { level: number }) => {
          return item.level
        })
        // eslint-disable-next-line max-lines
        levelFlag.value = levelArr.includes(1) ? 1 : 2 // 1-高 2-低
        // 高亮显示敏感词
        toDealEditHtml(res, 'level2')
        isTureContent.value = false
        toShowModal()
      } else {
        isTureContent.value = true
        toSubmitCommentHandler() // 提交评论
      }
    }

    /**
     * 处理敏感文字高亮显示
     */
    let levelFlag = ref(0)
    function toDealEditHtml(data: Array<AnyObject>, flag: string, checkResults?: number) {
      // 先将之前的文本替换成正常的，否则不修改敏感词继续输入时有bug
      let str = editorHtml.value.replace(new RegExp('<span style="color: red;">', 'g'), '').replace(new RegExp('</span>', 'g'), '')
      data.forEach((item) => {
        if (flag === 'level1') {
          if (item.contexts && item.contexts.length > 0) {
            // 存在contexts 为null,说明整段话语义有问题
            item.contexts.forEach((i: { context: string }) => {
              str = str.replace(new RegExp(i.context, 'g'), `<span style="color: red;">${i.context}</span>`)
            })
            if (checkResults === 3) {
              levelFlag.value = 1
              toShowModal()
            }
          } else if (checkResults === 3 && item.contexts === null) {
            levelFlag.value = 1
            toShowModal()
          }
        } else {
          str = str.replace(new RegExp(item.context, 'g'), `<span style="color: red;">${item.context}</span>`)
        }
      })
      isShowTextArea.value = false // 隐藏textarea输入框
      nextTick(() => {
        editorCtx?.setContents({
          html: `<p>${str}</p>`
        })
        editorCtx?.blur()
      })
    }

    /**
     * 内容违规提示
     */
    function toShowModal() {
      uni.showModal({
        title: '提示',
        content: levelFlag.value === 1 ? '内容可能涉及违规，发布内容需要进入人工审核阶段' : '内容可能涉及违规，发布内容可能会被屏蔽',
        confirmColor: '#292c2e',
        success: async (res) => {
          if (res.confirm) {
            toSubmitCommentHandler()
          } else {
            levelFlag.value = 0
          }
        }
      })
    }

    async function toSubmitCommentHandler() {
      try {
        let params =
          detailObj.type === 'content'
            ? { contentId: detailId.value, commentContent: comment.value, pid: pid.value }
            : { contentId: detailObj.info.contentId, commentContent: comment.value, pid: pid.value || detailId.value }
        await toSubmitComment(params)
        if (levelFlag.value === 1) {
          uni.navigateTo({
            url: `/package-community/pages/my-content-list/my-content-list?currentTab=1`
          })
        } else {
          uni.showToast({
            title: '评论成功'
          })
          detailObj.info.commentCount++
          showPop.value = false
          pageNo.value = 1
          isEnd.value = false
          getComments()
        }
      } catch (error) {}
    }

    /**
     * 跳转评论页面
     */
    function goDeepCommentPage(val: AnyObject) {
      uni.navigateTo({
        url: `/package-community/pages/content-detail/content-detail?id=${val.id}&type=comment`
      })
    }

    return {
      detailId,
      detailObj,
      thumbUpIcon,
      thumbUpActiveIcon,
      commentIcon,
      commentList,
      isEnd,
      showPop,
      isShowTextArea,
      comment,
      isTureContent,
      placeholder,
      getDetail,
      handleLikeOrUnLike,
      formatTime,
      handleCommentLike,
      openPop,
      onEditorReady,
      setTextAreaValue,
      getEditorContent,
      handleSubmit,
      rightIcon,
      goDeepCommentPage,
      getComments,
      pageNo
    }
  },
  onLoad(option: { id: string; type: string }) {
    this.detailId = option.id
    this.detailObj.type = option.type
    uni.setNavigationBarTitle({ title: option.type === 'content' ? '内容详情' : '' })
    uni.pageScrollTo({ duration: 0, scrollTop: 0 })
  },
  onShow() {
    this.getDetail()
  },
  onPullDownRefresh() {
    this.getDetail()
  },
  onReachBottom() {
    if (!this.isEnd) {
      this.pageNo++
      this.getComments()
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
