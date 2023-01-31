import { computed, reactive, inject } from 'vue'
import { useCarStore } from '@src/pinia/car'

export default function usePackageData() {
  const { showPriceFlag, skuData, outCarData } = inject<any>('useSetting')

  // 选装包
  const packagesList = reactive({
    data: [] as Car.Option[]
  })
  const packages = reactive({
    data: [] as Car.Option[]
  })

  const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
  /**
   * 页面主图片
   */
  const [iconHelp, iconNoChecked, iconChecked] = gdp(['icon-help.png', 'icon-checkBox-no-checked.png', 'icon-checkBox-checked.png'])
  const carStore = useCarStore()
  const goPackagesDetail = (item: any) => {
    carStore.setTempData(item)
    uni.navigateTo({
      url: `/package-car/pages/packages-detail/index?id=${item.id}`
    })
  }

  const setVehicle = () => {
    carStore.setVehicle({
      packages: packages.data,
      carPoster: carPoster.value,
      skuData: skuData.value
    })
    console.log(carStore.vehicle.packages, 111)
  }

  const carPoster = computed(() => {
    return outCarData.value ? outCarData.value.carAssemblerMaterialVO.singleImageInfo.path : ''
  })

  /**
   * 获取选装包的状态icon
   * @param item
   * @returns
   */
  const getImgSrc = (item: Car.Option) => {
    return packages.data.findIndex((pk: { id: string }) => pk.id === item.id) > -1 ? iconChecked : iconNoChecked
  }

  const toSelectPackages = (item: Car.Option) => {
    if (packages.data.length) {
      const index = packages.data.findIndex((pk: { id: string }) => pk.id === item.id)
      index > -1 && packages.data.splice(index, 1)
      index === -1 && packages.data.push(item)
    } else {
      packages.data.push(item)
    }
    setVehicle()
  }

  return {
    iconHelp,
    packagesList,
    showPriceFlag,
    getImgSrc,
    toSelectPackages,
    goPackagesDetail
  }
}
