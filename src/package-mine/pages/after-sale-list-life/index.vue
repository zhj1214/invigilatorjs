<template>
  <view class="after-sale-list-life">
    <view v-for="(item, index) in afterSaleList" :key="index" class="after-sale-list-life-content" @click="goAfterSaleDetail(item)">
      <view class="after-sale-list-life-content-num-status">
        <view class="num">售后单号： {{ item.id }}</view>
        <view class="status">{{ item.type === 0 ? '退款' : '退货' }}</view>
      </view>
      <view class="after-sale-list-life-content-goods">
        <image class="after-sale-list-life-content-goods-image" :src="item.itemImage" mode="aspectFit" />
        <view class="after-sale-list-life-content-goods-sku">
          <view class="name">{{ item.itemName }}</view>
          <view>
            <text v-for="(attr, index) in item.attributeMaps || []" :key="index" class="attrs">{{ attr.attrVal }}</text>
            <text class="quantity">X{{ item.quantity }}</text>
          </view>
          <view class="price">
            <text>退款</text>
            <view style="display: flex; align-items: center">
              <text v-if="item.totalAmount > 0">￥{{ item.totalAmount / 100 }}</text>
              <text v-if="item.totalAmount > 0 && item.totalPointNum > 0">+</text>
              <template v-if="item.totalPointNum > 0">
                <image :src="afterSaleIcon" />
                <text>{{ item.totalPointNum }}</text>
              </template>
            </view>
          </view>
        </view>
      </view>
      <view class="after-sale-list-life-content-status">
        <view class="text">
          {{ getStatusText(item.status) }}
          <uni-countdown
            v-if="item.status === Status.ToBeReviewed"
            class="count-down"
            :show-day="false"
            :hour="0"
            :minute="0"
            color="#909CA8"
            splitor-color="#909CA8"
            background-color="909CA8"
            :second="getTime(item.auditOutTime)"
          />
          <template v-if="item.status === Status.Success">
            <text v-if="item.totalAmount > 0">￥{{ item.totalAmount / 100 }}</text>
            <text v-if="item.totalAmount > 0 && item.totalPointNum > 0">+</text>
            <template v-if="item.totalPointNum > 0">
              <image :src="afterSaleIcon" />
              <text>{{ item.totalPointNum }}</text>
            </template>
          </template>
        </view>
        <view v-if="item.status === Status.ToBeReviewed" class="btn" @click.stop="toBackApply(item)">撤回申请</view>
        <view v-if="item.status === Status.Passed" class="btn" @click.stop="goAfterSaleDetail(item)">去处理</view>
      </view>
    </view>
    <view v-if="!afterSaleList.length && !loading" class="after-sale-list-life-no-data">暂无售后单</view>
    <view v-if="afterSaleList.length && isEnd" class="after-sale-list-life-no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { inject, ref, reactive } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getOrderList, setAfterRefundCancel } from '@src/api/after-sale'
import { Enum } from '@src/lib/enmu'
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const afterSaleIcon = gdp('icon-after-sale-new.png')
const pageNo = ref(1)
const isEnd = ref(false)

const afterSaleList: AfterSale.ListInfo[] = reactive([])
const loading = ref(false)

const { getStatusText, Status } = Enum.AfterSale

onShow(() => {
  onRefresh()
})

onPullDownRefresh(() => {
  onRefresh()
})

onReachBottom(() => {
  onScrolltolower()
})

async function getPagingOrder() {
  uni.showLoading({
    title: '加载中'
  })
  loading.value = true
  const params = {
    pageNo: pageNo.value,
    pageSize: 10,
    itemTypes: [1, 2, 3].toString()
  }
  try {
    const { data, total } = await getOrderList(params)
    uni.stopPullDownRefresh()
    uni.hideLoading()
    afterSaleList.push(...data)
    isEnd.value = afterSaleList.length === total
    loading.value = false
  } catch {
    loading.value = false
    uni.hideLoading()
  }
}

/**
 * @description: 撤销申请
 * @Date: 2021-12-06 17:33:44
 * @param {AfterSale.ListInfo} item
 * @return {*}
 */
function toBackApply(item: AfterSale.ListInfo) {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认撤销申请吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await setAfterRefundCancel(item.id)
          item.status = -1
        } catch (error) {}
      }
    }
  })
}

/**
 * @description: 跳转售后详情
 * @Date: 2021-12-06 17:34:34
 * @param {AfterSale.ListInfo} item
 * @return {*}
 */
function goAfterSaleDetail(item: AfterSale.ListInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/after-sale-detail/index?id=${item.id}`
  })
}

function onRefresh() {
  isEnd.value = false
  pageNo.value = 1
  afterSaleList.splice(0)
  getPagingOrder()
}

function onScrolltolower() {
  if (isEnd.value) {
    return
  }
  if (!isEnd.value) {
    pageNo.value++
    getPagingOrder()
  }
}

function getTime(auditOutTime: number) {
  const now = new Date().getTime()
  if (now <= auditOutTime) {
    const time = ((auditOutTime - now) / 1000).toString()
    return parseInt(time)
  }
}
</script>

<style lang="scss" scoped>
.after-sale-list-life {
  padding: 0 40rpx;

  &-content {
    padding: 56rpx 0 73rpx;
    border-bottom: 1rpx solid #e4e7ea;

    &-num-status {
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;

      .num {
        color: #909ca8;
      }

      .status {
        color: #4e6175;
      }
    }

    &-goods {
      margin: 24rpx 0;
      display: flex;

      &-image {
        width: 160rpx;
        height: 160rpx;
      }

      &-sku {
        margin-left: 16rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% - 160rpx);
        padding: 11rpx 0 15rpx;

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          color: #1a1a1a;
        }

        .attrs,
        .quantity {
          font-size: 26rpx;
          color: #909ca8;
          margin-right: 16rpx;
        }

        .price {
          display: flex;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          color: #1a1a1a;

          view {
            margin-left: 16rpx;
          }

          image {
            width: 28rpx;
            height: 28rpx;
          }
        }
      }
    }

    &-status {
      height: 80rpx;
      background: rgb(228 231 234 / 20%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx;

      .count-down {
        margin-top: 4rpx;
        margin-left: 24rpx;
      }

      .text {
        font-size: 26rpx;
        color: #909ca8;
        display: flex;
        align-items: center;

        image {
          width: 28rpx;
          height: 28rpx;
        }
      }

      .btn {
        font-size: 26rpx;
        color: #7190b0;
      }
    }
  }

  &-no-data {
    padding: 75rpx 40rpx 124rpx;
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #909ca8;
  }

  &-no-more {
    text-align: center;
    font-size: 26rpx;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #909ca8;
    padding: 20rpx;
  }
}
</style>
