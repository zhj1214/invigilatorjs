import { request } from './request'

/**
 * https://yapi.public.supaur.top/project/2947/interface/api/258938
 *分页获取经销商列表
 * @param data object
 * @description cityCode 城市编码
 * @description pageNo 页码
 * @description pageSize 每页数量
 * @returns
 */
export const getDealerList: Dealer.GetDealer = (data) => {
  return request({
    url: '/web/dealers/',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 我的行程试驾单列表
export const getRecord = (data: { pageNo: number; pageSize: number }) => {
  return request({
    url: '/web/test-drive/consumer/record',
    method: 'GET',
    domain: 'LEAD',
    data
  })
}
/**
 *获取验证码
 * @param data object
 * @description mobile 手机号码
 * @returns
 */
export const getCode = (data: { mobile: number }) => {
  return request({
    url: '/web/test-drive/consumer/sms',
    method: 'GET',
    domain: 'LEAD',
    data
  })
}
// 获取车型车系
export const getSerial = () => {
  return request({
    url: '/web/test-drive/consumer/mall/serial',
    method: 'GET',
    domain: 'LEAD'
  })
}
// 获取经销商信息
export const getInstitution = (data: { cityCode: string }): Promise<Dealer.BizItem[]> => {
  return request({
    url: '/web/test-drive/consumer/org/institution',
    method: 'GET',
    domain: 'LEAD',
    data
  })
}
// 获取城市经纬度
export const getGps = (data: { cityCode: string }) => {
  return request({
    url: '/web/test-drive/consumer/org/district/gps',
    method: 'GET',
    domain: 'LEAD',
    data
  })
}

/**
 *
 *
 * 预约试乘试驾
 * @returns
 */
export const setReservation: TestDrive.SetReservation = (data) => {
  return request({
    url: '/web/test-drive/consumer/reservation',
    method: 'POST',
    domain: 'LEAD',
    data
  })
}
// 行程试驾单详情
export const getDetail: TestDrive.GetTestDrive = (id) => {
  return request({
    url: `/web/test-drive/consumer/${id}/detail`,
    method: 'GET',
    domain: 'LEAD'
  })
}

/**
 * https://yapi.public.supaur.top/project/2931/interface/api/253178
 * 获取车系
 * @returns
 */
export const getCarSeries: Car.GetCarSeries = () => {
  return request({
    url: '/web/car-assemblers/car-series',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * https://yapi.public.supaur.top/project/2931/interface/api/253186
 * 获取车型sku
 * @param data
 * @returns
 */
export const getCarSkus: Car.GetSkus = (data) => {
  return request({
    url: '/web/car-assemblers/vehicle-sku',
    method: 'GET',
    domain: 'MALL',
    data
  })
}
/**
 * 获取sku详情
 * @param data { skuId: number; optionalPackIds: string[] }
 * @returns
 */
export const getCarSkuDetail = (data: { skuId: string; optionalPackIds: string }) => {
  return request({
    url: '/web/car-assemblers/car-sku',
    method: 'GET',
    domain: 'MALL',
    data
  })
}
