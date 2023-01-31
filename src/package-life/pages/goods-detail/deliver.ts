import { computed, ref } from 'vue'
import { getDefaultAddress, getShippingRule } from '@src/api/goods'
import { useAddressStore } from '@src/pinia/address'
import { useLocationStore } from '@src/pinia/location'

/**
 * 配送商品配送信息
 * @returns
 */
export function useDeliver() {
  // 运费模板
  const freightTemplate = ref('')
  // 是否包邮
  const isFreeShipping = ref(false)

  const addressStore = useAddressStore()
  const selectedAddress = computed(() => addressStore.selectedAddress)
  // 配送地址
  const shippingAddress = computed(() => addressStore.shippingAddress)

  let shipTemplateId = ''

  /**
   * selectedAddress从地址列表页面返回才会有值
   * 如果在地址列表页面新增地址后直接返回，此时默认选中的是新增的地址
   * 没有选中的地址信息则需要获取当前定位地址
   */
  async function getDeliverInfo(templateId: string) {
    shipTemplateId = templateId
    if (selectedAddress.value) {
      const cityCode = selectedAddress.value?.cityCode
      await getShipRule(cityCode)
    } else {
      let cityCode = ''
      const { id, provinceName, districtName, cityCode: defaultCityCode, cityName } = await getDefaultAddress()
      if (id) {
        addressStore.$patch({
          shippingAddress: `${provinceName} ${cityName} ${districtName}`
        })
        cityCode = defaultCityCode
      } else {
        const { cityCode: currentCityCode, province, city, district } = await useLocationStore().getCityCode()
        cityCode = currentCityCode
        addressStore.$patch({
          shippingAddress: `${province} ${city} ${district}`
        })
      }
      await getShipRule(cityCode)
    }
  }

  /**
   * 获取物流规则
   */
  async function getShipRule(cityCode: string) {
    //   try {
    //     const { basicUnit, basicPrice, beyondUnit, beyondPrice, isFree } = await getShippingRule({ cityCode, shipTemplateId })
    //     freightTemplate.value = `${basicUnit}件内,${basicPrice / 100}元,每增加${beyondUnit}件,增加运费${beyondPrice / 100}元`
    //     isFreeShipping.value = isFree
    //     addressStore.$patch({
    //       freightTemplate: freightTemplate.value
    //     })
    //   } catch (error) {}
  }

  return { freightTemplate, shippingAddress, isFreeShipping, getDeliverInfo }
}
