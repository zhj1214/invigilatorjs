import { defineStore } from 'pinia'
import { getAddress } from '@src/api/user'

interface AddressState {
  // 选择的地址
  selectedAddress: User.AddressInfo | null
  // 选择的城市
  selectedCity: User.CityInfo[] | null
  selectedDealer: Dealer.BizItem | null
  shippingAddress: string
  freightTemplate: string
}

export const useAddressStore = defineStore({
  id: 'address',
  state: (): AddressState => {
    return {
      selectedAddress: null,
      selectedCity: null,
      selectedDealer: null,
      shippingAddress: '',
      freightTemplate: ''
    }
  },
  actions: {
    // 收货地址
    async getUserAddress() {
      try {
        const addressList = (await getAddress()) || []
        let selectedAddress
        if (this.selectedAddress !== null) {
          selectedAddress = addressList.find((address) => {
            return address.id === this.selectedAddress?.id
          })
        } else {
          selectedAddress = addressList.find((address) => address.isDefault)
        }
        // 如果没有设置默认地址，但是有设置地址，取第一个
        if (!selectedAddress && addressList.length) {
          selectedAddress = addressList[0]
        }
        console.log(selectedAddress)
        this.selectedAddress = selectedAddress || null
      } catch (error) {}
    }
  }
})
