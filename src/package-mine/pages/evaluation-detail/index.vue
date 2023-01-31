<template>
  <view class="content-box">
    <!--商品信息-->
    <!--整车订单-->
    <template v-if="itemType === 0">
      <view class="car-order-item">
        <!--数据结构不一致，所以需要判断取值-->
        <template v-if="orderInfo.orderItemDto">
          <view class="card" :style="{ backgroundImage: 'url(' + orderInfo.orderItemDto?.carVehicleImg + ')' }">
            <view class="title">
              <text class="ellipsis">{{ orderInfo.orderItemDto?.vehicleTitle }}</text>
            </view>
            <view class="text-configure">
              <view v-for="(attr, index) in orderInfo.orderItemDto?.saleAttrs.slice(0, 2)" :key="index">
                {{ attr }}
              </view>
              <view>...</view>
            </view>
          </view>
        </template>
      </view>
    </template>
    <!--生活订单-->
    <template v-if="itemType === 1">
      <view class="life-order-item">
        <view class="detail-img">
          <image :src="orderInfo.orderItemInfo?.itemImage" mode="aspectFit" />
        </view>
        <view class="detail-other">
          <view class="detail-sku">
            <view class="item-name ellipsis">{{ orderInfo.orderItemInfo?.itemName }}</view>
            <view class="attrs ellipsis">
              <text v-for="(item, index) in orderInfo?.orderItemInfo?.attributeMaps || []" :key="index">
                <text>{{ item.attrVal }}</text>
                <text v-show="index < orderInfo.orderItemInfo?.attributeMaps.length - 1">/</text>
              </text>
            </view>
          </view>
        </view>
      </view>
    </template>
    <!--评价信息-->
    <view class="evaluation-details">
      <view class="header-info">
        <view class="user-info">
          <image mode="aspectFill" :src="orderInfo.userAvatar || avatar" />
          <text>{{ orderInfo.userName }}</text>
        </view>
        <view class="date">{{ orderInfo.createTime }}</view>
      </view>
      <view>
        <uni-rate :value="orderInfo.score" size="16" color="#BBC8D6" active-color="#7190B0" margin="2" :readonly="true" :is-fill="false" />
      </view>
      <!--评价内容-->
      <view class="content">
        <view class="text-description">{{ orderInfo.content }}</view>
        <view class="image-video">
          <template v-for="(item, index) in orderInfo.mediaUrlList" :key="index">
            <image v-if="item.mediaType === 1" :src="item.mediaUrl" mode="widthFix" @click="toImagePreview(orderInfo.mediaUrlList, index)" />
            <video
              v-if="item.mediaType === 2"
              id="myVideo"
              class="video"
              :src="item.mediaUrl"
              :show-fullscreen-btn="false"
              @play="playVideo"
              @fullscreenchange="toFullscreenchange"
            />
          </template>
        </view>
      </view>
      <view v-if="orderInfo.reply?.length" class="merchant-reply">
        <view class="reply-content">
          <text class="title">商家回复：</text>
          <text>{{ orderInfo.reply[0].replyContent }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, getCurrentInstance } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { handleImagePreview } from '@util/common'
import { useCarStore } from '@src/pinia/car'
import { getEvaluatedDetail } from '@src/api/evaluation'

const carStore = useCarStore()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let avatar: string = gdp('avatar.png')

let itemType = ref(0)
let orderInfo = reactive({}) as Evaluation.Detail
let id = ref('')
let videoContext: any

interface EvaluationInfoOptions {
  itemType: number
  id: string
}

type OnLoadOptionType<T> = Record<keyof T, string | undefined>
onLoad((options: OnLoadOptionType<EvaluationInfoOptions>) => {
  itemType.value = Number(options.itemType)
  id.value = options.id || '' // 已评价列表的id
  getInfoDetails()
})

// 下拉刷新
onPullDownRefresh(() => {
  getInfoDetails()
})

function getInfoDetails() {
  uni.showLoading({
    title: '加载中'
  })
  getEvaluatedDetail(id.value)
    .then((res) => {
      // itemType 0是整车
      Object.assign(orderInfo, itemType.value === 1 ? res : carStore.getInfo([res], 1)[0])
    })
    .finally(() => {
      uni.hideLoading()
      uni.stopPullDownRefresh() // 得到数据后停止下拉刷新
    })
}
function toImagePreview(mediaUrlList: AnyObject[], index: number) {
  handleImagePreview(mediaUrlList, index)
}
function playVideo() {
  videoContext = uni.createVideoContext('myVideo', getCurrentInstance())
  videoContext.requestFullScreen({ direction: 0 })
}

function toFullscreenchange(e: { detail: { fullScreen: boolean } }) {
  if (!e.detail.fullScreen) {
    videoContext.pause()
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  padding: 40rpx;

  .car-order-item {
    height: 344rpx;
    background: #f2f3f3;
    padding: 32rpx 0 0 36rpx;

    .card {
      height: 100%;
      background-size: 70%;
      background-position: right bottom;
      background-repeat: no-repeat;

      .title {
        width: 100%;
        color: #4e6175;
        font-size: 38rpx;
        line-height: 56rpx;
        display: flex;
        align-items: center;

        .text {
          width: calc(100% - 40rpx);
        }

        image {
          width: 32rpx;
          min-width: 32rpx;
          height: 32rpx;
          margin-left: 5rpx;
          vertical-align: middle;
        }
      }

      .text-configure {
        width: 35%;
        margin-top: 6rpx;
        color: #92969a;

        > view {
          font-size: 24rpx;
          line-height: 30rpx;
          margin-bottom: 12rpx;
        }
      }
    }
  }

  .life-order-item {
    display: flex;
    align-items: center;
    background: #f2f3f3;
    padding: 20rpx 28rpx;

    .detail-img {
      width: 160rpx;
      height: 160rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .detail-other {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 160rpx);
      padding-left: 24rpx;

      .detail-sku {
        width: calc(100% - 50rpx);

        .item-name {
          color: #1a1a1a;
          font-size: 28rpx;
          line-height: 40rpx;
        }

        .attrs {
          color: #909ca8;
          font-size: 26rpx;
          margin-top: 10rpx;

          text {
            margin-right: 10rpx;
          }
        }
      }

      .arrow-right {
        image {
          width: 50rpx;
          height: 50rpx;
        }
      }
    }
  }

  .evaluation-details {
    padding-bottom: 60rpx;

    .header-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40rpx 0 32rpx;

      .user-info {
        display: flex;
        align-items: center;

        image {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
          margin-right: 24rpx;
        }

        text {
          color: #1a1a1a;
          font-size: 28rpx;
          max-width: 400rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .date {
        color: #92969a;
        font-size: 24rpx;
      }
    }

    .content {
      .text-description {
        font-size: 30rpx;
        color: #292c2e;
        margin: 20rpx 0;
        word-break: break-all;
      }

      .image-video {
        image,
        .video {
          width: 100%;
          display: inherit;
          margin-bottom: 24rpx;
          border-radius: 4rpx;
        }
      }
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
          word-break: break-all;
        }

        .title {
          color: #7190b0;
        }
      }
    }
  }
}
</style>
