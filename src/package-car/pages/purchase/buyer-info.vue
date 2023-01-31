<template>
  <view class="group">
    <view class="group-title">购买信息</view>
    <view id="buyer" class="form-item items-center">
      <view class="label">购买人姓名</view>
      <view class="form-item-content">
        <input v-model.trim="buyer" class="form-item-input" maxlength="20" placeholder="输入收货人姓名" placeholder-class="placeholder" @blur="checkName(buyer)" />
      </view>
    </view>
    <view id="phone" class="form-item items-center">
      <view class="label">手机号码</view>
      <view class="form-item-content">
        <input v-model.trim="phone" type="number" class="form-item-input" maxlength="11" placeholder="输入手机号码" placeholder-class="placeholder" @blur="checkPhone(phone)" />
      </view>
    </view>
    <template v-if="reserveType === 0">
      <view class="form-item items-center">
        <view class="label">证件类型</view>
        <view class="form-item-content items-center justify-between" @click="selectorVisible = true">
          <view class="select-content ellipsis" :class="{ 'has-value': idType.label }">{{ idType.label || '选择证件类型' }}</view>
          <image class="icon" :src="bottomIcon" />
        </view>
      </view>
      <view id="idNum" class="form-item items-center">
        <view class="label">证件号码</view>
        <view class="form-item-content">
          <input v-model.trim="idNum" class="form-item-input" placeholder="输入证件号码" placeholder-class="placeholder" @blur="checkIdCard(idNum)" />
        </view>
      </view>
    </template>
    <view id="provider" class="form-item items-center">
      <view class="label">选择服务商</view>
      <view class="form-item-content items-center justify-between" @click="toSelectProvider">
        <view class="select-content ellipsis" :class="{ 'has-value': provider.name }">{{ provider.name || '选择服务商' }}</view>
        <image class="icon" :src="bottomIcon" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="BuyerInfo">
import { inject, ref } from 'vue'
import usePurchase from './purchase'
import { checkName, checkPhone, checkIdCard } from './util'

const { provider, buyer, phone, idNum, reserveType, idType, toSelectProvider } = usePurchase()

// 图片资源
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [bottomIcon] = gdp(['icon-bottom.png'])

const selectorVisible = ref(false)
</script>

<style lang="scss" scoped>
.group {
  padding: 72rpx 40rpx 56rpx;

  .group-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #292c2e;
    margin-bottom: 40rpx;
  }
}

.form-item {
  height: 112rpx;

  .label {
    width: 200rpx;
    font-size: 28rpx;
    color: #909ca8;
  }

  .form-item-content {
    flex: 1;
    height: 100%;
    border-bottom: 1rpx solid #e4e7ea;

    .form-item-input {
      height: 100%;
      color: #1a1a1a;
      font-size: 28rpx;
    }

    .placeholder,
    .select-content {
      color: #92969a;
      font-size: 28rpx;
    }

    .select-content {
      flex: 1;

      &.has-value {
        color: #1a1a1a;
      }
    }

    .icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
