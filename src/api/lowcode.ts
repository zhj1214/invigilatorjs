import { request } from './request'

// 获取页面配置信息
export const getPageConfig = (data: { position: 'home_page_boutique' }) => {
  return request({
    url: '/web/design/pages/position',
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 根据id获取商品列表
export const getGoodsList = (data: { relateIds: string[]; type: number }) => {
  return request({
    url: '/web/design/relate_item',
    method: 'POST',
    domain: 'MALL',
    data
  })
}
