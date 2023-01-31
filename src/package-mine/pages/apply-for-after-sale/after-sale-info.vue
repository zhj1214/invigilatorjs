<template>
  <view class="apply-for-after-sale-content">
    <view class="title">售后信息</view>
    <view class="item">
      <view class="item-label">退款方式</view>
      <view class="item-content" @click="openAfterSaleType">
        <view class="select">
          <view :class="{ active: afterSaleType.desc }">{{ afterSaleType.desc || '请选择退款方式' }}</view>
          <image :src="applyAfterSaleIcon" mode="scaleToFill" />
        </view>
      </view>
      <sp-selector ref="afterSaleTypeRef" title="退款方式" :arr-props="afterSaleTypeList" :custom-props="{ value: 'code', label: 'desc' }" @get-data="toAfterSaleTypeChange" />
    </view>
    <view class="item">
      <view class="item-label">售后原因</view>
      <view class="item-content" @click="openAfterSaleReason">
        <view class="select">
          <view :class="{ active: afterSaleReason.code }">{{ afterSaleReason.desc || '请选择售后原因' }}</view>
          <image :src="applyAfterSaleIcon" mode="scaleToFill" />
        </view>
      </view>
      <sp-selector
        ref="afterSaleReasonRef"
        title="售后原因"
        :arr-props="afterSaleReasonList"
        :custom-props="{ value: 'code', label: 'desc' }"
        @get-data="toAfterSaleReasonChange"
      />
    </view>
    <view>
      <after-sale-amount :order-id="orderId" :item-id="id" @get-after-sale-amout="getAfterSaleAmout" />
    </view>
  </view>
</template>

<script setup lang="ts" name="AfterSaleInfo">
import { defineProps, computed, inject, Ref, ref } from 'vue'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import AfterSaleAmount from '../../components/after-sale-amount/after-sale-amount.vue'
import useFormData from './form-data'

defineProps<{ id: string }>()

const afterSaleStore = useAfterSaleStore()
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const applyAfterSaleIcon = gdp('icon-apply-after-sale.png')

const orderId = computed(() => afterSaleStore.afterSaleParams.orderId)

const { afterSaleType, afterSaleReason, afterSaleTypeList, afterSaleReasonList, toAfterSaleTypeChange, toAfterSaleReasonChange, getAfterSaleAmout } = useFormData()
console.log(afterSaleTypeList)
const afterSaleTypeRef: Ref<SpPopup | null> = ref(null)
function openAfterSaleType() {
  afterSaleTypeRef.value?.open()
}
const afterSaleReasonRef: Ref<SpPopup | null> = ref(null)
function openAfterSaleReason() {
  afterSaleReasonRef.value?.open()
}
</script>

<style scoped lang="scss">
.apply-for-after-sale-content {
  margin-top: 125rpx;

  .title {
    font-size: 36rpx;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
  }

  .item {
    display: flex;
    justify-content: space-between;
    color: #909ca8;

    &-label {
      width: 200rpx;
      font-size: 28rpx;
      padding: 32rpx 0;
    }

    &-content {
      flex: 1;
      height: 100%;
      padding: 32rpx 0;
      position: relative;
      font-size: 28rpx;
      color: #92969a;

      .select {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #92969a;

        view {
          &.active {
            color: #696b6c;
          }
        }

        image {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
  }
}
</style>
