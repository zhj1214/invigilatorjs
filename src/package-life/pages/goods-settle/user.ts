import { getToUseCoupon } from '@src/api/card'
import { getUserUsablePoint } from '@src/api/user'
import { reactive, ref } from 'vue'

export function useUser() {
  const userUsablePoint = ref(0)
  const coupon: Coupon.PickerInfo = reactive({
    availableLength: 0,
    availableList: [],
    unavailableList: []
  })

  /**
   * 获取用户可用积分
   */
  async function getUsablePoint() {
    try {
      const point = await getUserUsablePoint()
      userUsablePoint.value = point
    } catch (error) {}
  }

  /**
   * 获取订单关联卡券
   */
  async function getCoupon(orderDetail: Order.PreviewOrderInfo) {
    const params = orderDetail?.itemList?.map((item: AnyObject) => {
      return {
        skuId: item.skuId,
        itemId: item.itemId,
        quantity: item.quantity
      }
    })
    const res = await getToUseCoupon(params)
    Object.assign(coupon, {
      availableLength: Number(res.availableList.length),
      availableList: res.availableList,
      unavailableList: res.unavailableList
    })
  }

  return {
    userUsablePoint,
    coupon,
    getUsablePoint,
    getCoupon
  }
}
