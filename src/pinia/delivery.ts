import { defineStore } from 'pinia'

interface DeliveryParams {
  mianPic: string
  totalNum: number
}

export const useDeliveryStore = defineStore({
  id: 'Delivery',
  state: () => {
    return {
      deliveryParams: {
        mianPic: '',
        totalNum: 0
      }
    }
  },
  actions: {
    setParams(deliveryParams: DeliveryParams) {
      this.deliveryParams = deliveryParams
    }
  }
})
