import { useCarStore } from '@src/pinia/car'

const carStore = useCarStore()
/**
 *
 * @param index  修改的不同模块 0:外饰, 1:轮圈, 2:内饰, 3:选装
 * @param hideWish 是否隐藏心愿单按钮
 * @param model 车型信息
 * @param cartWishId 心愿单id
 */
export default function useGoBackSetting(index: number, hideWish: boolean, model: { itemId: number }, cartWishId: string) {
  carStore.setConfigActive(index)
  const pages = getCurrentPages()
  if (hideWish || pages.length === 1) {
    uni.navigateTo({
      url: `/package-car/pages/vehicle-setting/index?itemId=${model.itemId}&hideWish=true&cartWishId=${cartWishId}`
    })
  } else {
    uni.navigateBack({
      delta: 1
    })
  }
}
