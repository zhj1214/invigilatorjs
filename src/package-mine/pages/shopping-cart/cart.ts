import { computed, reactive, ref } from 'vue'
import { getCartList, removeGoods, changeGoodsInfo, changeGoodsNumber } from '@api/cart'
import dayjs from '$dayjs'
import { Enum } from '@src/lib/enmu'
import { formatDate } from '@src/util/date-time'
import { FormatedPriceInfo, formatPrice } from '@src/util/money'
/**
 * 校验商品库存是否充足
 * @param goods
 * @returns
 */
export function hasStock(goods: Cart.Goods) {
  if (goods.activitySkuVos?.length && goods.activitySkuVos[0].itemActivityStatus === 1) {
    const { activityType } = goods.activitySkuVos[0]
    if (activityType === 5) {
      const activitySku = goods.activitySkuVos.find((item) => item.skuId === goods.skuId) as Goods.Activity.Sku
      return activitySku.skuQuantity >= goods.quantity
    }
  } else {
    return goods.stockQuantity >= goods.quantity
  }
}

/**
 * 改变购物车商品数量
 * @param goods
 */
export async function changeNumber(goods: Cart.Goods) {
  await changeGoodsNumber({
    id: goods.id,
    itemId: goods.itemId,
    skuId: goods.skuId,
    shopCode: goods.shopCode,
    quantity: goods.quantity
  })
}
/**
 * 获取购买上限
 * @param goods
 * @returns
 */

export function toGeneratorStockNumber(goods: Cart.Goods) {
  let num = 99
  if (goods.activitySkuVos?.length) {
    const { activityType, itemActivityStatus } = goods.activitySkuVos[0]
    if (activityType === 5 && itemActivityStatus === 1) {
      const activitySku = goods.activitySkuVos.find((item) => item.skuId === goods.skuId) as Goods.Activity.Sku
      num = activitySku.skuBuyLimit ? Math.min(activitySku.skuBuyLimit, activitySku.skuQuantity) : activitySku.skuQuantity
    }
  } else if (goods.limitQuantity) {
    num = Math.min(goods.limitQuantity, goods.stockQuantity)
  } else {
    num = Number(goods.stockQuantity)
  }
  return num > 99 ? 99 : num
}

/**
 * 改变购物车sku
 * @param goods
 */
export async function changeCartSku(goods: Cart.Goods, newSku: Goods.Sku) {
  const activityId = newSku.activityVO ? newSku.activityVO[0].id : ''
  await changeGoodsInfo({
    oldId: goods.id,
    itemId: goods.itemId,
    oldSkuId: goods.skuId,
    skuId: newSku.skuBasicVO.id,
    activityId,
    quantity: goods.quantity,
    snapshotPrice: goods.snapshotPrice,
    parentId: 0,
    vmId: 1
  })
}

/**
 * 生成商品属性字符串
 * @param skuAttr
 * @returns
 */
export function toGeneratorSkuAttr(skuAttr: Goods.SkuAttributeValueVOList[]) {
  return skuAttr
    ? skuAttr.reduce((str, next, index, arr) => {
        return str + (index === arr.length - 1 ? next.attributeValue : `${next.attributeValue}/`)
      }, '')
    : ''
}

/**
 * 购物车有效商品
 */
export interface CartGoods extends Cart.Goods {
  activityInfo: {
    isActivityGoing: boolean
    activityTypeName: string
    activityStatusName: string
    startTimeFormat: string
    endTimeFormat: string
  } | null
  priceInfo: FormatedPriceInfo
}
/**
 * 格式化购物车有效商品列表
 * 活动信息格式化、增加计算后价格
 * @param goodsList
 * @param pointRatio
 * @returns
 */
export function formatGoodsList(goodsList: Cart.Goods[], pointRatio: number): CartGoods[] {
  return goodsList?.map((item) => {
    const skuActInfo = item.activitySkuVos?.find((skuAct) => skuAct.skuId === item.skuId)
    const isStartAfterCurrentYear = skuActInfo ? dayjs(skuActInfo.startTime).isAfter(dayjs().endOf('year')) : ''
    const isEndAfterCurrentYear = skuActInfo ? dayjs(skuActInfo.endTime).isAfter(dayjs().endOf('year')) : ''
    return {
      ...item,
      activityInfo: skuActInfo
        ? {
            isActivityGoing: skuActInfo.itemActivityStatus === Enum.Activity.Status.IsGoing,
            activityTypeName: Enum.Activity.getTypeText(skuActInfo.activityType),
            activityStatusName: Enum.Activity.getStatusText(skuActInfo.itemActivityStatus),
            startTimeFormat: formatDate(skuActInfo.startTime as number, isStartAfterCurrentYear ? 'YYYY年M月D日' : 'M月D日 H:mm'),
            endTimeFormat: formatDate(skuActInfo.endTime as number, isEndAfterCurrentYear ? 'YYYY年M月D日' : 'M月D日 H:mm')
          }
        : null,
      priceInfo: formatPrice({
        payType: item.payType,
        price: item.snapshotPrice,
        pointPrice: Number(item.pointPrice),
        pointRatio: pointRatio,
        maxPointPrice: Number(item.maxPointPrice),
        activityInfo: skuActInfo
          ? {
              activityPrice: skuActInfo.activityPrice,
              activityStatus: skuActInfo.itemActivityStatus
            }
          : null
      })
    }
  })
}

/**
 * 批量移除购物车商品
 * @param ids
 * @returns
 */
export async function removeCartGoods(ids: string): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title: '提示',
      content: '确认删除？',
      success: async (res) => {
        if (res.confirm) {
          uni.showLoading({
            mask: true
          })
          try {
            await removeGoods(ids)
            uni.hideLoading()
            uni.showToast({
              title: '删除成功'
            })
            resolve(true)
          } catch (error) {
            uni.hideLoading()
            resolve(false)
          }
        } else {
          resolve(false)
        }
      }
    })
  })
}

/**
 * 购物车操作
 * @returns
 */
export function useCart() {
  // 全部购物车商品
  const cartList: Cart.Goods[] = reactive([])
  // 有效购物车商品
  const validCartList = computed(() => cartList.filter((item) => item.status === 1))
  // 有效且库存充足可以购买的购物车商品
  const canBoughtCartList = computed(() => validCartList.value.filter((item) => item.status === 1 && hasStock(item)))
  // 失效购物车商品
  const invalidCartList = computed(() => cartList.filter((item) => item.status === 0))
  // 购物车商品总数
  const total = ref(0)
  // 是否为空
  const isEmpty = ref(false)

  /**
   * 获取购物车商品
   */
  async function getCart() {
    const data = await getCartList()
    total.value = data.length
    isEmpty.value = !data.length
    cartList.length = 0
    cartList.push(...data)
  }

  return {
    cartList,
    validCartList,
    canBoughtCartList,
    invalidCartList,
    total,
    isEmpty,
    getCart
  }
}
