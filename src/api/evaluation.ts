import { request, uploadRequest } from './request'
interface Params {
  pageNo: number
  pageSize: number
}
// 获取更多评价信息
export const getMoreEvaluationList = (data: unknown) => {
  return request({
    url: `/web/evaluations/paging`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 发表评价
export const toEvaluationPublished = (data: unknown) => {
  return request({
    url: '/web/evaluations/publish',
    method: 'POST',
    domain: 'MALL',
    data
  })
}
// 订单评价图片上传
export const toFileUpload = (data: Request.UploadFileDataOptions) => {
  return uploadRequest({
    url: '/web/files/evaluation/upload',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

/**
 *
 * @desc 获取OSS上传需要的参数
 */
export const getOSSSTS = () => {
  return request({
    domain: 'MALL',
    url: '/web/files/sts',
    method: 'GET'
  })
}

/**
 *
 * @desc 获取OSS上传需要的参数
 */
export const getOSSSTSH5 = () => {
  return request({
    domain: 'MALL',
    url: '/web/files/sts-h5',
    method: 'GET'
  })
}

// // 获取商品基础评价信息
// const getProductAssess = id => {
//   return request({
//     url: `/web/app/assesses/base-item/${id}`,
//     method: 'get',
//     domain: 'MALL',
//     noTenantId: true
//   })
// }

// 分页获取商品评价
// export const getProductAssessList = (data: unknown) => {
//   return request({
//     url: `/web/mall/assess/item/page`,
//     method: 'GET',
//     domain: 'MALL',
//     data
//   })
// }

// 评价-我的评价
export const getEvaluatedList = (data: unknown) => {
  return request({
    url: `/web/evaluations/user/paging`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 获取评价详细信息
export const getEvaluatedDetail = (id: string) => {
  return request({
    url: `/web/evaluations/${id}/detail`,
    method: 'GET',
    domain: 'MALL'
  })
}
// 获取评价数量
export const getEvaluationNum = (data: unknown) => {
  return request({
    url: `/web/evaluations/item/statistics`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}

// 查询用户默认评价数(生活)
export const getEvaDefaultNum = (id: string) => {
  return request({
    url: `/web/evaluations/item/${id}/default/count`,
    method: 'GET',
    domain: 'MALL'
  })
}

// 查询用户默认评价数(整车)
export const getEvaDefaulCartNum = (id: string) => {
  return request({
    url: `/web/evaluations/car/${id}/default/count`,
    method: 'GET',
    domain: 'MALL'
  })
}
// 商品详情页最新两条评价
export const getItemTwoEva = (itemId: string) => {
  return request({
    url: `/web/evaluations/item/${itemId}`,
    method: 'GET',
    domain: 'MALL'
  })
}
