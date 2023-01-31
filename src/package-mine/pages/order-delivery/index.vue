<template>
  <view class="order-delivery">
    <view class="order-delivery-top">
      <view class="order-delivery-top-img">
        <image :src="mianPic" mode="asceptFit" />
        <view>共 {{ totalNum }} 件商品</view>
      </view>
      <view class="order-delivery-top-express">
        <view>
          <text class="order-delivery-top-express-label">快递公司</text>
          <text class="order-delivery-top-express-text">{{ expressInfo.name }}</text>
        </view>
        <view>
          <text class="order-delivery-top-express-label">快递单号</text>
          <text class="order-delivery-top-express-text">{{ expressNum }}</text>
        </view>
        <view>
          <text class="order-delivery-top-express-label">联系电话</text>
          <text class="order-delivery-top-express-text">{{ expressInfo.telephone }}</text>
        </view>
      </view>
    </view>
    <view class="order-delivery-status">
      <uni-steps :options="logisticsStatus" :active="statusTrans[logisticsDetails.state]" />
    </view>
    <view class="order-delivery-detail">
      <view class="order-delivery-detail-title">物流详情</view>
      <view class="order-delivery-detail-status">
        <view v-for="(item, index) in logisticsDetails.traces" :key="index">
          <delivery-track :is-end="index === logisticsDetails.traces.length - 1" :is-newest="index === 0" :node-data="item" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTrackInfo } from '@src/api/order'
import { getExpressCompanies } from '@api/after-sale'
import deliveryTrack from './delivery-track.vue'
import { pureAssign } from '@util/common'
import { useDeliveryStore } from '@src/pinia/delivery'

const deliveryStore = useDeliveryStore()
const deliveryParams = computed(() => deliveryStore.deliveryParams)
const mianPic = computed(() => deliveryParams.value.mianPic)
const totalNum = computed(() => deliveryParams.value.totalNum)
// 0在途中、1已揽收、2疑难、3已签收、4退签、5同城派送中、6退回
const logisticsStatus = [{ title: '已发货' }, { title: '运输中' }, { title: '派件中' }, { title: '已签收' }]
let expressNum = ref('')
let expressCode = ref('')
let telphoneNum = ref('')

let expressInfo: AfterSale.ExpressInfo = reactive({
  name: '',
  telephone: ''
})
let logisticsDetails: Order.LogisticsDetailInfo = reactive({
  state: '',
  traces: []
})

onLoad((option: { params?: string }) => {
  // eslint-disable-next-line no-shadow
  const { code, telphone, expressNumber } = JSON.parse(option.params || '')
  expressCode.value = code
  expressNum.value = expressNumber
  telphoneNum.value = telphone
  getTrackInfos()
  getExpressList()
})

/**
 * @description: 获取物流公司列表
 * @Date: 2021-12-03 11:33:19
 * @param {*}
 * @return {*}
 */
async function getExpressList() {
  const { data } = await getExpressCompanies({ pageNo: 1, pageSize: 99 })
  let currentExpressInfo = data.find((item: AnyObject) => item.code === expressCode.value) as AfterSale.ExpressInfo
  expressInfo.name = currentExpressInfo.name
  expressInfo.telephone = currentExpressInfo.telephone
}
/**
 * @description: 获取物流详情
 * @Date: 2021-12-03 11:33:38
 * @param {*}
 * @return {*}
 */
async function getTrackInfos() {
  uni.showLoading({
    title: '加载中'
  })
  let obj = {
    expressNumber: expressNum.value,
    expressCode: expressCode.value,
    telphone: telphoneNum.value
  }
  const res = await getTrackInfo(obj)
  uni.hideLoading()
  const tracesData = res.traces.map((item: AnyObject) => {
    return {
      acceptTime: item.acceptTime,
      acceptStation: item.acceptStation
    }
  })
  pureAssign(logisticsDetails, { traces: tracesData.reverse(), state: res.state })
}
const statusTrans = reactive({
  0: 0,
  1: 1,
  2: 2,
  5: 3,
  3: 4
}) as AnyObject
</script>
<style lang="scss" scoped>
.order-delivery {
  &-top {
    height: 272rpx;
    background: #fff;
    padding: 56rpx 0;
    margin: 0 40rpx;
    display: flex;
    border-bottom: 1rpx solid #e4e7ea;

    &-img {
      position: relative;
      width: 160rpx;
      height: 160rpx;

      image {
        width: 100%;
        height: 100%;
      }

      view {
        width: 160rpx;
        height: 49rpx;
        background: #909ca8;
        border-radius: 1px;
        opacity: 0.7;
        position: absolute;
        bottom: 0;
        font-size: 24rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #fff;
        line-height: 49rpx;
        text-align: center;
      }
    }

    &-express {
      flex: 1;
      margin-left: 40rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 7rpx 0;
      font-size: 26rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #92969a;

      &-text {
        margin-left: 16rpx;
        color: #1a1a1a;
      }
    }
  }

  &-status {
    background: #fff;
    padding: 65rpx 20rpx 80rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .start-end {
      display: flex;

      text {
        width: 25%;
        display: inline-block;
        text-align: center;
        font-size: 30rpx;
      }
    }
  }

  &-detail {
    padding: 0 40rpx;

    &-title {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      line-height: 54rpx;
    }

    &-status {
      padding: 49rpx 0;
    }
  }
}
</style>
