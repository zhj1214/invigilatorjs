import { reactive } from 'vue'
import { getGoodsCoupon, receiveCoupon } from '@api/card'

export function useCoupon() {
  const couponList = reactive([]) as Coupon.Item[]
  // 当前商品id
  let goodsId: string | number = ''

  /**
   * 获取商品关联可用卡券
   * @param itemId
   */
  async function getCounponList(itemId: number | string) {
    goodsId = itemId
    const list = await getGoodsCoupon(itemId)
    couponList.length = 0
    couponList.push(...list)
  }

  /**
   * 领取卡券
   */
  async function getCoupon(data: Coupon.ReceiveParams) {
    try {
      await receiveCoupon(data)
      uni.showToast({
        title: '领取成功'
      })
      getCounponList(goodsId)
    } catch (error) {}
  }

  return {
    couponList,
    getCounponList,
    getCoupon
  }
}
