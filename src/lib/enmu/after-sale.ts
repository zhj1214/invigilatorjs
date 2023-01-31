/**
 * 售后
 */
export const AfterSale = {
  /**
   * 售后状态
   */
  Status: {
    /**
     * 待商家审核
     * ToBeReviewed = 8
     */
    ToBeReviewed: 8,
    /**
     * 售后申请已通过
     * passed = 5
     */
    Passed: 5,
    /**
     * 发货成功
     * Shipped = 6
     */
    Shipped: 6,
    /**
     * 退款中
     * Refunding = 3
     */
    Refunding: 3,
    /**
     * 待卖家验货
     * InInspection = 6
     */
    InInspection: 6,
    /**
     * 退款成功
     * Success = 4
     */
    Success: 4,
    /**
     * 商家拒绝退款
     * Rejected = 7
     */
    Rejected: 7
  },
  /**
   * 获取状态中文名
   * @param status
   * @returns string
   */
  getStatusText: (status: number | string | null): string => {
    switch (status) {
      case 8:
        return '待商家审核'
      case 5:
        return '售后申请已通过，请尽快完成退货'
      case 6:
        return '发货成功，请耐心等待商家验货退款'
      case 3:
        return '退款预计在2小时内到达账户'
      case -1:
        return '您已取消本次售后申请'
      case 4:
        return '退款成功'
      case 7:
        return '商家已拒绝，退款关闭'
      default:
        return ''
    }
  },
  /**
   * 获取售后详情页状态中文名
   * @param status
   * @returns string
   */
  getStatusDetailText: (status: number | string | null): string => {
    switch (status) {
      case 8:
        return '待商家审核'
      case 5:
        return '售后申请已通过'
      case 6:
        return '已发货'
      case 3:
        return '退款预计在2小时内到达账户'
      case -1:
        return '售后申请已撤销，交易将正常进行'
      case 4:
        return '退款成功'
      case 7:
        return '商家拒绝售后'
      default:
        return ''
    }
  }
}
