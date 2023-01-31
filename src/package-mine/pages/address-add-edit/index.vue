<template>
  <view class="page">
    <!-- 收货地址表单 -->
    <view class="list">
      <view class="item font-regular flex-col justify-center">
        <view class="item-left">姓名</view>
        <input v-model="receiverName" class="item-input" placeholder-class="font-regular item-placeholder" maxlength="20" placeholder="请输入收货人姓名" />
      </view>
      <view class="item font-regular">
        <view class="item-left">电话</view>
        <input v-model="mobile" class="item-input" placeholder-class="font-regular item-placeholder" type="number" maxlength="11" placeholder="请输入收货人手机号" />
      </view>
      <view class="item font-regular">
        <view class="item-left">地区</view>
        <view class="address-box items-center justify-between" @click="cityPickerVisible = true">
          <text v-if="cityText" class="city-text">{{ cityText }}</text>
          <text v-else class="item-placeholder">请选择所省/市/区</text>
          <image class="img" :src="bottomIcon" mode="aspectFill" />
        </view>
      </view>
      <view class="item font-regular">
        <view class="item-left">详细地址</view>
        <textarea
          v-model="details"
          class="item-input"
          placeholder-class="font-regular item-placeholder"
          maxlength="100"
          placeholder="街道、楼牌号等详细地址"
          @blur="handleTextAreaBlur"
        />
      </view>
    </view>
    <!-- 默认设置 -->
    <view class="flex-row items-center default" @click="changeDefault">
      <sp-checkbox v-model="isDefault" :true-value="1" :false-value="0" />
      <text class="default-text font-regular">设为默认地址</text>
    </view>
    <!-- 编辑按钮 -->
    <view v-if="id" class="fixd-footer items-center justify-between">
      <view class="delete-btn items-center justify-center" @click="toDelAddress">删 除</view>
      <view class="save-btn items-center justify-center" @click="toSave">保 存</view>
    </view>
    <!-- 新增保存按钮 -->
    <view v-else class="footer">
      <view class="save-btn items-center justify-center" @click="toSave">保 存</view>
    </view>
    <!-- 城市选择popup组件 -->
    <sp-city-picker v-model="cityPickerVisible" :value="cityValue" @change="toPickerChange" />
  </view>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { addAddress, updateAddress, deleteAddress } from '@api/user'
import { onLoad } from '@dcloudio/uni-app'
import { useAddressStore } from '@src/pinia/address'
import { isCorrectMobile } from '@src/util/common'
import useAddressForm from './address'

interface AddressAddEditOption {
  id?: string
  isPicker: 'false' | 'true'
  isFromPage: string
}
type OnLoadOption<T> = Record<keyof T, string | undefined>

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const bottomIcon = gdp('icon-bottom.png')

const addressStore = useAddressStore()
const id = ref('')

const isPicker = ref(false)
// 是否来自购物结算页面的标识
const isFromPage = ref('')

const { receiverName, mobile, details, isDefault, cityValue, cityText, initAddress, toPickerChange } = useAddressForm()
console.log(useAddressForm())

onLoad((option: OnLoadOption<AddressAddEditOption>) => {
  if (option.id) {
    id.value = option.id
    initAddress(id.value)
  }
  isPicker.value = option.isPicker === 'true'
  isFromPage.value = option.isFromPage as string
  uni.setNavigationBarTitle({
    title: option.id ? '修改收货地址' : '新增收货地址'
  })
})

const cityPickerVisible = ref(false)

const changeDefault = () => {
  isDefault.value = +!isDefault
}

const handleTextAreaBlur = (e: AnyObject) => {
  details.value = e.detail.value
}

// 整理表单数据
const getParams = async () => {
  const [province, city, district] = cityValue
  return {
    addressType: 2,
    receiverName: receiverName.value,
    mobile: mobile.value,
    province: province.name || '',
    provinceCode: province.code,
    provinceId: province.id as string,
    city: city.name || '',
    cityCode: city?.code,
    cityId: city?.id as string,
    district: district?.name,
    districtCode: district?.code,
    districtId: district?.id as string,
    details: details.value,
    isDefault: isDefault.value
  }
}

// 验证表单数据
const toFormValidate = () => {
  if (
    !validateRule(!!receiverName.value, '请输入收货人姓名') ||
    !validateRule(!!mobile.value, '请输入手机号') ||
    !validateRule(isCorrectMobile(mobile.value), '请输入正确格式的手机号') ||
    !validateRule(!!cityValue.length, '请选择省市区') ||
    !validateRule(!!details.value, '请输入详细地址')
  ) {
    return false
  }

  return true
}

// 验证
const validateRule = (condition: boolean, message: string) => {
  if (!condition) {
    uni.showToast({
      icon: 'none',
      title: message
    })
    return false
  }
  return true
}

const toSave = async () => {
  if (!toFormValidate()) {
    return false
  }
  const addressInfo = await getParams()
  uni.showLoading({
    mask: true,
    title: '保存中'
  })
  try {
    let addressId = ''
    if (id.value) {
      addressId = id.value
      await updateAddress(id.value, addressInfo)
    } else {
      addressId = await addAddress(addressInfo)
    }
    uni.hideLoading()
    uni.showToast({
      title: id.value ? '修改成功' : '新增成功'
    })
    // isFromPage.value ===goodsSettle 是来自于购物结算页面，则需要重新存值，商品详情页是goodsDetail，需要点击某一地址再存值
    isFromPage.value === 'goodsSettle' &&
      addressStore.$patch({
        selectedAddress: { id: addressId, ...addressInfo }
      })
    if (getCurrentPages().length === 1) {
      uni.redirectTo({
        url: '/package-mine/pages/address-list/index'
      })
    } else {
      uni.navigateBack({
        delta: isPicker.value ? 2 : 1
      })
    }
  } catch (error) {
    uni.hideLoading()
  }
}

const toDelAddress = async () => {
  uni.showModal({
    title: '提示',
    content: '确认删除？',
    confirmColor: '#292c2e',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({
          mask: true,
          title: '正在删除'
        })
        try {
          await deleteAddress(id.value)
          uni.showToast({
            icon: 'none',
            title: '删除地址成功'
          })
          uni.hideLoading()
          uni.navigateBack({
            delta: 1
          })
        } catch (error) {
          uni.hideLoading()
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 122rpx);
}

.list {
  padding: 0 40rpx;
}

.item {
  width: 100%;
  height: 140rpx;
  border-bottom: 1rpx solid #e4e7ea;
  margin-bottom: 33rpx;
  padding-bottom: 20rpx;

  &:last-of-type {
    margin-bottom: 0;
  }

  &-left {
    font-size: 24rpx;
    height: 36rpx;
    line-height: 36rpx;
    color: #4e6175;
  }

  &-input {
    width: 100%;
    height: 80rpx;
  }

  &-placeholder {
    color: #bababa;
    font-size: 32rpx;
  }

  .address-box {
    height: 80rpx;

    .city-text {
      flex: 1;
    }

    .img {
      flex-basis: 32rpx;
      width: 32rpx;
      height: 32rpx;
      margin-left: auto;
    }
  }
}

.default {
  padding: 50rpx 40rpx 80rpx;

  .default-text {
    color: #1a1a1a;
    margin-left: 5rpx;
  }
}

.footer {
  padding: 0 40rpx;

  .save-btn {
    width: 100%;
    height: 84rpx;
    color: #fff;
    background: #1a1a1a;
    border-radius: 1rpx;
    font-size: 28rpx;
  }
}

.fixd-footer {
  position: fixed;
  bottom: 0;
  padding: 18rpx 40rpx calc(env(safe-area-inset-bottom) + 18rpx);
  width: 100%;
  background: #fff;
  border-top: 1rpx solid #e4e7ea;

  .delete-btn {
    width: 315rpx;
    height: 84rpx;
    border-radius: 1rpx;
    border: 2rpx solid #1a1a1a;
  }

  .save-btn {
    width: 315rpx;
    height: 84rpx;
    color: #fff;
    background: #1a1a1a;
    border-radius: 1rpx;
  }
}
</style>
