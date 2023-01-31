import { defineStore } from 'pinia'
import { getPointRatio } from '@src/api/goods'

export const useGoodsStore = defineStore({
  id: 'goods',
  state: () => {
    return {
      pointRatio: 1
    }
  },
  actions: {
    /**
     * 获取货币积分兑换比例 1元 = ${pointRatio}积分
     */
    async getPointRatio() {
      const res = await getPointRatio()
      this.pointRatio = res
      return res
    }
  }
})
