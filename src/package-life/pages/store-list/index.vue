<template>
  <view class="container">
    <view class="shop-modular">
      <view v-for="item in storeData.list" :key="item.id" class="shop-list">
        <view class="item-detail-info" @click="openTheMap(item)">
          <view class="store-name">{{ item.name }}</view>
          <view class="store-address">
            <text>{{ item.address }}</text>
          </view>
        </view>
        <view class="icon-info" @click="onShowPhonePop(item)">
          <image :src="iconPhone" mode="scaleToFill" />
        </view>
      </view>
    </view>
    <view class="no-more">-没有更多了-</view>
    <uni-popup ref="popupRef" type="bottom">
      <view class="popup-content">
        <view class="phone-number-box">
          <view v-for="phone in businessPhone" :key="phone" @click="onMakePhoneCall(phone)">{{ phone }}</view>
        </view>
        <view class="popup-btn">
          <view class="btn" @click="closePhonePopup">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup name="StoreList">
import { ref, reactive, inject, Ref } from 'vue'
import { getConsumerPlaces } from '@api/goods'
import { useLocationStore } from '@src/pinia/location'
import { getFlatternDistance } from '@src/util/map'
import { onLoad } from '@dcloudio/uni-app'

type OnLoadOption<T> = Record<keyof T, string | undefined>

onLoad((options: OnLoadOption<{ id: string }>) => {
  id.value = options.id || ''
  getStoreList()
})

const businessPhone: string[] = reactive([])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconPhone] = gdp(['icon-phone.png'])

const openTheMap = async (item: AnyObject) => {
  uni.openLocation({
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    name: item.name,
    address: item.address
  })
}
const onMakePhoneCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

const pageNo = ref(1)
const pageSize = ref(100)
const storeData = reactive({
  total: 0,
  list: [] as Goods.StoreInfo[],
  length: 0 // list的当前长度
})
const id = ref('')

// 获取门店列表
const getStoreList = () => {
  const params = {
    itemId: id.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  getConsumerPlaces(params).then(async (res: AnyObject) => {
    const resData = res?.data || []
    storeData.total = res.total || 0
    storeData.length = resData.length
    try {
      const loca = await useLocationStore().getLocation()
      // 门店按照直线距离远近排序
      storeData.list = resData.sort((a: StoreInfo, b: StoreInfo) => {
        return (
          getFlatternDistance(Number(a.latitude), Number(a.longitude), Number(loca.latitude), Number(loca.longitude)) -
          getFlatternDistance(Number(b.latitude), Number(b.longitude), Number(loca.latitude), Number(loca.longitude))
        )
      })
    } catch (error) {
      console.log('获取定位失败')
      storeData.list = resData
    }
  })
}

const popupRef: Ref<SpPopup | null> = ref(null)
function onShowPhonePop(item: AnyObject) {
  businessPhone.length = 0
  businessPhone.push(...item.telephone.split(','))
  popupRef.value?.open()
}
function closePhonePopup() {
  popupRef.value?.close()
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: env(safe-area-inset-bottom);
}

.wrap-header {
  width: 100vw;
  height: 88rpx;
  line-height: 88rpx;
  position: relative;
  text-align: center;
  background-color: #fff;

  .img {
    position: absolute;
    width: 48rpx;
    height: 48rpx;
    top: 20rpx;
    left: 16rpx;
  }
}

.shop-modular {
  width: 90%;
  margin: 0 auto 60rpx;

  .shop-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36rpx 0;
    border-bottom: 1rpx solid rgb(228 231 234 / 50%);

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

        text {
          width: 83%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .icon-info {
      line-height: 0;

      image {
        width: 72rpx;
        height: 72rpx;
      }
    }
  }

  .more-shop {
    width: 100%;
    margin: 48rpx 0 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    text {
      color: #4e6175;
    }

    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.no-more {
  text-align: center;
  font-size: 26rpx;
  color: #909ca8;
  padding-bottom: 30rpx;
}

.popup-content {
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
