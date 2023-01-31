import { Enum } from '@src/lib/enmu'

/**
 * @description 标准货币格式化方法
 * @param {String,Number} s 金额
 * @param {Number} n 保留位数 默认2
 * @param {Number} u 金额单位 默认2
 * @returns
 */
export function formatMoney(s: string | number, n?: number, u?: number) {
  const str = (Number(s) / Math.pow(10, !u && u !== 0 ? 2 : u)).toFixed(n || 2).toString()
  const indexD = str.indexOf('.')
  // 取到整数部分
  const intSum = (indexD > -1 ? str.substring(0, indexD) : str).replace(/\B(?=(?:\d{3})+$)/g, ',')
  // 取到小数部分搜索
  const dot = indexD > -1 ? str.substring(str.length, indexD) : ''
  return intSum + dot
}
/**
 * @property activityStatus 活动状态
 * @property activityPrice 活动价格
 */
interface ActivityInfoForFormatPrice {
  activityStatus: number
  activityPrice: number
}
/**
 *统一的商品价格格式化
 * @param goods 商品信息
 * @returns
 */
/**
 * @property payType 支付类型
 * @property price 商品现金价格
 * @property pointPrice 商品积分价格
 * @property pointRatio 现金积分兑换比例
 * @property maxPointPrice 自由组合中最大积分额度
 * @property activityInfo 活动信息
 */
interface GoodsInfoForFormatPrice {
  payType: number
  price: number
  pointPrice: number
  pointRatio: number
  maxPointPrice: number
  activityInfo: ActivityInfoForFormatPrice | null
}

/**
 * @property fee 计算后现金价格
 * @property point 计算后积分
 * @property originFee 原始现金价格
 * @property originPoint 原始积分
 */
export interface FormatedPriceInfo {
  fee: number
  point: number
  originFee: number
  originPoint: number
  activityFee?: number
  activityPoint?: number
}
export const formatPrice = (goods: GoodsInfoForFormatPrice): FormatedPriceInfo => {
  let fee = 0
  let point = 0
  let originFee = 0
  let originPoint = 0
  const { payType, price, pointPrice, pointRatio, maxPointPrice } = goods
  const { activityStatus, activityPrice } = goods.activityInfo || {}
  originFee = Number(price) / 100
  const activityFee = Number(activityPrice) / 100
  let activityPoint = 0

  const isActivityGoing = activityStatus === Enum.Activity.Status.IsGoing
  // 纯现金
  if (payType === Enum.Pay.Type.Cash) {
    fee = isActivityGoing ? Number(activityPrice) / 100 : price / 100
  }
  // 纯积分
  if (payType === Enum.Pay.Type.Point) {
    point = pointPrice / pointRatio
  }
  // 定额积分+现金
  if (payType === Enum.Pay.Type.PartialMixing) {
    fee = isActivityGoing ? Number(activityPrice) / 100 : price / 100
    point = pointPrice / pointRatio
  }
  // 自由组合
  if (payType === Enum.Pay.Type.FreeMixing) {
    fee = activityStatus === 1 ? Number(activityPrice) / 100 : price / 100
    if (maxPointPrice > 0) {
      point = isActivityGoing ? Number(activityPrice) / pointRatio : price / pointRatio
    }
    originPoint = maxPointPrice / pointRatio
    activityPoint = Number(activityPrice) / pointRatio
  }
  return {
    fee,
    point,
    originFee,
    originPoint,
    activityFee,
    activityPoint
  }
}
