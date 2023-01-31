<template>
  <view v-if="activityInfo" class="activity-info" :class="{ 'not-start': !activityIsStarted }">
    <view class="flex-row items-center justify-between">
      <!-- 当前价格：活动未开始显示商品原始价格；活动开始即为活动价格 -->
      <view class="activity-price items-center">
        <view v-if="currentPriceInfo.fee">
          <text class="symbal">￥</text>
          <text>{{ currentPriceInfo.fee }}</text>
        </view>
        <text v-if="isPartialMixing" class="symbal">+</text>
        <text v-if="isFreeMixing && currentPriceInfo.point" class="symbal">（</text>
        <view v-if="currentPriceInfo.point">
          <image class="point-icon" :src="pointIcon" mode="aspectFit" />
          <text>{{ currentPriceInfo.point }}</text>
        </view>
        <text v-if="isFreeMixing && currentPriceInfo.point" class="symbal">）</text>
        <view v-if="isFree" class="isfree-box">包邮</view>
      </view>

      <!-- 当前库存：活动未开始显示活动库存，活动开始即为活动库存 -->
      <view class="activity-stock">{{ activityIsStarted ? '库存剩余' : '库存' }} {{ (activityIsStarted ? activityInfo?.skuQuantity : stockQuantity) || 0 }}</view>
    </view>
    <!-- 原价格：活动未开始显示活动价格；活动开始即为商品原始价格 -->
    <view class="origin-price items-center">
      <text>{{ activityIsStarted ? '原价' : '活动价' }}</text>
      <view v-if="originPriceInfo.fee">
        <text class="symbal">￥</text>
        <text>{{ originPriceInfo.fee }}</text>
      </view>
      <text v-if="isPartialMixing" class="symbal">+</text>
      <text v-if="isFreeMixing && originPriceInfo.point" class="symbal">（</text>
      <view v-if="originPriceInfo.point">
        <image class="point-icon" :src="activityIsStarted ? disabledPointIcon : bluePointIcon" mode="aspectFit" />
        <text>{{ originPriceInfo.point }}</text>
      </view>
      <text v-if="isFreeMixing && originPriceInfo.point" class="symbal">）</text>
    </view>
    <!-- 活动开始/结束倒计时 -->
    <view class="activity-countdown items-center justify-between">
      <image class="bg" :src="activityIsStarted ? bgRed : bgBlue" />
      <view class="activity-name items-center">
        <image class="time-limit-img" :src="timeLimitImg" mode="aspectFit" />
        <text>{{ activityTypeName }}</text>
      </view>
      <view class="activity-countdown-num items-center">
        <text>{{ activityIsStarted ? '距结束' : '距开始' }}</text>
        <uni-countdown
          v-if="seconds"
          :color="countdownColor"
          :background-color="countdownBgColor"
          :special-style="true"
          splitor-color="#fff"
          :second="seconds"
          @timeup="emit('timeup')"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Enum } from '@src/lib/enmu'
import { FormatedPriceInfo } from '@src/util/money'
import { inject, computed, PropType } from 'vue'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [disabledPointIcon, bluePointIcon, pointIcon, bgBlue, bgRed, timeLimitImg] = gdp([
  'icon-point-disabled.png',
  'icon-point-blue.png',
  'icon-point.png',
  'blue-bg.png',
  'red-bg.png',
  'time-limit.png'
])

const props = defineProps({
  payType: {
    type: Number,
    default: null
  },
  activityInfo: {
    type: Object as PropType<Goods.Activity.Sku>,
    default: null
  },
  priceInfo: {
    type: Object as PropType<FormatedPriceInfo>,
    default: null
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  }
})

const activityIsStarted = computed(() => props.activityInfo && props.activityInfo.itemActivityStatus === Enum.Activity.Status.IsGoing)
// 活动类型中文
const activityTypeName = computed(() => {
  return Enum.Activity.getTypeText(props.activityInfo.activityType)
})
// 据活动开始/结束时间，单位s
const seconds = computed(() => {
  const { startTime, endTime } = props.activityInfo
  return (activityIsStarted.value ? endTime - +new Date() : startTime - +new Date()) / 1000
})
// 自由混合支付
const isFreeMixing = computed(() => props.payType === Enum.Pay.Type.FreeMixing)
// 定额积分+现金
const isPartialMixing = computed(() => props.payType === Enum.Pay.Type.PartialMixing)

// 当前价格：活动未开始显示商品原始价格；活动开始即为活动价格
const currentPriceInfo = computed(() => {
  return {
    fee: activityIsStarted.value ? props.priceInfo.fee : props.priceInfo.originFee,
    point: activityIsStarted.value ? props.priceInfo.point : props.priceInfo.originPoint
  }
})

// 原价格：活动未开始显示活动价格；活动开始即为商品原始价格
const originPriceInfo = computed(() => {
  return {
    fee: activityIsStarted.value ? props.priceInfo.originFee : props.priceInfo.activityFee,
    point: activityIsStarted.value ? props.priceInfo.originPoint : props.priceInfo.activityPoint
  }
})

const countdownColor = computed(() => (props.activityInfo?.itemActivityStatus === -1 ? '#5586B9' : '#ffffff'))
const countdownBgColor = computed(() => (props.activityInfo?.itemActivityStatus === -1 ? '#ffffff' : '#9E3A38'))

const emit = defineEmits(['timeup'])
</script>

<style lang="scss" scoped>
.activity-info {
  padding: 32rpx 40rpx 0;
  background-color: $uni-bg-color;

  .activity-price {
    font-size: 44rpx;
    font-weight: bold;

    .symbal {
      font-weight: normal;
      font-size: 32rpx;
      color: #1a1a1a;
    }

    .point-icon {
      width: 28rpx;
      height: 28rpx;
    }

    .isfree-box {
      width: 60rpx;
      height: 36rpx;
      line-height: 36rpx;
      text-align: center;
      background: #edeff1;
      border-radius: 2rpx;
      font-size: 22rpx;
      color: #696b6c;
      margin-left: 12rpx;
      font-weight: normal;
    }
  }

  .activity-stock {
    font-size: 24rpx;
    color: #c8504e;
  }

  .origin-price {
    color: #92969a;
    font-size: 26rpx;
    margin: 16rpx 0;

    .point-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }

  .activity-countdown {
    position: relative;
    width: 100%;
    height: 88rpx;
    color: #fff0f0;
    border-radius: 4rpx;
    padding: 0 32rpx;
    font-size: 28rpx;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .activity-name {
      font-weight: bold;
      font-size: 28rpx;
      color: #fff0f0;
      z-index: 1;
    }

    .time-limit-img {
      width: 26rpx;
      height: 26rpx;
      margin-right: 9rpx;
    }

    .activity-countdown-num {
      z-index: 1;
    }
  }

  &.not-start {
    .activity-stock {
      color: #92969a;
    }

    .origin-price {
      color: #5586b9;
    }
  }
}
</style>
