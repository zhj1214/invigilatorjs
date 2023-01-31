import { request } from './request'

/**
 * 加入购物车
 * @param data
 * @returns
 */
export const addGoodsToCart: Cart.AddCart = (data) => {
  return request({
    url: '/web/cart-items',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

/**
 * 获取购物车商品数量
 * @param data
 * @returns
 */
export const getCartGoodsNumber = () => {
  return request({
    url: '/web/cart-items/user/count',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 获取购物车商品列表
 * @returns
 */
export const getCartList = () => {
  return request({
    url: '/web/cart-items/user',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 批量删除购物车商品
 * @param ids
 * @returns
 */
export const removeGoods = (ids: string) => {
  return request({
    url: `/web/cart-items/batch?ids=${ids}`,
    method: 'DELETE',
    domain: 'MALL'
  })
}

/**
 * 修改购物车商品sku信息
 * @param data
 * @returns
 */
export const changeGoodsInfo = (data: AnyObject) => {
  return request({
    url: '/web/cart-items',
    method: 'PUT',
    domain: 'MALL',
    data
  })
}
/**
 * 修改购物车商品数量
 * @param data
 * @returns
 */
export const changeGoodsNumber = (data: AnyObject) => {
  return request({
    url: '/web/cart-items/quantity',
    method: 'PUT',
    domain: 'MALL',
    data
  })
}
