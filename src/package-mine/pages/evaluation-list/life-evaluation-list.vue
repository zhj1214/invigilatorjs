<template>
  <view class="inner-box">
    <template v-if="listData.length > 0">
      <view v-for="(orderInfo, index) in listData" :key="index" class="item">
        <view class="item-header">
          <view class="order-number">订单号：{{ orderInfo.order?.id || orderInfo.orderItemInfo?.orderId }}</view>
          <view v-if="status === 0 && orderInfo.orderItemDtoList.length > 1" class="batch" @click="toEvaluate(orderInfo.order, '')">批量评价</view>
        </view>
        <!--待评价-->
        <template v-if="status === 0">
          <view v-for="info in orderInfo.orderItemDtoList" :key="info.id" class="order-item" @click="goOrderDetail(info)">
            <view class="detail-img">
              <image :src="info.itemImage" mode="aspectFit" />
            </view>
            <view class="detail-sku">
              <view class="item-name ellipsis">{{ info.itemName }}</view>
              <view class="attrs ellipsis">
                <text v-for="(item, index) in info.attributeMaps || []" :key="index">
                  <text>{{ item.attrVal }}</text>
                  <text v-show="index < info.attributeMaps.length - 1">/</text>
                </text>
              </view>
              <view class="quantity-price-btn">
                <view class="quantity">x{{ info.quantity }}</view>
                <view v-if="status === 0" class="evaluate-btn" @click.stop="toEvaluate(orderInfo.order, info.id)">评价</view>
              </view>
            </view>
          </view>
        </template>
        <!--已评价-->
        <view v-else class="order-item" @click="goOrderDetail(orderInfo.orderItemInfo)">
          <view class="detail-img">
            <image :src="orderInfo.orderItemInfo.itemImage" mode="aspectFit" />
          </view>
          <view class="detail-sku">
            <view class="item-name ellipsis">{{ orderInfo.orderItemInfo.itemName }}</view>
            <view class="attrs ellipsis">
              <text v-for="(item, index) in orderInfo.orderItemInfo.attributeMaps || []" :key="index">
                <text>{{ item.attrVal }}</text>
                <text v-show="index < orderInfo.orderItemInfo.attributeMaps.length - 1">/</text>
              </text>
            </view>
            <view class="quantity-price-btn">
              <view class="quantity">x{{ orderInfo.orderItemInfo.quantity }}</view>
            </view>
          </view>
        </view>
        <template v-if="status === 1">
          <view class="evaluation-detail" @click="checkDetails(orderInfo)">
            <view>
              <text class="label">评分</text>
              <uni-rate :value="orderInfo.score" size="22" color="#BBC8D6" active-color="#7190B0" margin="2" :readonly="true" :is-fill="false" />
            </view>
            <view class="evaluation-content">
              <text class="label">评价</text>
              <view class="value ellipsis-2">{{ orderInfo.content }}</view>
            </view>
          </view>
        </template>
      </view>
    </template>
    <template v-else>
      <view class="no-evaluation">
        <image :src="noEvaluation" />
        <text v-if="status === 0">当前无待评价商品</text>
        <text v-if="status === 1">当前无已评价商品</text>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup name="LifeEvaluationList">
import { inject, watchEffect, reactive } from 'vue'

const props = defineProps<{
  lifeOrderLists: Evaluation.LifeEvaluation[]
  status: number
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let noEvaluation: string = gdp('no-evaluation.png')

const listData: Evaluation.LifeEvaluation[] = reactive([])

watchEffect(() => {
  listData.length = 0
  listData.push(...(props.lifeOrderLists as Array<Evaluation.LifeEvaluation>))
})

function toEvaluate(order: Evaluation.LifeEvaluationItem, productId: string) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${order.id}&orderType=${order.orderType}&productId=${productId}&itemType=1`
  })
}
function goOrderDetail(item: Evaluation.LifeEvaluationItem) {
  let id = props.status === 0 ? item.orderId : item.orderId
  uni.navigateTo({
    url: `/package-mine/pages/order-detail-life/index?orderId=${id}`
  })
}
// 查看评价详情
function checkDetails(orderInfo: Evaluation.LifeEvaluation) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-detail/index?itemType=1&id=${orderInfo.id}`
  })
}
</script>

<style lang="scss" scoped>
.inner-box {
  padding: 0 40rpx;
  color: #909ca8;
  font-size: 26rpx;

  .item {
    padding: 48rpx 0 56rpx;
    border-bottom: 1rpx solid #e4e7ea;

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;

      .batch {
        color: #4e6175;
      }
    }

    .order-item {
      margin-top: 30rpx;
      display: flex;

      .detail-img {
        width: 160rpx;
        height: 160rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .detail-sku {
        width: calc(100% - 160rpx);
        padding-left: 24rpx;

        .item-name {
          color: #1a1a1a;
          font-size: 28rpx;
          margin-top: 10rpx;
          line-height: 40rpx;
          font-weight: bold;
        }

        .attrs {
          text {
            margin-right: 10rpx;
          }
        }

        .quantity-price-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16rpx;

          .quantity {
            font-size: 26rpx;
          }

          .price {
            color: #1a1a1a;
            font-size: 28rpx;
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

          .evaluate-btn {
            width: 160rpx;
            height: 64rpx;
            line-height: 64rpx;
            text-align: center;
            color: #1a1a1a;
            font-size: 24rpx;
            border: 1rpx solid #e4e7ea;
          }
        }
      }
    }

    .evaluation-detail {
      margin-top: 40rpx;

      > view {
        display: flex;
        align-items: center;

        .label {
          width: 12%;
          color: #92969a;
          font-size: 22rpx;
        }

        .value {
          width: 88%;
          color: #696b6c;
          font-size: 26rpx;
          word-break: break-all;
        }
      }

      .evaluation-content {
        align-items: baseline;
        margin-top: 18rpx;
      }
    }
  }

  .no-evaluation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 300rpx;

    image {
      width: 144rpx;
      height: 144rpx;
    }

    text {
      color: #909ca8;
      font-size: 26rpx;
      margin-top: 20rpx;
    }
  }
}
</style>
