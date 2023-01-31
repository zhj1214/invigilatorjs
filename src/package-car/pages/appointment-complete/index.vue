<template>
  <view class="appointment-complete">
    <view class="top">
      <view class="complete-img">
        <image :src="completeImg" class="img" />
      </view>
      <view class="text1">预约完成</view>
      <view class="text2">您的专属顾问会尽快跟您取得联系</view>
    </view>
    <view v-if="isShowInfo" class="content">
      <view class="item">
        <text class="label">真实姓名</text>
        <text class="value">{{ dataList.data.driverName }}</text>
      </view>
      <view class="item">
        <text class="label">手机号码</text>
        <text class="value">{{ dataList.data.mobile }}</text>
      </view>
      <view class="item">
        <text class="label">试驾车型</text>
        <text class="value">{{ dataList.data.modelName }}</text>
      </view>
      <view class="item">
        <text class="label">试驾门店</text>
        <text class="value">{{ dataList.data.orgName }}</text>
      </view>
      <view class="item">
        <text class="label">试驾时间</text>
        <text class="value">{{ formatDate(dataList.data.reservationTime, 'YYYY年MM月DD日') }}</text>
      </view>
    </view>
    <view class="foot">
      <view class="btn-group">
        <view class="btn" @click="goSetting">配置爱车</view>
        <view class="btn white" @click="toBackIndex">返回首页</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="AppointmentComplete">
import { inject, Ref, ref, reactive } from 'vue'
import { getDetail } from '@api/car'
import { formatDate } from '@util/date-time'
import { onLoad, onShow } from '@dcloudio/uni-app'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
/**
 * 页面主图片
 */
const completeImg = gdp('completeImg.png')
const id: Ref<number | string | undefined> = ref(-1)
const dataList = reactive({
  data: {} as TestDrive.TestDriveDetail
})

onLoad((Option) => {
  id.value = Option && Option.id
})
onShow(() => {
  getDetailList()
})

function toBackIndex() {
  uni.switchTab({
    url: '/pages/car/car'
  })
}
function goSetting() {
  uni.redirectTo({
    url: '/package-car/pages/select-vehicle/index'
  })
}
/**
 * 判断是否需要展示详细信息的标识
 */
const isShowInfo = ref(true)
async function getDetailList() {
  if (!uni.getStorageSync('token')) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return
  }
  try {
    const resData = await getDetail(id.value)
    dataList.data = resData
  } catch {
    /**
     * 无权访问时不展示详细信息
     */
    isShowInfo.value = false
  }
}
</script>

<style lang="scss" scoped>
.appointment-complete {
  padding: 0 93rpx;
  text-align: center;
  overflow: hidden;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;

  .top {
    margin-top: 70rpx;

    .complete-img {
      .img {
        width: 164rpx;
        height: 164rpx;
      }
    }

    .text1 {
      margin-top: 38rpx;
      color: #292c2e;
      font-size: 56rpx;
    }

    .text2 {
      margin-top: 8rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .content {
    margin-top: 157rpx;
    text-align: left;
    margin-left: 58rpx;

    .item {
      line-height: 50rpx;
      font-size: 28rpx;

      .label {
        color: #92969a;
      }

      .value {
        margin-left: 22rpx;
        color: #292c2e;
      }
    }
  }

  .foot {
    margin-top: 104rpx;
    margin-bottom: 230rpx;

    .btn-group {
      .btn {
        height: 96rpx;
        background: #1a1a1a;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        padding: 23rpx 0;
        border: 1px solid #92969a;
      }

      .white {
        margin-top: 36rpx;
        background: #fff;
        color: #292c2e;
      }
    }
  }
}
</style>
