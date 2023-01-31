import { reactive, computed, toRefs } from 'vue'
import { pureAssign } from '@src/util/common'
import { getAddressInfo } from '@api/user'

interface FormData {
  receiverName: string
  mobile: string
  details: string
  isDefault: number
}

const useForm = () => {
  const address: FormData = reactive({
    receiverName: '',
    mobile: '',
    details: '',
    isDefault: 0
  })
  const cityValue: User.CityInfo[] = reactive([])

  const initAddress = async (id: string) => {
    try {
      const detail = await getAddressInfo(id)
      pureAssign(address, detail)
      cityValue.length = 0
      const { province, provinceCode, provinceId, city, cityCode, cityId, district, districtCode, districtId } = detail
      province && cityValue.push({ name: province, code: provinceCode, id: provinceId })
      city && cityValue.push({ name: city, code: cityCode, id: cityId })
      district && cityValue.push({ name: district, code: districtCode, id: districtId })
    } catch (error) {
      uni.showToast({
        title: '获取地址信息失败'
      })
    }
  }

  // 城市数据修改
  const toPickerChange = (cityDate: User.CityInfo[]) => {
    cityValue.splice(0, 999)
    cityValue.push(...cityDate)
  }

  const cityText = computed(() => cityValue.map((item) => item.name).join(' '))

  return {
    ...toRefs<FormData>(address),
    cityValue,
    cityText,
    initAddress,
    toPickerChange
  }
}

export default useForm
