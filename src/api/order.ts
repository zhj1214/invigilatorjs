import { request } from './request'

/**
 * 创建订单预览缓存
 * @param data
 * @returns
 */
export const toCreatePreviewOrder: Order.CreateOrderPreview = (data) => {
  return request({
    url: '/web/orders/preview',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

/**
 * 获取缓存的用于预览的订单详情
 */
export const getOrderPreviewDetail = () => {
  return request({
    url: '/web/orders/preview',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 创建订单
 * @param data
 * @returns
 */
export const addOrder: Order.CreateOrder = (data) => {
  return request({
    url: '/web/orders/place',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

/**
 * 获取订单详情
 * @param orderId
 * @returns
 */
export const getOrderInfo: Order.GetOrderDetail = (orderId: string) => {
  return request({
    url: `/web/orders/${orderId}/detail`,
    method: 'GET',
    domain: 'MALL'
  })
}

// c端获取用户订单列表接口
export const getOrderList: Order.GetOrderList = (data: unknown) => {
  return request({
    url: '/web/orders/user',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

// 用户取消订单
export const cancelOrder: Order.CanceOrder = (orderId) => {
  return request({
    url: `/web/orders/${orderId}/cancel`,
    method: 'PUT',
    domain: 'MALL'
  })
}

// 查询物流信息
export const getTrackInfo: Order.GetTrackInfo = (data) => {
  return request({
    url: '/web/logistics',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 批量查询物流信息
export const getOrderLogisticsList = (data: AnyObject) => {
  return request({
    url: '/web/logistics/batch',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

// 用户确认收货
export const getArriveOrder: Order.ArriveOrder = (orderId) => {
  return request({
    url: `/web/orders/${orderId}/arrive`,
    method: 'PUT',
    domain: 'MALL'
  })
}
