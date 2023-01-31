<template>
  <!-- 轮播图 -->
  <view v-if="imgList" class="top-swiper">
    <sp-swiper :img-list="imgList" :control-bottom="20" />
  </view>
  <!-- 商品活动信息 -->
  <goods-activity-price
    v-if="activityInfo"
    class="goods-detail-price"
    :activity-info="activityInfo"
    :pay-type="baseInfo.payType"
    :price-info="priceInfo"
    :stock-quantity="currentSku.stockVO.availableQuantity"
    :is-free="isFree"
    @timeup="toDelayRefreshGoodsDetail"
  />
  <!-- 商品名称 + 价格 -->
  <view v-if="baseInfo" class="goods-base-info">
    <view class="name ellipsis">{{ baseInfo.name }}</view>
    <view v-if="baseInfo.advertise" class="desc ellipsis">{{ baseInfo.advertise }}</view>
    <sp-goods-price v-if="!activityInfo" :single-line-max-length="30" :sku-id="currentSku.skuBasicVO?.id" :item-detail="goodsDetail" :is-free="isFree" :point-ratio="pointRatio" />
    <!-- 价格展示 end -->
  </view>
</template>

<script setup lang="ts" name="GoodsBaseInfo">
import GoodsActivityPrice from './goods-activity-price.vue'

import { computed, PropType } from 'vue'
import { useGoodsStore } from '@src/pinia/goods'
import { formatPrice } from '@util/money'

const goodsStore = useGoodsStore()

const props = defineProps({
  baseInfo: {
    type: Object as PropType<Goods.BaseInfo>,
    default: null,
    required: true
  },
  activityInfo: {
    type: Object as PropType<Goods.Activity.Sku>,
    default: null
  },
  imgList: {
    type: Array as PropType<string[]>,
    default: null
  },
  currentSku: {
    type: Object as PropType<Goods.Sku>,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  goodsDetail: {
    type: Object as PropType<Goods.Item>,
    required: true
  }
})

const pointRatio = computed(() => goodsStore.pointRatio)

const priceInfo = computed(() => {
  const { payType } = props.goodsDetail.itemBasicVO
  const { price, pointPrice, maxPointPrice, id } = props.currentSku.skuBasicVO
  const { itemActivityVO } = props.goodsDetail
  const actSkuInfo = itemActivityVO && itemActivityVO[0].activitySkuVos.find((item) => item.skuId === id)
  return formatPrice({
    payType: payType,
    price: Number(price),
    pointPrice: Number(pointPrice),
    pointRatio: pointRatio.value,
    maxPointPrice: Number(maxPointPrice),
    activityInfo: itemActivityVO && {
      activityPrice: Number(actSkuInfo?.activityPrice),
      activityStatus: itemActivityVO[0].itemActivityStatus
    }
  })
})
const emit = defineEmits(['refresh'])

function toDelayRefreshGoodsDetail() {
  setTimeout(() => {
    emit('refresh')
  }, 500)
}
</script>

<style lang="scss" scoped>
// 轮播图
.top-swiper {
  width: 100vw;
  height: 685rpx;
  position: relative;
  background-color: $uni-bg-color;
}

// 商品名、描述、价格等基础信息
.goods-base-info {
  padding: 40rpx 40rpx 67rpx;
  background-color: $uni-bg-color;
  min-height: 226rpx;

  .name {
    font-size: 48rpx;
    color: #292c2e;
    font-weight: 600;
    margin-bottom: 6rpx;
  }

  .desc {
    margin-bottom: 24rpx;
    font-size: 24rpx;
    color: #92969a;
  }
}

.goods-detail-price + .goods-base-info {
  min-height: unset;
}
</style>
