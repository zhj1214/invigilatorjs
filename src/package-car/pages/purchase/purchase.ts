import { useCarStore } from '@src/pinia/car'
import { computed, reactive, ref, ComputedRef, watch, Ref } from 'vue'
import { ReserveType, IdType, checkName, checkPhone, checkIdCard } from './util'
import { relogin } from '@src/api/request'
import { getBusinessId } from '@api/pay'
import { addOrder } from '@src/api/order'
import { useAppStore } from '@src/pinia/app'
const carStore = useCarStore()
/**
 * 订单车辆信息
 */
const vehicle = computed(() => carStore.vehicle)
/**
 * 车型
 */
const model = computed(() => vehicle.value.model || {})

const totalPrice: ComputedRef<string> = computed(() => carStore.totalPrice(vehicle.value))

const provider: ComputedRef<Dealer.Iteminfo> = computed(() => carStore.provider)

const buyer = ref('')
const phone = ref('')
const idNum = ref('')
const carOwner = ref('')

const idTypeArr = [
  {
    value: 0,
    label: '居民身份证'
  }
]
const idType = reactive({
  value: 0,
  label: '居民身份证'
})

const isLogin = computed(() => useAppStore().isLogin)

/**
 * 组合外饰配置信息
 */
function getOutText() {
  const outText = computed(() => {
    return `${(vehicle.value.outColor && vehicle.value.outColor.name) || ''}${
      vehicle.value.outColor && vehicle.value.outColor.name && vehicle.value.outPainting && vehicle.value.outPainting.name ? '+' : ''
    }${(vehicle.value.outPainting && vehicle.value.outPainting.name) || ''}`
  })

  return {
    outText
  }
}

/**
 *
 * 组合内饰配置信息
 * @returns
 */
function getInnerText() {
  const innerText = computed(() => {
    return `${(vehicle.value.innerColor && vehicle.value.innerColor.name) || ''}${
      vehicle.value.innerColor && vehicle.value.innerColor.name && vehicle.value.innerMaterial && vehicle.value.innerMaterial.name ? '+' : ''
    }${(vehicle.value.innerMaterial && vehicle.value.innerMaterial.name) || ''}`
  })

  return {
    innerText
  }
}

/**
 * 预定方式
 * @returns {reserveTypes}
 */
function getReserveTypes() {
  const reserveTypes: ComputedRef<ReserveType[]> = computed(() => {
    if (vehicle.value.skuData) {
      const depositPrice = vehicle.value.skuData.skuPriceVO.depositPrice[0].price || 0
      const intentionPrice = vehicle.value.skuData.skuPriceVO.intentionPrice[0].price || 0
      const types = []
      const payMode = vehicle.value.skuData.payMode
      if ([1, 3].includes(payMode) && intentionPrice) {
        types.push({
          value: 0,
          text: '意向金',
          desc: '可退',
          price: intentionPrice / 100
        })
      }
      if ([2, 3].includes(payMode) && depositPrice) {
        types.push({
          value: 1,
          text: '定金',
          desc: '不可退',
          price: depositPrice / 100
        })
      }
      return types
    }
    return []
  })

  return {
    reserveTypes
  }
}

/**
 * 根据预定方式获取意向金或定金
 * @param reserveType
 * @returns {reservePrice}
 */
function getReservePrice(reserveType: AnyObject) {
  const { reserveTypes } = getReserveTypes()
  const reservePrice = computed(() => {
    const item = reserveTypes.value.find((type) => type.value === reserveType.value)
    return item?.price || 0
  })
  return {
    reservePrice
  }
}

/**
 * 根据hash滚动到页面相应位置
 * @param content
 * @param selector
 */
function toShowToastAndScroll(content: string, selector?: string) {
  if (selector) {
    uni.pageScrollTo({
      selector
    })
  }
  uni.showToast({
    title: content,
    duration: 1500,
    icon: 'none'
  })
}

// 验证购买和车主信息表单信息
function handleToValid(options: AnyObject) {
  const { reserveType, checked } = options
  let validFlag = true
  const validArr = [
    { id: '#buyer', msg: '请填写购买人姓名', value: buyer, validFn: checkName },
    { id: '#phone', msg: '请填写手机号码', value: phone, validFn: checkPhone },
    { id: '#idNum', msg: '请填写证件号码', value: idNum, validFn: checkIdCard },
    { id: '#provider', msg: '请选择服务商', value: provider, validFn: () => true }
  ]
  if (!isLogin.value) {
    relogin()
    validFlag = false
    return
  }

  if (reserveType.value === 1) {
    if (carOwner.value === '') {
      toShowToastAndScroll('请填写车主姓名', '#carOwner')
      validFlag = false
      return
    } else if (!checkName(carOwner.value)) {
      carOwner.value = ''
      uni.pageScrollTo({ selector: '#carOwner' })
      validFlag = false
    }
  }

  for (const item of validArr) {
    if (item.value.value && item.validFn(item.value.value)) {
      continue
    }

    if (item.value.value === '') {
      toShowToastAndScroll(item.msg, item.id)
      validFlag = false
      break
    } else if (!item.validFn(item.value.value)) {
      item.value.value = ''
      uni.pageScrollTo({ selector: item.id })
      validFlag = false
      break
    } else if (!provider.value.name) {
      toShowToastAndScroll('请选择服务商', '#provider')
      validFlag = false
      break
    } else if (!checked.value) {
      toShowToastAndScroll('请阅读并同意相关协议')
      validFlag = false
      break
    }
  }

  return validFlag
}

/**
 * 支付操作
 * @param options
 * @returns { toBuy, buyer, phone, idNum, carOwner }
 */
function handletoBuy(options: AnyObject) {
  const toBuy = async () => {
    const { loading, reserveType, cartWishId, skuId, optionalPackIds } = options
    const judgeFlag = handleToValid({ ...options, buyer, phone, idNum, carOwner })
    if (!judgeFlag) {
      return
    }
    // console.log('handleToValid({ ...options, buyer, phone, idNum, carOwner })', handleToValid({ ...options, buyer, phone, idNum, carOwner }))
    loading.value = true
    try {
      const businessId = (await getBusinessId()) as string
      const data = {
        businessId,
        vmId: 1,
        vehiclePayType: reserveType.value,
        orderChannel: cartWishId.value ? 1 : 0,
        cartWishId: cartWishId.value || null,
        itemToOrderList: [{ skuId: skuId.value, optionalPackIds, itemId: vehicle.value.skuData.itemId, quantity: 1 }],
        purchaser: { name: buyer.value, mobile: phone.value, dealerId: provider.value.id }
      }
      if (reserveType.value === 0) {
        Object.assign(data.purchaser, {
          certificateType: idType.value,
          certificateNumber: idNum.value
        })
      } else if (reserveType.value === 1) {
        Object.assign(data, {
          carOwner: {
            name: carOwner.value,
            certificateType: idType.value,
            certificateNumber: idNum.value
          }
        })
      }
      const orderId = await addOrder(data)
      loading.value = false
      const url = `/package-life/pages/payment/index?orderId=${orderId}&type=0&isRedirect=${!cartWishId.value ? 'true' : 'false'}`
      uni.redirectTo({ url })
    } catch (error) {
      loading.value = false
    }
  }

  return { toBuy, buyer, phone, idNum, carOwner }
}

/**
 * 初始化预览配置页面跳转进入携带数据
 * @param parms
 * @returns
 */
function handleInit(parms: { skuId: any; hideWish: any; cartWishId: any; optionalPackIds: any }) {
  const toInit = (options: { skuId: any; hideWish: any; cartWishId: any; pkIds: any }) => {
    const { skuId, hideWish, cartWishId, optionalPackIds } = parms
    skuId.value = Number(options.skuId)
    hideWish.value = options.hideWish === 'true'
    cartWishId.value = Number(options.cartWishId)
    if (skuId.value) {
      options.pkIds && optionalPackIds.push(...options.pkIds.split(','))
      carStore.getSkuDetail(skuId.value, optionalPackIds)
    } else {
      skuId.value = vehicle.value?.skuData?.id
      optionalPackIds.push(...(vehicle.value.packages || []).map((pk: { id: string }) => pk.id))
    }
  }
  return {
    toInit
  }
}

/**
 * 跳转到选择服务商选择页面
 */
function toSelectProvider() {
  uni.navigateTo({ url: `/package-car/pages/select-provider/index` })
}

/**
 * 初始化表单信息
 */
function initBuyerInfo() {
  buyer.value = ''
  phone.value = ''
  idNum.value = ''
  carOwner.value = ''
}

export default function usePurchase() {
  /**
   * 页面参数
   * @var skuId skuid
   * @var hideWish 隐藏加入心愿单
   * @var cartWishId 心愿单id
   * @var optionalPackIds
   */
  const hideWish = ref(false)
  const cartWishId = ref(0)
  const skuId = ref(0)
  const selectorVisible = ref(false)
  const optionalPackIds: string[] = reactive([])
  const { toInit } = handleInit({ skuId, hideWish, cartWishId, optionalPackIds })
  // 预订方式处理逻辑
  const reserveType: Ref<null | number> = ref(null)
  const { reserveTypes } = getReserveTypes()
  watch(
    reserveTypes,
    (types: string | any[]) => {
      reserveType.value = types.length ? types[0].value : null
    },
    {
      immediate: true
    }
  )

  const loading = ref(false)
  const checked = ref(false)
  const { outText } = getOutText()
  const { innerText } = getInnerText()
  const { reservePrice } = getReservePrice(reserveType)
  const { toBuy } = handletoBuy({ loading, reserveType, cartWishId, skuId, optionalPackIds, idType, checked })
  return {
    outText,
    innerText,
    reservePrice,
    reserveTypes,
    reserveType,
    idTypeArr,
    idType,
    totalPrice,
    model,
    vehicle,
    buyer,
    phone,
    idNum,
    carOwner,
    provider,
    checked,
    selectorVisible,
    toSelectProvider,
    toInit,
    initBuyerInfo,
    toBuy
  }
}
