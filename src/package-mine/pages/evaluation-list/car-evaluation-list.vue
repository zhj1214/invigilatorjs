<template>
  <view class="inner-box">
    <template v-if="listData.length > 0">
      <view v-for="(item, index) in listData" :key="index" class="order-item">
        <view class="order-info" @click="goOrderDetail(item)">
          <view class="card" :style="{ backgroundImage: 'url(' + item.orderItemDto.carVehicleImg + ')' }">
            <view class="title">
              <text class="ellipsis">{{ item.orderItemDto.vehicleTitle }}</text>
              <image :src="iconOrderRight" mode="asceptFit" />
            </view>
            <view class="text-configure">
              <view v-for="(attr, index) in (item.orderItemDto.saleAttrs || []).slice(0, 2)" :key="index">
                {{ attr }}
              </view>
              <view>...</view>
            </view>
          </view>
        </view>
        <view class="box-bottom">
          <view class="price-box">
            <view class="total-price">
              <text>总价</text>
              <view class="price">
                <text class="unit">￥</text>
                <text class="num">{{ formatMoney(getComputePrice(item.orderItemDto), 0, 0) }}</text>
              </view>
            </view>
            <text>交易完成</text>
          </view>
          <!--已评价-->
          <template v-if="status === 1">
            <view class="evaluation-detail" @click="checkDetails(item)">
              <view>
                <text class="label">评分</text>
                <uni-rate :value="item.score" size="22" color="#BBC8D6" active-color="#7190B0" margin="2" :readonly="true" :is-fill="false" />
              </view>
              <view class="evaluation-content">
                <text class="label">评价</text>
                <view class="value ellipsis-2">{{ item.content }}</view>
              </view>
            </view>
          </template>
          <!--待评价-->
          <view v-if="status === 0" class="evaluation-btn">
            <view @click="toEvaluate(item.order)">评价</view>
          </view>
        </view>
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

<script lang="ts" setup name="CarEvalutionList">
import { inject, watchEffect, reactive, computed } from 'vue'
import { formatMoney } from '@util/money'

const props = defineProps<{
  carOrderLists: Evaluation.CarEvaluation[]
  status: number
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
let iconOrderRight: string = gdp('icon-order-right.png')
let noEvaluation: string = gdp('no-evaluation.png')

const listData: Evaluation.CarEvaluation[] = reactive([])

watchEffect(() => {
  listData.length = 0
  listData.push(...(props.carOrderLists as Array<Evaluation.CarEvaluation>))
})

function toEvaluate(order: Evaluation.CarEvaluationOrder) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-published/index?orderId=${order.id}&orderType=${order.orderType}&itemType=0`
  })
}
// 计算价格
function getComputePrice(item: Evaluation.CarEvaluationItem) {
  let tempTotal = 0
  if (item.optionalPackagePrice && item.optionalPackagePrice.length > 0) {
    item.optionalPackagePrice.forEach((i) => {
      tempTotal += i
    })
  }
  let computePrice = item.carFacadePrice + item.carRimPrice + item.carInteriorPrice + item.carVehiclePrice + tempTotal
  return computePrice
}
// 订单详情页
function goOrderDetail(item: Evaluation.CarEvaluation) {
  let id = props.status === 0 ? item.order?.id : item.orderItemInfo?.orderId
  uni.navigateTo({
    url: `/package-mine/pages/order-detail-car/index?id=${id}`
  })
}
// 查看评价详情
function checkDetails(item: Evaluation.CarEvaluation) {
  uni.navigateTo({
    url: `/package-mine/pages/evaluation-detail/index?itemType=0&id=${item.id}`
  })
}
</script>

<style lang="scss" scoped>
.inner-box {
  padding: 0 40rpx;

  &:first-child {
    margin-top: 30rpx;
  }

  .order-item {
    margin-bottom: 50rpx;
    border: 1rpx solid #e4e7ea;
    box-shadow: 0 15rpx 30rpx -15rpx rgb(111 111 111 / 20%);

    .order-info {
      height: 344rpx;
      background: #f2f3f3;
      padding: 32rpx 0 0 36rpx;

      .card {
        height: 100%;
        background-size: 72%;
        background-position: right bottom;
        background-repeat: no-repeat;

        .title {
          width: 100%;
          color: #4e6175;
          font-size: 38rpx;
          line-height: 56rpx;
          display: flex;
          align-items: center;

          .text {
            width: calc(100% - 40rpx);
          }

          image {
            width: 32rpx;
            min-width: 32rpx;
            height: 32rpx;
            margin-left: 5rpx;
            vertical-align: middle;
          }
        }

        .text-configure {
          width: 35%;
          margin-top: 6rpx;
          color: #92969a;

          > view {
            font-size: 24rpx;
            line-height: 30rpx;
            margin-bottom: 12rpx;
          }
        }
      }
    }

    .box-bottom {
      padding: 35rpx 40rpx;

      .price-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .total-price {
          > text {
            color: #92969a;
            font-size: 22rpx;
          }

          .price {
            color: #4e6175;
            line-height: 32rpx;

            .unit {
              font-size: 20rpx;
            }

            .num {
              font-size: 30rpx;
            }
          }
        }

        > text {
          color: #909ca8;
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

    .evaluation-btn {
      padding: 0 40rpx;
      margin: 26rpx 0 10rpx;

      > view {
        text-align: center;
        line-height: 80rpx;
        color: #4e6175;
        font-size: 26rpx;
        letter-spacing: 10rpx;
        border: 1px solid #e4e7ea;
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
