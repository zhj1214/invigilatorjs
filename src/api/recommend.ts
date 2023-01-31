import { request } from './request'

/**
 * 分页查询推荐商品 生活及商品详情
 * @param params
 * @returns
 * @yapi https://yapi.public.supaur.top/project/2931/interface/api/253074
 */
export const getRecommendAtGoods: Goods.GetRecommendItems = (params) => {
  // return request({
  //   url: '/api/v1/app/item/items/recommendation/page',
  //   method: 'GET',
  //   data: params,
  //   domain: 'MALL'
  // })
  return {}
}
/**
 * @property excludeFontCategoryId 前台类目id,后端去重需要
 * @property excludeItemIds 商品id
 */
interface RecommendationAtGoodsOption {
  pageNo?: number
  pageSize?: number
  recType?: number
  recItemTypes: string | number[]
  excludeFontCategoryId?: number
  excludeItemIds?: number
  terminal?: number
  orderId?: string
  orderIds?: (string | number)[]
  orderItemIds?: (string | number)[]
}
/**
 * 分页查询推荐商品 支付成功
 * @param params
 * @param data RecommendationAtGoodsOption
 * @returns
 */
export const getPageForParentOrder = (params: { pageNo: number; pageSize: number }, data: RecommendationAtGoodsOption): Promise<PageListInfo<Goods.Item>> => {
  return request({
    url: `/api/v1/app/item/items/recommendation/pageForParentOrder?pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
    method: 'POST',
    data,
    domain: 'MALL'
  })
}

// 分页查询推荐商品 订单列表
export const getPageForOrderList = (params: { pageNo: number; pageSize: number }, data: RecommendationAtGoodsOption) => {
  return request({
    url: `/api/v1/app/item/items/recommendation/pageForOrder?pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
    method: 'POST',
    data,
    domain: 'MALL'
  })
}

// 分页查询推荐商品 订单详情
export const getPageForOrderItem = (params: { pageNo: number; pageSize: number }, data: RecommendationAtGoodsOption) => {
  return request({
    url: `/api/v1/app/item/items/recommendation/pageForOrderItem?pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
    method: 'POST',
    data,
    domain: 'MALL'
  })
}

/**
 * 获取搜索推荐词
 * @param keyword
 * @returns
 */
export const getAssociateWord = (keyword: string): Promise<string[]> => {
  return request({
    url: '/web/search/item-associate-word',
    method: 'GET',
    domain: 'MALL',
    data: { keyword }
  })
}

/**
 * 商品搜索
 */
interface GoodsSearchParams {
  keyword: string
  pageNo: number
  pageSize: number
  sortKey?: string | null
  sortType?: number | null
}
export const getSearchGoodsList = (data: GoodsSearchParams) => {
  return request({
    url: '/web/search/search-item',
    method: 'GET',
    data,
    domain: 'MALL'
  })
}

/**
 * 搜索推荐
 */
export const getSearchRecommendList = (data: { listSize: number }) => {
  return request({
    url: '/web/search/item-hot-search-word',
    method: 'GET',
    data,
    domain: 'MALL'
  })
}
