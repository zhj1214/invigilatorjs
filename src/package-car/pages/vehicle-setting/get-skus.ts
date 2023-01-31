import { computed, reactive } from 'vue'
import { getCarSkus } from '@api/car'
import { useCarStore } from '@src/pinia/car'

const carStore = useCarStore()
const model = reactive({
  data: {} as Car.Model
})
interface ItemId {
  value: string
}
/**
 * 获取skus数据以及个性化配置 获取整车sku后的数据处理
 * @param itemId
 * @returns
 */
export default function useSkus(itemId: ItemId) {
  const vehicle = computed(() => carStore.vehicle)
  const getSkus = async () => {
    model.data = vehicle.value.model
    const resData = await getCarSkus({ itemId: itemId.value || model.data?.itemId, terminal: '' })
    const finalData = carStore.handleAfterCarSkus(resData) as Car.CarSku[]
    return finalData
  }

  return {
    getSkus
  }
}
