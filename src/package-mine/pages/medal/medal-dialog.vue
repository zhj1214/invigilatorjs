<template>
  <view class="medal-dialog">
    <view class="zan-dialog" catchtouchmove="true">
      <view class="zan-dialog-mask" :style="showDialog ? 'display:block' : ''" @click="toggleDialog" />
      <view class="zan-dialog-container" :style="showDialog ? 'display:block' : ''">
        <view class="content">
          <image :src="medalCloseIcon" class="close" @click="close" />
          <image :src="medalInfo.medalIconUrl" class="medal-img" :class="!ifLightUp ? 'gray' : ''" />
          <view v-if="ifLightUp" class="time">{{ formatDate(medalInfo.gainTime) }}获得</view>
          <view class="name">{{ medalInfo.medalName }}</view>
          <rich-text :nodes="medalInfo.description" class="desc" />
          <view v-if="ifLightUp && ifCurUser" class="btn" @click="goToShare">炫耀一下</view>
          <view class="foot">
            <view v-if="!ifLightUp" class="text">未获得</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="MedalDialog">
import { ref, inject, watch, reactive } from 'vue'
import { getMedalDetails } from '@src/api/community'
import { pureAssign } from '@util/common'
import { formatDate } from '@util/date-time'
const props = defineProps({
  medalId: {
    type: String,
    default: ''
  },
  ifLightUp: {
    type: Boolean,
    default: false
  },
  accountId: {
    type: String,
    default: ''
  },
  ifCurUser: {
    type: Boolean,
    default: true
  }
})
let medalInfo: MedalInfo = reactive({
  id: '',
  medalName: '',
  ifLightUp: false,
  medalIconUrl: '',
  gainTime: '',
  description: '',
  gainPopupDescription: ''
})
watch(
  () => props.medalId,
  (val) => {
    Object.assign(medalInfo, {
      id: '',
      medalName: '',
      ifLightUp: false,
      medalIconUrl: '',
      gainTime: '',
      description: '',
      gainPopupDescription: ''
    })
    getMedalDetail()
  }
)
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [medalCloseIcon] = gdp(['icon-medal-close.png'])
let showDialog = ref(false)
const open = () => {
  showDialog.value = true
}
const close = () => {
  showDialog.value = false
}
const toggleDialog = () => {
  showDialog.value = !showDialog.value
}
const goToShare = () => {
  uni.navigateTo({
    url: `/package-mine/pages/medal-share/index?medalId=${props.medalId}&accountId=${props.accountId}`
  })
}
const getMedalDetail = async () => {
  const data = (await getMedalDetails({ medalId: props.medalId, accountId: props.accountId })) as AnyObject
  pureAssign(medalInfo, { ...data })
}
defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.zan-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgb(0 0 0 / 70%); /* 设置阴影半透明背景如： background: rgba(0, 0, 0, 0.4); */
  display: none;
}

.zan-dialog-container {
  position: fixed;
  transform: translate(-50%, -50%); /* 弹框弹出距离，与弹框布局高度有关，如300%表示弹起距离为3倍弹窗高度 */
  transition: all 0.4s ease;
  z-index: 12;

  /* #ifdef MP-WEIXIN */
  top: 63.5%;
  /* #endif */

  /* #ifdef H5 */
  top: 61%;
  /* #endif */
  left: 50%;
  display: none;
  height: 100%;
  width: 100%;
  padding: 0 86rpx;

  .content {
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    display: flex;
    flex-direction: column;
    align-items: center;

    .close {
      width: 70rpx;
      height: 70rpx;
      margin-left: auto;
      margin-bottom: 118rpx;
    }

    .medal-img {
      width: 420rpx;
      height: 420rpx;
    }

    .gray {
      filter: grayscale(100%);
      filter: gray;
    }

    .time {
      margin-top: 14rpx;
      font-size: 28rpx;
      color: #bdbdbd;
    }

    .name {
      margin-top: 100rpx;
      font-size: 46rpx;
      color: #fff;
      margin-bottom: 22rpx;
    }

    .desc {
      font-size: 36rpx;
      color: #8e8e8e;
      margin-bottom: 22rpx;
    }

    .btn {
      margin-top: 76rpx;
      width: 100%;
      height: 108rpx;
      line-height: 108rpx;
      text-align: center;
      background: #2a7cf3;
      border-radius: 4rpx;
      font-size: 36rpx;
      color: #fff;
    }

    .foot {
      margin-top: 194rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .text {
        margin-bottom: 88rpx;
        font-size: 32rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        color: #8e8e8e;
      }
    }
  }
}

.zan-dialog-show {
  display: block;
}
</style>
