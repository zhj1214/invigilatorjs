import { addOrder, getOrderPreviewDetail } from '@api/order'
import { getBusinessId } from '@src/api/pay'
import { reactive, ref } from 'vue'

// 生成商品属性
export function toGeneratorSkuAttr(skuAttr: Goods.Attribute[]) {
  return skuAttr
    ? skuAttr.reduce((str, next, index, arr) => {
        return str + (index === arr.length - 1 ? next.attrVal : `${next.attrVal}/`)
      }, '')
    : ''
}

export function useOrder() {
  // 预订单详情
  const orderDetail = reactive({}) as Order.PreviewOrderInfo
  // 交易id
  const businessId = ref('')
  /**
   * 创建订单
   * @param data
   */
  async function createOrder(data: Order.CreateOrderParams) {
    uni.showLoading({
      mask: true,
      title: '正在提交订单'
    })
    try {
      const orderId = await addOrder(data)
      uni.hideLoading()
      uni.showToast({
        icon: 'none',
        title: '订单提交成功'
      })
      // 跳转支付页面
      uni.redirectTo({
        url: '/package-life/pages/payment/index?type=1&orderId=' + orderId
      })
    } catch (error) {
      uni.hideLoading()
    }
  }

  // 获取交易编码
  async function getBisId() {
    businessId.value = await getBusinessId()
  }

  // 获取缓存的用于预览的订单
  async function refreshPreviewDetail() {
    Object.assign(orderDetail, await getOrderPreviewDetail())
  }

  return {
    orderDetail,
    businessId,
    getBisId,
    refreshPreviewDetail,
    createOrder
  }
}
