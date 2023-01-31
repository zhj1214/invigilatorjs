/**
 * 商品评价模块
 */
declare namespace Evaluation {
  /**
   * @name: 评价详情
   * @property: orderItemDto 整车评价订单信息
   * @property: orderItemInfo 商品评价订单信息
   * @property: userAvatar 用户头像
   * @property: userName 用户名称
   * @property: createTime 创建时间
   * @property: content 评论内容
   * @property: mediaUrlList 评论图片
   * @property: reply 评论回复
   */
  interface Detail {
    orderItemDto: CarEvaluationItem
    orderItemInfo: LifeEvaluationItem
    userAvatar: string
    userName: string
    createTime: string
    content: string
    mediaUrlList: AnyObject[]
    reply: AnyObject[]
    score: number
  }
  /**
   * @name: 整车评价列表
   * @property orderItemDto 订单商品列表
   * @property score 评分
   * @property content 评价内容
   * @property order 订单信息
   */
  interface CarEvaluation {
    id: string
    orderItemDto: CarEvaluationItem
    score?: number
    content?: string
    order: carEvaluationOrder
    orderItemInfo?: { orderId: string }
  }

  /**
   * @name: 整车订单商品信息
   * @property carVehicleImg 车辆图片
   * @property vehicleTitle 车辆标题
   * @property saleAttrs 车辆规格信息
   * @property carFacadePrice 车辆外观价格
   * @property optionalPackagePrice 选装包价格
   * @property carRimPrice 轮圈价格
   * @property carInteriorPrice 内饰价格
   * @property carVehiclePrice 车型价格
   */
  interface CarEvaluationItem {
    carVehicleImg: string
    vehicleTitle: string
    saleAttrs: Array<string>
    carFacadePrice: number
    optionalPackagePrice: Array<number>
    carRimPrice: number
    carInteriorPrice: number
    carVehiclePrice: number
  }

  /**
   * @name: 订单信息
   * @property: id 订单id
   * @property: orderType 订单类型
   */
  interface CarEvaluationOrder {
    id: string
    orderType: string
  }

  /**
   * @name: 商品评价列表
   * @property:orderItemInfo 订单信息
   * @property:order 订单信息
   * @property:orderItemDtoList 订单商品列表
   * @property:score 评分
   * @property:content 评价内容
   */
  interface LifeEvaluation {
    orderItemInfo: LifeEvaluationItem
    order: LifeEvaluationItem
    orderItemDtoList: LifeEvaluationItem[]
    score?: number
    content?: string
    id?: string
    orderId: string
  }

  /**
   * @name: 商品评价订单信息
   * @property: orderId 订单id
   * @property: id 订单id
   * @property: itemImage 商品图片
   * @property: itemName 商品名称
   * @property: attributeMaps 商品规格信息
   * @property: quantity 数量
   * @property: totalAmount 总价
   * @property: orderType 订单类型
   */
  interface LifeEvaluationItem {
    orderId: string
    id: string
    itemImage?: string
    itemName?: string
    attributeMaps: Array<{ attrVal: string }>
    quantity?: number
    totalAmount: number
    assessStatus?: number
    orderType?: number
    orderItemInfo: { orderId: string }
    totalPointNum: number
  }

  /**
   * @name: 发布评价商品列表
   */
  type EvaluationItem = carEvaluationItemInfo | lifeEvaluationItemInfo
  /**
   * @name: 评价发表的表单
   * @property: 匹配使用的id
   * @property: content 内容
   * @property: image 图片
   * @property: video 视频
   * @property: score 评分
   * @property: dimension 评价类型
   * @property: orderItemId 商品id
   */
  interface AssessInfo {
    [x: string]: any
    id?: string
    content?: string
    image?: Array<string>
    video?: string
    score?: number
    dimension?: 'ITEM_EVALUATION' | 'LOGISTICS_EVALUATION' | 'ONLINE_EVALUATION' | 'DELIVERY_EVALUATION'
    orderItemId?: string
  }
}
