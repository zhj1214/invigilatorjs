import { request } from './request'

/**
 * https://yapi.public.supaur.top/project/1796/interface/api/239680
 * 获取商品关联的可领取优惠券
 * @param itemId 商品id
 * @returns
 */
export const getGoodsCoupon: Coupon.GetGoodsCouponList = (goodsId) => {
  return request({
    url: `/api/v1/app/coupon/items/${goodsId}/user-receive-coupons`,
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * https://yapi.public.supaur.top/project/2920/interface/api/248050
 * 领取优惠券
 * @param {*} data
 * @returns
 */
export const receiveCoupon: Coupon.ReceiveCoupon = (data: Coupon.ReceiveParams) => {
  return request({
    url: `/api/v1/app/coupon/current-user/coupons`,
    method: 'POST',
    domain: 'MALL',
    data
  })
}

// 获取用户待使用的优惠券
export const getToUseCoupon = (data: AnyObject) => {
  return request({
    url: `/api/v1/app/coupon/current-user/to-use/coupons`,
    method: 'POST',
    data,
    domain: 'MALL'
  })
}
// 优惠券对应商品的商品列表
export const getGoodsList = (couponId: string, data: AnyObject) => {
  return request({
    url: `/web/items/coupons/${couponId}`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 获取卡券详情
export const getCardDetail = (couponAccountCode: string) => {
  return request({
    url: `/api/v1/app/coupon/current-user/coupons/${couponAccountCode}`,
    method: 'GET',
    domain: 'MALL'
  })
}
// 获取卡券列表
export const getCardList = (data: AnyObject) => {
  return request({
    url: '/api/v1/app/coupon/current-user/coupons',
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 用户的优惠券列表页
export const getUserCoupon = (data: AnyObject) => {
  return request({
    url: `/api/v1/app/coupon/current-user/discount-coupons`,
    method: 'GET',
    data,
    domain: 'MALL'
  })
}
