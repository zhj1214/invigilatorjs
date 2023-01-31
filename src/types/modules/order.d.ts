declare namespace Order {
  /**
   * 订单详情类型声明
   * @property id 订单id
   * @property order 订单信息
   * @property orderItemDtoList 订单商品
   * @property status 订单状态
   * @property totalAmount 总金额
   * @property totalPointNum 总积分
   * @property receiveInfo 收货人信息
   * @property totalCouponAmount 卡券优惠金额
   * @property couponList 使用卡券
   * @property userRemark 备注
   * @property createdAt 提交时间
   * @property extraMap 额外字段
   * @property payType 支付方式
   * @property payTime 支付时间
   * @property orderInvoice 发票信息
   * @property shipAmount 运费
   * @property orderItemList 子订单idList
   * @property wholeAssessStatus 评价状态
   * @property orderDelivery 物流信息
   * @property purchaserMobile 购买人手机号
   * @property orderType 订单类型
   */
  interface LifeDetailInfo {
    id: string | number
    order: {
      subtotalAmount: number
      receiveInfo: string
      payLeftTime: number
      receiveLeftTime: number
      purchaserMobile: string
      dealer?: string
    }
    orderItemDtoList: ItemDtoListInfo[]
    status: number
    totalAmount: number
    totalPointNum: number
    totalPointAmount: number
    receiveInfo: ReceiveInfo
    totalCouponAmount: number
    couponList: CouponInfo[]
    userRemark: string
    createdAt: number
    extraMap: ExtraMap
    payType: number
    payTime: number
    orderInvoice: OrderInvoiceInfo
    shipAmount: number
    orderItemList: []
    payLeftTime: number
    autoReceiveStatus: number | null
    receiveLeftTime: number
    afterSalesApplyTimeOut: boolean
    wholeAssessStatus: null
    orderDelivery: OrderDeliveryInfo[]
    purchaserMobile: string
    orderType: number
  }

  /**
   * 订单发票类型声明
   * @property invoiceTitle 发票名称
   * @property invoiceContent 发票内容
   */
  interface OrderInvoiceInfo {
    invoiceTitle: string
    invoiceContent: string
  }
  /**
   * 收货地址类型声明
   * @property receiver 收件人名称
   * @property mobile 收件人联系方式
   * @property receiveAddress 收件人地址
   */
  interface ReceiveInfo {
    receiver: string
    mobile: string
    receiveAddress: string
  }

  interface OrderDeliveryInfo {
    acceptStation?: string
    acceptTime?: string
    expressNumber?: string
    expressCode?: string
    telphone?: string
  }

  /**
   * 生活订单列表类型声明
   * @property id 订单id
   * @property orderItemDtoList 订单商品
   * @property status 订单状态
   * @property totalAmount 总金额
   * @property totalPointNum 总积分
   * @property receiveInfo 收货人信息
   * @property orderDelivery 物流信息
   * @property wholeAssessStatus 评价状态
   * @property expressCode 物流公司code
   * @property expressNum 物流单号
   * @property telphone 物流公司联系电话
   */
  interface LifeListItemInfo {
    orderId: string | number
    orderItemDtoList: ItemDtoListInfo[]
    orderStatus: number
    totalAmount?: number
    totalPointNum?: number
    receiveInfo?: string
    orderDelivery?: any
    wholeAssessStatus?: number
    expressCode?: string
    expressNum?: string | number
    telphone?: string
    orderType?: number
  }

  /**
   * 商品信息类型声明
   * @property itemImage 商品图片
   * @property itemName 商品名称
   * @property itemType 商品类型
   * @property attributeMaps 商品规格
   * @property quantity 购买量
   * @property skuPayMode 支付方式 1:现金支付, 2:积分支付, 3:定额积分+现金, 4:自由积分
   * @property activityTypeList 活动类型
   * @property activityPrice 活动价格
   * @property retailPrice 原价
   * @property extraMap 额外字段
   * @property pointAmount 积分价格
   * @property status 订单商品状态
   * @property orderAfterSalesDto 售后相关
   * @property id
   * @property orderId 订单id
   */
  interface ItemDtoListInfo {
    itemImage: string
    itemName: string
    itemType: string | number
    attributeMaps: AttributeMaps[]
    quantity: string | number
    skuPayMode?: number
    activityPrice?: number
    extraMap: ExtraMap
    pointAmount?: number
    status: number
    orderAfterSalesDto?: { id: string }
    id: string
    orderId?: string
    activityTypeList?: Array<string | number>
    activityPrice: number
    retailPrice: number
    assessStatus: number
  }

  /**
   * 商品规格类型声明
   * @property attrVal 商品规格
   */
  interface AttributeMaps {
    attrVal: string
  }

  interface StatusList {
    [key: number]: [number] | [number, number] | []
  }

  /**
   * 整车订单列表类型声明
   * @property orderItemDto 商品信息
   * @property order 订单信息
   */
  interface CarListInfo {
    orderItemDto: CarItemInfo
    order: CarOrderInfo
  }

  /**
   * 整车订单列表商品信息类型声明
   * @property carVehicleImg 车辆图片
   * @property vehicleTitle 车辆标题
   * @property saleAttrs 车辆规格信息
   * @property carFacadePrice 车辆外观价格
   * @property optionalPackagePrice 选装包价格
   * @property carRimPrice 轮圈价格
   * @property carInteriorPrice 内饰价格
   * @property carVehiclePrice 车型价格
   * @property status 订单商品状态
   * @property orderAfterSalesDto 售后信息
   * @property itemType 商品类型
   * @property id 订单商品id
   * @property orderId 订单id
   */
  interface CarItemInfo {
    carVehicleImg?: string
    vehicleTitle: string
    saleAttrs: string[]
    carFacadePrice: number
    optionalPackagePrice: number[]
    carRimPrice: number
    carInteriorPrice: number
    carVehiclePrice: number
    status: number
    orderAfterSalesDto?: { id: string }
    itemType: string | number
    id: string
    orderId: string
  }

  /**
   * 整车订单信息
   * @property id 订单编号
   * @property status 订单状态
   * @property extraMap 订单额外字段
   * @property wholeAssessStatus 评价状态
   * @property orderDealer 服务商
   * @property totalAmount 总价
   * @property createdAt 提交时间
   * @property payTime 支付时间
   */
  interface CarOrderInfo {
    afterSalesApplyTimeOut: boolean
    assessStatus: number
    extraMap: ExtraMap
    id: string
    isVisibled: number
    orderType: number
    parentId: string
    payLeftTime: number
    payOutTime: number
    payTime: number | null
    payType: number
    purchaserId: string
    purchaserMobile: string
    purchaserName: string
    receiveInfo: any
    receiveLeftTime: null | number
    remainReceiveTime: null | number
    remark: null | string
    shipAmount: number
    shopCode: string
    status: number
    subtotalAmount: number
    totalAmount: number
    totalCouponAmount: number
    totalPointAmount: number
    totalPointNum: number
    userRemark: null | string
    wholeAssessStatus: number
  }

  /**
   * 订单额外信息
   * @property showPriceFlag 是否展示价格
   * @property preSaleFlag 是否为预售
   */
  interface ExtraMap {
    [x: string]: any
    orderWay: number
    preSaleFlag: boolean
    purchaser: {
      certificateNumber: string
      certificateType: number
      dealerId: string
      mobile: string
      name: string
    }
    showPriceFlag: boolean
    vehiclePayType: number
  }

  /**
   * 整车订单详情商品信息类型声明
   * @property status 订单商品状态
   * @property carFacade 车辆外观
   * @property carRim 轮圈
   * @property carInterior 内饰
   * @property carVehicle 车型
   * @property optionalPackage 选装包
   * @property orderAfterSalesDto 售后信息
   * @property orderId 订单id
   * @property itemType 商品类型
   * @property id 订单商品id
   * @property skuId 规格Id
   */
  interface CarDetailInfo {
    status: number
    carFacade: { price: number; colorName: string; paintingName: string }
    carRim: { price: number; rimName: string }
    carInterior: { price: number; colorName: string; materialName: string }
    carVehicle: { price: number; name: string }
    optionalPackage: { price: number; id: string; name: string }[]
    orderAfterSalesDto: { id: string }
    orderId: string
    itemType: string
    id: string
    skuId: string
    materialImage: { path: string }
  }

  /**
   * 物流详情类型声明
   * @property state 物流状态
   * @property Traces 物流详情
   */
  interface LogisticsDetailInfo {
    state: string
    traces: TraceInfo[]
  }

  interface TraceInfo {
    acceptStation: string
    acceptTime: string
  }

  /**
   * 列表接口参数定义
   * @property attrVal 商品规格
   */
  interface ListParams {
    pageNo: number
    pageSize: number
    criteria: { orderAscription: number }
    statuses?: number[]
    wholeAssessStatus?: number
  }

  /**
   * 提交订单参数
   */
  interface CreateOrderParams {
    vmId: number
    businessId: string
    orderChannel: number
    remark?: string
    itemToOrderList: AnyObject[]
    pointNum?: number
    couponAccountCode?: string
    criteria?: {
      distributer?: string
      customerInfo?: AnyObject
    }
    orderAddressId?: string
  }

  /**
   * 创建支付订单所需参数
   * @property orderId 订单id（父订单）
   * @property agencyCode 支付机构编码 01: 支付宝; 02: 微信; 03: 工商银行; 04: 微软; 05: 卡券; 06: 连连支付; 07: 易宝支付; 08: 积分中心; 09: 平安银行; 10: 银联商务 默认：02， 现金支付时必传
   * @property channelCode 支付渠道编码 04-微信app 05-微信公众号 06-微信扫码 07-微信h5 08-微信小程序  12-支付宝 jsapi 13-支付宝扫码 14-支付宝app 15-支付宝h5 16-支付宝web 17-支付宝小程序，现金支付时必传
   * @property remark 支付备注
   * @property returnUrl 付款完成后跳转地址 H5支付
   * @property code 微信登录code
   */
  interface PayOrderParams {
    orderId: string
    agencyCode: string
    channelCode: string
    vmId: number
    code?: string
    returnUrl?: string
    remark?: string
  }

  interface PreviewOrderItem {
    activityPrice: number | null
    activityTypeList: number[]
    finalPrice: string
    itemId: number
    itemImage: string
    itemName: string
    itemType: number
    payType: number
    pointNum: null
    quantity: number
    retailPrice: string
    shipAmount: string
    skuExtra: { price: string; guidePrice: string; originPrice: string }
    guidePrice: string
    originPrice: string
    price: string
    skuId: number
    skuImage: string
    skuName: string
    skuAttributeValueVOList: Goods.SkuAttributeValueVOList[]
    subtotalAmount: string
    totalAmount: string
    totalCouponAmount: string
  }

  interface PreviewOrderInfo {
    shipAmount: number
    necessaryPointNum: number
    subtotalAmount: number
    totalAmount: number
    totalCouponAmount: number
    availablePointNum: number
    itemList: PreviewOrderItem[]
  }

  /**
   * 创建订单
   */
  interface CreateOrderPreviewParams {
    cartIds?: string[]
    userAddressId?: string
    couponAccountCode?: string
    vmId: number
    itemToOrderList: {
      skuId: string | number
      itemId: string | number
      quantity: number
      dealerId?: number | null
      activityId?: string | null
    }[]
  }

  type CreateOrderPreview = (data: CreateOrderPreviewParams) => Promise<boolean>

  /**
   * 创建订单预览缓存
   */
  type CreateOrder = (data: CreateOrderParams) => Promise

  /**
   * 获取订单列表
   */
  type GetOrderList = (data: ListParams) => Promise<PageListInfo>

  /**
   * 获取订单详情
   */
  type GetOrderDetail = (orderId: string) => Promise<LifeDetailInfo>
  type GetOrderDetail = (orderId: string) => Promise<CarOrderInfo>

  /**
   * 取消订单
   */
  type CanceOrder = (orderId: string | number) => Promise

  /**
   * 确认收货
   */
  type ArriveOrder = (orderId: string | number) => Promise

  /**
   * 查询物流信息
   */
  type GetTrackInfo = (data: { expressNumber: string; expressCode: string; telphone: string }) => Promise

  /**
   * 订单支付
   */
  type PayOrder = (data: PayOrderParams) => Promise
}
