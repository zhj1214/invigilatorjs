<template>
  <view class="sp-goods-price">
    <view v-if="showActivityTag && activityType !== null" class="activity-info">
      <view v-if="activityTypeName" class="activity-type-tag">{{ activityTypeName }}</view>
      <view v-if="activityStatusName" class="activity-status-tag" :class="{ 'not-start': activityStatus === -1 }">{{ activityStatusName }}</view>
    </view>
    <view class="price-info" :class="['font-size-' + fontSize]" :style="{ fontSize: fontSize + 'rpx', color: color }">
      <view v-if="priceInfo.fee" class="price-fee ellipsis" :class="{ 'width-100': priceInfo.fee.toString().length + priceInfo.point.toString().length > singleLineMaxLength }">
        <text class="symbol">¥</text>
        <text>{{ priceInfo.fee }}</text>
      </view>
      <view v-if="priceInfo.point" class="ellipsis" :class="{ 'width-100': priceInfo.fee.toString().length + priceInfo.point.toString().length > singleLineMaxLength }">
        <text v-if="payType === 3">+</text>
        <text v-if="payType === 4">(</text>
        <image class="point-icon" :src="iconPoint" mode="aspectFit" />
        <text>{{ priceInfo.point }}</text>
        <text v-if="payType === 4">)</text>
      </view>
      <view v-if="isFree" class="isfree-box">包邮</view>
    </view>
  </view>
</template>

<script setup lang="ts" name="SpGoodsPrice">
import { Enum } from '@src/lib/enmu'
import { formatPrice } from '@src/util/money'
import { computed, inject, reactive, Ref, ref, watch } from 'vue'

interface Props {
  /**
   * 积分兑换比例
   */
  pointRatio?: number
  /**
   * 商品信息
   */
  itemDetail: Goods.Item
  /**
   * 当前sku信息
   */
  currentSku?: Goods.Sku
  skuId?: string | null
  /**
   * 价格显示的字体大小
   */
  fontSize?: string | number
  /**
   * 价格显示的字体颜色
   */
  color?: string
  /**
   * 是否显示活动标签，默认显示
   * @default true
   */
  showActivityTag?: boolean
  /**
   * 一行超出隐藏的字数
   * @default 12
   */
  singleLineMaxLength?: number
  /**
   * 是否包邮
   * @default false
   */
  isFree?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pointRatio: 1,
  fontSize: '40',
  color: '#4e6175',
  showActivityTag: true,
  singleLineMaxLength: 12,
  skuId: null
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconPoint] = gdp(['icon-point-dark.png'])

const activityType: Ref<number | null> = ref(null)
const activityStatus: Ref<number | null> = ref(null)

const activityTypeName = computed(() => Enum.Activity.getTypeText(activityType.value))
const activityStatusName = computed(() => Enum.Activity.getStatusText(activityStatus.value))

const payType: Ref<number | null> = ref(null)

const priceInfo = reactive({
  fee: 0,
  point: 0,
  originFee: 0,
  originPoint: 0
})

watch(
  [() => props.currentSku, () => props.itemDetail, () => props.pointRatio, () => props.skuId],
  ([currentSku, itemDetail, pointRatio]) => {
    if (itemDetail && pointRatio) {
      activityType.value = (itemDetail.itemActivityVO && itemDetail.itemActivityVO[0].activityType) || null
      activityStatus.value = (itemDetail.itemActivityVO && itemDetail.itemActivityVO[0].itemActivityStatus) || null
      payType.value = itemDetail.itemBasicVO.payType
      let actSkuInfo = null

      if (itemDetail.itemActivityVO && props.skuId) {
        actSkuInfo = itemDetail.itemActivityVO[0].activitySkuVos.find((item: { skuId: string | null }) => item.skuId === props.skuId)
      }

      const price = formatPrice({
        payType: itemDetail.itemBasicVO.payType,
        price: Number(currentSku ? currentSku.skuBasicVO.price : itemDetail.itemPriceVO.minPrice),
        pointPrice: Number(currentSku ? currentSku.skuBasicVO.minPointPrice : itemDetail.itemPriceVO.minPointPrice),
        pointRatio,
        maxPointPrice: Number(currentSku ? currentSku.skuBasicVO.maxPointPrice : itemDetail.itemPriceVO.maxPointPrice),
        activityInfo: itemDetail.itemActivityVO && {
          activityPrice: actSkuInfo ? actSkuInfo.activityPrice : Number(itemDetail.itemActivityVO[0].lowPrice),
          activityStatus: itemDetail.itemActivityVO[0].itemActivityStatus
        }
      })
      Object.assign(priceInfo, price)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.sp-goods-price {
  .activity-info {
    display: flex;
    align-items: center;
    margin-bottom: 6rpx;

    .activity-type-tag {
      color: #fff;
      font-size: 22rpx;
      border-radius: 4rpx;
      background: #c14947;
      height: 36rpx;
      padding: 0 8rpx;
      margin-right: 12rpx;
      display: flex;
      align-items: center;
    }

    .activity-status-tag {
      box-sizing: border-box;
      color: #c14947;
      font-size: 22rpx;
      height: 36rpx;
      padding: 0 8rpx;
      border-radius: 4rpx;
      border: 1rpx solid #c14947;
      display: flex;
      align-items: center;

      &.not-start {
        border-color: #bababa;
        color: #bababa;
      }
    }
  }

  .price-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .price-fee {
      margin-right: 5rpx;
    }

    .width-100 {
      width: 100%;
    }

    .point-icon {
      width: 0.95em;
      height: 0.95em;
      position: relative;
      top: 0.07em;
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
    }
  }

  .wrap-limit {
    height: 1.7em;
    padding: 0 7rpx;
    margin-left: 14rpx;
    line-height: 1.6em;
    font-size: 0.6em;
    color: #696b6c;
    background-color: #edeff1;
    border-radius: 2rpx;
    position: relative;
    top: 2rpx;
  }
}

.font-size-40 {
  font-size: 40rpx;
}

.font-size-32 {
  font-size: 32rpx;
}

.color-4e6175 {
  color: #4e6175;
}
</style>
