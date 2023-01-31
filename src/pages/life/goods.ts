import { useCategory } from './category'
import { useRecommendGoods } from '@src/hooks/recommend-goods'

export function useGoods() {
  const { frontCategoryId, categoryList, categoryItems, refreshCategory, refreshCategoryItems } = useCategory()
  const { recommendItems, noMoreRecommendItems, refreshRecommendItems, getMoreRecommendItems } = useRecommendGoods()
  /**
   * 刷新页面类目、商品、商品推荐数据
   */
  async function refreshPage() {
    // 刷新一级类目数据
    await refreshCategory()
    // 若当前选中类目不存在 frontCategoryId 设置为第一个前台类目id
    const index = categoryList.findIndex((item) => item.id === frontCategoryId.value)
    if (index === -1) {
      frontCategoryId.value = categoryList[0].id
    }
    // 刷新类目下商品
    await refreshCategoryItems()
    // 刷新推荐商品
    await refreshRecommendItems({
      recType: 2,
      excludeFontCategoryId: frontCategoryId.value
    })
  }

  return {
    frontCategoryId,
    categoryItems,
    categoryList,
    recommendItems,
    noMoreRecommendItems,
    refreshCategoryItems,
    refreshPage,
    refreshRecommendItems,
    getMoreRecommendItems
  }
}
