import { reactive, ref } from 'vue'
import { getRecommendAtGoods } from '@api/recommend'

export function useRecommendGoods() {
  // 一级前台类目下的二级类目及二级类目下商品列表
  const recommendItems: Goods.Item[] = reactive([])

  // 推荐商品列表参数
  const pageNo = ref(1)
  const pageSize = 20
  const params: Goods.RecommendItemsQuery = {
    pageNo: pageNo.value,
    pageSize,
    recItemTypes: '1,2,3'
  }
  // 没有更多推荐商品
  const noMoreRecommendItems = ref(false)

  /**
   * 分页获取推荐商品列表
   * @returns
   */
  async function getRecommendItems() {
    const { data = [], total } = await getRecommendAtGoods(params)
    // 判断已无更多分页数据，已到底部
    noMoreRecommendItems.value = data.length < pageSize || total === recommendItems.length + data.length
    return data
  }

  /**
   * 刷新推荐商品，重置推荐分页
   */
  async function refreshRecommendItems(query: Goods.RecommendItemsQuery) {
    Object.assign(params, query)
    pageNo.value = 1
    const list = await getRecommendItems()
    recommendItems.length = 0
    recommendItems.push(...list)
  }

  /**
   * 获取下一页推荐商品
   */
  async function getMoreRecommendItems() {
    if (!noMoreRecommendItems.value) {
      pageNo.value++
      try {
        // const list = await getRecommendItems()
        // const list = []
        // recommendItems.push(...list)
      } catch (error) {
        pageNo.value--
      }
    }
  }

  return {
    recommendItems,
    noMoreRecommendItems,
    refreshRecommendItems,
    getMoreRecommendItems
  }
}
