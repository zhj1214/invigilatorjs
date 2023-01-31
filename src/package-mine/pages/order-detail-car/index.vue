<template>
  <view class="order-detail-car">
    <!-- 订单状态 -->
    <order-status :order-detail="orderDetail" />

    <!-- 商品详情卡片 -->
    <car-info />

    <!-- 价格明细 -->
    <price-info />

    <!-- 购买信息 -->
    <buy-info />

    <!-- 车主信息 -->
    <!-- 购车协议 -->
    <!-- 付款明细 -->
    <!-- 订单信息 -->
    <other-info />

    <!-- 底部状态按钮 -->
    <footer-btn :order-id="orderId" />

    <sp-recommend-goods :recommend-list="recommendList" :point-ratio="pointRatio" />
    <view v-if="isNoMore" class="order-detail-car-foot-tips">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { useGoodsStore } from '@src/pinia/goods'
import { getPageForOrderItem } from '@api/recommend'
import orderStatus from './order-status.vue'
import carInfo from './car-info.vue'
import priceInfo from './price-info.vue'
import buyInfo from './buy-info.vue'
import otherInfo from './other-info.vue'
import footerBtn from './footer-btn.vue'
import useDetail from './detail'
import OrderStatus from './order-status.vue'

const goodsStore = useGoodsStore()
goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)

const { orderIdList, orderDetail, getOrderDetail } = useDetail()

let orderId = ref('')
let recommendList: Goods.Item[] = reactive([])
let recommendPageNo = ref(1)
let isNoMore = ref(false)

onLoad((option: { id?: string }) => {
  orderId.value = option.id || ''
})

onShow(async () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 50
  })
  await getOrderDetail(orderId.value)
  // 只需要首次进入页面时在此处调用推荐接口
  !recommendList.length && getCommendList()
})

// 上拉加载
onReachBottom(() => {
  onScrolltolower()
})

async function getCommendList() {
  let recommendObj = {
    recItemTypes: [1, 2, 3],
    orderItemIds: orderIdList.value
  }
  try {
    const { data, total } = await getPageForOrderItem({ pageNo: recommendPageNo.value, pageSize: 20 }, recommendObj)
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

<style scoped lang="scss">
.order-detail-car {
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));

  &-info {
    padding: 0 40rpx;

    .title {
      margin: 107rpx 0 35rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #292c2e;
    }

    view {
      display: flex;
      justify-content: space-between;

      // align-items: center;
      min-height: 64rpx;
      padding: 11rpx 0;

      .label {
        min-width: 200rpx;
      }

      text {
        font-size: 30rpx;
        color: #696b6c;
        line-height: 41rpx;

        .yuan {
          font-size: 24rpx;
        }
      }

      text:last-child {
        text-align: right;
        flex: 1;
        min-width: 0;
        word-break: break-all;
      }
    }
  }
}
</style>
