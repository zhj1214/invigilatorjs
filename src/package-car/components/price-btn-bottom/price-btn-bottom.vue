<template>
  <view class="price-btn-bottom">
    <view class="bottom-btn">
      <view v-if="showPriceFlag" class="price">
        <view class="total-price" @click="toPriceDetail">
          <text class="text1">￥</text>
          <text class="text2">{{ formatMoney(totalPriceData, 0, 0) }}</text>
          <uni-icons type="arrowup" size="12" color="#92969A" />
        </view>
      </view>
      <!-- 价格待定 -->
      <view v-else class="price">
        <view class="total-price" @click="toPriceDetail">
          <text class="text2">价格待定</text>
          <uni-icons type="arrowup" size="12" />
        </view>
      </view>
      <view class="next-btn" :class="checkout === 'true' ? 'btn-width' : ''" @click="toNext">
        {{ btnText }}
        <uni-icons class="btn-icon" type="arrowright" size="12" color="#fff" />
      </view>
    </view>
    <uni-popup ref="priceshow" type="bottom">
      <view class="popup-box">
        <view class="header">
          <text>价格明细</text>
          <uni-icons type="closeempty" size="48" color="#939EAA" @click="cancelBtn" />
        </view>
        <view class="list">
          <view v-if="vehicle.model && vehicle.model.attrs" class="list-box">
            <text class="title">车型</text>
            <text class="value">{{ vehicle.model.attrs.title }}</text>
            <text v-if="vehicle.model.attrs.price && showPriceFlag" class="price-style">￥{{ formatMoney(vehicle.model.attrs.price, 0, 0) }}</text>
            <text v-if="!vehicle.model.attrs.price && showPriceFlag" class="price-none">价格已包含</text>
            <text v-if="!showPriceFlag" class="price-none">价格待定</text>
          </view>
          <view v-if="vehicle.outColor || vehicle.outPainting" class="list-box">
            <text class="title">外饰</text>
            <text class="value">{{ outText }}</text>
            <text v-if="vehicle.outPrice && showPriceFlag" class="price-style">￥{{ formatMoney(vehicle.outPrice, 0, 0) }}</text>
            <text v-if="!vehicle.outPrice && showPriceFlag" class="price-none">价格已包含</text>
            <text v-if="!showPriceFlag" class="price-none">价格待定</text>
          </view>
          <view v-if="vehicle.rim" class="list-box">
            <text class="title">轮圈</text>
            <text class="value">{{ vehicle.rim.name || '' }}</text>
            <text v-if="vehicle.rimPrice && showPriceFlag" class="price-style">￥{{ formatMoney(vehicle.rimPrice, 0, 0) }}</text>
            <text v-if="!vehicle.rimPrice && showPriceFlag" class="price-none">价格已包含</text>
            <text v-if="!showPriceFlag" class="price-none">价格待定</text>
          </view>
          <view v-if="vehicle.innerColor || vehicle.innerMaterial" class="list-box">
            <text class="title">内饰</text>
            <text class="value">{{ innerText }}</text>
            <text v-if="vehicle.innerPrice && showPriceFlag" class="price-style">￥{{ formatMoney(vehicle.innerPrice, 0, 0) }}</text>
            <text v-if="!vehicle.innerPrice && showPriceFlag" class="price-none">价格已包含</text>
            <text v-if="!showPriceFlag" class="price-none">价格待定</text>
          </view>
          <view v-for="pk in vehicle.packages" :key="pk.id" class="list-box">
            <text class="title">选装</text>
            <text class="value">{{ pk.name || '' }}</text>
            <text v-if="pk.price && showPriceFlag" class="price-style">￥{{ formatMoney(pk.price, 0, 0) }}</text>
            <text v-if="!pk.price && showPriceFlag" class="price-none">价格已包含</text>
            <text v-if="!showPriceFlag" class="price-none">价格待定</text>
          </view>
        </view>
        <view class="popup-bottom-btn">
          <view class="bottom-btn">
            <view v-if="showPriceFlag" class="price">
              <view class="total-price" @click="cancelBtn">
                <text class="text1">￥</text>
                <text class="text2">{{ formatMoney(totalPriceData, 0, 0) }}</text>
                <uni-icons type="arrowdown" size="12" color="#92969A" />
              </view>
            </view>
            <!-- 价格待定 -->
            <view v-else class="price">
              <view class="total-price" @click="cancelBtn">
                <text class="text2">价格待定</text>
                <uni-icons type="arrowup" size="12" color="#92969A" />
              </view>
            </view>
            <view class="next-btn" :class="checkout === 'true' ? 'btn-width' : ''" @click="toNext">
              {{ btnText }}
              <uni-icons type="arrowright" size="12" color="#fff" />
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts" name="PriceBtnBottom">
import { ref, Ref, computed, watch } from 'vue'
import { formatMoney } from '@util/money'
import { useCarStore } from '@src/pinia/car'
const emit = defineEmits(['btnClick'])
const props = defineProps({
  vehicle: {
    type: Object,
    default: () => ({})
  },
  btnText: {
    type: String,
    default: ''
  },
  checkout: {
    type: String,
    default: ''
  }
})

const carStore = useCarStore()

const totalPriceData = computed(() => carStore.totalPrice(props.vehicle))
const outText = computed(() => {
  return `${props.vehicle.outColor?.name || ''}${props.vehicle.outColor?.name && props.vehicle.outPainting?.name ? '+' : ''}${props.vehicle.outPainting?.name || ''}`
})
const innerText = computed(() => {
  return `${props.vehicle.innerColor?.name || ''}${props.vehicle.innerColor?.name && props.vehicle.innerMaterial?.name ? '+' : ''}${props.vehicle.innerMaterial?.name || ''}`
})
const toNext = () => {
  if (props.checkout === 'true') {
    return
  }
  emit('btnClick')
}
// 获取组件
const priceshow: Ref<SpPopup | null> = ref(null)
const toPriceDetail = () => {
  priceshow.value?.open()
}
const cancelBtn = () => {
  priceshow.value?.close()
}
let showPriceFlag = ref(true) // 是否展示售价 0:否；1:是
watch(
  () => props.vehicle,
  (v) => {
    showPriceFlag.value = v?.skuData && v.skuData.itemPreSaleVO.showPriceFlag
  },
  {
    deep: true,
    immediate: true
  }
)
// 将父组件需要的方法暴露出去
defineExpose({
  cancelBtn
})
</script>

<style lang="scss" scoped>
.price-btn-bottom,
.popup-bottom-btn {
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 999;
  padding: 18rpx 0 calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #e4e7ea;

  .uni-icons {
    vertical-align: middle;
  }

  .bottom-btn {
    height: 80rpx;
    padding: 0 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price {
      .total-price {
        display: flex;
        align-items: center;

        .text1 {
          font-size: 26rpx;
          color: #213a53;
        }

        .text2 {
          font-size: 40rpx;
          font-weight: bold;
          color: #213a53;
          margin-right: 15rpx;
        }
      }

      .cut-price {
        .text1 {
          font-size: 26rpx;
          color: #696b6c;
          margin-right: 8rpx;
        }

        .text2 {
          font-size: 20rpx;
          color: #495056;
        }

        .text3 {
          font-size: 24rpx;
          color: #495056;
        }
      }
    }

    .next-btn {
      width: 232rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #1a1a1a;
      border-radius: 1rpx;
      text-align: center;
      color: #fff;

      .btn-icon {
        position: relative;
        bottom: 3rpx;
      }
    }

    .btn-width {
      width: 232rpx;
      height: 80rpx;
      font-size: 28rpx;
      line-height: 80rpx;
      background: #bababa;
      border-radius: 1rpx;
      text-align: center;
      color: #fff;
    }
  }

  .popup-box {
    background-color: #fff;
    border-radius: 10rpx;

    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120rpx;
      padding: 0 40rpx;
      font-size: 34rpx;
      color: #292c2e;
      border-bottom: 1rpx solid #e4e7ea;
    }

    .list {
      height: 510rpx;
      overflow-y: scroll;
      padding: 16rpx 40rpx calc(120rpx + env(safe-area-inset-bottom));

      .list-box {
        width: 100%;
        line-height: 72rpx;
        display: flex;

        text {
          font-size: 30rpx;
          font-weight: 400;
        }

        .title {
          color: #909ca8;
          margin-right: 32rpx;
        }

        .value {
          width: 55%;
          color: #292c2e;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .price-style {
          color: #292c2e;
          margin-left: auto;
        }

        .price-none {
          color: #92969a;
          margin-left: auto;
        }
      }
    }
  }
}
</style>
