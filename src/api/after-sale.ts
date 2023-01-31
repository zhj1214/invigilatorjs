import { request, uploadRequest } from './request'

// 售后申请列表
export const getOrderList: AfterSale.GetOrderList = (data) => {
  return request({
    url: '/web/after-sales',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 售后单取消
export const setAfterRefundCancel: AfterSale.Cancel = (afterSaleId) => {
  return request({
    url: `/web/after-sales/${afterSaleId}/cancel`,
    method: 'PUT',
    domain: 'MALL'
  })
}

// 售后原因
export const getCauses: AfterSale.GetCauses = (data) => {
  return request({
    url: '/web/after-sales/causes',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 申请售后上传附件
export const setFileUpload: AfterSale.UploadFile = (data) => {
  return uploadRequest({
    url: '/web/files/upload',
    domain: 'MALL',
    data
  })
}

// 订单买家发起退款/退货退款申请
export const toRefund: AfterSale.ApplyAfterSale = (data) => {
  return request({
    url: '/web/after-sales/apply',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

// 订单售后单详情
export const getAfterSaleDetail: AfterSale.GetDetail = (afterSaleId) => {
  return request({
    url: `/web/after-sales/${afterSaleId}`,
    method: 'GET',
    domain: 'MALL'
  })
}

// 获取物流公司
export const getExpressCompanies: AfterSale.GetExpressCompanies = (data) => {
  return request({
    url: '/web/logistics/express-companies',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 售后单确认发货
export const checkAfterRefundDeliver: AfterSale.ConfirmShipment = (id: string, data) => {
  return request({
    url: `/web/after-sales/${id}/deliver`,
    method: 'PUT',
    domain: 'MALL',
    data
  })
}
