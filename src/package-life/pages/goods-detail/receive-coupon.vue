<template>
  <uni-popup ref="popup" type="bottom">
    <view class="content">
      <view class="popup-title">领取优惠券</view>
      <scroll-view scroll-y class="wrap-list">
        <!-- 没有优惠券 -->
        <template v-if="couponList.length === 0">
          <view class="coupon-none">
            <image class="not-coupon-image" :src="couponEmpty" />
            <view class="txt">无可用优惠券</view>
          </view>
        </template>
        <!-- 有优惠券时，优惠券列表 -->
        <view v-else class="coupon-list">
          <view v-for="(item, key) of couponList" :key="key" class="coupon-item-choose">
            <view class="item-content" :class="{ disabled: item.balance == 0 }" @click="receiveCoupon(item)">
              <image class="img" :src="item.balance == 0 ? couponBgDisabled : couponBg" mode="scaleToFill" />
              <!-- 左侧金额 -->
              <view class="left" :class="[formatGeneratorNumSizeClass(item.worth / 100)]">
                <text class="money-symbol">¥</text>
                <text class="num ellipsis">{{ item.worth / 100 }}</text>
              </view>
              <!-- 右侧内容 -->
              <view class="right">
                <view class="info">
                  <view v-if="item.threshold === 0" class="title ellipsis">无门槛({{ item.applicability }})</view>
                  <view v-else class="title ellipsis">满{{ item.threshold / 100 }}可用 ({{ item.applicability }})</view>
                  <template v-if="item.validityTimeType == 1">
                    <view class="limit">有效期至{{ item.validityEndTime }}</view>
                  </template>
                  <template v-else-if="item.validityTimeType == 2">
                    <view class="limit">有效期限{{ item.validityTime }}{{ item.validityUnit == 1 ? '日' : '个月' }}</view>
                  </template>
                </view>
                <view class="operate">
                  <view v-if="item.balance == 0" class="disabled">已领完</view>
                  <view v-else>
                    <view>立即领取</view>
                    <view v-if="item.balance <= 5" class="balance-number">还剩{{ item.balance }}张</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="popup-footer">
        <view class="btn" @click="close">关闭</view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { inject, PropType, ref, Ref } from 'vue'

const props = defineProps({
  couponList: {
    type: Array as PropType<Coupon.Item[]>,
    default: () => []
  },
  goodsName: {
    type: String,
    default: ''
  },
  goodsId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['receive'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [couponEmpty, couponBg, couponBgDisabled] = gdp(['coupon-empty.png', 'bg-coupon.png', 'bg-coupon-disabled.png'])

const formatGeneratorNumSizeClass = (num: number) => {
  const len = String(num).length
  return len > 7 ? 'size-mini' : len > 5 ? 'size-small' : len > 4 ? 'size-middle' : ''
}

async function receiveCoupon(item: Coupon.Item) {
  if (item.balance > 0) {
    const sendData: Coupon.ReceiveParams = {
      businessDataName: props.goodsName,
      businessDataId: props.goodsId,
      couponList: [{ couponId: item.id, number: 1 }]
    }
    emit('receive', sendData)
  }
}

const popup: Ref<SpPopup | null> = ref(null)
function open() {
  popup.value?.open()
}
function close() {
  popup.value?.close()
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.content {
  height: 70vh;
  background-color: #fff;
}

.popup-title {
  height: 120rpx;
  line-height: 120rpx;
  font-size: 34rpx;
  color: #292c2e;
  text-align: center;
}

.popup-footer {
  height: 120rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #e4e7ea;

  .btn {
    background: #1a1a1a;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
    width: 94%;
    margin: 0 auto;
    height: 84rpx;
    line-height: 84rpx;
  }
}

.coupon-none {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 680rpx;

  .not-coupon-image {
    width: 144rpx;
    height: 144rpx;
  }

  .txt {
    font-size: 26rpx;
    color: #909ca8;
    text-align: center;
    margin-top: 32rpx;
  }
}

.wrap-list {
  // 弹窗高度 - 头部高度 - 底部按钮容器
  height: calc(70vh - 120rpx - 120rpx);
}

.coupon-list {
  padding-bottom: 20rpx;

  .coupon-item-choose {
    margin: 40rpx 0;

    .item-content {
      display: flex;
      align-items: center;
      position: relative;

      &.disabled {
        opacity: 0.7;
      }

      .img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200rpx;
      }

      .left {
        font-size: 28rpx;
        color: #fff;
        line-height: 170rpx;
        position: relative;
        height: 170rpx;
        width: 28%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        margin-left: 32rpx;

        .money-symbol {
          position: relative;
          top: 22rpx;
        }

        .num {
          font-size: 80rpx;
          margin-left: 4rpx;
        }

        &.size-middle {
          .money-symbol {
            top: 12rpx;
          }

          .num {
            font-size: 60rpx;
          }
        }

        &.size-small {
          .money-symbol {
            top: 4rpx;
          }

          .num {
            font-size: 46rpx;
          }
        }

        &.size-mini {
          .money-symbol {
            top: 4rpx;
          }

          .num {
            font-size: 40rpx;
            max-width: 180rpx;
          }
        }
      }

      .right {
        // 剩余宽度 - 左边margin
        width: calc(72% - 32rpx);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 60rpx 0rpx 20rpx;
        height: calc(168rpx - 40rpx);
        z-index: 10;

        .info {
          width: 70%;

          .title {
            font-size: 30rpx;
            color: #1a1a1a;
            font-weight: 600;
            width: 98%;
          }

          .limit {
            font-size: 24rpx;
            color: #909ca8;
            margin-top: 4rpx;
            font-weight: 400;
          }
        }

        .operate {
          text-align: center;
          flex-shrink: 0;
          color: #4e6175;
          font-size: 32rpx;
          font-weight: 600;

          .disabled {
            color: #bababa;
          }

          .balance-number {
            font-size: 24rpx;
            color: #909ca8;
            font-weight: 400;
          }
        }
      }
    }
  }

  .coupon-item-choose:first-child {
    margin-top: 20rpx;
  }
}
</style>
