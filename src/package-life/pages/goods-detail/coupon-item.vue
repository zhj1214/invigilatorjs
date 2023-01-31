<template>
  <view v-if="couponList.length" class="item">
    <text class="left">优惠</text>
    <view class="right">
      <text class="desc ellipsis">{{ couponHintString }}</text>
      <view class="wrap-btn" @click="openCouponPopup">
        领券
        <image class="icon-right" :src="iconRight" mode="scaleToFill" />
      </view>
    </view>
  </view>
  <!-- 选择优惠券弹窗 -->
  <sp-receive-coupon ref="spReceiveCouponRef" :goods-id="itemId" :goods-name="itemName" :coupon-list="couponList" @receive="getCoupon" />
</template>

<script lang="ts" setup>
import { inject, computed, ref, Ref, watch } from 'vue'
import SpReceiveCoupon from './receive-coupon.vue'
import { useCoupon } from './coupon'

const props = defineProps({
  itemName: {
    type: String,
    default: ''
  },
  itemId: {
    type: [String, Number],
    default: ''
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const iconRight = gdp('icon-right.png')

// 卡券信息
const { couponList, getCounponList, getCoupon } = useCoupon()

watch(
  () => props.itemId,
  () => {
    getCounponList(props.itemId)
  }
)

const couponHintString = computed(() => {
  const firstCoupon = couponList[0]
  if (!firstCoupon) {
    return ''
  }
  const { threshold, worth } = firstCoupon
  return `满${threshold / 100}减${worth / 100}`
})

const spReceiveCouponRef: Ref<SpPopup | null> = ref(null)
function openCouponPopup() {
  spReceiveCouponRef.value?.open()
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  display: flex;

  & > .left {
    width: 136rpx;
    text-align: center;
  }

  & > .right {
    width: calc(100% - 136rpx);
    display: flex;
    justify-content: space-between;
    border-bottom: 1rpx solid #e4e7ea;
    overflow: hidden;

    & > .desc {
      font-size: 28rpx;
      color: #292c2e;
      flex: 1;
    }

    & > .wrap-btn {
      font-size: 30rpx;
      color: #4e6175;
      display: flex;
      align-items: center;

      .icon-right {
        width: 48rpx;
        height: 48rpx;
        margin-right: 40rpx;
      }
    }

    .freight-template {
      width: calc(100% - 88rpx);
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: initial;
      font-size: 28rpx;

      .shipping-address {
        color: #bababa;
        font-size: 24rpx;
        margin-top: 10rpx;
      }
    }
  }

  &:last-of-type .right {
    border-bottom: none;
  }
}
</style>
