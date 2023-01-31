import { request } from './request'

/**
 * 获取交易编码
 * @returns
 */
export const getBusinessId = () => {
  return request({
    url: '/web/orders/business-id',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 用户支付
 * @param data
 * @returns
 */
export const getPayOrder: Order.PayOrder = (data) => {
  return request({
    url: `/web/orders/${data.orderId}/pay`,
    method: 'POST',
    domain: 'MALL',
    data
  })
}
