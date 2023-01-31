import { defineStore } from 'pinia'
import { getCarSkuDetail } from '@api/car'

interface OrderItemDto {
  orderItemDtoList: AnyObject
  orderItemDto: AnyObject
  orderItemInfo: any
  extraMap: AnyObject
  vehicleTitle: string
  carVehiclePrice: string
  carVehicleImg: string
  carFacadePrice: number
  carRimPrice: number
  carInteriorPrice: number
  optionalPackagePrice: number[]
  saleAttrs: string[]
}

export const useCarStore = defineStore({
  id: 'car',
  state: () => {
    return {
      vehicle: uni.getStorageSync('vehicleData') || {},
      modelActive: 1,
      configActive: 0,
      tempData: {} as Car.Series,
      provider: {} as Dealer.Iteminfo
    }
  },
  actions: {
    setVehicle(vechicle: AnyObject) {
      uni.setStorageSync('vehicleData', { ...this.vehicle, ...vechicle }) //存缓存，防止刷新页面数据丢失
      this.vehicle = { ...this.vehicle, ...vechicle }
    },
    toClearVehicle(vechicle: AnyObject) {
      this.vehicle = vechicle
    },
    setModelActive(index: number) {
      this.modelActive = index
    },
    setTempData(tempData: Car.Series) {
      this.tempData = tempData
    },
    setConfigActive(index: number) {
      this.configActive = index
    },
    setProvider(provider: Dealer.Iteminfo) {
      this.provider = provider
    },
    handleData(attr: Car.GroupedCustomAttribute) {
      let attrVal: any
      if (attr.unit === 'picture') {
        attrVal = JSON.parse(attr.attrVal)[0].path
      } else if (attr.unit === 'pictures') {
        attrVal = JSON.parse(attr.attrVal).map((pic: { path: '' }) => pic.path)
      } else if (attr.unit === 'price') {
        attrVal = Number(attr.attrVal)
      } else {
        attrVal = attr.attrVal
      }
      return attrVal
    },
    getInfo(data: AnyObject, status: number) {
      // status 0-未评价 1-已评价 2-发布评价页面获取详情
      // eslint-disable-next-line max-lines-per-function
      data.forEach((item: OrderItemDto) => {
        const tempArr = []
        let orderItemDto = {} as OrderItemDto
        status === 0 && (orderItemDto = item.orderItemDtoList && item.orderItemDtoList[0])
        status === 1 && (orderItemDto = item.orderItemInfo)
        status === 2 && (orderItemDto = item)
        // 车辆数据
        const carVehicleAttrs: AnyObject = {}
        orderItemDto.extraMap.carVehicle.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => {
          carVehicleAttrs[attr.attrKey] = this.handleData(attr)
        })
        orderItemDto.vehicleTitle = carVehicleAttrs.title
        orderItemDto.carVehiclePrice = carVehicleAttrs.price
        // 图片连接中若有空格，背景图片则不显示，需要单独处理 replace(/\s/g, encodeURIComponent(' '))
        const imageUrl = (orderItemDto.extraMap.materialImage && orderItemDto.extraMap.materialImage.path) || carVehicleAttrs.poster
        orderItemDto.carVehicleImg = imageUrl.replace(/\s/g, encodeURIComponent(' '))
        // 外观属性
        const carFacadeAttrs: AnyObject = {}
        orderItemDto.extraMap.carFacade.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => {
          carFacadeAttrs[attr.attrKey] = this.handleData(attr)
        })
        tempArr.push(`${carFacadeAttrs.colorName}+${carFacadeAttrs.paintingName}`)
        orderItemDto.carFacadePrice = Number(carFacadeAttrs.price)

        // 轮圈属性
        const carRimAttrs: AnyObject = {}
        orderItemDto.extraMap.carRim.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => {
          carRimAttrs[attr.attrKey] = this.handleData(attr)
        })
        tempArr.push(carRimAttrs.rimName)
        orderItemDto.carRimPrice = Number(carRimAttrs.price)

        // 内饰属性
        const carInteriorAttrs: AnyObject = {}
        orderItemDto.extraMap.carInterior.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => {
          carInteriorAttrs[attr.attrKey] = this.handleData(attr)
        })
        tempArr.push(`${carInteriorAttrs.colorName}+${carInteriorAttrs.materialName}`)
        orderItemDto.carInteriorPrice = Number(carInteriorAttrs.price)

        // 选装包
        const pkNames: string[] = []
        const pkPrice: number[] = []
        orderItemDto.extraMap.optionalPackage?.forEach((pk: AnyObject) => {
          const pkAttrs: AnyObject = {}
          pk.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => {
            pkAttrs[attr.attrKey] = this.handleData(attr)
          })
          pkNames.push(pkAttrs.name)
          pkPrice.push(Number(pkAttrs.price))
        })
        tempArr.push(pkNames.join('+'))
        orderItemDto.optionalPackagePrice = pkPrice
        orderItemDto.saleAttrs = tempArr
        status === 2 ? (item = orderItemDto) : (item.orderItemDto = orderItemDto)
      })
      return data
    },

    // 个性化配置 获取整车sku后的数据处理
    handleAfterCarSkus(data: AnyObject) {
      data.forEach((item: Car.CarSku) => {
        // 车辆外观(颜色、喷漆、价格)
        if (item.carFacadeVO) {
          const outAttrs: AnyObject = {}
          item.carFacadeVO.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => (outAttrs[attr.attrKey] = this.handleData(attr)))
          item.carFacadeVO.outColor = { image: outAttrs.colorImg, name: outAttrs.colorName }
          item.carFacadeVO.outPainting = { image: outAttrs.paintingImg, name: outAttrs.paintingName }
          item.carFacadeVO.price = outAttrs.price
        }

        // 车辆轮圈
        if (item.carRimVo) {
          const rimAttrs: AnyObject = {}
          item.carRimVo.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => (rimAttrs[attr.attrKey] = this.handleData(attr)))
          item.carRimVo.rim = { image: rimAttrs.rimImg, name: rimAttrs.rimName }
          item.carRimVo.price = rimAttrs.price
        }

        // 车辆内饰(颜色、材质、价格)
        if (item.carInteriorVO) {
          const innerAttrs: AnyObject = {}
          item.carInteriorVO.groupedCustomAttributes?.forEach((attr: Car.GroupedCustomAttribute) => (innerAttrs[attr.attrKey] = this.handleData(attr)))
          item.carInteriorVO.innerColor = { image: innerAttrs.colorImg, name: innerAttrs.colorName }
          item.carInteriorVO.innerMaterial = { image: innerAttrs.materialImg, name: innerAttrs.materialName }
          item.carInteriorVO.price = innerAttrs.price
          item.carInteriorVO.bannerImgs = innerAttrs.bannerImgs
        }

        // 选装包
        item.optionalPackageVOS?.forEach((pk: Car.optionalPackageVOS) => {
          const packageAttrs: AnyObject = {}
          const groupedCustomAttributes = pk.groupedCustomAttributes || []
          groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (packageAttrs[attr.attrKey] = this.handleData(attr)))
          pk.packages = { id: pk.id, image: packageAttrs.image, name: packageAttrs.name, price: packageAttrs.price, detail: packageAttrs.detail }
        })
      })
      return data
    },
    getCarDetailInfo(data: AnyObject) {
      const orderItemDto = data[0]
      // 车辆数据
      const carVehicleAttrs: AnyObject = {}
      orderItemDto.extraMap.carVehicle.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (carVehicleAttrs[attr.attrKey] = this.handleData(attr)))
      orderItemDto.carVehicle = carVehicleAttrs
      orderItemDto.materialImage = orderItemDto.extraMap.materialImage
      // 外观属性
      const carFacadeAttrs: AnyObject = {}
      orderItemDto.extraMap.carFacade.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (carFacadeAttrs[attr.attrKey] = this.handleData(attr)))
      orderItemDto.carFacade = carFacadeAttrs
      // 轮圈属性
      const carRimAttrs: AnyObject = {}
      orderItemDto.extraMap.carRim.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (carRimAttrs[attr.attrKey] = this.handleData(attr)))
      orderItemDto.carRim = carRimAttrs

      // 内饰属性
      const carInteriorAttrs: AnyObject = {}
      orderItemDto.extraMap.carInterior.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (carInteriorAttrs[attr.attrKey] = this.handleData(attr)))
      orderItemDto.carInterior = carInteriorAttrs

      // 选装包
      const pks: any = []
      orderItemDto?.extraMap?.optionalPackage.forEach((pk: AnyObject) => {
        const pkAttrs: AnyObject = { id: pk.id }
        pk.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (pkAttrs[attr.attrKey] = this.handleData(attr)))
        pks.push(pkAttrs)
      })
      orderItemDto.optionalPackage = pks
      return orderItemDto
    },

    /**
     * 调整接口数据结构
     * @param skuId
     * @param optionalPackIds
     * @returns
     */
    async handleConvertApi(skuId: string, optionalPackIds: string[]) {
      const data = await getCarSkuDetail({ skuId: skuId, optionalPackIds: optionalPackIds.join(',') })
      // 车系数据处理
      if (data.carSeriesVO) {
        data.carSeriesVO = Object.assign(data.carSeriesVO, {
          placeOrderFlag: data.itemPreSaleVO.placeOrderFlag,
          preSaleFlag: data.preSaleFlag,
          showPriceFlag: data.itemPreSaleVO.showPriceFlag,
          attrs: {}
        })
        data.carSeriesVO.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (data.carSeriesVO.attrs[attr.attrKey] = this.handleData(attr)))
      }
      // 车型数据处理
      if (data.carVehicleVO) {
        data.carVehicleVO = Object.assign(data.carVehicleVO, {
          placeOrderFlag: data.itemPreSaleVO.placeOrderFlag,
          preSaleFlag: data.preSaleFlag,
          showPriceFlag: data.itemPreSaleVO.showPriceFlag,
          salePriceType: data.itemPreSaleVO.salePriceType,
          attrs: {},
          itemId: data.itemId
        })
        data.carVehicleVO.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => {
          attr.attrKey === 'desc' ? (data.carVehicleVO.attrs[attr.attrKey] = attr.attrVal.split('\\n')) : (data.carVehicleVO.attrs[attr.attrKey] = this.handleData(attr))
        })
      }

      // 外观数据处理
      if (data.carFacadeVO) {
        data.carFacadeVO.attrs = {}
        data.carFacadeVO.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (data.carFacadeVO.attrs[attr.attrKey] = this.handleData(attr)))
      }

      // 轮圈数据处理
      if (data.carRimVo) {
        data.carRimVo.attrs = {}
        data.carRimVo.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (data.carRimVo.attrs[attr.attrKey] = this.handleData(attr)))
      }

      // 内饰数据处理
      if (data.carInteriorVO) {
        data.carInteriorVO.attrs = {}
        data.carInteriorVO.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (data.carInteriorVO.attrs[attr.attrKey] = this.handleData(attr)))
      }

      return data
    },

    /**
     * 处理车辆配置总览数据
     * @param data
     * @returns
     */
    handleTransBusiness(data: Car.CarSku) {
      const obj = {
        // 外观数据处理
        outColor: {},
        outPainting: {},
        outPrice: null,
        // 轮圈数据
        rim: {},
        rimPrice: null,
        // 内饰数据
        innerColor: {},
        innerMaterial: {},
        innerPrice: null,
        // 选装包数据
        packages: [] as Car.Packages[],
        // 车辆图
        carPoster: ''
      }

      // 外观数据处理
      if (data.carFacadeVO) {
        obj.outColor = { name: data.carFacadeVO.attrs.colorName, image: data.carFacadeVO.attrs.colorImg }
        obj.outPainting = { name: data.carFacadeVO.attrs.paintingName, image: data.carFacadeVO.attrs.paintingImg }
        obj.outPrice = data.carFacadeVO.attrs.price
      }

      // 轮圈数据处理
      if (data.carRimVo) {
        obj.rim = { name: data.carRimVo.attrs.rimName, image: data.carRimVo.attrs.rimImg }
        obj.rimPrice = data.carRimVo.attrs.price
      }

      // 内饰数据处理
      if (data.carInteriorVO) {
        obj.innerColor = { name: data.carInteriorVO.attrs.colorName, image: data.carInteriorVO.attrs.colorImg }
        obj.innerMaterial = { name: data.carInteriorVO.attrs.materialName, image: data.carInteriorVO.attrs.materialImg }
        obj.innerPrice = data.carInteriorVO.attrs.price
      }

      // 选装包数据处理
      data?.optionalPackageVOS?.forEach((pk: Car.optionalPackageVOS) => {
        pk.attrs = {}
        pk.groupedCustomAttributes.forEach((attr: Car.GroupedCustomAttribute) => (pk.attrs[attr.attrKey] = this.handleData(attr)))
        obj.packages.push({ id: pk.id, name: pk.attrs.name, price: pk.attrs.price, image: pk.attrs.image })
      })

      // 车辆图
      obj.carPoster = data.carAssemblerMaterialVO ? data.carAssemblerMaterialVO.singleImageInfo.path : ''

      return obj
    },

    /**
     * 获取sku详情
     * @param skuId
     * @param optionalPackIds
     */
    async getSkuDetail(skuId: string, optionalPackIds: string[]) {
      uni.showLoading({
        title: '加载中'
      })
      try {
        const data = await this.handleConvertApi(skuId, optionalPackIds)
        const carObj = this.handleTransBusiness(data)
        // sku数据
        const skuData = data

        const vehicle = {
          ...carObj,
          status: data.status,
          series: data.carSeriesVO,
          model: data.carVehicleVO,
          skuData
        }
        this.setVehicle(vehicle)
        uni.hideLoading()
      } catch (error) {
        this.setVehicle({})
        uni.hideLoading()
      }
    },
    totalPrice(vehicle: AnyObject) {
      const modelPrice = vehicle.model && vehicle.model.attrs ? vehicle.model.attrs.price : 0
      const outPrice = vehicle.outPrice || 0
      const rimPrice = vehicle.rimPrice || 0
      const innerPrice = vehicle.innerPrice || 0
      const packages = (vehicle.packages || []).map((pk: AnyObject) => pk.price)
      const packagesPrice = packages.length ? packages.reduce((pre: number, cur: number) => pre + cur) : 0
      return modelPrice + outPrice + rimPrice + innerPrice + packagesPrice
    }
  }
})
