import { getCartWishList, addCartWish, deleteCartWish } from '@src/api/cart-wish'
import { useCarStore } from '@src/pinia/car'

interface WishInfo {
  id: string
  skuId: string
  optionalPackIds: string[]
}

interface WishId {
  id: string
}

const carStore = useCarStore()

/**
 *
 *获取心愿单
 * @return {wish}
 */
const getWishData = async (optionalPackIds: string[], skuId: string): Promise<WishId> => {
  try {
    const list: Array<{ id: string; skuId: string; extra: { optionalPackIds: string[] } }> = (await getCartWishList()) as Array<{
      id: string
      skuId: string
      extra: { optionalPackIds: string[] }
    }>
    const wishList: WishInfo[] = list.map((item) => {
      return {
        id: item.id,
        skuId: item.skuId,
        optionalPackIds: item.extra.optionalPackIds
      }
    })
    const wish = wishList.find((item) => {
      item.optionalPackIds.sort()
      optionalPackIds.sort()
      console.log(item.optionalPackIds.join(','), '2323', optionalPackIds.join(','), 'hehhehhe')
      return item.skuId === skuId && item.optionalPackIds.join(',') === optionalPackIds.join(',')
    })
    return {
      id: wish ? wish.id : ''
    }
  } catch (error) {
    throw new Error('获取心愿单失败')
  }
}

/**
 * 删除心愿单
 */
const deleteWish = (cartWishId: string) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: '确认删除心愿单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            uni.showLoading({
              title: '正在删除心愿单'
            })
            await deleteCartWish(cartWishId)
            uni.hideLoading()
            resolve('心愿单已删除')
          } catch (error) {
            uni.hideLoading()
          }
        }
      }
    })
  })
}

/**
 * 添加心愿
 */
const addWish = (vehicle: AnyObject, model: AnyObject, packages: Car.Packages[]) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      cancelText: '不保存',
      confirmText: '保存',
      content: '是否将配置存入心愿单？',
      success: async (res) => {
        if (res.confirm) {
          const optionalPackIds = packages.map((pk) => pk.id)
          const data = {
            placeOrderFlag: vehicle.skuData.itemPreSaleVO.placeOrderFlag,
            preSaleFlag: vehicle.preSaleFlag,
            showPriceFlag: vehicle.skuData.itemPreSaleVO.showPriceFlag,
            itemId: vehicle.skuData.itemId,
            itemName: model.attrs.title,
            skuId: vehicle.skuData.id,
            extra: {
              modelName: model.attrs.title,
              optionalPackIds,
              carPoster: vehicle.carPoster,
              totalPrice: carStore.totalPrice(vehicle), // 现为前端传入，待与后端沟通
              saleAttrs: [
                `${vehicle.outColor.name} + ${vehicle.outPainting.name} `,
                vehicle.rim.name,
                `${vehicle.innerColor.name} + ${vehicle.innerMaterial.name} `,
                ...[...packages.map((pk) => pk.name)]
              ]
            }
          }
          try {
            uni.showLoading({
              title: '正在添加心愿单'
            })
            await addCartWish(data)
            uni.hideLoading()
            uni.showToast({
              title: '添加心愿单成功',
              duration: 1000
            })
            resolve('添加心愿单成功')
          } catch (error) {
            uni.hideLoading()
            reject()
          }
        }
      }
    })
  })
}

export default function useWish() {
  return {
    getWishData,
    deleteWish,
    addWish
  }
}
