<template>
  <view class="page">
    <!-- 运费规则 -->
    <view v-if="shipTemplateId" class="freight-box">
      <view class="shipping-address">
        <view>运费规则</view>
        <view class="address-info ellipsis">
          <image class="icon-location" :src="iconLocation" mode="aspectFill" />
          <text>配送至：{{ shippingAddress }}</text>
        </view>
      </view>
      <view class="freight-template">{{ freightTemplate }}</view>
    </view>
    <!-- 收货地址为空 -->
    <view v-if="isEmpty" class="empty flex-col items-center justify-center">
      <image class="img" :src="addressImg" mode="aspectFill" />
      <text class="desc">当前还未添加收货地址</text>
    </view>
    <!-- 收货地址列表 -->
    <view v-else class="address-list">
      <view class="scroll-card">
        <view v-if="shipTemplateId" class="list-title">收货地址</view>
        <view v-for="(address, index) in addressList" :key="index" class="address flex-row items-center justify-between" @click="toPickerAddress(address)">
          <view class="info">
            <view class="address-title font-medium flex-row items-center">
              <text class="name ellipsis">{{ address.receiverName }}</text>
              <text class="tel">{{ address.mobile }}</text>
              <image v-if="address.isDefault" class="tag" :src="defaultImg" mode="aspectFill" />
            </view>
            <view class="address-desc">{{ address.province }} {{ address.city || '' }} {{ address.district || '' }} {{ address.details }}</view>
          </view>
          <!-- 编辑icon -->
          <!-- 来自商品详情页不允许编辑 -->
          <image v-if="isFromPage !== 'goodsDetail'" class="icon-edit" :src="editIcon" mode="aspectFill" @click.stop="goToAddAndEdit(address.id)" />
        </view>
      </view>
    </view>
    <!-- 底部新增按钮 -->
    <view class="footer">
      <view class="add-btn items-center justify-center" @click="goToAddAndEdit()">新增收货地址</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { getAddress } from '@api/user'
import { useAddressStore } from '@src/pinia/address'

const addressStore = useAddressStore()

interface OnLoadOption {
  'is-picker': string
  shipTemplateId: string
  id: string
  isFromPage: string
}
type OnLoadOptionType<T> = Record<keyof T, string | undefined>

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [editIcon, addressImg, defaultImg, iconLocation] = gdp(['icon-edit.png', 'address.png', 'default.png', 'icon-location.png'])

// 选择地址状态
const isPicker = ref(false)
// 判断是否来自购物结算页面的标识，需要传递给新增地址页面
const isFromPage = ref('')
const isEmpty = ref(false)

const addressList: User.AddressInfo[] = reactive([])

const getAddressList = async () => {
  uni.showLoading({
    mask: true
  })
  try {
    const list = (await getAddress()) as Array<AnyObject>
    const addressData = list.map((address: AnyObject) => {
      const { id, receiverName, mobile, province, provinceCode, provinceId, city, cityCode, cityId, district, districtCode, districtId, details, isDefault } = address
      return {
        id,
        receiverName,
        mobile,
        province,
        provinceCode,
        provinceId,
        city,
        cityCode,
        cityId,
        district,
        districtCode,
        districtId,
        details,
        isDefault
      }
    })
    isEmpty.value = !list.length
    addressList.splice(0, 999)
    addressData.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
    addressList.push(...addressData)
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
  }
}

const goToAddAndEdit = (id?: string) => {
  if (!id && addressList.length >= 10) {
    uni.showToast({
      icon: 'none',
      title: '地址仅能保留10条'
    })
    return
  }

  const url = `/package-mine/pages/address-add-edit/index?isFromPage=${isFromPage.value}&isPicker=${isPicker.value}${id ? `&id=${id}` : ''}`
  uni.navigateTo({
    url
  })
}

const toPickerAddress = (address: User.AddressInfo) => {
  if (isPicker.value || shipTemplateId.value) {
    addressStore.$patch({
      selectedAddress: address,
      shippingAddress: `${address.province} ${address.city} ${address.district}`
    })
    uni.navigateBack({
      delta: 1
    })
  }
}
const shipTemplateId = ref('')
const freightTemplate = computed(() => addressStore.freightTemplate)
const shippingAddress = computed(() => addressStore.shippingAddress)

onLoad((options: OnLoadOptionType<OnLoadOption>) => {
  isPicker.value = options['is-picker'] === '1'
  isFromPage.value = options.isFromPage || '' // goodsDetail说明来自于商品详情页面
  uni.setNavigationBarTitle({
    title: options.isFromPage === 'goodsDetail' ? '配送至' : '收货地址'
  })
  shipTemplateId.value = options.shipTemplateId || '' // 运费模板id  没有时不显示运费信息
})

onShow(() => {
  getAddressList()
})
</script>

<style lang="scss" scoped>
$footer-height: calc(120rpx + env(safe-area-inset-bottom));
$scroll-height: calc(100vh - $footer-height - var(--window-top));

.freight-box {
  width: 100%;
  height: 144rpx;
  padding: 0 40rpx;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .shipping-address {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: #bababa;

    .address-info {
      width: 78%;
      text-align: right;
    }

    .icon-location {
      width: 24rpx;
      height: 24rpx;
      vertical-align: -4rpx;
      margin-right: 4rpx;
    }
  }

  .freight-template {
    font-size: 28rpx;
    color: #92969a;
    margin-top: 16rpx;
  }
}

.empty {
  height: $scroll-height;

  .img {
    width: 144rpx;
    height: 144rpx;
  }

  .desc {
    color: #909ca8;
    font-size: 26rpx;
    margin-top: 40rpx;
  }
}

.address-list {
  padding-bottom: $footer-height;

  .scroll-card {
    padding: 0 40rpx;

    .list-title {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: #92969a;
    }
  }

  .address {
    padding: 42rpx 0 45rpx;
    border-bottom: 1rpx solid #e4e7ea;

    .info {
      flex: 1;
    }

    .address-title {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 32rpx;

      .name {
        max-width: 200rpx;
      }

      .tel {
        margin: 0 16rpx;
      }

      .tag {
        width: 64rpx;
        height: 37rpx;
      }
    }

    .address-desc {
      color: #92969a;
      font-size: 26rpx;
      line-height: 38rpx;
    }

    .icon-edit {
      width: 48rpx;
      height: 48rpx;
      margin-left: 6rpx;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  padding: 18rpx 40rpx calc(env(safe-area-inset-bottom) + 18rpx);
  width: 100%;
  background: #fff;
  border-top: 1rpx solid #e4e7ea;

  .add-btn {
    width: 100%;
    height: 84rpx;
    color: #fff;
    background: #1a1a1a;
    border-radius: 1rpx;
  }
}
</style>
