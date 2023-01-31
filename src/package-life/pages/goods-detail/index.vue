<template>
  <view class="goods-detail-page">
    <sp-header>
      <image class="back-icon" :src="iconBack" mode="scaleToFill" @click="onBack" />
    </sp-header>
    <!-- 商品基本信息 -->
    <goods-base-info
      v-if="currentSku.skuBasicVO?.id"
      :base-info="baseInfo"
      :activity-info="activitySkuInfo"
      :img-list="imageInfos"
      :current-sku="currentSku"
      :is-free="isFreeShipping"
      :goods-detail="goodsDetail"
      @refresh="refreshGoodsDetail"
    />
    <!-- 优惠、选择规格、参数 start -->
    <view class="wrap-options">
      <coupon-item :item-id="baseInfo.id" :item-name="baseInfo.name" />
      <view class="item">
        <text class="left">选择</text>
        <view class="right" @click="openSelectSkuPopup('selectSku')">
          <text class="desc ellipsis">{{ selectedAttrStr }}</text>
          <view class="wrap-btn">
            <image class="icon-right" :src="iconRight" mode="scaleToFill" />
          </view>
        </view>
      </view>
      <!-- 不包邮并且不是虚拟商品展示 -->
      <view v-if="isDeliver && !isFreeShipping" class="item">
        <text class="left">发货</text>
        <view class="right" @click="checkAddress">
          <view class="freight-template">
            <text class="desc ellipsis">{{ freightTemplate }}</text>
            <text class="shipping-address ellipsis">配送至: {{ shippingAddress }}</text>
          </view>
          <view class="wrap-btn">
            <image class="icon-right" :src="iconRight" mode="scaleToFill" />
          </view>
        </view>
      </view>
      <view v-if="otherAttr.attrKeys" class="item">
        <text class="left">参数</text>
        <view class="right" @click="openGoodsParamsPopup">
          <text class="desc ellipsis">{{ otherAttr.attrKeys }}</text>
          <view class="wrap-btn">
            <image class="icon-right" :src="iconRight" mode="scaleToFill" />
          </view>
        </view>
      </view>
    </view>
    <!-- 优惠、选择规格、参数 end -->

    <!-- 适用门店 -->
    <goods-store-info v-if="isVirtual && storeList.length" :item-id="baseInfo.id" :store-list="storeList" />

    <!-- 商品评价 -->
    <view class="wrap-goods-evaluation"><goods-evaluation :goods-detail="goodsDetail" :goods-evaluations="goodsEvaluations" /></view>

    <!-- 商品问答 -->
    <view class="wrap-goods-question">
      <goods-question :item-id="id" :name="baseInfo.name || ''" :image-infos="imageInfos" />
    </view>

    <!-- 商品详情内容 -->
    <view class="wrap-goods-detail">
      <rich-text :nodes="goodsDetailContent" />
    </view>

    <!-- 推荐商品 -->
    <sp-recommend-goods :recommend-list="recommendItems" :point-ratio="pointRatio" :no-more="noMoreRecommendItems" />

    <!-- 底部按钮组 -->
    <view class="footer">
      <view v-if="goodsDetail.itemBasicVO && !isInSale" class="not-for-sale">商品已下架</view>
      <view class="wrap-cart" @click="handleClickCart">
        <image class="shopping-cart-img" :src="shoppingCart" mode="scaleToFill" />
        <text>购物车</text>
        <text v-if="cartGoodsNumber" class="cart-number">{{ cartGoodsNumber }}</text>
      </view>
      <view :class="['wrap-btn', { 'disabled-all-btn': !isInSale }]">
        <!-- 虚拟商品无法加入购物车 -->
        <view v-if="!isVirtual" class="btn add-cart" @click="openSelectSkuPopup('addCart')">加入购物车</view>
        <!-- 如果是虚拟商品，立即购买按钮宽度100% -->
        <view :class="['btn', 'btn-buy', { 'full-width': isVirtual }]" @click="openSelectSkuPopup('buy')">立即购买</view>
      </view>
    </view>
    <!-- 选择sku弹窗 -->
    <sp-select-sku
      v-if="currentSku.skuBasicVO?.id"
      ref="spSelectSkuRef"
      :point-ratio="pointRatio"
      :sku-id="currentSku.skuBasicVO?.id"
      :goods-detail="goodsDetail"
      :immediate-change="true"
      @sku-change="handleSkuChange"
      @add-cart="handleAddCart"
      @buy="handleBuy"
    />
    <!-- 商品参数弹窗 -->
    <goods-attrs-popup ref="popupGoodsParamsRef" :attrs="otherAttr.attrs" />
  </view>
</template>
<script lang="ts" setup name="GoodsDetail">
import GoodsEvaluation from './goods-evaluation.vue'
import GoodsQuestion from './goods-question.vue'
import GoodsAttrsPopup from './goods-attrs-popup.vue'
import GoodsBaseInfo from './base-info.vue'
import GoodsStoreInfo from './store.vue'
import CouponItem from './coupon-item.vue'

import { inject, computed, ref, Ref, reactive } from 'vue'

import { relogin } from '@api/request'
import { useAppStore } from '@src/pinia/app'
import { useGoodsStore } from '@src/pinia/goods'
import { useAddressStore } from '@src/pinia/address'

import { terminal } from '@util/common'
import { Enum } from '@src/lib/enmu'
import parseHtml from '@src/lib/html-parser'
import { onShow, onLoad, onReachBottom } from '@dcloudio/uni-app'

import { useCart } from './cart'
import { useOrder } from './order'
import { useDeliver } from './deliver'
import { useGoodsDetail } from './goods-detail'

// 商品id
let id = ref('')
const distributer = ref('')

type PageOptions = 'id' | 'scene'
onLoad((options: Record<PageOptions, string | undefined>) => {
  if (options.scene) {
    let params = decodeURIComponent(options.scene || '').split('&')
    id.value = params[0]
    distributer.value = params[1]
  } else {
    id.value = options.id || ''
  }
})

const { goodsDetail, currentSku, recommendItems, noMoreRecommendItems, goodsEvaluations, refreshGoodsDetail, refreshRecommendItems, getMoreRecommendItems } = useGoodsDetail()
const baseInfo = computed(() => goodsDetail.itemBasicVO || {})
const imageInfos = computed(() => {
  // 各个端的商品主图 （H5、PC、小程序）
  let itemDetailList = goodsDetail?.itemDetailVOList || []
  let itemDetail = itemDetailList.find((item: Goods.ItemDetailList) => item.terminal === terminal)
  return itemDetail?.imageList || []
})
// 活动中的sku信息
const activitySkuInfo = computed(() => {
  const activitySkuVos = goodsDetail && goodsDetail.itemActivityVO && goodsDetail.itemActivityVO[0].activitySkuVos
  return activitySkuVos ? activitySkuVos.find((item) => item.skuId === currentSku.skuBasicVO?.id) : undefined
})

const appStore = useAppStore()
const isLogin = computed(() => appStore.isLogin)

const goodsStore = useGoodsStore()
const pointRatio = computed(() => goodsStore.pointRatio)

const { cartGoodsNumber, getCartNumber, addCart } = useCart()

// 是否配送商品
const isDeliver = computed(() => baseInfo.value.type === Enum.Item.Type.Deliver)
// 是否虚拟商品
const isVirtual = computed(() => baseInfo.value.type === Enum.Item.Type.Virtual)
// 是否在售商品
const isInSale = computed(() => baseInfo.value.status === Enum.Item.Status.InSale)
// 虚拟商品门店信息
const storeList = computed(() => baseInfo.value.extra?.storeInfo || [])
// 商品普通属性
const otherAttr = computed(() => {
  let { itemAttributeVOList = [] } = goodsDetail
  let attrKeys: string[] = []
  let attrs: any = []
  itemAttributeVOList?.forEach((item) => {
    if (item.attributeType === 3) {
      attrKeys.push(item.attributeName)
      attrs.push({
        attrKey: item.attributeName,
        attrVal: item.attributeValueList[0]
      })
    }
  })
  return {
    attrKeys: attrKeys.join(' '),
    attrs
  }
})
// 商品详情，富文本
const goodsDetailContent = computed(() => {
  let itemDetailList = goodsDetail?.itemDetailVOList || []
  let itemDetail = itemDetailList.find((item: Goods.ItemDetailList) => item.terminal === terminal)
  return parseHtml(itemDetail?.details || '')
})
// 选中的sku信息
const selectedAttrStr = computed(() => {
  return '已选：' + (currentSku?.skuBasicVO?.skuAttributeValueVOList?.map((item) => item.attributeValue).join('/') || '')
})

const isFirstEnter = ref(true)
onShow(async () => {
  if (isFirstEnter.value) {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 50
    })
    isFirstEnter.value = false
  }
  // refreshRecommendItems({
  //   recType: 4,
  //   excludeItemIds: id.value
  // })
  isLogin.value && getCartNumber()
  id.value && (await refreshGoodsDetail(id.value))
  // 配送商品  获取收获地址相关信息，展示运费
  if (isDeliver.value) {
    getDeliverInfo(baseInfo.value.shipTemplateId)
  }
})

onReachBottom(async () => {
  // getMoreRecommendItems()
})
/**
 * 点击 “选择sku” “加入购物车” “立即购买” 触发该函数
 * @param operateType selectSku、buy、addCart
 */
const spSelectSkuRef: Ref<SpPopup | null> = ref(null)
function openSelectSkuPopup(operateType: string) {
  /**
   * 在售的商品 或 选择sku操作，弹窗窗口
   * 非在售商品，“加入购物车” “立即购买” 无法激活弹窗
   */
  if (isInSale.value || operateType === 'selectSku') {
    spSelectSkuRef.value?.open(operateType)
  }
}

const popupGoodsParamsRef: Ref<SpPopup | null> = ref(null)
function openGoodsParamsPopup() {
  popupGoodsParamsRef.value?.open()
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconBack, shoppingCart, iconRight] = gdp(['icon-back.png', 'shopping-cart.png', 'icon-right.png'])

function handleSkuChange(skuId: string, sku: Goods.Sku) {
  Object.assign(currentSku, sku)
}

/**
 * 物流配送信息
 */
const { isFreeShipping, freightTemplate, shippingAddress, getDeliverInfo } = useDeliver()

// 去地址列表页面
const checkAddress = () => {
  // 未登录先去登录页面
  if (isLogin.value) {
    uni.navigateTo({
      url: `/package-mine/pages/address-list/index?isFromPage=goodsDetail&shipTemplateId=${baseInfo.value.shipTemplateId}&id=${id.value}`
    })
  } else {
    relogin()
  }
}

/**
 * 加入购物车
 * @param sku
 * @param buyNumber
 */
function handleAddCart(skuId: string, buyNumber: number) {
  const { id: itemId, type, name, mainImage } = goodsDetail?.itemBasicVO || {}
  const data = {
    shopCode: goodsDetail.itemContentVO.shopCode, //店铺编码
    itemType: type,
    itemName: name,
    thumbnail: mainImage || '',
    itemId,
    skuId,
    quantity: buyNumber,
    snapshotPrice: Number(goodsDetail.itemPriceVO.minPrice),
    activityId: activitySkuInfo.value?.id
  }
  addCart(data)
}
/**
 * 立即购买
 * @param sku
 * @param buyNumber
 */
async function handleBuy(skuId: string, buyNumber: number) {
  const { id: itemId, type, extra } = goodsDetail?.itemBasicVO || {}
  let params = {
    vmId: 1,
    itemToOrderList: [
      {
        itemId: itemId,
        quantity: buyNumber,
        skuId
      }
    ]
  }
  await useOrder().addPreviewOrder(params)
  let orderChannel = 0
  let goodsType = type
  let customerInfo = extra?.customerInfo || {}
  let query = `orderChannel=${orderChannel}&distributer=${distributer.value}&goodsType=${goodsType}&customerInfo=${JSON.stringify(customerInfo)}`
  uni.navigateTo({ url: `/package-life/pages/goods-settle/index?${query}` })
  //  商详地址的选择不影响购物结算规则，因此这里需要清空
  useAddressStore().$patch({
    selectedAddress: null
  })
}

function onBack() {
  let routers = getCurrentPages()
  if (routers.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else {
    uni.switchTab({ url: '/pages/life/index' })
  }
}

function handleClickCart() {
  if (isLogin.value) {
    uni.navigateTo({
      url: '/package-mine/pages/shopping-cart/index'
    })
  } else {
    relogin()
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
