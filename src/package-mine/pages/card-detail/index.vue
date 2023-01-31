<template>
  <view v-if="cardDetailInfo" class="detail-content">
    <view class="card-detail">
      <view class="card-detail-top">
        <view class="card-detail-top-info">
          <view class="card-detail-top-info-names">
            <view class="card-detail-top-info-names-name">{{ cardDetailInfo.name }}</view>
          </view>
          <view v-if="cardDetailInfo.validEndDate" class="card-detail-top-info-time">
            {{ formatDate(cardDetailInfo.validBeginDate) }}-{{ formatDate(cardDetailInfo.validEndDate) }}
          </view>
          <view v-else class="card-detail-top-info-time">永久有效</view>
        </view>
      </view>
      <view class="line" />
      <view class="card-detail-bottom">
        <view class="card-detail-bottom-info">
          <view class="card-detail-bottom-info-left">
            <view class="card-detail-bottom-info-left-number">
              卡号
              <view class="number">{{ cardDetailInfo.code }}</view>
            </view>
            <view v-if="cardDetailInfo.password" class="card-detail-bottom-info-left-number">
              卡密
              <view class="number">{{ cardDetailInfo.password }}</view>
            </view>
          </view>
          <view class="card-detail-bottom-info-right" @click="toCopyCard(cardDetailInfo.code, cardDetailInfo.password)">复制</view>
        </view>
      </view>
      <view v-show="cardDetailInfo.qrCodeUrl" class="card-detail-box" :style="{ opacity: cardDetailInfo.status !== 1 ? 0.4 : 1 }">
        <image class="card-detail-box-img" :src="cardDetailInfo.qrCodeUrl" mode="aspectFit" />
      </view>
      <view class="card-detail-icon">
        <image class="card-detail-icon-img" :src="imgUrl[cardDetailInfo.status]" mode="aspectFit" />
      </view>
    </view>
    <view class="card-info">
      <view class="card-info-title">卡券信息</view>
      <view class="card-info-detail">
        <view class="card-info-detail-channel">核销渠道：{{ cardDetailInfo.remark || '' }}</view>
        <view class="card-info-detail-time">领取时间：{{ formatDate(cardDetailInfo.receiveTime) }}</view>
      </view>
    </view>
    <view class="card-info">
      <view class="card-info-title">使用规则</view>
      <view class="card-info-detail">
        <view v-for="(item, index) in cardDetailInfo.desc" :key="index" class="card-info-detail-desc">{{ item ? item : '' }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { getCardDetail } from '@api/card'
import { formatDate } from '@util/date-time'
import { pureAssign } from '@src/util/common'
import { onLoad } from '@dcloudio/uni-app'

interface CardDetaiInfo {
  qrCodeUrl: string | null // 二维码
  name: string
  status: number //状态
  validEndDate: string // 结束时间
  validBeginDate: string // 开始时间
  code: string // 卡号
  password: string // 卡密
  remark: string // 核销渠道
  receiveTime: string // 领取时间
  desc: string[] // 使用规则
}

const cardDetailInfo: CardDetaiInfo = reactive({
  qrCodeUrl: '', // 二维码
  name: '',
  status: 0, //状态
  validEndDate: '', // 结束时间
  validBeginDate: '', // 开始时间
  code: '', // 卡号
  password: '', // 卡密
  remark: '', // 核销渠道
  receiveTime: '', // 领取时间
  desc: [''] // 使用规则
})
const couponAccountCode = ref('')
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const cardUsed = gdp('card-used.png')
const cardExpired = gdp('card-expired.png')
const cardInvalid = gdp('card-invalid.png')
const imgUrl: AnyObject = {
  '3': cardUsed,
  '4': cardExpired,
  '5': cardInvalid,
  '6': cardInvalid
}

onLoad((option: { id?: string }) => {
  couponAccountCode.value = option.id || ''
  getCardDetailInfo()
})

// 复制
function toCopyCard(code: string, password: string) {
  let data = ''
  if (!password) {
    data = '卡号：' + code
  } else {
    data = `卡号: ${code}\n卡密: ${password}`
  }
  // #ifdef H5
  const textarea = document.createElement('textarea')
  textarea.value = data
  textarea.readOnly = true
  document.body.appendChild(textarea)
  textarea.select() // 选中文本内容
  textarea.setSelectionRange(0, data.length) // 设置选定区的开始和结束点
  uni.showToast({
    icon: 'none',
    title: '内容已复制'
  })
  textarea.remove()
  // #endif
  // #ifdef MP-WEIXIN
  uni.setClipboardData({
    data,
    success: () => {
      uni.hideToast() // 取消小程序平台自动弹出的轻提示
      uni.getClipboardData({
        success: () => {
          uni.showToast({
            icon: 'none',
            title: '内容已复制'
          })
        }
      })
    }
  })
  // #endif
}
// cardDetailInfo.data.qrCodeUrl = null
async function getCardDetailInfo() {
  try {
    const res = (await getCardDetail(couponAccountCode.value)) as AnyObject
    const desc = (res.desc && res.desc.replace(/(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))/g, '~').split('~')) || []
    const newDesc = desc.filter((i: string) => i && i.trim())
    res.desc = newDesc
    pureAssign(cardDetailInfo, res)
  } catch (err) {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
.detail-content {
  margin-top: 24rpx;
  padding: 0 40rpx;

  .card-detail {
    position: relative;
    background: #fff;
    box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 17%);
    border: 1rpx solid #e4e7ea;
    overflow: hidden;

    &-icon {
      width: 148rpx;
      height: 148rpx;
      position: absolute;
      top: 0;
      right: 0;

      &-img {
        width: 100%;
        height: 100%;
      }
    }

    &-top {
      padding: 42rpx 40rpx 18rpx;
      width: 100%;
      height: 308rpx;
      display: flex;
      justify-content: space-between;

      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &-names {
          display: flex;

          &-name {
            width: 410rpx;
            height: 104rpx;
            font-size: 38rpx;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 52rpx;
          }
        }

        &-time {
          height: 41rpx;
          font-size: 28rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
          line-height: 41rpx;
        }
      }
    }

    .quan1 {
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      transform: translate(-12rpx, 14rpx);
      background-color: #e4e7ea;
    }

    .line {
      width: 646rpx;
      height: 1rpx;
      margin: auto;
      border: 1rpx dashed #e4e7ea;
    }

    .quan2 {
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      transform: translate(654rpx, -14rpx);
      background-color: #e4e7ea;
    }

    &-bottom {
      padding: 40rpx 40rpx 48rpx;
      height: 197rpx;

      &-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-left {
          &-number {
            display: flex;
            align-items: center;
            font-size: 28rpx;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            color: #4e6175;
            line-height: 41rpx;

            .number {
              margin-left: 13rpx;
              font-size: 32rpx;
              font-family: SourceHanSansSC-Bold, SourceHanSansSC;
              font-weight: bold;
              color: #4e6175;
              line-height: 47rpx;
            }
          }
        }

        &-right {
          width: 120rpx;
          height: 64rpx;
          border-radius: 1rpx;
          border: 2rpx solid #909ca8;
          font-size: 24rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          color: #4e6175;
          text-align: center;
          padding: 13rpx 0;
          line-height: 38rpx;
        }
      }
    }

    &-box {
      width: 370rpx;
      height: 370rpx;
      margin: 0 auto 72rpx;

      &-img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .card-info {
    margin-top: 64rpx;

    &-title {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      line-height: 54rpx;
    }

    &-detail {
      margin-top: 35rpx;
      font-size: 28rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      color: #696b6c;
      line-height: 41rpx;

      &-desc {
        margin-top: 12rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #696b6c;
        line-height: 38rpx;

        &:last-child {
          margin-bottom: 208rpx;
        }
      }
    }
  }
}
</style>
