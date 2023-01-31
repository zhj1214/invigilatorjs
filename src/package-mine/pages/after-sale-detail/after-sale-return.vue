<template>
  <view class="after-sale-return">
    <view class="after-sale-return-form">
      <view class="content">
        <view>
          <view class="label">运单号码</view>
          <view class="form-item-content">
            <input type="text" maxlength="32" placeholder="请输入运单号码" placeholder-style="font-size: 28rpx;color: #92969a;" @input="getInputValue" />
          </view>
        </view>
        <view>
          <view class="label">物流公司</view>
          <view class="form-item-content" @click="openexpressSel">
            <view class="select-express">
              <view :class="{ active: expressInfo.expressCode }">{{ expressInfo.expressName || '请选择物流公司' }}</view>
              <image :src="applyAfterSaleIcon" mode="scaleToFill" />
            </view>
          </view>
        </view>
      </view>
      <view class="btns">
        <view class="cancel" @click="toBackApply">撤销申请</view>
        <view class="ok" :class="disabled ? 'disabled' : ''" @click="getAfterRefundExpress">确认退货</view>
      </view>
    </view>
    <sp-selector ref="expressRef" title="物流公司" :arr-props="expressList" :custom-props="{ value: 'expressCode', label: 'expressName' }" @get-data="handleExpressChange" />
  </view>
</template>

<script setup lang="ts" name="AfterSaleReturn">
import { inject, defineProps, ref, reactive, computed, onMounted, Ref } from 'vue'
import { getExpressCompanies, checkAfterRefundDeliver, setAfterRefundCancel } from '@api/after-sale'

const props = defineProps<{
  afterSaleId: string
}>()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const applyAfterSaleIcon = gdp('icon-apply-after-sale.png')
const expressList: Array<{ expressName: string; expressCode: string }> = reactive([])
const expressInfo = ref({
  expressName: '',
  expressCode: ''
})
const expressNumber = ref('')
const disabled = computed(() => !expressNumber.value || !expressInfo.value.expressCode)

onMounted(() => {
  getExpressCompany()
})

const emit = defineEmits(['getDetail'])

async function getExpressCompany() {
  try {
    const { data } = await getExpressCompanies({ pageNo: 1, pageSize: 200 })
    const expData = data.map((item: AnyObject) => {
      return {
        expressCode: item.code,
        expressName: item.name
      }
    })
    expressList.push(...expData)
  } catch (error) {}
}

const expressRef: Ref<SpSelector | null> = ref(null)

function openexpressSel() {
  expressRef.value?.open()
}

function handleExpressChange(val: { expressName: string; expressCode: string }) {
  expressInfo.value = val
}

function getInputValue(val: AnyObject) {
  expressNumber.value = val.detail.value
}

function checkExpressNum() {
  if (!/^([a-zA-Z]|\d)*$/.test(expressNumber.value)) {
    uni.showToast({
      title: '运单号仅支持输入数字与字母',
      duration: 1000,
      icon: 'none'
    })
    return false
  }
  return true
}

async function getAfterRefundExpress() {
  if (!expressNumber.value) {
    uni.showToast({
      title: '请输入运单号码',
      duration: 1000,
      icon: 'none'
    })
    return
  }
  if (!checkExpressNum()) {
    return
  }
  if (!expressInfo.value.expressCode) {
    uni.showToast({
      title: '请选择物流公司',
      duration: 1000,
      icon: 'none'
    })
    return
  }
  const obj = {
    expressNumber: expressNumber.value,
    ...expressInfo.value
  }
  try {
    await checkAfterRefundDeliver(props.afterSaleId, { expressInfo: obj })
    emit('getDetail')
  } catch (error) {}
}

function toBackApply() {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认撤销售后单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await setAfterRefundCancel(props.afterSaleId)
          emit('getDetail')
        } catch (error) {}
      }
    }
  })
}
</script>

<style scoped lang="scss">
.after-sale-return {
  margin-bottom: 31rpx;

  &-form {
    .content {
      > view {
        display: flex;
        justify-content: space-between;
        height: 112rpx;
        color: #909ca8;

        .label {
          font-size: 28rpx;
          width: 200rpx;
          padding: 35rpx 0;
        }

        .form-item-content {
          flex: 1;
          height: 100%;
          padding: 35rpx 0;
          position: relative;

          input {
            font-size: 28rpx;
            color: #1a1a1a;
            height: 100%;
          }

          .select-express {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 28rpx;
            color: #92969a;

            view {
              &.active {
                color: #1a1a1a;
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

    .btns {
      display: flex;
      justify-content: space-between;
      margin-top: 47rpx;

      .cancel {
        width: 308rpx;
        height: 76rpx;
        background: #fff;
        border-radius: 2rpx;
        border: 2rpx solid #909ca8;
        font-size: 28rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #292c2e;
        line-height: 72rpx;
        text-align: center;
      }

      .ok {
        width: 319rpx;
        height: 76rpx;
        background: #1a1a1a;
        border-radius: 2rpx;
        font-size: 28rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #fff;
        line-height: 76rpx;
        text-align: center;

        &.disabled {
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
