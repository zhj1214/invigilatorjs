<template>
  <view class="container">
    <!-- 评价概述 -->
    <view class="evaluation-overview">
      <view>
        <text>用户评价</text>
        <text v-if="totalNum" class="evaluation-num">({{ totalNum }})</text>
      </view>
      <view v-if="totalNum" @click="goEvaluation">
        <text class="item-h-high-rate">{{ applauseRate }}%</text>
        <text>好评率</text>
        <image class="icon-right" :src="iconRight" mode="scaleToFill" />
      </view>
      <view v-else>商品暂无评价</view>
    </view>
    <!-- 评价概述 end -->

    <view v-if="goodsEvaluation.length > 0" class="goods-evaluation-list">
      <view v-for="item in goodsEvaluation" :key="item.id" class="evaluation-item" @click="goEvaluation">
        <view class="item-header">
          <!-- 头像 -->
          <image class="avator" :src="item.userAvatar || iconDefaultAvatar" mode="aspectFill" />
          <view class="base-info">
            <view class="name">{{ item.userName }}</view>
            <view class="time">{{ item.createTime }}</view>
          </view>
        </view>
        <view class="evaluation-content ellipsis-2">
          {{ item.content }}
        </view>
        <view class="evaluation-media">
          <view v-if="item.mediaUrlList && item.mediaUrlList.length > 0" class="image-group">
            <template v-for="(mediaItem, index) in item.mediaUrlList">
              <image v-if="mediaItem.mediaUrl && index < 3" :key="index" class="img" :src="mediaItem.mediaUrl" mode="aspectFill" />
            </template>
          </view>
        </view>
      </view>
    </view>
    <view v-else-if="defaultNum" class="default-evaluation-num">{{ defaultNum }}位用户默认评价了该商品</view>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, PropType } from 'vue'
const props = defineProps({
  goodsDetail: {
    type: Object as PropType<Goods.Item>,
    default: null
  },
  goodsEvaluations: {
    type: Object as PropType<Goods.GoodsEvaluations>,
    default: null
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconRight, iconDefaultAvatar] = gdp(['icon-right.png', 'icon-default-avatar.png'])

const goodsEvaluation = computed(() => {
  // 最多只展示两个评价
  let evaluations = props.goodsEvaluations.itemEvaluationConsumer
  return evaluations.map((evaluation: Goods.ItemEvaluationConsumer) => {
    // 需要过滤掉视频、且只展示三张图片
    evaluation.mediaUrlList = evaluation.mediaUrlList?.filter((item) => item.mediaType === 1).slice(0, 3) || []
    return evaluation
  })
})
const defaultNum = computed(() => props.goodsEvaluations?.defaultNum)
const totalNum = computed(() => props.goodsEvaluations?.totalNum)
const applauseRate = computed(() => props.goodsEvaluations?.applauseRate)

function goEvaluation() {
  uni.navigateTo({ url: `/package-life/pages/product-assess-list/index?itemId=${props.goodsDetail?.itemBasicVO.id}` })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  background-color: white;
}

.evaluation-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #92969a;

  .item-h-high-rate {
    color: #c14947;
    margin-right: 10rpx;
  }

  .evaluation-num {
    margin-left: 15rpx;
  }

  .icon-right {
    width: 40rpx;
    height: 40rpx;
    vertical-align: text-bottom;
  }
}

.goods-evaluation-list {
  overflow: hidden;

  .evaluation-item {
    padding-top: 48rpx;
    border-bottom: 1rpx solid #e4e7ea;

    &:last-child {
      border-bottom: none;
    }

    .item-header {
      display: flex;
      align-items: center;

      .avator {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }

      .base-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          height: 41rpx;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 41rpx;
        }

        .time {
          height: 33rpx;
          font-size: 22rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #909ca8;
          line-height: 33rpx;
        }
      }
    }

    .evaluation-content {
      margin-top: 13rpx;
      width: 655rpx;
      font-size: 26rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #292c2e;
      line-height: 34rpx;
      word-break: break-all;
    }

    .evaluation-media {
      margin: 26rpx 0 56rpx;

      .image-group {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;

        .img {
          width: 32%;
          height: 212rpx;

          // margin-top: 26rpx;
          margin-right: 2%;
          border-radius: 4rpx;

          &:nth-child(3) {
            margin-right: 0;
          }
        }
      }
    }
  }
}

.default-evaluation-num {
  margin-top: 48rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, 'PingFang SC';
  font-weight: 400;
  color: #909ca8;
  text-align: center;
}
</style>
