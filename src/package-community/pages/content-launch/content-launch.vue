<template>
  <view class="content-launch">
    <!-- 文字内容 -->
    <view class="content-launch-text">
      <editor id="editor" class="content-launch-textarea-value" placeholder="编辑动态内容" @ready="onEditorReady" @input="getEditorContent" />
    </view>

    <!-- 上传图片 -->
    <view class="content-launch-images">
      <drag-image
        :enable-del="true"
        :row-num="3"
        :img-list="uploadImgList"
        :ori-list="originalImageList"
        @move-end-list="toMoveEndList"
        @add-img="toChooseImg"
        @del-img="toDelImg"
      />
    </view>

    <!-- 选择圈子 -->
    <view class="content-launch-group" @click="handleGroupSelect">
      <image class="content-launch-group-icon" mode="asceptFit" :src="groupName ? groupIconBlue : groupIconDark" />
      <view class="content-launch-group-name" :style="groupName ? '' : 'color:#1A1A1A'">{{ groupName ? groupName : '请选择圈子' }}</view>
      <image class="content-launch-group-arrow" mode="asceptFit" :src="iconRight" />
    </view>

    <!-- 选择话题 -->
    <view class="content-launch-group" @click="handleTopicSelect">
      <image class="content-launch-group-icon" mode="asceptFit" :src="formData.topicId ? topicIconBlue : topicIconDark" />
      <view class="content-launch-group-name" :style="formData.topicId ? '' : 'color:#1A1A1A'">
        {{ formData.topicId ? topicName : '请选择话题' }}
      </view>
      <image class="content-launch-group-arrow" mode="asceptFit" :src="iconRight" />
    </view>

    <!-- 选择位置 -->
    <view class="content-launch-group" @click="getSettingLocation">
      <image class="content-launch-group-icon" mode="asceptFit" :src="formData.geoPosition ? locationIconBlue : locationIconDark" />
      <view class="content-launch-group-name" :style="formData.geoPosition ? '' : 'color:#1A1A1A'">{{ formData.geoPosition || '请选择位置' }}</view>
      <image class="content-launch-group-arrow" mode="asceptFit" :src="iconRight" />
    </view>

    <!-- 违规提示 -->
    <view v-if="checkResultFlag" class="content-launch-tips">内容涉及违规，请修改</view>

    <!-- 发布按钮 -->
    <view class="content-launch-option">
      <button
        class="content-launch-option-button"
        :class="[!formData.detail || !formData.groupId ? 'content-launch-option-button-disabled' : 'content-launch-option-button-active']"
        :disabled="!formData.detail || !formData.groupId"
        @click="toSubmitForm"
      >
        发布
      </button>
    </view>
    <uni-popup ref="popup" type="center" class="clearSafePadding" @touchmove.stop.prevent="() => {}">
      <pop-dialog
        title="确认发布"
        :content="levelFlag === 1 ? '内容可能涉及违规，发布内容需要进入人工审核阶段' : '内容可能涉及违规，发布内容可能会被屏蔽'"
        mode="launch"
        @confirm="toConfirmRelease"
        @cancel="closePopup"
      />
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject, getCurrentInstance, onMounted, onUnmounted, nextTick, Ref } from 'vue'
import dragImage from '../../components/drag-image/drag-image.vue'
import popDialog from '../../components/pop-dialog/pop-dialog.vue'
import { toFileUpload, toGreenCheck, toSensitiveWordCheck, toContentLaunch, getLastGroup } from '@src/api/community'
import { goBackFn } from '@util/go-back'
import { useUserStore } from '@src/pinia/user'

export default defineComponent({
  name: 'ContentLaunch',
  components: {
    dragImage,
    popDialog
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    onMounted(() => {
      // #ifdef H5
      history.pushState(null, '', document.URL)
      // goBackFn.addEvent('2', goBack)
      // #endif
    })

    onUnmounted(() => {
      // #ifdef H5
      goBackFn.removeEvent('2', goBack)
      // #endif
      uni.hideLoading()
    })

    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [locationIconDark, locationIconBlue, topicIconDark, topicIconBlue, groupIconDark, groupIconBlue, iconRight] = gdp([
      'icon-location-dark.png',
      'icon-location-blue.png',
      'topic-icon-dark.png',
      'topic-icon-blue.png',
      'group-icon-dark.png',
      'group-icon-blue.png',
      'icon-right.png'
    ])
    const instance = getCurrentInstance()

    const uploadImgList = reactive([]) as Array<{ url: string; checkResults?: number }>
    const originalImageList = reactive([]) as Array<{ url: string; checkResults?: number }>
    const lastGroup = reactive({})
    let contentFrom = ref('')
    let from = ref('')
    let levelFlag = ref(0)
    let checkResultFlag = ref(false)

    /**
     * 用户信息
     */
    let loginUserId = ref('')
    async function getUserInfo() {
      const user = await useUserStore().getUserInfo()
      loginUserId.value = user.accountId
    }

    /**
     * 发表内容保存字段对象
     */
    const formData = reactive({
      detail: '',
      pictureUrls: [] as Array<string>,
      contentType: 2,
      groupId: '',
      topicId: '',
      longitude: '',
      latitude: '',
      geoPosition: ''
    })
    let groupName = ref('')
    let topicName = ref('')
    let displayGeoPosition = ref('')

    // 编辑器初始化完成时触发
    // let editorCtx: AnyObject | undefined = reactive({})
    let editorCtx: any = {}
    let editorHtml = ref('')
    function onEditorReady(this: any) {
      nextTick(() => {
        const query = uni.createSelectorQuery().in(this)
        query
          .select('#editor')
          .context((res) => {
            editorCtx = res.context
          })
          .exec()
      })
    }
    function getEditorContent(e: any) {
      // formData.detail = e.detail.text.substring(0, e.detail.text.length - 1) // 删除最后一个换行符,否则会影响长度的判断
      // editorHtml.value = e.detail.html
      // TODO 输入无效，没办法获取值
      editorCtx?.getContents({
        success: (res: AnyObject) => {
          formData.detail = res.text.substring(0, res.text.length - 1) // 删除最后一个换行符,否则会影响长度的判断
          editorHtml.value = res.html
        }
      })
    }

    async function toMoveEndList(e: Array<{ url: string }>, ori: Array<{ url: string }>) {
      uploadImgList.length = 0
      uploadImgList.push(...e)
      originalImageList.length = 0
      originalImageList.push(...ori)
    }
    async function toChooseImg(params: string) {
      const count = 9 - uploadImgList.length
      uni.chooseImage({
        count, // 默认9
        sizeType: ['compressed'], // 指定压缩图，默认二者都有
        sourceType: ['album'], // 从相册选择
        success: async (res: any) => {
          uni.showLoading({
            title: '上传中',
            mask: true
          })
          let resSize = res.tempFiles[0].size
          const isLt50M = resSize / 1024 / 1024 < 50
          if (!isLt50M) {
            uni.showToast({
              title: '上传的图片大小不超过50M',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return
          }
          const filePaths = res.tempFilePaths
          let map = [] as Array<{ url: string; thumbUrl: string }>
          for (let i = 0; i < filePaths.length; i++) {
            map[i] = (await toFileUpload({
              fileType: 'image',
              filePath: filePaths[i],
              name: 'file',
              hideLoading: true
            })) as { url: string; thumbUrl: string }
          }
          uni.hideLoading()
          toDealImgList(map)
        }
      })
    }
    function toDealImgList(map: Array<{ url: string; thumbUrl: string }>) {
      let arr = [] as Array<string>
      let oriArr = [] as Array<string>
      for (let key in map) {
        if (map.hasOwnProperty(key)) {
          oriArr.push(map[key].url)
          arr.push(map[key].thumbUrl)
        }
      }
      for (let i = 0; i < arr.length; i++) {
        uploadImgList.unshift({ url: arr[i] })
      }
      for (let i = 0; i < oriArr.length; i++) {
        originalImageList.unshift({ url: oriArr[i] })
      }
    }
    async function toDelImg(e: number) {
      uploadImgList.splice(e, 1)
      originalImageList.splice(e, 1)
    }

    /**
     * 选择圈子
     */
    function handleGroupSelect() {
      uni.navigateTo({
        url: `/package-community/pages/user-groups/user-groups?id=${loginUserId.value}&type=choose&selected=${formData.groupId}`
      })
    }

    /**
     * 选择话题
     */
    function handleTopicSelect() {
      uni.navigateTo({
        url: `/package-community/pages/choose-topic/choose-topic?selected=${formData.topicId}`
      })
    }

    /**
     * 选择位置
     */
    let locationId = ref('')
    async function getSettingLocation() {
      // 获取权限跳转选择位置
      // #ifdef MP-WEIXIN
      try {
        const res = await wx.getSetting()
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              console.log(res)
              getLocation()
            },
            fail() {
              uni.navigateTo({
                url: 'package-community/pages/choose-location/choose-location?latitude=&longitude=&locationId='
              })
            }
          })
        } else {
          getLocation()
        }
      } catch (err) {}
      // #endif
      // #ifdef H5
      getLocation()
      // #endif
    }
    function getLocation() {
      uni.showLoading({
        title: '定位中，请稍后',
        mask: true
      })
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.navigateTo({
            url: `/package-community/pages/choose-location/choose-location?latitude=${res.latitude}&longitude=${res.longitude}&locationId=${locationId.value}`
          })
        },
        complete: () => uni.hideLoading()
      })
    }
    /**
     * 提交动态
     */
    // eslint-disable-next-line max-lines-per-function
    function toSubmitForm() {
      if (formData.detail && formData.detail.length > 700) {
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
      formData.pictureUrls = [] // 先清空再赋值
      originalImageList
        .filter((item) => item.url)
        .map((el) => {
          formData.pictureUrls.push(el.url)
        })
      let data = {
        text: formData.detail,
        imageUrls: formData.pictureUrls
      }
      // 绿网文本和图片预审核
      toGreenCheck(data)
        .then((res) => {
          // 重置levelFlag
          levelFlag.value = 0
          let resData = res as AnyObject
          let checkResults = resData.contentCheckResult.checkResults
          checkResultFlag.value = resData.contentCheckResult.checkResults !== 1 // 1-文本正常 2-文本违规 3-需要人工审核
          let imageCheckResultFlag = true
          resData.imageCheckResult &&
            resData.imageCheckResult.length > 0 &&
            resData.imageCheckResult.forEach((item: { imageUrl: string; checkResults: number }, index: number) => {
              if (originalImageList[index].url === item.imageUrl) {
                uploadImgList[index]['checkResults'] = item.checkResults
                if (item.checkResults !== 1) {
                  imageCheckResultFlag = false
                } // 是否有图片不符合规定
              }
            })
          if (!checkResultFlag.value) {
            imageCheckResultFlag && toSensitiveWordCheckAction()
          }
          // 绿网审核通过进行敏感词预审核
          else {
            toDealEditHtml(resData.contentCheckResult.details, 'level1', checkResults)
          }
          uni.hideLoading()
        })
        .catch((err) => {
          // 1、异常情况下，绿网无响应时，持续请求10s,页面显示检测中
          // 2、超出10s还没有响应，跳过绿网审核，当做绿网放行处理，继续匹配敏感词
          if (err.errMsg === 'request:fail timeout') {
            // eslint-disable-next-line max-lines
            toSensitiveWordCheck({ text: '' })
          }
        })
    }

    const popup: Ref<SpPopup | null> = ref(null)

    function openPopup() {
      popup.value?.open()
    }
    function closePopup() {
      popup.value?.close()
    }

    // 处理敏感文字高亮显示
    function toDealEditHtml(data: Array<{ contexts?: Array<{ context: string }>; context: string }>, flag: string, checkResults?: number) {
      // 先将之前的文本替换成正常的，否则不修改敏感词继续输入时有bug
      let str = editorHtml.value.replace(new RegExp('<span style="color: red;">', 'g'), '').replace(new RegExp('</span>', 'g'), '')
      data.forEach((item) => {
        if (flag === 'level1') {
          if (item.contexts && item.contexts.length > 0) {
            // 存在contexts 为null,说明整段话语义有问题
            item.contexts.forEach((i) => {
              str = str.replace(new RegExp(i.context, 'g'), `<span style="color: red;">${i.context}</span>`)
            })
            if (checkResults === 3) {
              levelFlag.value = 1
              openPopup()
            }
          } else if (checkResults === 3 && item.contexts === null) {
            levelFlag.value = 1
            openPopup()
          }
        } else {
          str = str.replace(new RegExp(item.context, 'g'), `<span style="color: red;">${item.context}</span>`)
        }
      })
      editorCtx.setContents({
        html: '<p>' + str + '</p>'
      })
      editorCtx.blur()
    }
    // 敏感词预审核
    function toSensitiveWordCheckAction() {
      uni.showLoading({
        title: '检测中...',
        mask: true
      })
      toSensitiveWordCheck({ text: formData.detail }).then((res: any) => {
        uni.hideLoading()
        if (res && res.length > 0) {
          let levelArr = res.map((item: AnyObject) => {
            return item.level
          })
          levelFlag.value = levelArr.includes(1) ? 1 : 2 // 1-高 2-低
          // 高亮显示敏感词
          toDealEditHtml(res, 'level2')
          checkResultFlag.value = true
          openPopup()
        } else {
          checkResultFlag.value = false
          handleRelease()
        }
      })
    }
    function handleRelease() {
      // 选择不发布到圈子
      if (formData.groupId === '0') {
        formData.groupId = ''
      }
      // 选择不显示位置
      if (formData.geoPosition === '不显示位置') {
        formData.geoPosition = ''
      }
      toContentLaunch(formData).then((res: any) => {
        if (res) {
          if (levelFlag.value === 1) {
            uni.navigateTo({
              url: '/package-community/pages/my-content-list/my-content-list'
            })
          } else {
            if (from.value) {
              // #ifdef MP-WEIXIN
              wx.disableAlertBeforeUnload()
              // #endif
              uni.navigateBack({ delta: 1 })
            } else {
              uni.switchTab({
                url: '/pages/community/community'
              })
            }
          }
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }

    // 确认发布
    function toConfirmRelease() {
      handleRelease()
    }

    // 进入页面获取用户上一条发布所在的圈子
    function getLastGroupInfo() {
      getLastGroup().then((res: any) => {
        if (!res) {
          return
        }
        Object.assign(lastGroup, res)
        formData.groupId = res.id
        groupName.value = res.groupName
      })
    }

    function goBack() {
      uni.showModal({
        title: '提示',
        content: '是否确认退出',
        success: (res) => {
          if (res.confirm) {
            goBackFn.removeEvent('2', goBack)
            uni.navigateBack({ delta: 1 })
          } else {
            history.pushState(null, '', document.URL)
          }
        }
      })
    }

    return {
      contentFrom,
      from,
      formData,
      groupName,
      topicName,
      displayGeoPosition,
      locationId,
      locationIconDark,
      locationIconBlue,
      topicIconDark,
      topicIconBlue,
      groupIconDark,
      groupIconBlue,
      iconRight,
      levelFlag,

      getLastGroupInfo,
      getUserInfo,
      uploadImgList,
      originalImageList,
      onEditorReady,
      getEditorContent,
      handleGroupSelect,
      handleTopicSelect,
      getSettingLocation,
      checkResultFlag,

      toMoveEndList,
      toChooseImg,
      toDelImg,
      toSubmitForm,
      closePopup,
      toConfirmRelease,
      goBack
    }
  },
  onLoad(option: ContentLaunchOption) {
    this.getUserInfo()
    if (option.topicName) {
      this.topicName = option.topicName
      this.formData.topicId = option.topicId
      this.from = option.from
    } else if (option.groupName) {
      this.groupName = option.groupName
      this.formData.groupId = option.groupId
      this.from = option.from
    }
    // 来自首页
    if (!option.from) {
      this.getLastGroupInfo()
    }
  },
  onShow() {
    // 选择后回跳
    if (uni.getStorageSync('currentGroupId')) {
      this.formData.groupId = uni.getStorageSync('currentGroupId')
      this.groupName = uni.getStorageSync('currentGroupName')
    }
    if (uni.getStorageSync('currentTopicId')) {
      this.formData.topicId = uni.getStorageSync('currentTopicId')
      this.topicName = uni.getStorageSync('currentTopicName')
    }

    const { geoPosition, locationId, longitude, latitude } = uni.getStorageSync('currentLocation')
    this.formData.geoPosition = geoPosition || ''
    this.formData.longitude = longitude || ''
    this.formData.latitude = latitude || ''
    this.locationId = locationId || ''
    // #ifdef H5
    goBackFn.addEvent('2', this.goBack)
    // #endif
    // #ifdef MP-WEIXIN
    wx.enableAlertBeforeUnload({
      message: '是否确认退出'
    })
    // #endif
  },
  onHide() {
    // #ifdef H5
    goBackFn.removeEvent('2', this.goBack)
    // #endif
    // #ifdef MP-WEIXIN
    wx.disableAlertBeforeUnload()
    // #endif
  },
  onUnload() {
    // #ifdef H5
    goBackFn.removeEvent('2', this.goBack)
    // #endif
    // #ifdef MP-WEIXIN
    wx.disableAlertBeforeUnload()
    // #endif
    // 重置所有选择项
    uni.removeStorageSync('currentGroupId')
    uni.removeStorageSync('currentGroupName')
    uni.removeStorageSync('currentTopicId')
    uni.removeStorageSync('currentTopicName')
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
