<template>
  <view class="apply-for-after-sale">
    <view class="apply-for-after-sale-title">申请售后</view>
    <!-- 售后信息 -->
    <after-sale-info :id="id" />

    <!-- 问题描述 -->
    <problem-description />

    <view class="apply-for-after-sale-foot">
      <view class="apply-for-after-sale-foot-btn" :class="disabled ? 'disabled' : ''" @click="!disabled && handleSubmit()">提交</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { toRefund } from '@src/api/after-sale'
import afterSaleInfo from './after-sale-info.vue'
import problemDescription from './problem-description.vue'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import useFormData from './form-data'

const afterSaleStore = useAfterSaleStore()
const { afterSaleType, afterSaleReason, desc, uploadImgList, amount, pointAmount, editAble, init } = useFormData()

const afterSaleParams = computed(() => afterSaleStore.afterSaleParams)
const { itemType, orderId } = afterSaleParams.value
let id = ref('')

const disabled = computed(() => {
  let flag = afterSaleType.desc && afterSaleReason.code && desc.value

  if (afterSaleType.code !== 1 && flag) {
    return false
  } else if (afterSaleType.code === 1 && flag && uploadImgList[0].imgPath) {
    return false
  }
  return true
})
watch(
  () => desc.value,
  (val) => {
    if (val.length > 300) {
      uni.showToast({
        title: '当前文案超出最多字数上限，将无法完全展示',
        icon: 'none'
      })
    }
  }
)

async function validate(cb: (valid: boolean) => void) {
  if (!afterSaleType.desc) {
    cb(false)
    return uni.showToast({
      title: '请选择退款方式',
      icon: 'none'
    })
  }
  if (!afterSaleReason.code) {
    cb(false)
    return uni.showToast({
      title: '请选择售后原因',
      icon: 'none'
    })
  }
  if (!desc.value) {
    cb(false)
    return uni.showToast({
      title: '请输入问题描述',
      icon: 'none'
    })
  }
  if (afterSaleType.code === 1) {
    if (uploadImgList[0].imgPath === '') {
      cb(false)
      return uni.showToast({
        title: '请上传最少一个附件',
        icon: 'none'
      })
    }
  }
  cb(true)
}

async function handleSubmit() {
  validate(async (valid: boolean) => {
    if (valid) {
      let ImgList: Array<AnyObject> = []
      uploadImgList.map((item: AnyObject) => {
        if (item.imgPath !== '') {
          ImgList.push(item.imgPath)
        }
      })
      try {
        const amounts = editAble.value
          ? [
              {
                orderItemId: id.value,
                amount: amount.value,
                pointAmount: pointAmount.value
              }
            ]
          : []
        const data = await toRefund({
          afterSaleType: afterSaleType.code,
          causeType: afterSaleReason.code,
          desc: desc.value.substring(0, 300),
          orderItemIdList: [id.value],
          fileUrlList: afterSaleType.code === 0 ? [] : ImgList, //
          orderId: orderId,
          amounts
        })
        uni.redirectTo({
          url: `/package-mine/pages/after-sale-succuss/index?id=${data[0]}&itemType=${itemType}&orderId=${orderId}`
        })
      } catch (error) {}
    }
  })
}

onLoad((option: { id?: string }) => {
  id.value = option.id || ''
  init()
})
</script>
<style lang="scss" scoped>
.apply-for-after-sale {
  padding: 0 40rpx calc(150rpx + env(safe-area-inset-bottom)) 40rpx;

  // height: 100vh;
  &-title {
    font-size: 56rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
  }

  &-foot {
    z-index: 99;
    border-top: 1rpx solid #e4e7ea;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 18rpx 40rpx;
    background: #fff;
    padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
    width: 100%;
    height: calc(120rpx + env(safe-area-inset-bottom));

    &-btn {
      width: 100%;
      height: 84rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #fff;
      line-height: 84rpx;
      background: #1a1a1a;
      text-align: center;
    }

    .disabled {
      background: #bababa;
    }
  }
}
</style>
