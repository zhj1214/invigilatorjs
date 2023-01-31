<template>
  <uni-popup ref="popupRef" type="bottom">
    <view class="content">
      <image class="close-icon" :src="iconSquareClose" mode="scaleToFill" @click="close" />
      <view class="header-base-info">
        <image class="goods-image" :src="currentSku.skuBasicVO.image" mode="scaleToFill" />
        <view class="base-info">
          <view class="price-box">
            <sp-goods-price :sku-id="currentSku.skuBasicVO.id" :current-Sku="currentSku" :item-detail="goodsDetail" :point-ratio="pointRatio" :show-activity-tag="false" />
          </view>
          <view v-if="currentSkuActivity" class="activity-tip">
            <text>限时活动进行中</text>
            <text v-if="currentSkuActivity.skuBuyLimit">（限购{{ currentSkuActivity.skuBuyLimit }}件）</text>
          </view>
          <view v-else-if="currentSku.skuBasicVO.limitFlag" class="activity-tip">限购{{ currentSku.skuBasicVO.limitQuantity }}件</view>
          <view class="stock-quantity">库存 {{ stockQuantity }}</view>
          <view class="attr-info ellipsis-2">
            <text class="selected-label">已选</text>
            <text v-for="item in selectedSkuSaleAttr" :key="item" class="attr-value">{{ item || '' }}</text>
          </view>
          <view v-if="isGoodsInActivity && !currentSkuActivity" class="activity-tip">
            <text>注：所选规格不参加限时抢购</text>
          </view>
        </view>
      </view>
      <!-- 选择sku -->

      <scroll-view scroll-y :class="['wrap-list', { 'no-control-number': !isShowControlNumber }]">
        <view class="attrs">
          <view v-for="item in groupedSaleAttrs" :key="item.attrKey" class="attr-item">
            <!-- 属性的名称，例如：颜色、形状 -->
            <view class="attr-key ellipsis">{{ item.attrKey }}</view>
            <view class="attr-value-list">
              <!-- 属性值，例如：红、黑 -->
              <view
                v-for="val in filterAttrVal(item.attrKey, item.attrVal)"
                :key="val"
                :class="['attr-value', { active: selectedSkuSaleAttr[item.attrKey] === val, disabled: !hasStock(item.attrKey, val) }]"
                @click="handleClickAttr(item.attrKey, val)"
              >
                <view class="wrap-text ellipsis">
                  {{ val }}
                </view>
                <text v-if="!hasStock(item.attrKey, val)" class="not-stock-hint">售罄</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 控制数量 -->
      <view v-if="isShowControlNumber || false" class="control-number">
        <view class="label">购买数量</view>
        <view class="btn-group">
          <view :class="['wrap-icon', { disabled: buyNumber <= 1 }]" @click="setBuyNumber(-1)">
            <image class="minus" :src="iconMinusNumber" mode="scaleToFill" />
          </view>
          <text class="number">{{ buyNumber }}</text>
          <view :class="['wrap-icon', { disabled: buyNumber === maxBuyNumber }]" @click="setBuyNumber(1)">
            <image class="plus" :src="iconPlusNumber" mode="scaleToFill" />
          </view>
        </view>
      </view>

      <!-- 按钮组 -->
      <view class="popup-footer">
        <!-- 没有库存 -->
        <template v-if="!stockQuantity">
          <view class="btn btn-full disabled">当前商品无库存，不支持选购</view>
        </template>
        <!-- 有库存 -->
        <template v-else>
          <!-- 点击 “加入购物车、立即购买” 按钮后弹窗 -->
          <view v-if="['addCart', 'buy', 'changeCart'].includes(operateType)" class="btn btn-full" @click="handleConfirm()">确定</view>
          <!-- 点击“选择sku”的操作 -->
          <template v-else-if="operateType === 'selectSku'">
            <view v-if="!isVirtualGoods" class="btn btn-middle btn-plain" @click="handleConfirm('addCart')">加入购物车</view>
            <view :class="['btn', isVirtualGoods ? 'btn-full' : 'btn-middle']" @click="handleConfirm('buy')">立即购买</view>
          </template>
        </template>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { Enum } from '@src/lib/enmu'
import { Item } from '@src/lib/enmu/item'
import { computed, inject, PropType, reactive, Ref, ref, watch } from 'vue'

export type OperateType = 'addCart' | 'buy' | 'selectSku' | 'changeCart'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconSquareClose, iconMinusNumber, iconPlusNumber] = gdp(['icon-square-close.png', 'icon-minus-number.png', 'icon-plus-number.png'])

const props = defineProps({
  goodsDetail: {
    type: Object as PropType<Goods.Item>,
    default: null,
    require: true
  },
  skuId: {
    type: String,
    default: null,
    require: true
  },
  pointRatio: {
    type: Number,
    default: 1
  },
  // 是否显示数量步进器
  isShowControlNumber: {
    type: Boolean,
    default: true
  },
  immediateChange: {
    type: Boolean,
    default: false
  },
  // 初始购买数量
  defaultBuyNumber: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits<{
  (event: 'sku-change', skuId: string, sku: Goods.Sku): void
  (event: 'add-cart', skuId: string, buyNumber: number): void
  (event: 'buy', skuId: string, buyNumber: number): void
}>()

// 销售属性组
const groupedSaleAttrs = computed(() => {
  let { itemAttributeVOList = [] } = props.goodsDetail
  let attrs: any = []
  itemAttributeVOList?.forEach((item) => {
    if (item.attributeType === 2) {
      attrs.push({
        attrKey: item.attributeName,
        attrVal: item.attributeValueList
      })
    }
  })
  return attrs
})
// 默认带入的初始sku
const defaultSku = computed(() => props.goodsDetail?.skuVOList?.find((sku) => sku.skuBasicVO.id === props.skuId) as Goods.Sku)
// 选中的销售属性
const selectedSkuSaleAttr: Record<string, string> = reactive({})
watch(
  defaultSku,
  () => {
    // 根据默认带入的初始化选中的销售属性
    defaultSku.value?.skuBasicVO.skuAttributeValueVOList?.forEach((item) => {
      selectedSkuSaleAttr[item.attributeName] = item.attributeValue
    })
  },
  {
    immediate: true
  }
)
// 当前sku
const currentSku = computed(() => {
  return props.goodsDetail?.skuVOList?.find((sku: Goods.Sku) => {
    return sku.skuBasicVO.skuAttributeValueVOList.every((item) => {
      return item.attributeValue === selectedSkuSaleAttr[item.attributeName]
    })
  }) as Goods.Sku
})

watch(currentSku, (sku, oldSku) => {
  if (oldSku && props.immediateChange) {
    emit('sku-change', sku.skuBasicVO.id, sku)
    buyNumber.value = maxBuyNumber.value ? props.defaultBuyNumber || 1 : 0
  }
})
// 参加活动的所有sku信息
const activitySkus = computed(() => {
  return (props.goodsDetail && props.goodsDetail.itemActivityVO && props.goodsDetail.itemActivityVO[0].activitySkuVos) || []
})
const isGoodsInActivity = computed(() => {
  return activitySkus.value && activitySkus.value.some((sku: { itemActivityStatus: number }) => sku.itemActivityStatus === Enum.Activity.Status.IsGoing)
})
// 当前sku的有效活动信息
const currentSkuActivity = computed(() => {
  return getSkuOngoingActivityInfo(currentSku.value.skuBasicVO.id)
})
// 库存数量，活动进行中取活动库存数量
const stockQuantity = computed(() => {
  return currentSkuActivity.value ? currentSkuActivity.value.skuQuantity : currentSku.value.stockVO.availableQuantity
})
// 最大购买数量
const maxBuyNumber = computed(() => {
  // 活动进行中取活动限购数量
  if (currentSkuActivity.value) {
    return Math.min(99, Number(currentSkuActivity.value.skuQuantity), Number(currentSkuActivity.value.skuBuyLimit))
  }
  return Math.min(99, currentSku.value.stockVO.availableQuantity, currentSku.value.skuBasicVO.limitFlag ? Number(currentSku.value.skuBasicVO.limitQuantity) : 99)
})
// 实际购买数量
const buyNumber = ref(1)
// 是否虚拟商品
const isVirtualGoods = computed(() => props.goodsDetail.itemBasicVO.type === Enum.Item.Type.Virtual)
// 打开选择器场景类型
const operateType: Ref<OperateType | string> = ref('')
const popupRef: Ref<SpPopup | null> = ref(null)
/**
 * 关闭选择器
 */
function close() {
  popupRef.value?.close()
}
/**
 * 打开选择器
 * @param type
 */
function open(type: OperateType) {
  operateType.value = type
  popupRef.value?.open()
}
defineExpose({ open })

/**
 * 点击sku的某个属性，例如：颜色分类中的“红色”
 * @param key
 * @param val
 */
function handleClickAttr(key: string, val: string) {
  selectedSkuSaleAttr[key] = val
}
/**
 * 设置购买数量
 * @param number
 */
function setBuyNumber(number: number) {
  const newBuyNumber = buyNumber.value + number
  if (newBuyNumber > 0 && newBuyNumber <= maxBuyNumber.value) {
    buyNumber.value = newBuyNumber
  } else if (newBuyNumber > maxBuyNumber.value) {
    buyNumber.value = maxBuyNumber.value
  }
}

function getSkuOngoingActivityInfo(skuId: string) {
  const skuActInfo = activitySkus.value && activitySkus.value.find((item: { skuId: string }) => item.skuId === skuId)
  return skuActInfo && skuActInfo.itemActivityStatus === Enum.Activity.Status.IsGoing ? skuActInfo : null
}
const filterAttrVal = (attrKey: string, attributeValueList: string[]) => {
  attributeValueList.forEach((attrVal, index) => {
    if (hasStock(attrKey, attrVal) === 'noMatchedSku') attributeValueList.splice(index, 1)
  })
  return attributeValueList
}
/**
 * 计算当前属性值和其它几种属性是否互斥
 * 依据是否有库存
 * @param attrKey
 * @param attrVal
 */
function hasStock(attributeName: string, attributeValue: string) {
  const attrs = {
    ...selectedSkuSaleAttr,
    [attributeName]: attributeValue
  }
  const matchedSku = props.goodsDetail.skuVOList.find((sku: Goods.Sku) => {
    return sku.skuBasicVO.skuAttributeValueVOList.every((item) => {
      return item.attributeValue === attrs[item.attributeName]
    })
  }) as Goods.Sku
  if (!matchedSku) return 'noMatchedSku' // 存在勾选了销售属性，但未配置相关sku
  const skuActivityInfo = (activitySkus.value.length && getSkuOngoingActivityInfo(matchedSku.skuBasicVO.id)) || null
  return !!(skuActivityInfo ? skuActivityInfo.skuQuantity : matchedSku.stockVO.availableQuantity)
}

function handleConfirm(type?: OperateType) {
  const skuInfo = currentSku.value.skuBasicVO
  switch (type || operateType.value) {
    case 'addCart':
      emit('sku-change', skuInfo.id, skuInfo)
      emit('add-cart', skuInfo.id, buyNumber.value)
      break
    case 'buy':
      emit('sku-change', skuInfo.id, skuInfo)
      emit('buy', skuInfo.id, buyNumber.value)
      break
    case 'changeCart':
      emit('sku-change', skuInfo.id, skuInfo)
      break
    default:
      break
  }
  close()
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
