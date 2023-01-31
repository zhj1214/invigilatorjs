/**
 * 订单
 */
export const Order = {
  /**
   * 订单状态
   */
  Status: {
    /**
     * 订单待处理
     * Pending = 80
     */
    Pending: 80,
    /**
     * 订单待支付
     * TobePaid = 0
     */
    TobePaid: 0,
    /**
     * 等待支付意向金
     * WaitingIntentionMoney = 60
     */
    WaitingIntentionMoney: 60,
    /**
     * 已支付意向金
     * PaidIntentionMoney = 61
     */
    PaidIntentionMoney: 61,
    /**
     * 待支付订金
     * DepositToBePaid = 70
     */
    DepositToBePaid: 70,
    /**
     * 已支付订金
     * PaidDeposit = 71
     */
    PaidDeposit: 71,

    /**
     * 订单已支付
     * Paid = 1
     */
    Paid: 1,
    /**
     * 待发货
     * ToBeShipped = 2
     */
    ToBeShipped: 2,
    /**
     * 待收货
     * ToBeReceived = 3
     */
    ToBeReceived: 3,
    /**
     * 部分发货
     * SomeShipped = 4
     */
    SomeShipped: 4,
    /**
     * 整车交易完成
     * IsCarEnd = 68
     */
    IsCarEnd: 68,
    /**
     * 精品交易完成
     * IsLifeEnd = 80
     */
    IsLifeEnd: 80,
    /**
     * 已退款
     * IsRefunded = -2
     */
    IsRefunded: -2,
    /**
     * 待失效
     * WillInvalid = -3
     */
    WillInvalid: -3,
    /**
     * 已失效
     * IsInvalid = -4
     */
    IsInvalid: -4,
    /**
     * 已取消
     * IsCanceled = -5
     */
    IsCanceled: -5,
    /**
     * 交易关闭
     * IsClosed = -80
     */
    IsClosed: -80,
    /**
     * 售后中
     * AfterSales = 7
     */
    AfterSales: 7,
    /**
     * 已删除
     * IsDelete = -1
     */
    IsDelete: -1,
    /**
     * 交车准备中
     * WaitingDelivery = 64
     */
    WaitingDelivery: 64,
    /**
     * 待提车
     * WaitingToPickUpCar = 74
     */
    WaitingToPickUpCar: 74,
    /**
     * 已完成
     * IsEnd = 88
     */
    IsEnd: 88
  },
  /**
   * 获取状态中文名
   * @param status
   * @returns string
   */
  getStatusText: (status: number | string | null): string => {
    switch (status) {
      case 80:
        return '待处理'
      case 0:
        return '待支付'
      case 60:
        return '等待支付意向金'
      case 61:
        return '已支付意向金'
      case 70:
        return '等待支付定金'
      case 71:
        return '已支付定金'
      case 1:
        return '已支付'
      case 2:
        return '待发货'
      case 3:
        return '待收货'
      case 4:
        return '部分发货'
      case 64:
        return '交车准备中'
      case 74:
        return '待提车'
      case 68:
      case 88:
        return '交易完成'
      case 7:
        return '售后中'
      case -2:
      case '-2':
        return '退款完成'
      case -3:
      case '-3':
        return '待失效'
      case -4:
      case '-4':
        return '交易失效'
      case -5:
      case '-5':
        return '交易取消'
      case -80:
      case '-80':
        return '交易关闭'
      case -1:
      case '-1':
        return '已删除'
      default:
        return ''
    }
  }
}
