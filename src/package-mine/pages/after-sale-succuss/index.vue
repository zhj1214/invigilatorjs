<template>
  <view class="after-sale-succuss">
    <view class="wrap">
      <image class="icon" :src="successImg" />
      <view class="text">售后申请提交成功</view>
    </view>
    <view class="button-wrap">
      <view class="button-left" @click="goHome">返回首页</view>
      <view class="button-right" @click="goAfterSaleDetail">查看详情</view>
    </view>
    <view class="explain">
      <view class="explain-wrap">
        <view class="explain-tittle">温馨提示</view>
        <view class="explain-content">
          <view>
            <text>•</text>
            商品寄回地址将在审核通过后以短信形式告知，或在申请记录中查询
          </view>
          <view>
            <text>•</text>
            提交服务单后，售后专员可能与您电话沟通，请保持手机畅通
          </view>
          <view>
            <text>•</text>
            退货处理成功后退款金额将原路返回到您的支持账户中
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

let id = ref('')
let itemType = ref('')
let orderId = ref('')
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const successImg = gdp('icon-success.png')

function goHome() {
  if (itemType.value === '0') {
    uni.switchTab({
      url: '/pages/car/car'
    })
  } else {
    uni.switchTab({
      url: '/pages/life/life'
    })
  }
}

function goAfterSaleDetail() {
  uni.redirectTo({
    url: `/package-mine/pages/after-sale-detail/index?id=${id.value}`
  })
}

interface Option {
  id: string
  itemType: string
  orderId: string
}
type OnLoadOptionType<T> = Record<keyof T, string | undefined>
onLoad((option: OnLoadOptionType<Option>) => {
  id.value = option.id || ''
  itemType.value = option.itemType || ''
  orderId.value = option.orderId || ''
})
</script>
<style lang="scss" scoped>
.after-sale-succuss {
  .wrap {
    .icon {
      display: block;
      margin: 0 auto;
      margin-top: 200rpx;
      width: 164rpx;
      height: 164rpx;
    }

    .text {
      margin-top: 32rpx;
      font-size: 56rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #292c2e;
      line-height: 83rpx;
      text-align: center;
    }
  }

  .button-wrap {
    padding: 0 40rpx;
    height: 160rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 196rpx;

    .button-left {
      width: 306rpx;
      height: 84rpx;
      border: 2px solid #1a1a1a;
      background: #fff;
      border-radius: 1rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 80rpx;
      text-align: center;
    }

    .button-right {
      width: 306rpx;
      height: 84rpx;
      background: #1a1a1a;
      border-radius: 1rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #fff;
      line-height: 84rpx;
      text-align: center;
    }
  }

  .explain {
    padding: 56rpx 72rpx 60rpx 45rpx;

    .explain-wrap {
      display: flex;
      flex-direction: column;

      .explain-tittle {
        font-size: 26rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 38rpx;
        margin-bottom: 24rpx;
      }

      .explain-content {
        font-size: 24rpx;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #767676;

        > view {
          line-height: 36rpx;
          margin-bottom: 20rpx;
          padding-left: 20rpx;
          position: relative;

          text {
            display: inline-block;
            position: absolute;
            width: 20rpx;
            left: 0;
            color: #1a1a1a;
          }
        }
      }
    }
  }
}
</style>
