<template>
  <view class="shop-modular">
    <view class="modular-title">适用门店</view>
    <view class="shop-list">
      <view class="item-detail-info" @click="openTheMap">
        <view class="store-name">{{ nearestStore.storeName }}</view>
        <view class="store-address">
          <text class="text">{{ nearestStore.storeAddress }}</text>
          <image class="img" :src="iconRight" />
        </view>
      </view>
      <view class="icon-info" @click="toShowPhonePop()">
        <image class="img" :src="iconPhone" mode="scaleToFill" />
      </view>
    </view>
    <navigator :url="'/package-life/pages/store-list/index?id=' + itemId" hover-class="none">
      <view v-if="storeList.length > 1" class="more-shop">
        <text class="text">查看更多门店</text>
        <image class="img" :src="iconRightBlack" mode="scaleToFill" />
      </view>
    </navigator>
  </view>
  <uni-popup ref="phonePopupRef" type="bottom">
    <view class="phone-popup-content">
      <view class="phone-number-box">
        <view v-for="phone in phoneList" :key="phone" @click="onCall(phone)">{{ phone }}</view>
      </view>
      <view class="popup-btn">
        <view class="btn" @click="closePhonePopup">取消</view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { inject, computed, reactive, ref, Ref, PropType } from 'vue'
import { getFlatternDistance } from '@util/map'
import { useLocationStore } from '@src/pinia/location'

const locationStore = useLocationStore()

const props = defineProps({
  itemId: {
    type: [String, Number],
    default: null
  },
  storeList: {
    type: Array as PropType<Goods.StoreInfo[]>,
    default: () => []
  }
})
// 最近的门店
const nearestStore = reactive({}) as StoreInfo

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconRight, iconPhone, iconRightBlack] = gdp(['icon-right.png', 'icon-phone.png', 'icon-right-black.png'])

if (props.storeList.length) {
  try {
    const location = await locationStore.getLocation()
    // 门店按照直线距离远近排序
    const reversedStoreList = [...props.storeList].reverse()
    reversedStoreList.sort((a: StoreInfo, b: StoreInfo) => {
      return (
        getFlatternDistance(Number(a.latitude), Number(a.longitude), Number(location.latitude), Number(location.longitude)) -
        getFlatternDistance(Number(b.latitude), Number(b.longitude), Number(location.latitude), Number(location.longitude))
      )
    })
    // 显示最近的门店
    Object.assign(nearestStore, props.storeList[0])
  } catch (error) {
    Object.assign(nearestStore, props.storeList[props.storeList.length - 1])
    console.log('获取定位失败', nearestStore)
  }
}

const phonePopupRef: Ref<SpPopup | null> = ref(null)

function toShowPhonePop() {
  phonePopupRef.value?.open()
}
function closePhonePopup() {
  phonePopupRef.value?.close()
}

const phoneList = computed(() => (nearestStore.mobile || '').split(','))
// 调用地图
const openTheMap = async () => {
  const { latitude, longitude, storeName, storeAddress } = nearestStore
  uni.openLocation({
    latitude: Number(latitude),
    longitude: Number(longitude),
    name: storeName,
    address: storeAddress
  })
}

// 联系商家拨打电话
function onCall(mobile: string) {
  uni.makePhoneCall({
    phoneNumber: mobile
  })
}
</script>
<style lang="scss" scoped>
// 适用门店
.shop-modular {
  padding: 40rpx;
  background-color: #fff;

  .modular-title {
    color: #92969a;
    margin-bottom: 10rpx;
  }

  .shop-list {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item-detail-info {
      width: 90%;

      .store-name {
        font-size: 30rpx;
        color: #292c2e;
      }

      .store-address {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 24rpx;
        color: #92969a;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .text {
          width: 83%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .img {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }

    .icon-info {
      .img {
        width: 72rpx;
        height: 72rpx;
      }
    }
  }

  .more-shop {
    width: 100%;
    margin-top: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      color: #4e6175;
    }

    .img {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

// 弹窗，选择需要拨打的电话
.phone-popup-content {
  width: 94%;
  margin: 0 auto;
  color: #008eff;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .phone-number-box {
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    background: #fff;

    > view {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 120rpx;
      font-size: 34rpx;
      border-bottom: 1rpx solid rgb(228 231 234 / 50%);
    }

    > view:last-child {
      border-bottom: none;
    }
  }

  .popup-btn {
    background: #fff;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 120rpx;
      font-size: 38rpx;
    }
  }
}
</style>
