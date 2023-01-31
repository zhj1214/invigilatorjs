<template>
  <view class="order-detail">
    <!-- 状态信息 -->
    <status-info />
    <view v-if="orderDeliveryList.length > 0" class="order-detail-delivery">
      <swiper class="order-detail-delivery-swiper" :current="current" @change="handleBannerChange">
        <swiper-item v-for="(item, index) in orderDeliveryList" :key="index">
          <view class="order-detail-delivery-swiper-status" @click="goToLog('single', item)">
            <image :src="orderDetailDelivery" />
            <text>快递{{ index + 1 }}：</text>
            <text>{{ item.acceptStation }}</text>
          </view>
          <view class="order-detail-delivery-swiper-time">{{ item.acceptTime }}</view>
        </swiper-item>
      </swiper>
      <view class="order-detail-delivery-swiper-control">
        <view
          v-for="(item, index) in orderDeliveryList"
          :key="index"
          class="order-detail-delivery-swiper-control-item"
          :class="{ active: current === index }"
          @click="current = index"
        />
      </view>
    </view>
    <view class="order-detail-line" />

    <view v-if="orderDetail.receiveInfo.receiver" class="order-detail-address">
      <view class="order-detail-address-user">
        <text>{{ orderDetail.receiveInfo.receiver }}</text>
        <text style="margin-left: 16rpx">{{ orderDetail.receiveInfo.mobile }}</text>
      </view>
      <view class="order-detail-address-add">{{ orderDetail.receiveInfo.receiveAddress }}</view>
    </view>

    <view v-if="orderDetail.receiveInfo.receiver" class="order-detail-line" />
    <view class="order-detail-content">
      <order-detail-goods :order-item-dto-list="orderDetail.orderItemDtoList" :order-detail="orderDetail" />
    </view>
    <view class="order-detail-line" />

    <view v-if="orderDetail.orderItemDtoList.length > 0 && orderDetail.orderItemDtoList[0].itemType === '2' && orderDetail.couponList.length > 0" class="order-detail-coupon">
      <view v-for="(item, index) in orderDetail.couponList" :key="index" class="order-detail-coupon-item" @click="goCouponDetail(item)">
        <view>{{ item.name }}</view>
        <image :src="orderDetailRight" mode="asceptFit" />
      </view>
    </view>

    <!-- 商品价格 -->
    <price-info />

    <!-- 发票信息 -->
    <!-- 订单编号、支付信息 -->
    <other-info />

    <!-- 底部按钮 -->
    <footer-btn :orderItemDeliveryData="orderItemDeliveryData" @refresh="getOrderInfos(orderId)" />

    <sp-recommend-goods :recommend-list="recommendList" :point-ratio="pointRatio" />
    <view v-if="isNoMore" class="order-detail-foot-tips">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { getPageForOrderItem } from '@api/recommend'
import orderDetailGoods from '../../components/order-detail-goods/order-detail-goods.vue'
import { useGoodsStore } from '@src/pinia/goods'
import { useDeliveryStore } from '@src/pinia/delivery'
import statusInfo from './status-info.vue'
import priceInfo from './price-info.vue'
import otherInfo from './other-info.vue'
import footerBtn from './footer-btn.vue'
import { useDetail } from './detail'

const { orderDetail, orderItemDeliveryData, orderDeliveryList, subtotalPoint, subtotalPrice, getOrderInfos } = useDetail()
const deliveryStore = useDeliveryStore()
const goodsStore = useGoodsStore()
goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [orderDetailDelivery, orderDetailRight] = gdp(['order-detail-delivery.png', 'order-detail-right.png'])

let orderId = ref('')

let current = ref(0)
let recommendList: Goods.Item[] = reactive([])
let recommendPageNo = ref(1)
let isNoMore = ref(false)

onLoad((option: { orderId?: string }) => {
  orderId.value = option.orderId || ''
})

onShow(async () => {
  subtotalPoint.value = 0
  subtotalPrice.value = 0
  await getOrderInfos(orderId.value)
  // 只需要首次进入页面时在此处调用推荐接口
  !recommendList.length && getCommendList()
})

// 上拉加载
onReachBottom(() => {
  onScrolltolower()
})

function handleBannerChange(e: AnyObject) {
  current.value = e.detail.current
}

function goCouponDetail(couponItem: CouponInfo) {
  uni.navigateTo({
    url: `/package-mine/pages/card-detail/index?id=${couponItem.code}`
  })
}

/**
 * @description: 跳转物流列表或详情
 * @Date: 2021-12-06 09:34:34
 * @param {*} type
 * @param {*} item
 * @return {*}
 */
function goToLog(type: string, item: AnyObject) {
  if (type === 'multiple' && orderItemDeliveryData.length > 1) {
    uni.navigateTo({
      url: `/package-mine/pages/order-delivery-list/index?orderId=${orderDetail.id}`
    })
  } else {
    let obj = {
      code: item?.expressCode || orderItemDeliveryData[0].expressCode,
      telphone: item?.telphone || orderItemDeliveryData[0].telphone,
      expressNumber: item?.expressNumber || orderItemDeliveryData[0].expressNum
    }
    let mianPic = ''
    let totalNum = 0
    if (type === 'single') {
      orderItemDeliveryData.map((delivery: AnyObject) => {
        if (delivery.expressNum === item.expressNumber) {
          mianPic = delivery.orderItemDtoList[0].itemImage
          totalNum = delivery.orderItemDtoList.length
        }
      })
    } else {
      mianPic = orderItemDeliveryData[0]?.orderItemDtoList[0].itemImage
      totalNum = orderItemDeliveryData[0]?.orderItemDtoList.length
    }

    deliveryStore.setParams({
      mianPic: mianPic,
      totalNum: totalNum
    })
    uni.navigateTo({
      url: `/package-mine/pages/order-delivery/index?params=${JSON.stringify(obj)}`
    })
  }
}

/**
 * @description: 猜你喜欢列表
 * @Date: 2021-12-04 16:59:29
 * @param {*}
 * @return {*}
 */
async function getCommendList() {
  let recommendObj = {
    recItemTypes: [1, 2, 3],
    orderItemIds: orderDetail.orderItemList
  }
  try {
    const { data, total } = (await getPageForOrderItem({ pageNo: recommendPageNo.value, pageSize: 20 }, recommendObj)) as AnyObject
    recommendList.push(...data)
    isNoMore.value = recommendList.length === total
  } catch {}
}

function onScrolltolower() {
  if (isNoMore.value) {
    return
  }
  recommendPageNo.value++
  getCommendList()
}
</script>
<style lang="scss" scoped>
.order-detail {
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

  &-line {
    border-bottom: 1rpx solid #e4e7ea;
  }

  &-delivery {
    padding: 0 40rpx;
    width: 100%;
    height: 200rpx;
    position: relative;

    &-swiper {
      width: 100%;
      height: 200rpx;

      &-status {
        max-height: 102rpx;
        margin-bottom: 8rpx;
        overflow: hidden;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        display: flex;
        -webkit-box-orient: vertical;

        image {
          width: 38rpx;
          height: 38rpx;
          margin-right: 10rpx;
          vertical-align: middle;
        }

        text {
          font-size: 30rpx;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #4e6175;
          line-height: 45rpx;
          vertical-align: middle;
        }
      }

      &-time {
        font-size: 24rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #909ca8;
        line-height: 36rpx;
      }
    }

    &-swiper-control {
      position: absolute;
      z-index: 1;
      bottom: 10rpx;
      left: 0;
      right: 0;
      margin: auto;
      width: fit-content;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      padding: 0 40rpx;

      &-item {
        cursor: pointer;
        display: inline-block;
        width: 20rpx;
        height: 4rpx;
        margin: 0 12rpx 30rpx;
        background: #c9cfd5;

        &.active {
          background: #4e6175;
        }
      }
    }
  }

  &-address {
    padding: 44rpx 40rpx;

    &-user {
      font-size: 32rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      color: #1a1a1a;
      font-weight: bold;
      line-height: 60rpx;
    }

    &-add {
      font-size: 26rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      color: #92969a;
    }
  }

  &-content {
    padding: 0 44rpx;
  }

  &-coupon {
    margin: 0 40rpx;
    padding: 48rpx 0;
    border-bottom: 1rpx solid #e4e7ea;

    &-item {
      display: flex;
      justify-content: space-between;
      font-size: 32rpx;
      color: #4e6175;
      margin-bottom: 33rpx;

      &:last-child {
        margin-bottom: 0;
      }

      image {
        width: 32rpx;
        height: 32rpx;
        vertical-align: middle;
      }
    }
  }

  &-foot-tips {
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #909ca8;
    padding: 20rpx 20rpx calc(env(safe-area-inset-bottom)) 20rpx;
  }
}
</style>
