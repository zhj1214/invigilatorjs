import { computed, reactive, ref } from 'vue'
import { useCarStore } from '@src/pinia/car'
import useSkus from './get-skus'
import useSkuFlag from './flag'
interface SkuParms {
  [key: string]: {
    data: Car.Option
  }
}

const carStore = useCarStore()
const vehicle = computed(() => carStore.vehicle)
const configActive = computed(() => carStore.configActive)

const { toSkuOutPaintingFlag, toSkuRimFlag, toSkuInnerColorFlag, toSkuOutColorFlag, toSkuInnerMaterialFlag } = useSkuFlag()
/**
 * 定义skus
 */
const skus = reactive({
  data: [] as Car.CarSku[]
})
const initSkus = async (itemId: { value: any }) => {
  const { getSkus } = useSkus(itemId)
  skus.data = await getSkus()
}

/**
 * 初始化数据
 * @returns
 */
function initData() {
  // 外观配置
  const outColor = reactive({
    data: {} as Car.Option
  })
  // 喷漆配置
  const outPainting = reactive({
    data: {} as Car.Option
  })
  // 外饰价格
  const outPrice = ref(0)
  // 轮圈配置
  const rim = reactive({
    data: {} as Car.Option
  })
  // 轮圈价格
  const rimPrice = ref(0)
  // 内饰颜色
  const innerColor = reactive({
    data: {} as Car.Option
  })
  // 内饰材质
  const innerMaterial = reactive({
    data: {} as Car.Option
  })
  // 内饰价格
  const innerPrice = ref(0)

  // 选中的tab
  const active = ref(configActive.value)
  const series = reactive({
    data: {} as Car.Series
  })
  const model = reactive({
    data: {} as Car.Model
  })
  // 选装包
  const packages = reactive({
    data: [] as Car.Option[]
  })

  /**
   * 内饰配置
   */
  const innerImgList = reactive({
    data: []
  })

  return {
    outColor,
    outPainting,
    outPrice,
    rim,
    rimPrice,
    innerColor,
    innerMaterial,
    innerPrice,
    active,
    series,
    model,
    packages,
    innerImgList
  }
}

/**
 * 获取sku
 * @param { outColor, outPainting, rim, innerColor, innerMaterial }
 * @returns
 */
function getSkuData({ outColor, outPainting, rim, innerColor, innerMaterial }: SkuParms) {
  const matchSkus = computed(() => {
    return skus.data.filter((sku: Car.CarSku) => {
      return (
        toSkuOutColorFlag(sku, outColor) &&
        toSkuOutPaintingFlag(sku, outPainting) &&
        toSkuRimFlag(sku, rim) &&
        toSkuInnerColorFlag(sku, innerColor) &&
        toSkuInnerMaterialFlag(sku, innerMaterial)
      )
    })
  })
  const skuData = computed(() => {
    return matchSkus.value[0]
  })

  return {
    skuData
  }
}

/**
 * 外饰颜色列表
 * @param param0
 * @returns
 */
function getOutColorList({ rim, outPainting, innerColor, innerMaterial }: SkuParms) {
  const outColorList = computed(() => {
    const list: any = {}
    skus.data.forEach((sku: Car.CarSku) => {
      list[sku.carFacadeVO?.outColor.name] = { ...sku.carFacadeVO?.outColor, disabled: true }
    })
    skus.data
      .filter((sku: Car.CarSku) => {
        return toSkuOutPaintingFlag(sku, outPainting) && toSkuRimFlag(sku, rim) && toSkuInnerColorFlag(sku, innerColor) && toSkuInnerMaterialFlag(sku, innerMaterial)
      })
      .forEach((sku: { carFacadeVO: { outColor: { name: string | number } } }) => {
        if (list[sku.carFacadeVO?.outColor.name]) {
          list[sku.carFacadeVO?.outColor.name].disabled = false
        }
      })
    return Object.keys(list).map((key) => {
      return list[key]
    })
  })

  return {
    outColorList
  }
}

/**
 * 外饰喷漆列表
 * @param { outColor, rim, innerColor, innerMaterial }
 * @returns
 */
function getOutPaintingList({ outColor, rim, innerColor, innerMaterial }: SkuParms) {
  const outPaintingList = computed(() => {
    const list: any = {}
    skus.data.forEach((sku: { carFacadeVO: { outPainting: { name: string | number } } }) => {
      list[sku.carFacadeVO?.outPainting.name] = { ...sku.carFacadeVO?.outPainting, disabled: true }
    })
    skus.data
      .filter((sku: Car.CarSku) => {
        return toSkuOutColorFlag(sku, outColor) && toSkuRimFlag(sku, rim) && toSkuInnerColorFlag(sku, innerColor) && toSkuInnerMaterialFlag(sku, innerMaterial)
      })
      .forEach((sku: { carFacadeVO: { outPainting: { name: string | number } } }) => {
        if (list[sku.carFacadeVO?.outPainting.name]) {
          list[sku.carFacadeVO?.outPainting.name].disabled = false
        }
      })

    return Object.keys(list).map((key) => {
      return list[key]
    })
  })

  return { outPaintingList }
}

/**
 * 轮圈列表
 * @param { outColor, outPainting, innerColor, innerMaterial }
 * @returns
 */
function getRimLst({ outColor, outPainting, innerColor, innerMaterial }: SkuParms) {
  const rimList = computed(() => {
    const list: any = {}
    skus.data.forEach((sku: { carRimVo: { rim: { name: string | number } } }) => {
      list[sku.carRimVo?.rim.name] = { ...sku.carRimVo?.rim, disabled: true }
    })
    skus.data
      .filter((sku: Car.CarSku) => {
        return toSkuOutColorFlag(sku, outColor) && toSkuOutPaintingFlag(sku, outPainting) && toSkuInnerColorFlag(sku, innerColor) && toSkuInnerMaterialFlag(sku, innerMaterial)
      })
      .forEach((sku: { carRimVo: { rim: { name: string | number } } }) => {
        list[sku.carRimVo?.rim.name] && (list[sku.carRimVo?.rim.name].disabled = false)
      })
    return Object.keys(list).map((key) => {
      return list[key]
    })
  })

  return {
    rimList
  }
}

/**
 * 内饰颜色列表
 * @param { outColor, outPainting, rim, innerMaterial }
 * @returns
 */
function getInnerColorList({ outColor, outPainting, rim, innerMaterial }: SkuParms) {
  const innerColorList = computed(() => {
    const list: any = {}
    skus.data.forEach((sku: { carInteriorVO: { innerColor: { name: string | number } } }) => {
      list[sku.carInteriorVO?.innerColor.name] = { ...sku.carInteriorVO?.innerColor, disabled: true }
    })
    skus.data
      .filter((sku: Car.CarSku) => {
        return toSkuOutColorFlag(sku, outColor) && toSkuOutPaintingFlag(sku, outPainting) && toSkuRimFlag(sku, rim) && toSkuInnerMaterialFlag(sku, innerMaterial)
      })
      .forEach((sku: { carInteriorVO: { innerColor: { name: string | number } } }) => {
        list[sku.carInteriorVO?.innerColor.name] && (list[sku.carInteriorVO?.innerColor.name].disabled = false)
      })
    return Object.keys(list).map((key) => {
      return list[key]
    })
  })

  return {
    innerColorList
  }
}

/**
 * 内饰材质列表
 * @param { outColor, outPainting, rim, innerColor }
 * @returns
 */
function getInnerMaterial({ outColor, outPainting, rim, innerColor }: SkuParms) {
  const innerMaterialList = computed(() => {
    const list: any = {}
    skus.data.forEach((sku: { carInteriorVO: { innerMaterial: { name: string | number } } }) => {
      list[sku.carInteriorVO?.innerMaterial.name] = { ...sku.carInteriorVO?.innerMaterial, disabled: true }
    })
    skus.data
      .filter((sku: Car.CarSku) => {
        return toSkuOutColorFlag(sku, outColor) && toSkuOutPaintingFlag(sku, outPainting) && toSkuRimFlag(sku, rim) && toSkuInnerColorFlag(sku, innerColor)
      })
      .forEach((sku: { carInteriorVO: { innerMaterial: { name: string | number } } }) => {
        list[sku.carInteriorVO?.innerMaterial.name] && (list[sku.carInteriorVO?.innerMaterial.name].disabled = false)
      })
    return Object.keys(list).map((key) => {
      return list[key]
    })
  })

  return {
    innerMaterialList
  }
}

export default function useOptionalData() {
  const { outColor, outPainting, outPrice, rim, rimPrice, innerColor, innerMaterial, innerPrice, active, series, model, packages, innerImgList } = initData()
  /**
   * 初始化数据
   */
  const setData = () => {
    active.value = vehicle.value.model?.id === model.data?.id ? configActive.value : 0
    series.data = vehicle.value.series
    model.data = vehicle.value.model
    if (vehicle.value.skuData) {
      outColor.data = vehicle.value.outColor
      outPainting.data = vehicle.value.outPainting
      outPrice.value = vehicle.value.outPrice
      rim.data = vehicle.value.rim
      rimPrice.value = vehicle.value.rimPrice
      innerColor.data = vehicle.value.innerColor
      innerPrice.value = vehicle.value.innerPrice
      packages.data = vehicle.value.packages
      innerMaterial.data = vehicle.value.innerMaterial
    }
  }
  const { outColorList } = getOutColorList({ rim, outPainting, innerColor, innerMaterial })

  const { skuData } = getSkuData({ outColor, outPainting, rim, innerColor, innerMaterial })

  const { outPaintingList } = getOutPaintingList({ outColor, rim, innerColor, innerMaterial })

  const { rimList } = getRimLst({ outColor, outPainting, innerColor, innerMaterial })

  const { innerColorList } = getInnerColorList({ outColor, outPainting, rim, innerMaterial })

  const { innerMaterialList } = getInnerMaterial({ outColor, outPainting, rim, innerColor })

  return {
    setData,
    initSkus,
    skus,
    skuData,
    outColorList,
    outPaintingList,
    rimList,
    innerColorList,
    innerMaterialList,
    innerImgList,
    active,
    series,
    model,
    outColor,
    outPainting,
    outPrice,
    rim,
    rimPrice,
    innerColor,
    innerPrice,
    packages,
    innerMaterial
  }
}
