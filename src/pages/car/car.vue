<template>
  <view>
    <sp-header>
      <view class="current-tenants" @click="goToTenantsListPage">
        <view class="icon-box">
          <image class="icon-default-tenant" :src="selectedTenantObj.iconUrl ? selectedTenantObj.iconUrl : deaultTanent.iconUrl" mode="aspectFit" />
        </view>
        <text class="tenant-name ellipsis">{{ selectedTenantObj.tenantName }}</text>
      </view>
    </sp-header>
    <view class="flex-col container">
      <!-- 轮播 -->
      <view class="car-swiper">
        <sp-swiper :img-list="selectedTenantObj.tenantId === deaultTanent.tenantId ? supaurImgList : huaxiaImgList" :control-bottom="20" />
        <!-- 了解预定按钮 -->
        <view class="car-detail-btn" @click="goToSelectVehicle">了解和预订</view>
      </view>
      <view class="car-test-drive">
        <!-- 预约试驾入口 -->
        <image class="bg-img" :src="testDriveImg" />
        <view class="content" @click="goToTestDrive">
          <view class="left">
            <view class="name">预约试驾</view>
            <view class="note">购车享礼包，免费专属VIP客服</view>
          </view>
          <image :src="rightIcon" class="icon" />
        </view>
      </view>
      <!-- 经销商标题 -->
      <sp-title-bar class="title-bar" title="经销商信息" btn-text="查看全部" @on-click="goToDealerList" />
      <!-- 经销商卡片 -->
      <sp-dealer-card :dealer="dealerInfo.data" />
    </view>
  </view>
</template>

<script lang="ts" setup name="Car">
import { inject, ref, reactive } from 'vue'
import { getDealerList } from '@api/car'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { useCarStore } from '@src/pinia/car'
import { useConfigStore } from '@src/pinia/config'
// 多租户默认数据
onLoad(setTanent)

const carStore = useCarStore()
const configStore = useConfigStore()

let selectedTenantObj = reactive({
  iconUrl: '',
  tenantId: '',
  tenantName: ''
})

onShow(() => {
  // 清空关于购车的一些数据, 初始化页面
  uni.removeStorageSync('vehicleData')
  carStore.toClearVehicle({})
  carStore.setModelActive(0)
  carStore.setConfigActive(0)
  getDealerInfo()
  // 租户列表选中的值会放在缓存中
  Object.assign(selectedTenantObj, uni.getStorageSync('currentTenant') || {})
})

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>

// 数跑logo
const supaurLogo = gdp('Supaur.png')
// 默认租户图标
const iconDefaultTenant = gdp('icon-default-tenant.png')
// 多租户轮播图
const supaurImgList = gdp(['car-banner1.png?x-oss-process=image/resize,h_554,w_390', 'car-banner2.png?x-oss-process=image/resize,h_554,w_390'])
const huaxiaImgList = gdp(['car-banner3.png?x-oss-process=image/resize,h_554,w_390', 'car-banner4.png?x-oss-process=image/resize,h_554,w_390'])
// 试乘试驾链接图片
const testDriveImg = gdp('test-drive.png')
// 右箭头图片
const rightIcon = gdp('icon-right.png')

/**
 * 跳转至经销商信息列表页面
 */
const goToDealerList = () => {
  goToPage('/package-car/pages/dealer-list/index')
}

/**
 * 跳转至购车页面
 */
const goToSelectVehicle = () => {
  goToPage('/package-car/pages/select-vehicle/index')
}

/**
 * 跳转至预约试乘试驾页面
 */
const goToTestDrive = () => {
  goToPage('/package-car/pages/test-drive/index')
}

/**
 * 跳转至切换租户页面
 */
const goToTenantsListPage = () => {
  goToPage(`/package-car/pages/switch-tenants/index`)
}

// 跳转页面公共方法
const goToPage = (urlStr: string) => {
  uni.navigateTo({
    url: urlStr
  })
}

let dealerInfo = reactive({
  data: {}
})
// 经销商是否为空
const isDealerEmpty = ref(false)

/**
 * 获取首个经销商信息
 * @returns
 */
async function getDealerInfo() {
  const dealerData = await getDealerList({
    pageNo: 1,
    pageSize: 1,
    cityCode: '330100'
  })
  if (!dealerData.data || !dealerData.data.length) {
    isDealerEmpty.value = true
    return
  }
  const dealer = dealerData.data[0]
  dealerInfo.data = dealer
}

/**
 * 处理租户信息
 */
let deaultTanent = reactive({
  iconUrl: iconDefaultTenant,
  tenantId: '',
  tenantName: ''
})

async function setTanent() {
  // 有值直接取缓存的值
  const currentTenant = uni.getStorageSync('currentTenant')
  if (!currentTenant.tenantId) {
    const feConfigInfo = await configStore.getFeConfig()
    const deaultObj = feConfigInfo.deaultTanent
    deaultTanent.tenantId = deaultObj.tenantId
    deaultTanent.tenantName = deaultObj.tenantName
    deaultTanent.iconUrl = supaurLogo
    Object.assign(selectedTenantObj, deaultTanent)
    uni.setStorageSync('currentTenant', selectedTenantObj)
  }
}
</script>

<style lang="scss" scoped>
.current-tenants {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;

  /* #ifdef H5 */
  margin-top: 30rpx;
  /* #endif */
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66rpx;
    height: 66rpx;
    margin-right: 12rpx;
    margin-left: 39rpx;
    border-radius: 50%;
    background: rgb(255 255 255 / 25%);
    border: 1rpx solid rgb(146 150 154 / 75%);

    .icon-default-tenant {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .tenant-name {
    max-width: 310rpx;
  }
}

.container {
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 65rpx;
  flex: 1 1 auto;

  .car-swiper {
    position: relative;
    align-self: center;
    width: 100%;
    height: 1065rpx;

    .car-detail-btn {
      position: absolute;
      bottom: 150rpx;
      left: 0;
      right: 0;
      margin: auto;
      width: 304rpx;
      height: 94rpx;
      opacity: 0.8;

      /* #ifdef MP-WEIXIN */
      border-radius: 2rpx;
      /* #endif */
      border: 1rpx solid #fff;
      font-size: 28rpx;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .car-test-drive {
    padding: 40rpx 32rpx 24rpx;
    position: relative;

    .bg-img {
      height: 160rpx;
      width: 100%;
    }

    .content {
      position: absolute;
      display: flex;
      justify-content: space-between;
      top: 68rpx;
      left: 80rpx;
      width: 80%;

      .name {
        color: #fff;
        font-size: 36rpx;
      }

      .note {
        color: #fff;
        font-size: 24rpx;
      }

      .icon {
        width: 32rpx;
        height: 32rpx;
        margin-top: 45rpx;
      }
    }
  }

  .title-bar {
    padding: 0 30rpx;
  }
}
</style>
