declare namespace AfterSale {
  /**
   * 售后列表类型声明
   * @property afterSaleId 售后id
   * @property showExtraMap 整车商品售后额外字段
   * @property status 售后状态
   * @property remainTime 商家审核时间
   * @property totalAmount 总金额
   * @property totalPointNum 总积分
   * @property attributeMaps 生活商品规格
   * @property itemType 商品类型
   * @property auditOutTime 自动审核时间
   * @property type 退款种类   0:退款   1:退货退款
   * @property itemImage 商品主图
   * @property itemName 商品名称
   * @property quantity 退款商品数量
   * @property totalPointNum 退积分数额
   */
  interface ListInfo {
    id: number
    showExtraMap?: AnyObject
    status: number
    remainTime: number
    totalAmount: number
    totalPointNum: number
    attributeMaps?: AnyObject
    itemType: number
    auditOutTime: number
    // orderItemDto?: carItemInfo
    type: number
    itemImage: string
    itemName: string
    quantity: string | number
  }
  /**
   * 售后详情
   */
  interface DetailResponse {
    orderAfterSalesDto: DetailInfo
    orderAudits: Array<{
      newStatus: number
      createdAt: string
      fileIdList: Array
    }>
    orderItem: AfterSaleDetailItemInfo
  }

  /**
   * 售后订单详情类型声明
   */
  interface DetailInfo {
    totalAmount: string | number
    totalPointNum: string | number
    updatedAt: string
    auditOutTime: number
    status: number
    type: number
    createdAt: string
    applyDesc: string
    reason: string
    auditDesc: string
    sellerAddress: string
  }

  /**
   * 售后订单商品详情类型声明
   */
  interface AfterSaleDetailItemInfo {
    itemType: string
    itemImage: string
    itemName: string
    attributeMaps: Array<AttributeMaps>
    skuPayMode: number
    retailPrice: number
    pointAmount: number
    quantity: number
    status: number
    id: string
    orderId: string
    orderItemDto: Order.CarItemInfo
  }

  /**
   * 申请售后接口参数类型声明
   * afterSaleType 退款单类型(前端只传0：退款 1：退货退款)
   * causeType 售后原因
   * desc 问题描述
   * orderItemIdList 订单商品ids[]
   * fileUrlList 图片地址
   * orderId 订单id
   */
  interface RefundInfo {
    afterSaleType: number | null
    causeType: number | null
    desc: string
    orderItemIdList: string[]
    fileUrlList: string[] | any[]
    orderId: string
    amounts: Array<{
      orderItemId: string
      amount: number
      pointAmount: number
    }>
  }

  interface ExtraMap {
    maxPointNum: number | string
  }

  interface AttributeMaps {
    attrVal: string
  }

  /**
   * 获取售后列表
   */
  type GetOrderList = ({ pageNo: number, pageSize: number, itemTypes: string }) => Promise<PageListInfo<ListInfo>>

  /**
   * 获取售后详情
   */
  type GetDetail = (afterSaleId: number | string) => Promise<DetailResponse>

  /**
   * 获取物流公司
   */

  interface ExpressInfo {
    name: string
    telephone: string | number
  }
  type GetExpressCompanies = (data: { name?: string; pageNo?: number; pageSize?: number }) => Promise<PageListInfo<ExpressInfo>>

  /**
   * 取消售后
   */
  type Cancel = (afterSaleId: number | string) => Promise

  /**
   * 售后单确认发货
   * id 售后单id
   * expressNumber 物流单号
   * expressCode 物流公司编码
   * expressName 物流公司名称
   */
  type ConfirmShipment = (id: string, data: { expressInfo: { expressNumber: string; expressCode: string; expressName: string } }) => Promise

  /**
   * 获取售后原因
   */
  interface ReasonInfo {
    code: number
    desc: string
  }
  type GetCauses = ({ type: string }) => Promise<Array<ReasonInfo>>

  /**
   * 申请售后
   */
  type ApplyAfterSale = (RefundInfo) => Promise<Array<{ id: string }>>

  /**
   * 申请售后上传附件
   */
  type UploadFile = (data: Request.UploadFileDataOptions) => Promise<Array>
}
