declare namespace Coupon {
  /**
   * @property balance 剩余数量
   * @property worth 面额（现金券）
   * @property threshold 使用门槛（单位-分）
   * @property applicability 适用范围
   * @property applicabilityType 适用范围类型(-1: 全场通用，0:品牌，1:类目，2商品)
   * @property validityTimeType 有效期类型(1-固定期,2-领券后时间段)
   * @property validityStartTime 有效开始时间（validityTimeType为1时有效）
   * @property validityEndTime 有效结束时间（validityTimeType为1时有效）
   * @property validityTime 有效时长（validityTimeType为2时有效）
   * @property validityUnit 有效时长单位（1-日，2-月）（validityTimeType为2时有效）
   */
  interface Item {
    id: number
    code: string
    name: string
    couponId: string
    balance: number
    worth: number
    status: number
    threshold: number
    couponAccountCode: string
    couponName: string
    description: string
    effectiveStartTime: number
    effectiveEndTime: number
    applicability: string
    applicabilityType: number
    validEndDate: string
    validBeginDate: string
    validityTimeType: number
    validityStartTime: string
    validityEndTime: string
    validityUnit: number
    validityTime: number
  }

  interface PickerInfo {
    availableLength: number
    availableList: Item[]
    unavailableList: Item[]
  }

  /**
   * 获取商品关联的可领取优惠券
   * @param itemId 商品id
   */
  type GetGoodsCouponList = (itemId: number | string) => Promise<Item[]>

  interface ReceiveParams {
    businessDataName: string
    businessDataId: string | number
    couponList: { couponId: number; number: number }[]
  }

  /**
   * 批量领取卡券
   */
  type ReceiveCoupon = (params: ReceiveParams) => Promise<string[]>
}

/**
 * 卡券信息
 */
interface CouponInfo {
  couponId: string
  couponAccountCode: string
  couponName: string
  description: string
  effectiveStartTime: number
  effectiveEndTime: number
  applicability: string
  applicabilityType: number
  threshold: number
  worth: number
  status: number
  validEndDate: string
  name: string
  validBeginDate: string
  code: string
  id: string
}

/**
 * @property businessDataName 商品名称，取 goodsData.item.name
 * @property businessDataId 商品id
 * @property couponList
 * @property couponList[0].couponId 领取的优惠券id
 * @property couponList[0].number 领取的数量
 */
interface receiveCouponOption {
  businessDataName: string
  businessDataId: string | number
  couponList: { couponId: number; number: number }[]
}

/**
 * @property balance 剩余数量
 * @property worth 面额（现金券）
 * @property threshold 使用门槛（单位-分）
 * @property applicability 适用范围
 * @property applicabilityType 适用范围类型(-1: 全场通用，0:品牌，1:类目，2商品)
 * @property validityTimeType 有效期类型(1-固定期,2-领券后时间段)
 * @property validityStartTime 有效开始时间（validityTimeType为1时必须）
 * @property validityEndTime 有效结束时间（validityTimeType为1时必须）
 * @property validityUnit 有效时长单位（1-日，2-月）（validityTimeType为2时必须）
 */
interface CouponsDetail {
  balance: number
  worth: number
  threshold: number
  applicability: string
  applicabilityType: number
  validityTimeType: number
  validityStartTime: string
  validityEndTime: string
  validityUnit: number
}

interface CouponPickerInfo {
  availableLength: number
  availableList: Item[]
  unavailableList: Item[]
}
