import { reactive, ref } from 'vue'
import { getOrderInfo, getOrderLogisticsList } from '@src/api/order'
import { pureAssign } from '@util/common'

const defaultDetail = {
  id: '',
  order: {
    subtotalAmount: 0,
    receiveInfo: '',
    payLeftTime: 0,
    receiveLeftTime: 0,
    purchaserMobile: ''
  },
  orderItemDtoList: [],
  status: 0,
  totalAmount: 0,
  totalPointNum: 0,
  totalPointAmount: 0,
  receiveInfo: {
    receiver: '',
    mobile: '',
    receiveAddress: ''
  },
  totalCouponAmount: 0,
  couponList: [],
  userRemark: '',
  createdAt: 0,
  extraMap: {},
  payType: 0,
  payTime: 0,
  orderInvoice: {
    invoiceTitle: '',
    invoiceContent: ''
  },
  shipAmount: 0,
  orderItemList: [],
  payLeftTime: 0,
  autoReceiveStatus: null, //存在先申请售后，订单状态再变为待收货的情况，此时后端返回的的autoReceiveStatus是null
  receiveLeftTime: 0,
  afterSalesApplyTimeOut: false,
  wholeAssessStatus: null,
  orderDelivery: [],
  purchaserMobile: '',
  orderType: 0
} as unknown as Order.LifeDetailInfo
/**
 * @description: 获取订单详情
 * @Date: 2021-12-04 16:59:12
 * @param {*}
 * @return {*}
 */
const subtotalPoint = ref(0)
const subtotalPrice = ref(0)

async function getOrderDetail(orderId: string) {
  uni.showLoading({
    title: '加载中'
  })
  const data = await getOrderInfo(orderId)
  uni.stopPullDownRefresh()
  uni.hideLoading()
  const { order, orderItemDtoList, orderItemList, couponList, orderInvoice, orderDelivery } = data
  const { subtotalAmount, receiveInfo, payLeftTime, receiveLeftTime } = order
  const orderItemData: Order.ItemDtoListInfo[] = await getOrderItemDtoList(orderItemDtoList, subtotalAmount)
  const couponData: CouponInfo[] = await getCouponList(couponList)

  const orderDeliveryFormData: Order.OrderDeliveryInfo[] =
    orderDelivery &&
    orderDelivery.map((deliveryItem: AnyObject) => {
      return {
        expressNumber: deliveryItem.expressNum,
        expressCode: deliveryItem.expressCode,
        telphone: JSON.parse(receiveInfo).moblie
      }
    })
  const obj = {
    ...order,
    orderItemDtoList: orderItemData,
    receiveInfo: JSON.parse(receiveInfo),
    couponList: couponData,
    orderInvoice,
    orderItemList,
    payLeftTime: payLeftTime / 1000,
    receiveLeftTime: receiveLeftTime / 1000,
    orderDelivery: orderDeliveryFormData
  }
  return obj
}

/**
 * @description: 批量获取物流信息
 * @Date: 2021-12-06 10:57:25
 * @param {*}
 * @return {*}
 */
async function getTrackList(orderDeliveryFormData: Order.OrderDeliveryInfo[], mobile: string) {
  uni.showLoading({
    title: '加载中'
  })
  const res = await getOrderLogisticsList({ requests: orderDeliveryFormData })
  uni.hideLoading()
  let orderDeliveryInformation = res.map((item: AnyObject) => {
    let trace = item.traces[item.traces.length - 1]
    trace = trace || {
      acceptStation: '暂无物流信息',
      acceptTime: ''
    }
    trace.expressNumber = item.logisticCode
    trace.expressCode = item.shipperCode
    trace.telphone = mobile
    return {
      ...trace
    }
  })
  orderDeliveryInformation = orderDeliveryInformation.filter(
    (item: { expressCode: string; expressNum: string }) => item.expressCode === item.expressCode && item.expressNum === item.expressNum
  )
  return orderDeliveryInformation
}

async function getOrderItemDtoList(orderItemDtoList: AnyObject, subtotalAmount: number) {
  return orderItemDtoList.map((orderItem: AnyObject) => {
    if (orderItem.skuPayMode === 2) {
      subtotalPoint.value += orderItem.totalPointAmount
    }
    subtotalPrice.value = subtotalAmount - subtotalPoint.value
    return orderItem
  })
}

async function getCouponList(couponList: AnyObject) {
  return couponList.map((couponItem: AnyObject) => {
    const { id, name, code, source } = couponItem
    return {
      id,
      name,
      code,
      source
    }
  })
}

function handleDealDeleveryData(orderItemDtoList: Order.ItemDtoListInfo[]) {
  const arr: any = []
  orderItemDtoList.forEach((orderItem: AnyObject) => {
    const { itemImage, itemName, itemType, attributeMaps, quantity, id, status } = orderItem
    if (orderItem.orderDeliveryDtoList) {
      orderItem.orderDeliveryDtoList.forEach((deliveryItem: AnyObject) => {
        const { expressNum, expressCode } = deliveryItem
        const deliveryObj = {
          expressNum: expressNum,
          expressCode: expressCode
        }
        const orderItemList = {
          itemImage: itemImage,
          itemName: itemName,
          itemType: itemType,
          attributeMaps: attributeMaps,
          quantity: quantity,
          status: status,
          retailPrice: 0
        }
        const obj = {
          ...deliveryObj,
          orderItemList,
          id
        }
        arr.push(obj)
      })
    }
  })
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    const index = newArr.findIndex((item: AnyObject) => item.expressCode === arr[i].expressCode && item.expressNum === arr[i].expressNum)
    if (index !== -1) {
      newArr[index].orderItemDtoList.push(arr[i].orderItemList)
    } else {
      newArr.push({
        expressNum: arr[i].expressNum,
        expressCode: arr[i].expressCode,
        telphone: arr[i].telphone,
        orderItemDtoList: [arr[i].orderItemList],
        orderId: arr[i].id
      })
    }
  }

  return newArr
}

export const useDetail = () => {
  const orderDetail: Order.LifeDetailInfo = reactive(defaultDetail)
  const orderItemDeliveryData: any = reactive([])
  const orderDeliveryList: Order.OrderDeliveryInfo[] = reactive([])
  subtotalPoint.value = 0
  subtotalPrice.value = 0

  /**
   * @description: 获取订单详情
   * @Date: 2021-12-04 16:59:12
   * @param {*}
   * @return {*}
   */
  async function getOrderInfos(orderId: string) {
    const detail = await getOrderDetail(orderId)
    const { orderItemDtoList, orderDelivery } = detail
    orderItemDeliveryData.push(...handleDealDeleveryData(orderItemDtoList))
    pureAssign(orderDetail, detail)
    if (orderDelivery?.length > 0 && orderDeliveryList.length === 0) {
      try {
        const data = await getTrackList(orderDelivery, detail.purchaserMobile)
        orderDeliveryList.push(...data)
      } catch {
        console.log('getTrackList接口调用失败')
      }
    }
  }
  return {
    orderDetail,
    orderItemDeliveryData,
    orderDeliveryList,
    subtotalPoint,
    subtotalPrice,
    getOrderInfos
  }
}
