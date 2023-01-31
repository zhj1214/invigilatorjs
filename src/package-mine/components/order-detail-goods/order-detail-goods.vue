<template>
  <view>
    <view v-for="(item, index) in orderItemDtoList" :key="index" class="order-detail-goods">
      <image class="order-detail-goods-detail-image" :src="item.itemImage" mode="aspectFit" />
      <view class="order-detail-goods-detail-sku">
        <view>
          <view class="flex">
            <view class="name">{{ item.itemName }}</view>
            <view>x{{ item.quantity }}</view>
          </view>
          <view class="attrs">
            <text v-for="(orderItem, orderItemIndex) in item.attributeMaps || []" :key="orderItemIndex">
              {{ orderItem.attrVal }}
              <text v-show="orderItemIndex !== item.attributeMaps.length - 1">/</text>
            </text>
          </view>
        </view>
        <view v-if="item.activityTypeList && item.activityTypeList[0] === 5" class="activity">限时抢购</view>
        <view class="flex">
          <view class="price">
            <view v-if="item.skuPayMode !== 2">
              <text>￥{{ item.activityPrice ? item.activityPrice / 100 : item.retailPrice / 100 }}</text>
              <text v-if="item.skuPayMode === 3">+</text>
              <template v-if="item.skuPayMode === 4">
                <text>（</text>
                <image class="price-points-icon" :src="pointIcon" />
                <text>
                  {{ item.activityPrice ? item.activityPrice / pointRatio : item.retailPrice / pointRatio }}
                </text>
                <text>）</text>
              </template>
            </view>
            <view v-else>
              <image class="price-points-icon" :src="pointIcon" />
              <text>
                {{ item.pointAmount }}
              </text>
            </view>
            <view v-if="item.activityPrice" class="original">
              <text>￥{{ item.retailPrice / 100 }}</text>
              <text v-if="item.skuPayMode === 3">+</text>
              <template v-if="item.skuPayMode === 4">
                （
                <image class="price-points-icon" :src="orderPointsPayment" />
                <text>{{ item.extraMap.maxPointNum || '' }}</text>
                ）
              </template>
            </view>
          </view>
          <view v-if="type === 'orderDetail'" class="btns">
            <view v-if="[1, 2, 3, 4, 88].includes(item.status)" class="btn" @click="goToApply(item)">申请售后</view>
            <view v-if="[6, 7, 8].includes(item.status)" class="btn" @click="goToApplyInfo(item)">正在售后</view>
            <view v-if="item.status === -2" class="btn refund"><text @click="goToApplyInfo(item)">退款成功</text></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="OrderDetailGoods">
import { inject, computed, PropType } from 'vue'
import { useGoodsStore } from '@src/pinia/goods'
import { useAfterSaleStore } from '@src/pinia/after-sale'

const props = defineProps({
  orderItemDtoList: {
    type: Array as PropType<Array<Order.ItemDtoListInfo>>,
    default: () => []
  },
  orderDetail: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'orderDetail'
  }
})

const afterSaleStore = useAfterSaleStore()
const goodsStore = useGoodsStore()
goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const pointIcon = gdp('icon-point.png')
const orderPointsPayment = gdp('order-detail-point-detail.png')

function goToApply(orderItem: Order.ItemDtoListInfo) {
  if (props.orderDetail.orderStatus === 88 && !orderItem?.extraMap?.isAfterSale) {
    uni.showToast({
      icon: 'none',
      title: '该商品不可退款'
    })
    return
  }
  let obj = {
    status: orderItem.status,
    orderId: orderItem.orderId,
    itemType: orderItem.itemType
  }
  afterSaleStore.setParams(obj)
  uni.navigateTo({
    url: `/package-mine/pages/apply-for-after-sale/index?id=${orderItem.id}`
  })
}
function goToApplyInfo(orderItem: Order.ItemDtoListInfo) {
  const id = orderItem?.orderAfterSalesDto?.id
  uni.navigateTo({
    url: `/package-mine/pages/after-sale-detail/index?id=${id}`
  })
}
</script>
<style lang="scss" scoped>
.order-detail-goods {
  display: flex;
  padding: 47rpx 0;
  border-bottom: 1rpx solid #e4e7ea;

  &:last-child {
    border-bottom: 0;
  }

  &-detail {
    &-image {
      width: 160rpx;
      height: 160rpx;
    }

    &-sku {
      flex: 1;
      margin-left: 24rpx;
      padding: 11rpx 0 15rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: calc(100% - 184rpx);

      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .name {
        font-size: 28rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        color: #1a1a1a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 90%;
      }

      .attrs {
        font-size: 26rpx;
        color: #909ca8;
      }

      .activity {
        width: fit-content;
        line-height: 36rpx;
        padding: 0 8rpx;
        text-align: center;
        font-size: 22rpx;
        border-radius: 6rpx;
        border: 1rpx solid #c14947;
        color: #c14947;
        margin-top: 20rpx;
      }

      .price {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #1a1a1a;

        &-points-icon {
          width: 28rpx;
          height: 28rpx;
          position: relative;
          top: 4rpx;
        }

        .original {
          position: relative;
          color: #92969a;

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1rpx;
            background-color: #92969a;
            z-index: 5;
          }
        }
      }

      .btns {
        margin-top: 16rpx;

        .btn {
          width: 160rpx;
          height: 64rpx;
          border-radius: 1rpx;
          border: 2rpx solid #d8d8d8;
          font-size: 24rpx;
          color: #1a1a1a;
          line-height: 64rpx;
          text-align: center;
        }

        .refund {
          font-size: 26rpx;
          color: #4e6175;
        }
      }
    }
  }
}
</style>
