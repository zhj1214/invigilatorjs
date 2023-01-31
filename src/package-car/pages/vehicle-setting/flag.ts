export default function useSkuFlag() {
  interface Attributes {
    data: {
      name: string
    }
  }
  /**
   * 判断pinia中喷漆是否存在以及sku中的喷漆是否和pinia中的喷漆是否一致
   * @param sku
   * @param outPainting
   * @returns
   */
  const toSkuOutPaintingFlag = (sku: Car.CarSku, outPainting: Attributes) => {
    return !outPainting.data?.name || sku.carFacadeVO?.outPainting.name === outPainting.data.name
  }

  /**
   * 判断pinia中轮毂是否存在以及sku中的轮毂是否和pinia中的轮毂是否一致
   * @param sku
   * @param rim
   * @returns
   */
  const toSkuRimFlag = (sku: Car.CarSku, rim: Attributes) => {
    return !rim.data?.name || sku.carRimVo.rim.name === rim.data.name
  }

  /**
   * 判断pinia中内饰颜色是否存在以及sku中的内饰颜色是否和pinia中的内饰颜色是否一致
   * @param sku
   * @param innerColor
   * @returns
   */
  const toSkuInnerColorFlag = (sku: Car.CarSku, innerColor: Attributes) => {
    return !innerColor.data?.name || sku.carInteriorVO.innerColor.name === innerColor.data.name
  }
  /**
   * 判断pinia中内饰材质是否存在以及sku中的内饰材质是否和pinia中的内饰材质是否一致
   * @param sku
   * @param innerMaterial
   * @returns
   */
  const toSkuInnerMaterialFlag = (sku: Car.CarSku, innerMaterial: Attributes) => {
    return !innerMaterial.data?.name || sku.carInteriorVO.innerMaterial.name === innerMaterial.data.name
  }
  /**
   *  判断pinia中外饰颜色是否存在以及sku中的外饰颜色是否和pinia中的外饰颜色是否一致
   * @param sku
   * @param outColor
   * @returns
   */
  const toSkuOutColorFlag = (sku: Car.CarSku, outColor: Attributes) => {
    return !outColor.data?.name || sku.carFacadeVO?.outColor.name === outColor.data.name
  }

  return {
    toSkuOutPaintingFlag,
    toSkuRimFlag,
    toSkuInnerColorFlag,
    toSkuOutColorFlag,
    toSkuInnerMaterialFlag
  }
}
