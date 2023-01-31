<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <sp-header>
      <view class="uni-page-head success-header items-center">
        <view class="uni-page-head-hd" @click="goToIndex">
          <svg width="27" height="27" viewBox="0 0 32 32">
            <path
              d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z"
              fill="#000000"
            />
          </svg>
        </view>
        <view class="uni-page-head-bd">
          <view class="uni-page-head__title title">支付成功</view>
        </view>
      </view>
    </sp-header>
    <!-- #endif -->
    <!-- 支付成功 -->
    <view class="success flex-col items-center justify-center">
      <image class="icon" :src="successImg" />
      <view class="text">订单支付成功</view>
      <view class="btn items-center justify-between">
        <view class="btn-left items-center justify-center" @click="goToIndex">返回首页</view>
        <view class="btn-right items-center justify-center" @click="goToOrderDetail">查看订单</view>
      </view>
    </view>
    <!--猜你喜欢-->
    <sp-recommend-goods :recommend-list="recommendList" :point-ratio="pointRatio" :no-more="noMore" />
  </view>
</template>

<script lang="ts" setup bane="PaymentSuccess">
import { inject, ref, reactive, onMounted, computed } from 'vue'
import { getPageForParentOrder } from '@api/recommend'
import { useGoodsStore } from '@src/pinia/goods'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface PaymentSuccessOption {
  orderId: string
  type: string
}

onLoad((options: OnLoadOption<PaymentSuccessOption>) => {
  const { orderId: id, type: t } = options
  type.value = Number(t || 0)
  orderId.value = id || ''
})

onReachBottom(async () => {
  if (noMore.value) {
    return
  }
  pageNo.value++
  try {
    await getRecommendList()
  } catch (error) {
    pageNo.value--
  }
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const successImg = gdp('icon-success.png')

const goodsStore = useGoodsStore()

const type = ref(0)
const orderId = ref('')

const recommendList: Goods.Item[] = reactive([])
const noMore = ref(false)
const pageNo = ref(1)

const pointRatio = computed(() => goodsStore.pointRatio)
goodsStore.getPointRatio()

const getRecommendList = async () => {
  try {
    const { data, total } = await getPageForParentOrder(
      { pageNo: pageNo.value, pageSize: 10 },
      {
        recItemTypes: [1, 2, 3],
        orderId: orderId.value
      }
    )
    recommendList.push(...data)
    noMore.value = data.length === 0 || total === recommendList.length
  } catch (error) {
    throw new Error()
  }
}

const goToIndex = () => {
  if (type.value === 1) {
    uni.switchTab({
      url: '/pages/life/index'
    })
  } else {
    uni.switchTab({
      url: '/pages/car/car'
    })
  }
}

const goToOrderDetail = () => {
  if (type.value === 1) {
    uni.navigateTo({
      url: '/package-mine/pages/order-detail-life/index?orderId=' + orderId.value
    })
  } else {
    uni.navigateTo({
      url: '/package-mine/pages/order-detail-car/index?id=' + orderId.value
    })
  }
}

onMounted(() => {
  orderId.value && getRecommendList()
})
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.page {
  padding-top: var(--window-top);
}

.success-header {
  padding: 0 25rpx;
  background-color: $uni-bg-color;
  color: black;

  .title {
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
/* #endif */
.success {
  margin-bottom: 124rpx;
}

.icon {
  margin-top: 150rpx;
  width: 164rpx;
  height: 164rpx;
}

.text {
  margin-top: 38rpx;
  font-size: 56rpx;
  color: #292c2e;
  font-weight: 500;
}

.btn {
  margin-top: 104rpx;
  font-size: 30rpx;
  padding: 10rpx 60rpx;
  width: 100%;

  .btn-left {
    width: 284rpx;
    height: 96rpx;
    border: 1rpx solid #92969a;
    font-weight: 400;
    color: #292c2e;
  }

  .btn-right {
    width: 284rpx;
    height: 96rpx;
    border: 1rpx solid #1a1a1a;
    background: #1a1a1a;
    color: $uni-text-color-inverse;
  }
}
</style>
