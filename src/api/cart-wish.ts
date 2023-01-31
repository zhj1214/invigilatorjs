import { request } from './request'

// c端获取用户心愿单列表接口
export const getCartWishList = () => {
  return request({
    url: '/web/favorite-items/user',
    method: 'GET',
    domain: 'MALL'
  })
}
// 根据id删除心愿单
export const deleteCartWish = (id: string) => {
  return request({
    url: `/web/favorite-items/${id}`,
    method: 'DELETE',
    domain: 'MALL'
  })
}
interface AddWishParams {
  itemId: number
  itemName: string
  skuId: number
  // isCheckout: number
  preSaleFlag: boolean
  showPriceFlag: boolean
  extra: {
    modelName: string
    optionalPackIds: string[] | number[]
    carPoster: string
    totalPrice: number
    saleAttrs: string[]
  }
}

// 创建心愿单项
export const addCartWish = (data: AddWishParams) => {
  return request({
    url: '/web/favorite-items',
    method: 'POST',
    data,
    domain: 'MALL'
  })
}
