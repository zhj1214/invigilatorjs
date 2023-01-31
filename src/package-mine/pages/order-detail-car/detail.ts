import { ref, reactive, computed } from 'vue'
import { getOrderInfo } from '@src/api/order'
import { useCarStore } from '@src/pinia/car'
import { pureAssign } from '@util/common'
import { formatMoney } from '@util/money'

const carStore = useCarStore()
const defaultOrderDetail = {
  afterSalesApplyTimeOut: false,
  assessStatus: 0,
  extraMap: {
    orderWay: 0,
    preSaleFlag: true,
    purchaser: {
      certificateNumber: '',
      certificateType: 0,
      dealerId: '',
      mobile: '',
      name: ''
    },
    showPriceFlag: true,
    vehiclePayType: 0
  },
  id: '',
  isVisibled: 1,
  orderType: 0,
  parentId: '',
  payLeftTime: 0,
  payOutTime: 0,
  payTime: null,
  payType: 1,
  purchaserId: '',
  purchaserMobile: '',
  purchaserName: '',
  receiveInfo: null,
  receiveLeftTime: null,
  remainReceiveTime: null,
  remark: null,
  shipAmount: 0,
  shopCode: '',
  status: 0,
  subtotalAmount: 1,
  totalAmount: 1,
  totalCouponAmount: 0,
  totalPointAmount: 0,
  totalPointNum: 0,
  userRemark: null,
  wholeAssessStatus: 0
}
const defaultOrderItemDetail = {
  status: 0,
  carFacade: { price: 0, colorName: '', paintingName: '' },
  carRim: { price: 0, rimName: '' },
  carInterior: { price: 0, colorName: '', materialName: '' },
  carVehicle: { price: 0, name: '' },
  optionalPackage: [{ price: 0, id: '', name: '' }],
  orderAfterSalesDto: { id: '' },
  orderId: '',
  itemType: '',
  id: '',
  skuId: '',
  materialImage: { path: '' }
}

/**
 * 获取总价
 * */
function getTotalMoney(item: Order.CarDetailInfo) {
  let tempTotal = 0
  if (item.optionalPackage && item.optionalPackage.length > 0) {
    item.optionalPackage.forEach((i) => {
      tempTotal += i.price
    })
  }
  const computePrice = item.carFacade.price + item.carRim.price + item.carInterior.price + item.carVehicle.price + tempTotal
  return formatMoney(computePrice, 0, 0)
}

const idTypeMaps = ref({
  0: '居民身份证',
  1: '护照',
  2: '军官证',
  3: '台胞证',
  4: '香港身份证',
  5: '澳门居民身份证'
}) as AnyObject

const useDetail = () => {
  const orderItemDetail: Order.CarDetailInfo = reactive(defaultOrderItemDetail)
  const orderDetail: Order.CarOrderInfo = reactive(defaultOrderDetail)
  const vehiclePayType = computed(() => orderDetail?.extraMap?.vehiclePayType)
  const showPriceFlag = computed(() => orderDetail?.extraMap?.showPriceFlag)
  const agencyCode = computed(() => orderDetail?.extraMap?.pay && orderDetail.extraMap.pay.agencyCode)
  const orderAfterSale = computed(() => orderItemDetail.orderAfterSalesDto)
  const orderIdList = ref([])

  /**
   * 获取订单详情
   */
  async function getOrderDetail(orderId: string) {
    uni.showLoading({
      title: '加载中'
    })
    try {
      const data = await getOrderInfo(orderId)
      uni.hideLoading()
      const detail = await carStore.getCarDetailInfo(data.orderItemDtoList)
      pureAssign(orderItemDetail, detail)
      data.order.dealer = JSON.parse(data.order.dealer as string)
      pureAssign(orderDetail, data.order)
      orderIdList.value = data.orderItemList
    } catch {
      uni.hideLoading()
    }
  }

  return {
    orderItemDetail,
    orderDetail,
    vehiclePayType,
    showPriceFlag,
    agencyCode,
    orderAfterSale,
    orderIdList,
    idTypeMaps,
    getOrderDetail,
    getTotalMoney
  }
}

export default useDetail
