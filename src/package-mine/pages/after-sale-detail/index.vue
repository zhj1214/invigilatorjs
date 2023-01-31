<template>
  <view class="after-sale-detail">
    <after-sale-detail-life
      v-if="orderItemDto.itemType === '1' || orderItemDto.itemType === '2'"
      :after-sale-info="afterSaleInfo"
      :options="options"
      :active="active"
      :seconds="seconds"
    />
    <after-sale-detail-car v-if="orderItemDto.itemType === '0'" :after-sale-info="afterSaleInfo" :seconds="seconds" :active="active" :options="options" />
    <template v-if="afterSaleInfo.type === 1 && afterSaleInfo.status === 5">
      <view class="after-sale-detail-info">
        <view class="title">商家收货信息</view>
        <view>
          <text>联系人:</text>
          <text>{{ getSellerAddress[1] }}</text>
        </view>
        <view>
          <text>手机号码:</text>
          <view>
            <text id="phone">{{ getSellerAddress[2] }}</text>
            <text class="copy" @tap="setClipboardData(getSellerAddress.join(' '))">复制</text>
          </view>
        </view>
        <view>
          <text class="label">收货地址:</text>
          <text>{{ getSellerAddress[0] }}</text>
        </view>
      </view>
      <view class="after-sale-detail-return">
        <view class="title">我已退货</view>
        <after-sale-return :after-sale-id="afterSaleId" @get-detail="getDetail" />
      </view>
    </template>

    <!-- 退款相关信息 -->
    <refund-info-list :after-sale-info="afterSaleInfo" :order-item-dto="orderItemDto" :after-sale-id="afterSaleId" :file-id-list="fileIdList" />

    <view v-if="afterSaleInfo.status === 8 || isShow" class="after-sale-detail-foot">
      <view v-if="afterSaleInfo.status === 8" class="btn" @click="toBackApply">撤销申请</view>
      <view v-if="isShow" class="btn" @click="goApplyFor">重新申请售后</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { setAfterRefundCancel } from '@api/after-sale'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import refundInfoList from './refund-info.vue'
import afterSaleDetailLife from './after-sale-detail-life.vue'
import afterSaleDetailCar from './after-sale-detail-car.vue'
import afterSaleReturn from './after-sale-return.vue'
import useDetail from './detail'

const afterSaleStore = useAfterSaleStore()

const { afterSaleId, seconds, afterSaleInfo, orderItemDto, fileIdList, options, getDetail } = useDetail()

onLoad((option: { id?: string }) => {
  afterSaleId.value = option.id as string
})

onShow(() => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 50
  })
  getDetail()
})

// 暂时处理，1230版本后端优化会返回json字符串
let getSellerAddress = computed(() => {
  const { sellerAddress } = afterSaleInfo
  return sellerAddress.split(sellerAddress.indexOf('  ') > -1 ? '  ' : ' ')
})

const active = computed(() => {
  const { type, status } = afterSaleInfo
  let activeObj: AnyObject = {
    8: 1,
    3: type === 0 ? 2 : 4,
    5: 2,
    6: 3,
    4: type === 0 ? 4 : 6,
    7: 1.1,
    [-1]: 1.1
  }
  return activeObj[status]
})

const isShow = computed(() => {
  const { itemType, status } = orderItemDto.value
  return (itemType === '0' && status === 64) || (itemType === '1' && [2, 3, 88].includes(status)) || (itemType === '2' && [2, 88].includes(status))
})

function setClipboardData(str: string) {
  // #ifdef H5
  let oInput = document.createElement('textarea')
  oInput.value = str
  document.body.appendChild(oInput)
  oInput.select() // 选择对象;
  document.execCommand('Copy') // 执行浏览器复制命令
  oInput.remove()
  uni.showToast({
    title: '复制成功',
    duration: 1000
  })
  // #endif
  // #ifdef MP-WEIXIN
  uni.setClipboardData({
    data: str,
    success: function () {
      uni.showToast({
        title: '复制成功',
        duration: 1000
      })
    }
  })
  // #endif
}

/**
 * @description: 撤销申请
 * @Date: 2021-12-09 11:26:23
 * @param {*}
 * @return {*}
 */
function toBackApply() {
  uni.showModal({
    title: '提示',
    cancelText: '取消',
    confirmText: '确认',
    content: '您确认撤销售后单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await setAfterRefundCancel(afterSaleId.value)
          getDetail()
        } catch (error) {}
      }
    }
  })
}

/**
 * @description: 重新申请售后
 * @Date: 2021-12-09 11:26:07
 * @param {*}
 * @return {*}
 */
function goApplyFor() {
  const { status, orderId, itemType, id } = orderItemDto.value
  let obj = {
    status: status,
    orderId: orderId,
    itemType: itemType
  }
  afterSaleStore.setParams(obj)
  uni.navigateTo({
    url: `/package-mine/pages/apply-for-after-sale/index?id=${id}`
  })
}
</script>
<style lang="scss" scoped>
.after-sale-detail {
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  &-info {
    > view {
      display: flex;
      justify-content: space-between;
      padding: 10rpx 0;
    }
    padding: 0 40rpx;
    .title {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      margin: 31rpx 0 11rpx;
    }
    .copy {
      margin-left: 16rpx;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #4e6175;
      line-height: 45rpx;
      text-decoration: underline;
    }
  }

  &-line {
    border-bottom: 1rpx solid #e4e7ea;
  }

  &-return {
    padding: 0 40rpx;

    .title {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      margin: 31rpx 0 11rpx;
    }
  }

  &-foot {
    border-top: 1rpx solid #e4e7ea;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 18rpx 40rpx;
    background: #fff;
    padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
    width: 100%;
    height: calc(120rpx + env(safe-area-inset-bottom));

    .btn {
      border: 2rpx solid #1a1a1a;
      width: 100%;
      height: 84rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 84rpx;
      text-align: center;
    }
  }
}
</style>
