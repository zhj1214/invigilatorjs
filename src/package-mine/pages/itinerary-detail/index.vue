<template>
  <view class="iinerary-detail">
    <view class="iinerary-detail-bg">
      <image class="img" :src="myTestDrive" alt="" />
    </view>
    <view class="info-card">
      <view class="info-card-title">预约信息</view>
      <view class="info-card-line">
        <label class="info-card-lint-title">真实姓名</label>
        <label class="info-card-lint-title">{{ itineraryDetail.driverName }}</label>
      </view>
      <view class="info-card-line">
        <label class="info-card-lint-title">手机号码</label>
        <label class="info-card-lint-title">{{ itineraryDetail.mobile }}</label>
      </view>
      <view class="info-card-line">
        <label class="info-card-lint-title">试驾车型</label>
        <label class="info-card-lint-title">{{ itineraryDetail.modelName }}</label>
      </view>
      <view class="info-card-line">
        <label class="info-card-lint-title">试驾门店</label>
        <label class="info-card-lint-title">{{ itineraryDetail.orgName }}</label>
      </view>
      <view class="info-card-line">
        <label class="info-card-lint-title">试驾时间</label>
        <label class="info-card-lint-title">{{ formatDate(itineraryDetail.reservationTime) }}</label>
      </view>
    </view>
  </view>
  <!-- <view></view> -->
</template>

<script lang="ts" setup>
import { inject, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDetail } from '@api/car'
import { formatDate } from '@util/date-time'
import { pureAssign } from '@src/util/common'

interface ItineraryDetailInfo {
  dealerCode: string //门店id
  driverName: string //姓名
  driverTime?: number
  id: string
  image: [File] | null
  mobile: string
  modelCode: string
  modelName: string
  orgAddress: string
  orgName: string
  reservationTime: number
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const myTestDrive = gdp('my-test-drive.png')
const itineraryId = ref('')
const itineraryDetail: ItineraryDetailInfo = reactive({
  dealerCode: '',
  driverName: '',
  id: '',
  image: null,
  mobile: '',
  modelCode: '',
  modelName: '',
  orgAddress: '',
  orgName: '',
  reservationTime: 0
})

async function getItineraryDetail() {
  try {
    const res = (await getDetail(itineraryId.value)) as AnyObject
    res.image = JSON.parse(res.image)
    pureAssign(itineraryDetail, res)
    console.log(itineraryDetail)
  } catch (err) {
    console.log(err)
  }
}

onLoad((options: { id?: string }) => {
  itineraryId.value = options.id || ''
  getItineraryDetail()
})
</script>

<style lang="scss" scoped>
.iinerary-detail {
  .iinerary-detail-bg {
    height: 725rpx;
    width: 100%;

    .img {
      height: 100%;
      width: 100%;
    }
  }

  .info-card {
    margin: 0 auto;
    width: 686rpx;
    height: 552rpx;
    background: #fff;
    box-shadow: 0rpx 15rpx 33rpx 0rpx rgb(111 111 111 / 17%);
    border-radius: 2rpx;
    position: relative;
    top: -100rpx;
    padding: 56rpx 48rpx 0rpx;

    &-title {
      font-size: 48rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #292c2e;
      line-height: 1;
      margin-bottom: 32rpx;
    }

    &-line {
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #696b6c;
      line-height: 45rpx;
      margin-bottom: 22rpx;
    }
  }
}
</style>
