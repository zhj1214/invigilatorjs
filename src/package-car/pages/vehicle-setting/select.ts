import { useCarStore } from '@src/pinia/car'
const carStore = useCarStore()

function handleSelectColor(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { getOuterPrice } = handleGetOuterPrice(paraObj)
  const { toSelectOutPainting } = handleSelectPainting(paraObj)
  const { outPrice, outColor, rim, innerColor, innerMaterial, outPaintingList, outPainting } = paraObj
  /**
   * 选择外饰颜色
   * @param item
   * @param disabled
   * @returns
   */
  const toSelectOutColor = (item: Car.Option, disabled?: boolean) => {
    if (disabled) {
      return
    }
    outPrice.value = 0
    // disabled可能是undefined
    if (outColor.data?.name === item.name && disabled === false) {
      outColor.data = rim.data = innerColor.data = innerMaterial.data = {} as Car.Option
      setVehicle()
      return
    } else {
      outColor.data = item
    }
    getOuterPrice()
    if (outPaintingList.value.findIndex((it: { name: string; disabled: boolean }) => it.name === outPainting.data?.name && !it.disabled) >= 0) {
      toSelectOutPainting(outPainting.data)
    } else {
      toSelectOutPainting(outPaintingList.value?.find((it: { disabled: boolean }) => !it.disabled))
    }
  }

  return {
    toSelectOutColor
  }
}

/**
 * 选择外饰喷漆
 * @param paraObj
 * @returns
 */
function handleSelectPainting(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { getOuterPrice } = handleGetOuterPrice(paraObj)
  const { toSelectRim } = handleSelectRim(paraObj)
  const { outPrice, outPainting, innerColor, rim, innerMaterial, rimList } = paraObj
  const toSelectOutPainting = (item: Car.Option, disabled?: boolean) => {
    if (disabled) {
      return
    }
    outPrice.value = 0
    if (outPainting.data?.name === item.name && disabled === false) {
      innerColor.data = rim.data = outPainting.data = innerMaterial.data = {} as Car.Option
      setVehicle()
      return
    } else {
      outPainting.data = item
    }
    getOuterPrice()
    if (rim.data?.name && rimList.value.findIndex((it: { name: string; disabled: boolean }) => it.name === rim.data?.name && !it.disabled) >= 0) {
      toSelectRim(rim.data)
    } else {
      toSelectRim(rimList.value?.find((it: { disabled: boolean }) => !it.disabled))
    }
  }
  return {
    toSelectOutPainting
  }
}

/**
 * 选择轮圈
 * @param paraObj
 * @returns
 */
function handleSelectRim(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { toSelectInnerColor } = handleSelectInnerColor(paraObj)
  const { rimPrice, rim, innerColor, innerMaterial, skuData, innerColorList } = paraObj
  const toSelectRim = (item: Car.Option, disabled?: boolean) => {
    if (disabled) {
      return
    }
    rimPrice.value = 0
    if (rim.data?.name === item.name && disabled === false) {
      innerColor.data = rim.data = innerMaterial.data = {} as Car.Option
      setVehicle()
      return
    } else {
      rim.data = item
    }
    rimPrice.value = skuData.value?.carRimVo?.price
    setVehicle()
    if (innerColor.data?.name && innerColorList.value.findIndex((it: { name: string; disabled: boolean }) => it.name === innerColor.data.name && !it.disabled) >= 0) {
      toSelectInnerColor(innerColor.data)
    } else {
      toSelectInnerColor(innerColorList.value.find((it: { disabled: boolean }) => !it.disabled))
    }
  }
  return {
    toSelectRim
  }
}

/**
 * 选择内饰颜色
 * @param paraObj
 * @returns
 */
function handleSelectInnerColor(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { getInnerPrice } = handleGetInnerPrice(paraObj)
  const { toSelectInnerMaterial } = handleSelectInnerMaterial(paraObj)
  const { innerPrice, innerColor, innerMaterial, innerMaterialList } = paraObj
  const toSelectInnerColor = (item: Car.Option, disabled?: boolean) => {
    if (disabled) {
      return
    }
    innerPrice.value = 0
    if (innerColor.data?.name === item.name && disabled === false) {
      innerColor.data = {} as Car.Option
      setVehicle()
      return
    } else {
      innerColor.data = item
    }
    getInnerPrice()

    if (innerMaterial.data?.name && innerMaterialList.value.findIndex((it: { name: string; disabled: boolean }) => it.name === innerMaterial.data.name && !it.disabled) >= 0) {
      toSelectInnerMaterial(innerMaterial.data)
    } else {
      toSelectInnerMaterial(innerMaterialList.value.find((it: { disabled: boolean }) => !it.disabled))
    }
  }

  return {
    toSelectInnerColor
  }
}

/**
 * 选择内饰材质
 * @param paraObj
 * @returns
 */
function handleSelectInnerMaterial(paraObj: any) {
  const { getInnerPrice } = handleGetInnerPrice(paraObj)
  const { setVehicle } = handleSetVehicle(paraObj as any)
  const { innerPrice, innerMaterial } = paraObj
  const toSelectInnerMaterial = (item: Car.Option, disabled?: boolean) => {
    if (disabled) {
      return
    }

    innerPrice.value = 0
    if (innerMaterial.data?.name && innerMaterial.data?.name === item.name && disabled === false) {
      innerMaterial.data = {} as Car.Option
      setVehicle()
      return
    } else {
      innerMaterial.data = item
    }

    getInnerPrice()
  }

  return {
    toSelectInnerMaterial
  }
}

/**
 * 设置pinia数据
 * @param param0
 * @returns
 */
function handleSetVehicle({ outColor, outPainting, outPrice, rim, rimPrice, innerColor, innerMaterial, innerPrice, packages, skuData }: any) {
  const setVehicle = () => {
    carStore.setVehicle({
      outColor: outColor?.data,
      outPainting: outPainting?.data,
      outPrice: outPrice?.value,
      rim: rim?.data,
      rimPrice: rimPrice?.value,
      innerColor: innerColor?.data,
      innerMaterial: innerMaterial?.data,
      innerPrice: innerPrice?.value,
      packages: packages?.data,
      skuData: skuData?.value
    })
  }

  return {
    setVehicle
  }
}

/**
 * 获取外饰配置价格
 * @param paraObj
 * @returns
 */
function handleGetOuterPrice(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { outColor, outPainting, outPrice, skuData } = paraObj
  const getOuterPrice = () => {
    if (outColor.data?.name && outPainting.data?.name) {
      outPrice.value = skuData.value?.carFacadeVO.price
    }
    setVehicle()
  }

  return {
    getOuterPrice
  }
}

/**
 * 获取内饰配置价格
 * @param paraObj
 * @returns
 */
function handleGetInnerPrice(paraObj: any) {
  const { setVehicle } = handleSetVehicle(paraObj)
  const { innerColor, innerMaterial, innerPrice, skuData, innerImgList } = paraObj
  const getInnerPrice = () => {
    if (innerColor.data?.name && innerMaterial.data?.name) {
      innerPrice.value = skuData.value?.carInteriorVO.price
      innerImgList.data = skuData.value?.carInteriorVO.bannerImgs
    }
    setVehicle()
  }
  return {
    getInnerPrice
  }
}

export default function useSelect() {
  return {
    handleSelectColor,
    handleSelectPainting,
    handleSelectRim,
    handleSelectInnerColor,
    handleSelectInnerMaterial,
    handleSetVehicle,
    handleGetOuterPrice,
    handleGetInnerPrice
  }
}
