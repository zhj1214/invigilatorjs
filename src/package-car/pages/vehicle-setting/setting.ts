import { computed, reactive } from 'vue'
import { useCarStore } from '@src/pinia/car'
import useExteriorSetting from './optional-data'
import useSelect from './select'

const carStore = useCarStore()
const configActive = computed(() => carStore.configActive)
const vehicle = computed(() => carStore.vehicle)
const { handleSelectColor, handleSelectPainting, handleSelectRim, handleSelectInnerColor, handleSelectInnerMaterial, handleGetInnerPrice } = useSelect()

/**
 * 初始化数据
 * @param parms
 * @returns
 */
function setInitData(parms: any) {
  const initData = () => {
    const { active, series, model } = parms

    uni.setNavigationBarTitle({
      title: `${vehicle.value.model?.attrs.title}车辆配置器`
    })
    active.value = vehicle.value.model?.id === model.data?.id ? configActive.value : 0
    series.data = vehicle.value.series
    model.data = vehicle.value.model
  }

  return { initData }
}

/**
 * 选装包数据
 * @param parms
 * @returns
 */
function getDetail(parms: any, pamrs2: { toSelectOutColor: (arg0: any) => void }) {
  const packagesList = reactive({
    data: [] as Car.Option[]
  })

  const { outColor, outColorList, skus } = parms
  const { toSelectOutColor } = pamrs2
  /**
   * 获取配置详情
   */
  const getVehicleDeatil = () => {
    if (outColor.data && outColorList.value.findIndex((it: { name: string; disabled: boolean }) => it.name === outColor.data.name && !it.disabled) >= 0) {
      toSelectOutColor(outColor.data)
    } else {
      const data = outColorList.value.find((it: { disabled: boolean; image: string; name: string }) => !it.disabled)
      toSelectOutColor(data)
    }
    setPackagesList()
  }

  /**
   * 选装包
   */
  const setPackagesList = () => {
    packagesList.data = (skus.data[0].optionalPackageVOS || []).map((pk: { packages: any }) => {
      return pk.packages
    })
  }

  return {
    getVehicleDeatil,
    packagesList
  }
}

/**
 * 获取车辆外饰数据
 * @param parms
 * @returns
 */
function getOutCar(parms: any) {
  const { skus, outColor, outPainting } = parms
  const outCarData = computed(() => {
    const data = skus.data.find((sku: Car.CarSku) => {
      return outColor.data && sku.carFacadeVO?.outColor.name === outColor.data.name && outPainting.data && sku.carFacadeVO?.outPainting.name === outPainting.data.name
    })
    return data
  })

  return {
    outCarData
  }
}

/**
 * 是否选择了各项配置
 * @returns
 */
function getRequireCheck() {
  const toShowToastFn = (data: string, msg: string) => {
    if (!data) {
      uni.showToast({
        title: `请选择${msg}`,
        duration: 1000,
        icon: 'none'
      })
      return false
    }
    return true
  }
  const toRequireCheck = (index: number) => {
    let flag = true
    if (index === 1) {
      flag = toShowToastFn(vehicle.value.outColor.name, '外饰颜色') && toShowToastFn(vehicle.value.outPainting.name, '外饰喷漆')
    } else if (index === 2) {
      flag = toShowToastFn(vehicle.value.rim.name, '轮圈')
    } else if (index === 3) {
      flag = toShowToastFn(vehicle.value.innerColor.name, '内饰颜色') && toShowToastFn(vehicle.value.innerMaterial.name, '内饰材质')
    }
    return flag
  }

  return {
    toRequireCheck
  }
}

export default function useSetting() {
  const options = useExteriorSetting()
  const { toSelectOutColor } = handleSelectColor(options)
  const { toSelectOutPainting } = handleSelectPainting(options)
  const { toSelectRim } = handleSelectRim(options)
  const { toSelectInnerColor } = handleSelectInnerColor(options)
  const { toSelectInnerMaterial } = handleSelectInnerMaterial(options)
  const { getInnerPrice } = handleGetInnerPrice(options)
  const { initData } = setInitData(options)
  const { getVehicleDeatil, packagesList } = getDetail(options, { toSelectOutColor })
  const { outCarData } = getOutCar(options)
  const { toRequireCheck } = getRequireCheck()

  const packages = reactive({
    data: [] as Car.Packages[]
  })

  /**
   * 是否展示售价 falae:否；true:是
   */
  const showPriceFlag = computed(() => {
    return vehicle.value.skuData.itemPreSaleVO.showPriceFlag
  })

  return {
    ...options,
    showPriceFlag,
    outCarData,
    packagesList,
    packages,
    vehicle,
    configActive,
    toRequireCheck,
    getInnerPrice,
    initData,
    getVehicleDeatil,
    toSelectInnerMaterial,
    toSelectOutPainting,
    toSelectOutColor,
    toSelectRim,
    toSelectInnerColor
  }
}
