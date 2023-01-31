declare namespace Car {
  /**
   * 选项配置
   */
  interface Config {
    image: string
    name: string
  }

  /**
   * 车辆选项配置
   */
  interface Option {
    detail: string
    id: string
    image: string
    name: string
    price: number
  }

  /**
   * 选装包图片
   */
  interface imageList {
    name: string
    path: string
  }

  /**
   * 车辆外观sku
   */
  interface carFacadeVO {
    /**
     * 车辆外观自定义属性
     */
    groupedCustomAttributes: GroupedCustomAttribute[]

    /**
     * 车辆外观颜色
     */
    outColor: Config

    /**
     * 车辆外观喷漆
     */
    outPainting: Config
    price: number
    attrs: AnyObject
  }

  /**
   * 车辆轮毂sku
   */
  interface carRimVo {
    /**
     * 车辆轮毂自定义属性
     */
    groupedCustomAttributes: GroupedCustomAttribute[]

    /**
     * 车辆轮毂配置
     */
    rim: Config
    price: number
    attrs: AnyObject
  }

  /**
   * 车辆内饰Sku
   */
  interface carInteriorVO {
    /**
     * 车辆内饰自定义属性
     */
    groupedCustomAttributes: GroupedCustomAttribute[]

    /**
     * 车辆内饰颜色
     */
    innerColor: Config

    /**
     * 车辆内饰材质
     */
    innerMaterial: Config
    price: number

    /**
     * 车辆内饰轮播图片
     */
    bannerImgs: string[]
    attrs: AnyObject
  }

  /**
   * 车辆360预览信息
   */
  interface carAssemblerMaterialVO {
    /**
     * 车辆360预览图片集合
     */
    imageList: imageList[]

    /**
     * 车辆360预览主图
     */
    singleImageInfo: { path: string }
    attrs: AnyObject
  }

  /**
   * 选配包配置
   */
  interface Packages {
    id: string
    image: string
    name: string
    price: string | number
    detail?: string
  }

  /**
   * 车辆选装包配置
   */
  interface optionalPackageVOS {
    attrs: { [x: string]: any; name?: any; price?: any; image?: any }
    packages: Packages
    /**
     * 自定义属性
     */
    groupedCustomAttributes: any[]
    id: string
  }

  /**
   * 车辆sku
   */
  interface CarSku {
    /**
     *  车辆外观信息
     */
    carFacadeVO: carFacadeVO

    /**
     *  车辆轮圈信息
     */
    carRimVo: carRimVo

    /**
     * 车辆内饰信息
     */
    carInteriorVO: carInteriorVO

    /**
     * 车辆360预览信息
     */
    carAssemblerMaterialVO: carAssemblerMaterialVO

    /**
     * 车辆选装包信息
     */
    optionalPackageVOS: optionalPackageVOS[]

    /**
     * 商品状态 1:上架,-1:下架,-2:冻结,-3:删除
     */
    status: number

    /**
     * 商品id
     */
    itemId: string
    /**
     * 是否可下单    0:否；1:是
     */
    itemPreSaleVO: {
      placeOrderFlag: boolean
      showPriceFlag: boolean //是否展示售价   0:否；1:是
      /**
       * 价格类型    0:指导价；1:确定价
       */
      salePriceType: number | null
    }
    /**
     * 是否是预售    0:否；1:是
     */
    preSaleFlag: boolean

    /**
     * 车系信息
     */
    carSeriesVO: Series

    /**
     * 车型信息
     */
    carVehicleVO: Car.Series
  }
  /**
   * 车辆信息
   */
  interface CarInfo {
    id: string
    code: string
    name: string
    image: string
    vehicles?: Model[]
  }

  /**
   * 车系、车型基础属性
   */
  interface GroupedBasicAttributes {
    /**
     * 车系、车型基础属性key
     */
    attrKey: string

    /**
     * 车系、车型基础属性值
     */
    attrVal: string
  }

  /**
   * 车系、车型自定义属性
   */
  interface GroupedCustomAttribute {
    /**
     * 车系、车型自定义属性key
     */
    attrKey: string

    /**
     * 车系、车型自定义属性值
     */
    attrVal: string

    /**
     * 车系、车型自定义属性标签
     */
    tag: string

    /**
     * 车系、车型自定义属性单位
     */
    unit: string
  }

  /**
   * 车辆信息
   */
  interface itemInfo {
    id: string
    code: string

    /**
     * 车系、车型基础属性
     */
    groupedBasicAttributes: GroupedBasicAttributes[]

    /**
     * 车系、车型自定义属性
     */
    groupedCustomAttributes: GroupedCustomAttribute[]

    /**
     * 是否是预售
     */
    preSaleFlag: boolean

    /**
     * 是否展示售价
     */
    showPriceFlag: boolean
    name: string
    salePriceType: null | number
  }

  /**
   * 车系其他信息
   */
  interface Attrs {
    [key: string]: string
    price: number
    detail: string
    poster: string
    title: string
    desc: string | string[]
  }

  /**
   * 车系信息
   */
  interface Series extends itemInfo {
    hasChildren: boolean
    vehicles: Model[]
    attrs: Attrs
    price: number
    detail: string
  }

  /**
   * 车型信息
   */
  interface Model extends itemInfo {
    [x: string]: any
    image: string
    attrs: AnyObject

    /**
     * 商品id
     */
    itemId: string

    /**
     * 关联车系id
     */
    seriesCode: string
  }

  /**
   * 获取车系
   */
  type GetCarSeries = () => Promise<Series[]>

  /**
   * 获取车辆Sku
   */
  type GetSkus = ({ itemId: string, terminal: number }) => Promise<CarSku[]>
}
