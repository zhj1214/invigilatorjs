<template>
  <view class="coupon-goods">
    <view class="title">优惠券可用商品</view>
    <view class="wrap-coupon-goods">
      <sp-goods-card v-for="item in goodsItem" :key="item.id" :point-ratio="pointRatio" :goods-detail="item" />
    </view>
    <view v-if="!loadMore" class="no-more">-没有更多了-</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getGoodsList } from '@api/card'
import { useGoodsStore } from '@src/pinia/goods'

interface CouponGoodsInfo {
  id: number
  name: string
  mainImage: string
  lowPrice: number
}

const couponId = ref('')
const pageNo = ref(1) // 当前页数
const loadMore = ref(false)
const pageSize = 10 // 分页大小
const goodsItem: CouponGoodsInfo[] = reactive([])
const pointRatio = computed(() => useGoodsStore().pointRatio)
async function getCouponGoodsList() {
  const params = {
    pageNo: pageNo.value,
    pageSize: pageSize,
    status: 1 // 上架
  }
  try {
    const res = await getGoodsList(couponId.value, params)
    goodsItem.push(...res.data)
    pageNo.value += 1
    if (goodsItem.length === res.total) {
      loadMore.value = false
    } else {
      loadMore.value = true
    }
    uni.hideLoading()
  } catch (err) {
    console.log(err)
    uni.hideLoading()
  }
}

onLoad((option: { id?: string }) => {
  couponId.value = option.id || ''
  getCouponGoodsList()
})

onReachBottom(() => {
  if (loadMore.value) {
    getCouponGoodsList()
  }
})
</script>

<style lang="scss" scoped>
.coupon-goods {
  .title {
    background-color: #fff;
    line-height: normal;
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #292c2e;
    margin-bottom: 40rpx;
  }

  padding: 0 32rpx;

  .wrap-coupon-goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.no-more {
  text-align: center;
  font-size: 26rpx;
  font-family: SourceHanSansSC-Normal, SourceHanSansSC;
  font-weight: 400;
  color: #909ca8;
  padding-bottom: 20rpx;
}
</style>
