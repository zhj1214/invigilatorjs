import { request } from './request'

/**
 * https://yapi.public.supaur.top/project/2931/interface/api/253146
 * 查询商品的前台根类目(商品分类)
 * @returns
 */
export const getCategoryRoot: Goods.GetFrontCategory = () => {
  return request({
    url: '/web/front-categories/root',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * https://yapi.public.supaur.top/project/2931/interface/api/253050
 * 根据前台类目id、终端类型查询商品
 * @param data
 * @returns
 */
export const getCategoryItems: Goods.GetCategoryItems = (frontCategoryId: string) => {
  return request({
    url: `/web/items/front-category/${frontCategoryId}`,
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * https://yapi.public.supaur.top/project/2931/interface/api/253122
 * 获取商品详情
 * @param {*} params
 * @returns
 */
export const getGoodsDetail: Goods.GetGoodsDetail = (itemId) => {
  return request({
    url: `/web/items/${itemId}/detail`,
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * https://yapi.public.supaur.top/project/2920/interface/api/247522
 * 获取商品相关的额外信息
 * @param params
 * @returns
 */
export const getGoodsExtraInfo = (params: { itemId: number }) => {
  return request({
    url: `/web/items/${params.itemId}/detail`,
    method: 'GET',
    domain: 'MALL'
  })
}
interface ConsumerPlacesAPI {
  brandId?: string | number // 品牌id
  pageNo?: number
  pageSize?: number
}
/**
 * https://yapi.public.supaur.top/project/2920/interface/api/247906
 * 门店列表
 * @param params
 * @returns
 */

export const getConsumerPlaces = (params: ConsumerPlacesAPI) => {
  return request({
    url: '/web/retail-stores',
    method: 'GET',
    data: params,
    domain: 'MALL'
  })
}

// 获取积分比例
export const getPointRatio: Goods.GetPointRatio = () => {
  return request({
    url: '/web/point/ratio',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 接口目前无法使用，轮播图用的固定链接，等后续安排
 * 获取轮播图
 * @param code 值为B端轮播图的编码
 * @returns
 */
export const getBannerList = (code = 'Kvlunbo1') => {
  return request({
    url: `/web/app/carousel/${code}`,
    method: 'GET',
    domain: 'MALL'
  })
}
// 获取当前用户默认运费收货地址（商品详情页）
export const getDefaultAddress = () => {
  return request({
    url: `/web/delivery-addresses/ship/default`,
    method: 'GET',
    domain: 'MALL'
  })
}
// 根据城市和运费模板获取运费规则
export const getShippingRule = (data: { cityCode: string; shipTemplateId: string }) => {
  return request({
    url: `/web/shipping-rule?cityCode=${data.cityCode}&shipTemplateId=${data.shipTemplateId}`,
    method: 'GET',
    domain: 'MALL'
  })
}
