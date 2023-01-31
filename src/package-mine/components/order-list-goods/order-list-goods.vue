<template>
  <view class="order-list-goods">
    <view v-if="orderItemDtoList.length === 1" style="display: flex">
      <image class="order-list-goods-detail-image" :src="orderItemDtoList[0].itemImage" mode="aspectFit" />
      <view class="order-list-goods-detail-sku">
        <view class="name">{{ orderItemDtoList[0].itemName }}</view>
        <view class="attrs">
          <text v-for="(orderItem, orderItemIndex) in orderItemDtoList[0].attributeMaps" :key="orderItemIndex">
            {{ orderItem.attrVal }}
            <text v-show="orderItemIndex !== orderItemDtoList[0].attributeMaps.length - 1">/</text>
          </text>
        </view>
        <view class="quantity">
          <view>x{{ orderItemDtoList[0].quantity }}</view>
          <view class="price">
            <view v-if="totalAmount > 0" class="price-amount">￥{{ formatMoney(totalAmount) }}</view>
            <view v-if="totalPointNum > 0" class="points">
              <view v-if="totalAmount > 0" class="points-symbol">+</view>
              <image class="points-icon" :src="iconOrderPoint" />
              <view class="points-num">{{ totalPointNum }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="order-list-goods-detail-images">
        <image v-for="(orderItem, index) in orderItemDtoList" :key="index" :src="orderItem.itemImage" mode="aspectFit" />
      </view>
      <view class="order-list-goods-detail-quantity" style="margin-top: 20rpx">
        <view>共{{ orderItemDtoList.length }}件</view>
        <view class="price">
          <view v-if="totalAmount > 0" class="price-amount">￥{{ formatMoney(totalAmount) }}</view>
          <view v-if="totalPointNum > 0" class="points">
            <view v-if="totalAmount > 0" class="points-symbol">+</view>
            <image class="points-icon" :src="iconOrderPoint" />
            <view class="points-num">{{ totalPointNum }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="OrderListGoods">
import { inject, PropType } from 'vue'
import { formatMoney } from '@util/money'

defineProps({
  totalAmount: {
    type: Number,
    default: 0
  },
  totalPointNum: {
    type: Number,
    default: 0
  },
  orderItemDtoList: {
    type: Array as PropType<Array<Order.ItemDtoListInfo>>,
    default: () => []
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let iconOrderPoint: string = gdp('icon-order-point.png')
</script>
<style lang="scss" scoped>
.order-list-goods {
  margin: 24rpx 0;

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

      .name {
        font-size: 28rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        color: #1a1a1a;
      }

      .attrs {
        font-size: 26rpx;
        color: #909ca8;
      }

      .quantity {
        display: flex;
        justify-content: space-between;
        font-size: 26rpx;
        color: #909ca8;

        .price {
          display: flex;

          &-amount {
            font-size: 28rpx;
            font-family: SourceHanSansSC-Normal, SourceHanSansSC;
            color: #1a1a1a;
          }

          .points {
            display: flex;
            align-items: center;

            &-symbol {
              font-size: 28rpx;
              font-family: SourceHanSansSC-Normal, SourceHanSansSC;
              color: #1a1a1a;
              padding: 0 8rpx;
            }

            image {
              width: 28rpx;
              height: 28rpx;
              margin-bottom: 2rpx;
            }

            &-num {
              font-size: 28rpx;
              font-family: SourceHanSansSC-Normal, SourceHanSansSC;
              color: #1a1a1a;
            }

            .points-symbol {
              padding: 0 8rpx;
            }
          }
        }
      }
    }

    &-images {
      width: 100%;
      white-space: nowrap;
      overflow-x: scroll;

      image {
        width: 160rpx;
        height: 160rpx;
        margin-right: 32rpx;
      }
    }

    &-quantity {
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      color: #909ca8;

      .price {
        display: flex;

        &-amount {
          font-size: 28rpx;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          color: #1a1a1a;
        }

        .points {
          display: flex;
          align-items: center;

          &-symbol {
            font-size: 28rpx;
            font-family: SourceHanSansSC-Normal, SourceHanSansSC;
            color: #1a1a1a;
            padding: 0 8rpx;
          }

          image {
            width: 28rpx;
            height: 28rpx;
          }

          &-num {
            font-size: 28rpx;
            font-family: SourceHanSansSC-Normal, SourceHanSansSC;
            color: #1a1a1a;
          }
        }
      }
    }
  }
}
</style>
