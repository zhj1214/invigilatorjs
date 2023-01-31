import { toCreatePreviewOrder } from '@api/order'

export function useOrder() {
  /**
   * 创建预订单
   * @param data
   * @todo 入参数据类型待声明
   */
  async function addPreviewOrder(data: AnyObject) {
    try {
      await toCreatePreviewOrder(data)
    } catch (error) {}
  }

  return {
    addPreviewOrder
  }
}
