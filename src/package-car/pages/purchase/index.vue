<template>
  <view class="car-purchase">
    <!-- 提示语 -->
    <view v-if="vehicle.skuData.itemPreSaleVO.salePriceType === 0" class="tip">注：汽车售价、车型配置、图片等信息可能会与最终量产车型存在差异，请以最终交车信息为准</view>
    <!-- 基础信息 -->
    <view class="base-info" @click="goPreview">
      <image class="car-image" mode="aspectFit" :src="vehicle.carPoster" />
      <view class="car-info">
        <view class="items-center">
          <view class="name ellipsis-2">{{ model.attrs.title }}</view>
          <image class="icon" mode="aspectFit" />
        </view>
        <view class="package-item intercept">
          {{ outText }}
        </view>
        <view class="package-item intercept">{{ vehicle.rim.name || '' }}</view>
        <view class="package-item ellipsis">...</view>
      </view>
    </view>
    <!-- 预订方式 -->
    <view class="group">
      <view class="group-title">预订方式</view>
      <view
        v-for="type in reserveTypes"
        :key="type.value"
        class="reserve-type items-center justify-between"
        :class="{ active: type.value === reserveType }"
        @click="toReserveChange(type)"
      >
        <view class="reserve-name">
          <text>{{ type.text }}</text>
          <text class="desc">（{{ type.desc }}）</text>
        </view>
        <view class="reserve-price items-center">
          <text class="symbal">￥</text>
          <text>{{ formatMoney(type.price, 2, 0) }}</text>
        </view>
      </view>
    </view>
    <!-- 购买信息 -->
    <buyer-info />
    <!-- 车主信息 -->
    <view v-if="reserveType === 1" class="group">
      <view class="group-title">车主信息</view>
      <view id="carOwner" class="form-item items-center">
        <view class="label">姓名</view>
        <view class="form-item-content">
          <input v-model.trim="carOwner" class="form-item-input" maxlength="20" placeholder="输入车主姓名" placeholder-class="placeholder" @blur="checkName(carOwner)" />
        </view>
      </view>
      <view class="form-item items-center">
        <view class="label">证件类型</view>
        <view class="form-item-content items-center justify-between" @click="selectorVisible = true">
          <view class="select-content ellipsis" :class="{ 'has-value': idType.label }">{{ idType.label || '选择证件类型' }}</view>
          <image class="icon" :src="bottomIcon" />
        </view>
      </view>
      <view id="idNum" class="form-item items-center">
        <view class="label">证件号码</view>
        <view class="form-item-content">
          <input v-model.trim="idNum" class="form-item-input" placeholder="输入证件号码" placeholder-class="placeholder" @blur="checkIdCard(idNum)" />
        </view>
      </view>
    </view>
    <!-- 价格明细 -->
    <price-info />
    <!-- 底部支付按钮 -->
    <view class="footer">
      <view class="agreement flex-row items-center justify-start" @click="checked = !checked">
        <sp-checkbox v-model="checked" class="checkbox" size="small" />
        <text class="pre">已阅读并同意</text>
        <text v-show="reserveType === 1" class="agreement-item" @click.stop="goToPurchaseAgreement">《汽车购买协议》</text>
        <text v-show="reserveType === 0" class="agreement-item" @click.stop="goToIntent">《意向通用条款与条件》</text>
      </view>
      <view class="btn items-center justify-center" @click="toBuy">
        支付{{ reserveType === 0 ? '意向金' : '定金' }}
        <text class="symbal">￥</text>
        <text class="money">{{ formatMoney(reservePrice, 0, 0) }}</text>
      </view>
    </view>
    <!-- 身份类型选择框弹框 -->
    <sp-selector v-model="selectorVisible" title="证件类型" :default-value="idType" :arr-props="idTypeArr" @change="toIdChange" />
  </view>
</template>

<script lang="ts" setup name="Purchase">
import { inject, ref } from 'vue'
import { onLoad, onUnload, onBackPress } from '@dcloudio/uni-app'
import { formatMoney } from '@util/money'
import { useCarStore } from '@src/pinia/car'
import { ReserveType, IdType, checkName, checkIdCard } from './util'
import usePurchase from './purchase'
import BuyerInfo from './buyer-info.vue'
import PriceInfo from './price-info.vue'

type PageOptions = 'cartWishId' | 'skuId' | 'readOnly' | 'hideWish' | 'pkIds'

const { outText, reservePrice, reserveType, reserveTypes, idTypeArr, idType, model, vehicle, idNum, carOwner, checked, toBuy, toInit, initBuyerInfo } = usePurchase()

const carStore = useCarStore()

// 图片资源
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [bottomIcon] = gdp(['icon-bottom.png'])

onLoad((options: Record<PageOptions, string | undefined>) => {
  toInit(options)
})
onUnload(() => {
  carStore.setProvider({} as Dealer.Iteminfo)
})

onBackPress((e) => {
  initBuyerInfo()
})

const selectorVisible = ref(false)
/**
 * 获取预定方式类型
 */
function toReserveChange(type: ReserveType) {
  reserveType.value = type.value
}

function toIdChange(val: IdType) {
  Object.assign(idType, val)
}

/**
 * 返回预览配置页
 */
function goPreview() {
  uni.navigateTo({
    url: `/package-car/pages/preview/index?readOnly=true`
  })
}

function goToPurchaseAgreement() {
  uni.navigateTo({
    url: '/package-car/pages/agreements/purchase-agreement'
  })
}
function goToIntent() {
  uni.navigateTo({
    url: '/package-car/pages/agreements/intent-and-conditions'
  })
}
</script>

<style lang="scss" scoped>
.car-purchase {
  padding-bottom: 210rpx;

  .tip {
    padding: 21rpx 40rpx;
    font-size: 26rpx;
    color: #909ca8;
    line-height: 34rpx;
  }
}

.base-info {
  position: relative;
  width: 100%;
  height: 384rpx;
  background: #f2f3f3;

  .car-image {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 566rpx;
    height: 317rpx;
  }

  .car-info {
    position: absolute;
    top: 30rpx;
    left: 40rpx;

    .name {
      color: #4e6175;
      font-weight: bold;
      font-size: 42rpx;
      max-width: 550rpx;
      margin-bottom: 10rpx;
      flex: 1;
    }

    .icon {
      width: 32rpx;
      height: 32rpx;
      flex-basis: 32rpx;
    }

    .package-item {
      line-height: 38rpx;
      color: #92969a;
      font-size: 26rpx;
      margin-bottom: 4rpx;
      max-width: 190rpx;
    }

    .intercept {
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.group {
  padding: 72rpx 40rpx 56rpx;

  .group-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #292c2e;
    margin-bottom: 40rpx;
  }
}

.reserve-type {
  width: 100%;
  margin-bottom: 24rpx;
  border: 1rpx solid #dbdcdd;
  border-radius: 2rpx;
  padding: 40rpx;
  color: #292c2e;

  &.active {
    border: 2rpx solid #4e6175;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  .reserve-name {
    .desc {
      font-size: 26rpx;
      color: #92969a;
    }
  }

  .reserve-price {
    font-size: 36rpx;

    .symbal {
      font-size: 26rpx;
      margin-right: 12rpx;
    }
  }
}

.form-item {
  height: 112rpx;

  .label {
    width: 200rpx;
    font-size: 28rpx;
    color: #909ca8;
  }

  .form-item-content {
    flex: 1;
    height: 100%;
    border-bottom: 1rpx solid #e4e7ea;

    .form-item-input {
      height: 100%;
      color: #1a1a1a;
      font-size: 28rpx;
    }

    .placeholder,
    .select-content {
      color: #92969a;
      font-size: 28rpx;
    }

    .select-content {
      flex: 1;

      &.has-value {
        color: #1a1a1a;
      }
    }

    .icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 40rpx 40rpx calc(env(safe-area-inset-bottom) + 18rpx);
  background: #fff;
  border-top: 1rpx solid #e4e7ea;
  z-index: 10;

  .agreement {
    font-size: 24rpx;
    color: #92969a;
    margin-bottom: 30rpx;
    padding: 0 10rpx;

    .pre {
      margin-left: 10rpx;
    }

    .agreement-item {
      color: #4e6175;
    }
  }

  .btn {
    width: 100%;
    height: 85rpx;
    color: #fff;
    background: #1a1a1a;
    border-radius: 1rpx;
    font-size: 28rpx;

    .symbal {
      margin-left: 8rpx;
      font-size: 24rpx;
    }

    .money {
      font-weight: 500;
      font-size: 30rpx;
    }
  }
}
</style>
