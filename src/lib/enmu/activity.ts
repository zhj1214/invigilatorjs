/**
 * 活动模块字典
 */
export const Activity = {
  /**
   * 活动模块
   * @enum FlashSale 5 限时促销
   */
  Type: {
    /**
     * 限时促销
     * FlashSale = 5
     */
    FlashSale: 5
  },
  /**
   * 活动状态
   */
  Status: {
    /**
     * 活动未开始
     * NotStart = -1
     */
    NotStart: -1,
    /**
     * 活动进行中
     * IsGoing = 1
     */
    IsGoing: 1
  },
  /**
   * 获取活动类型中文名
   * @param type
   * @returns string
   */
  getTypeText: (type: number | null): string => {
    switch (type) {
      case 5:
        return '限时促销'
      default:
        return ''
    }
  },
  /**
   * 获取活动状态中文名
   * @param status
   * @returns string
   */
  getStatusText: (status: number | null): string => {
    switch (status) {
      case -1:
        return '未开始'
      case 1:
        return '进行中'
      default:
        return ''
    }
  }
}
