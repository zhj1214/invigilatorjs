<template>
  <view class="after-sale-detail-content">
    <view class="title">退款信息</view>
    <order-detail-goods v-if="orderItemDto.itemType === '1' || orderItemDto.itemType === '2'" :order-item-dto-list="[{ ...orderItemDto }]" type="afterSale" />
    <view class="car">
      <order-car-card v-if="orderItemDto.itemType === '0'" :order-item="orderItemDto" type="afterSaleDetail" />
    </view>
  </view>
  <view class="after-sale-detail-info">
    <view>
      <text>退款原因</text>
      <text>{{ afterSaleInfo.reason }}</text>
    </view>
    <view>
      <text>退款金额</text>
      <view class="after-sale-detail-info-price">
        <view v-if="afterSaleInfo.totalAmount > 0" class="amount">￥{{ formatMoney(afterSaleInfo.totalAmount) }}</view>
        <view v-if="afterSaleInfo.totalPointNum > 0" class="points">
          <view v-if="afterSaleInfo.totalAmount > 0" class="points-symbol">+</view>
          <image class="points-icon" :src="orderDetailPointDetail" />
          <view class="points-amount">{{ afterSaleInfo.totalPointNum }}</view>
        </view>
      </view>
    </view>
    <view>
      <text>售后单号</text>
      <text>{{ afterSaleId }}</text>
    </view>
    <view>
      <text>申请时间</text>
      <text>{{ afterSaleInfo.createdAt }}</text>
    </view>
  </view>
  <view class="after-sale-detail-info">
    <view class="title">问题描述</view>
    <text>{{ afterSaleInfo.applyDesc }}</text>
    <view v-if="fileIdList.length > 0" class="images">
      <image v-for="(path, index) in fileIdList" :key="index" :src="path" mode="asceptFit" />
    </view>
  </view>
  <view v-if="afterSaleInfo.auditDesc" class="after-sale-detail-info">
    <view class="title">审核留言</view>
    <text>{{ afterSaleInfo.auditDesc }}</text>
  </view>
</template>

<script setup lang="ts">
import { defineProps, inject } from 'vue'
import { formatMoney } from '@util/money'
import orderDetailGoods from '../../components/order-detail-goods/order-detail-goods.vue'
import orderCarCard from '../../components/order-car-card/order-car-card.vue'

defineProps<{
  afterSaleInfo: AfterSale.DetailInfo
  orderItemDto: Order.ItemDtoListInfo
  afterSaleId: string
  fileIdList: Array<AnyObject>
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const orderDetailPointDetail = gdp('order-detail-point-total.png')
</script>

<style scoped lang="scss">
.after-sale-detail-content {
  margin: 0 40rpx;

  .title {
    font-size: 36rpx;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
    margin: 31rpx 0 11rpx;
  }

  .car {
    margin: 56rpx 0;
  }
}

.after-sale-detail-info {
  margin: 22rpx 40rpx 44rpx;

  > view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64rpx;

    // padding: 11rpx 0;
    .label {
      min-width: 200rpx;
    }

    text {
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #696b6c;
    }

    text:last-child {
      text-align: right;
      flex: 1;
      min-width: 0;
      word-break: break-all;
    }

    .copy {
      font-size: 30rpx;
      color: #4e6175;
      text-decoration: underline;
      margin-left: 16rpx;
    }
  }

  text {
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    color: #696b6c;
    line-height: 41rpx;
  }

  .title {
    font-size: 36rpx;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
    margin-bottom: 31rpx;
  }

  .images {
    display: flex !important;
    justify-content: space-between;
    margin-top: 20rpx;
    height: 100%;

    image {
      width: 196rpx;
      height: 196rpx;
      margin-right: 41rpx;
    }

    image:last-child {
      margin-right: 0;
    }
  }

  .images::after {
    content: '';
    flex: auto;
  }

  &-price {
    display: flex;
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    color: #696b6c;

    &-amount {
      font-size: 32rpx;
      color: #696b6c;
    }

    .points {
      display: flex;
      align-items: center;

      &-symbol {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        color: #696b6c;
      }

      image {
        width: 28rpx;
        height: 28rpx;
      }

      &-num {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        color: #696b6c;
      }
    }
  }
}
</style>
