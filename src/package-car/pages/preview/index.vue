<template>
  <view class="car-preview">
    <!-- 基础信息 -->
    <view v-if="isDataLoaded && vehicle.carPoster" class="base-info">
      <image class="car-image" mode="aspectFit" :src="vehicle.carPoster" />
      <view class="car-name ellipsis-3">{{ model?.attrs?.title }}</view>
      <!-- 右侧操作按钮 -->
      <view v-if="model.attrs" class="toolbar flex-row items-center">
        <image v-if="canBeOrdered && !readOnly && !hideWish" class="icon" mode="aspectFit" :src="cartWishId ? wishActiveImg : wishImg" @click="handleWish" />
        <!-- #ifdef MP-WEIXIN -->
        <!-- 微信小程序显示分享 -->
        <view v-if="canBeOrdered && !readOnly && !hideWish" class="division" />
        <button v-if="vehicle.status === 1 || !vehicle.status" open-type="share" class="share-btn">
          <image class="icon" :src="shareImg" mode="asceptFit" />
        </button>
        <!-- #endif -->
      </view>
    </view>
    <!-- 配置信息 -->
    <config-info
      v-if="isDataLoaded && packages.length"
      :vehicle="vehicle"
      :model="model"
      :read-only="readOnly"
      :packages="packages"
      @btn-edit="useGoBackSetting($event, hideWish, model, cartWishId)"
    />
    <!-- 底部预定按钮 -->
    <price-btn-bottom v-if="!readOnly && isDataLoaded" :vehicle="vehicle" :checkout="canBeOrdered ? 'false' : 'true'" :btn-text="submitBtnText" @btn-click="toPurchase" />
  </view>
</template>

<script lang="ts">
export default {
  name: 'CarPreview',
  // #ifdef MP-WEIXIN
  // 微信小程序分享
  onShareAppMessage() {
    const previewShareObj = uni.getStorageSync('preview_share_obj')
    uni.removeStorageSync('preview_share_obj')
    return previewShareObj
  }
  // #endif
}
</script>

<script lang="ts" setup name="Preview">
import { inject, computed, ComputedRef, ref, reactive, toRaw } from 'vue'
import PriceBtnBottom from '../../components/price-btn-bottom/price-btn-bottom.vue'
import ConfigInfo from './config-info.vue'
import { onShow, onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useCarStore } from '@src/pinia/car'
import { useAppStore } from '@src/pinia/app'
import useWish from './wish'
import useGoBackSetting from './back-setting'
import { relogin } from '@api/request'

type PageOptions = 'cartWishId' | 'skuId' | 'readOnly' | 'hideWish' | 'pkIds'
const { getWishData, deleteWish, addWish } = useWish()
const appStore = useAppStore()

// 图片资源
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [wishImg, wishActiveImg, shareImg] = gdp(['icon-wish.png', 'wish-active.png', 'icon-share.png'])

const isLogin = computed(() => appStore.isLogin)

const isDataLoaded = ref(false)
const isFirstLoad = ref(true)
const carStore = useCarStore()
/**
 * 页面参数
 * @var skuId
 * @var readOnly 页面只读
 * @var hideWish 隐藏加入心愿单
 * @var cartWishId 心愿单id
 * @var optionalPackIds
 */
const skuId = ref('')
const readOnly = ref(false)
const hideWish = ref(false)
const cartWishId = ref('')
const optionalPackIds: string[] = reactive([])
const vehicle = computed(() => carStore.vehicle)
const model = computed(() => vehicle.value.model || {})
const packages: ComputedRef<Car.Packages[]> = computed(() => vehicle.value.packages || [])
// 可下单
const canBeOrdered = computed(() => vehicle.value.skuData.itemPreSaleVO.placeOrderFlag)
const submitBtnText = computed(() => (!vehicle.value.skuData.itemPreSaleVO.placeOrderFlag ? '预售未开始' : '立即预定'))

// #ifdef MP-WEIXIN
/**
 * 微信小程序分享
 *
 */
onShareAppMessage(() => {
  const previewShareObj = {
    title: model.value.attrs.title,
    path: `/package-car/pages/preview/index?skuId=${skuId.value || ''}&pkIds=${optionalPackIds.join(',')}`
  }
  uni.setStorageSync('preview_share_obj', previewShareObj)
  return previewShareObj
})
// #endif
// 页面加载
onLoad(async (options: Record<PageOptions, string | undefined>) => {
  skuId.value = options.skuId || ''
  readOnly.value = options.readOnly === 'true'
  hideWish.value = options.hideWish === 'true'
  cartWishId.value = options.cartWishId || ''
  if (skuId.value) {
    options.pkIds && optionalPackIds.push(...options.pkIds.split(','))
    await carStore.getSkuDetail(skuId.value, optionalPackIds)
    isDataLoaded.value = true
  } else {
    skuId.value = vehicle.value?.skuData?.id
    optionalPackIds.push(...(packages.value || []).map((pk: Car.Packages) => pk.id))
    isDataLoaded.value = true
  }
  isFirstLoad.value = false
})

// 页面显示
onShow(() => {
  if (skuId.value && !isFirstLoad.value) {
    carStore.getSkuDetail(skuId.value, optionalPackIds)
  }
  if (isLogin.value) {
    getWish()
  }
})
/**
 * 根据心愿单id判断不同的操作
 * 存在心愿单id则是删除操作
 * 反之则是添加操作
 */
async function handleWish() {
  if (!isLogin.value) {
    relogin()
    return
  }
  if (cartWishId.value) {
    await deleteWish(cartWishId.value)
  } else {
    await addWish(toRaw(vehicle.value), toRaw(model.value), toRaw(packages.value))
  }

  getWish()
}
/**
 * 查询心愿单
 */
async function getWish() {
  const { id } = await getWishData(optionalPackIds, skuId.value)
  cartWishId.value = id
}

/**
 * 跳转预定页面
 */
function toPurchase() {
  if (!isLogin.value) {
    relogin()
    return
  }
  if (cartWishId.value) {
    uni.navigateTo({
      url: `/package-car/pages/purchase/index?cartWishId=${cartWishId.value}`
    })
  } else {
    uni.navigateTo({
      url: '/package-car/pages/purchase/index'
    })
  }
}
</script>

<style lang="scss" scoped>
.car-preview {
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.base-info {
  position: relative;
  width: 100%;
  height: 494rpx;
  background: #f2f3f3;
  margin-bottom: 16rpx;

  .car-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 420rpx;
  }

  .car-name {
    position: absolute;
    top: 33rpx;
    left: 40rpx;
    color: #4e6175;
    font-weight: bold;
    font-size: 42rpx;
    max-width: 450rpx;
  }

  .toolbar {
    position: absolute;
    top: 44rpx;
    right: 40rpx;
    z-index: 3;

    .icon {
      width: 40rpx;
      height: 40rpx;
    }

    .division {
      width: 2rpx;
      height: 28rpx;
      margin: 0 22rpx;
      opacity: 0.3;
      background: #909ca8;
    }

    /* #ifdef MP-WEIXIN */
    .share-btn {
      border: none;
      background: transparent;
      margin: 0;
      padding: 0;
      width: 40rpx;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;

      &::after {
        width: 0;
        height: 0;
        border: none;
        background: transparent;
        margin: 0;
        padding: 0;
      }
    }
    /* #endif */
  }
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: calc(120rpx + env(safe-area-inset-bottom));
  padding: 0 40rpx env(safe-area-inset-bottom);
  background: #fff;
  border-top: 1rpx solid #e4e7ea;

  .btn {
    width: 232rpx;
    height: 85rpx;
    color: #fff;
    background: #1a1a1a;
    border-radius: 1rpx;
  }
}
</style>
