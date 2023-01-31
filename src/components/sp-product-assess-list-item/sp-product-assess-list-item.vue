<template>
  <view class="list-item">
    <view @click="checkDetails">
      <view class="list-item-header">
        <view class="list-item-header-left">
          <image class="list-item-header-avator" :src="item.userAvatar || defaultAvatar" mode="aspectFill" />
          <view class="list-item-header-info">
            <view class="list-item-header-info-name ellipsis">{{ item.userName }}</view>
            <view v-if="!!item.topFlag" class="list-item-header-info-label">精选</view>
          </view>
        </view>
        <view class="list-item-header-time">{{ item.createTime }}</view>
      </view>
      <view class="list-item-attr">
        <uni-rate :readonly="true" :value="item.score" color="#7190B0" active-color="#7190B0" :max="5" :size="16" :is-fill="false" />
        <view class="list-item-attr-line" />
        <view class="list-item-attr-text ellipsis">
          <view v-if="itemType === 0" class="">
            <view v-for="(attr, index) in (item.orderItemDto.saleAttrs || []).slice(0, 2)" :key="index">
              {{ attr }}
              <text v-if="index === 0">/</text>
            </view>
          </view>
          <view v-else>
            <text v-for="(i, index) in item.orderItemInfo.attributeMaps || []" :key="index">
              {{ i.attrVal }}
              <text v-if="index < item.orderItemInfo.attributeMaps.length - 1">/</text>
            </text>
          </view>
        </view>
      </view>
      <view class="list-item-context ellipsis-3">{{ item.content }}</view>
    </view>
    <view v-if="item.mediaUrlList && item.mediaUrlList.length > 0" class="list-item-media">
      <!-- <view> -->
      <template v-for="(mediaItem, index) in item.mediaUrlList" :key="index">
        <image v-if="mediaItem.mediaType === 1" class="list-item-media-images" :src="mediaItem.mediaUrl" mode="aspectFill" @click="toImagePreview(item.mediaUrlList, index)" />
        <video
          v-if="mediaItem.mediaType === 2"
          id="myVideo"
          class="list-item-media-video"
          :src="mediaItem.mediaUrl"
          :show-fullscreen-btn="false"
          @play="playVideo"
          @fullscreenchange="toFullscreenchange"
        />
      </template>
      <!-- </view> -->
    </view>
    <view v-if="item.reply.length" class="merchant-reply">
      <view class="reply-content ellipsis-2">
        <text>商家回复：</text>
        {{ item.reply[0].replyContent }}
      </view>
    </view>
  </view>
</template>

<script setup name="SpProductAssessListItem" lang="ts">
import { getCurrentInstance, inject, reactive } from 'vue'
import { handleImagePreview } from '@util/common'
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  },
  itemType: Number
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
const defaultAvatar = gdp('icon-default-avatar.png')
const instance = getCurrentInstance() // 获取主组件的实例
let videoContext = reactive({})
const toFullscreenchange = (e: any) => {
  console.log(e)
}
const toImagePreview = (mediaUrlList: [], index: number) => {
  handleImagePreview(mediaUrlList, index)
}
const playVideo = () => {
  videoContext = uni.createVideoContext('myVideo', instance)
  // videoContext.requestFullScreen({ direction: 0 })
}
// 查看评价详情
const checkDetails = () => {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-detail/index?itemType=${props.itemType}&id=${props.item.id}`
  })
}
</script>

<style lang="scss" scoped>
.list {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;

  &-item {
    width: 100%;
    background-color: #fff;
    padding: 48rpx 0 56rpx;

    &:last-child {
      padding-top: 56rpx;
    }

    &-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-left {
        width: 80%;
        display: flex;
        align-items: center;
      }

      &-avator {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }

      &-info {
        max-width: 60%;
        display: flex;
        align-items: center;

        &-name {
          max-width: 100%;
          height: 41rpx;
          font-size: 28rpx;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 41rpx;
        }

        &-label {
          margin-left: 20rpx;
          padding: 0 12rpx;
          font-size: 22rpx;
          color: #7190b0;
          background: #e4e7ea;
        }
      }

      &-time {
        height: 33rpx;
        font-size: 22rpx;
        font-weight: 400;
        color: #909ca8;
        line-height: 33rpx;
      }
    }

    &-attr {
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &-line {
        width: 1rpx;
        height: 28rpx;
        background: #e4e7ea;
        margin: 0 16rpx;
      }

      &-text {
        width: 70%;
        font-size: 24rpx;
        font-weight: 400;
        color: #92969a;

        > view {
          display: flex;
          width: 100%;
        }
      }
    }

    &-context {
      margin-top: 18rpx;
      width: 100%;
      font-size: 30rpx;
      font-weight: 400;
      color: #292c2e;
      word-break: break-all;
    }

    &-media {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      justify-content: space-between;

      &-images {
        width: 32%;
        height: 212rpx;
        margin-top: 26rpx;
        margin-right: 2%;
        border-radius: 4rpx;

        &:nth-child(3),
        &:nth-child(6) {
          margin-right: 0;
        }
      }

      &-video {
        width: 32%;
        height: 212rpx;
        margin-top: 26rpx;
        border-radius: 4rpx;
      }
    }

    &-media::after {
      content: '';
      flex: auto;
    }

    .merchant-reply {
      background: #f2f3f3;
      padding: 20rpx 24rpx;
      margin-top: 40rpx;

      .reply-content {
        width: 100%;
        color: #696b6c;
        font-size: 28rpx;
        word-break: break-all;

        > text {
          color: #7190b0;
        }
      }
    }
  }
}
</style>
