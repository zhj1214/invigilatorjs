import { defineStore } from 'pinia'
import { getGeneratorDynamicPic } from '@util/oss'
import { isInWechat } from '@src/util/common'
import { getPayOrder } from '@api/pay'

interface PayTypeInfo {
  value: string
  text: string
  icon: string
  agencyCode: string
  channelCode: string
}

const payTypeList: PayTypeInfo[] = [
  {
    value: 'wechat',
    text: '微信支付',
    icon: getGeneratorDynamicPic('icon-wechat.png') as string,
    agencyCode: '02',
    channelCode: '07'
  }
]

// #ifdef H5
if (!isInWechat) {
  payTypeList.push({
    value: 'alipay',
    text: '支付宝支付',
    icon: getGeneratorDynamicPic('icon-alipay.png') as string,
    agencyCode: '01',
    channelCode: '15'
  })
}
// #endif

export const usePayStore = defineStore({
  id: 'pay',
  state: () => {
    return {}
  },
  actions: {
    pay(type: 'wechat' | 'alipay', orderId: string) {
      let payPromise: Promise<AnyObject | ''>
      // #ifdef H5
      payPromise = this.payH5(type, orderId)
      // #endif
      // #ifdef MP-WEIXIN
      payPromise = this.payWechat(orderId)
      // #endif
      return payPromise
    },
    payH5(type: 'wechat' | 'alipay', orderId: string): Promise<AnyObject | ''> {
      const payTypeInfo = payTypeList.find((item) => item.value === type) as PayTypeInfo
      return new Promise(async (resolve, reject) => {
        try {
          const payOrder = (await getPayOrder({
            orderId,
            agencyCode: payTypeInfo.agencyCode,
            channelCode: payTypeInfo.channelCode,
            vmId: 1
          })) as AnyObject
          if (payOrder) {
            resolve(payOrder)
          } else {
            resolve('')
          }
        } catch (error) {
          reject()
        }
      })
    },
    // #ifdef MP-WEIXIN
    async payWechat(orderId: string): Promise<AnyObject | ''> {
      return new Promise((resolve, reject) => {
        // 支付前先静默登录再调用支付接口
        uni.login({
          success: async (res) => {
            const code = res.code
            try {
              const payOrder = (await getPayOrder({
                orderId,
                agencyCode: '02',
                channelCode: '08',
                vmId: 1,
                code
              })) as AnyObject
              if (payOrder) {
                uni.requestPayment({
                  provider: 'wxpay',
                  orderInfo: '',
                  timeStamp: payOrder.timeStamp,
                  nonceStr: payOrder.nonceStr,
                  package: payOrder.package,
                  signType: payOrder.signType,
                  paySign: payOrder.paySign,
                  success: () => {
                    resolve(payOrder)
                  },
                  fail: () => {
                    reject()
                  }
                })
              } else {
                resolve('')
              }
            } catch (error) {
              reject()
            }
          }
        })
      })
    }
    // #endif
  }
})
