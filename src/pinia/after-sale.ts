import { defineStore } from 'pinia'

interface AfterSaleParams {
  status: number
  orderId: string
  itemType: string
}

export const useAfterSaleStore = defineStore({
  id: 'AfterSale',
  state: () => {
    return {
      afterSaleParams: {
        status: 0,
        orderId: '',
        itemType: ''
      }
    }
  },
  actions: {
    setParams(afterSaleParams: AfterSaleParams) {
      this.afterSaleParams = afterSaleParams
    }
  }
})
