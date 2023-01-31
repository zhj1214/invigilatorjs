import { reactive, ref } from 'vue'
import { getGoodsDetail } from '@api/goods'
import { getItemTwoEva } from '@api/evaluation'
import { useRecommendGoods } from '@src/hooks/recommend-goods'

export function useGoodsDetail() {
  const itemId = ref('')
  // 商品详情
  const goodsDetail = reactive({}) as Goods.Item
  const { recommendItems, noMoreRecommendItems, refreshRecommendItems, getMoreRecommendItems } = useRecommendGoods()
  // 当前展示的sku
  const currentSku = reactive({}) as Goods.Sku

  /**
   * 获取商品详情
   * @param id
   */
  async function refreshGoodsDetail(id: string) {
    try {
      itemId.value = id
      const detail = await getGoodsDetail(id)
      Object.assign(goodsDetail, detail)
      let currentSkuNew = null
      if (currentSku.skuBasicVO?.id && (currentSkuNew = detail.skuVOList.find((sku: { skuBasicVO: { id: string } }) => sku.skuBasicVO.id === currentSku.skuBasicVO.id))) {
        Object.assign(currentSku, currentSkuNew || {})
      } else {
        // 刷新商品信息后，没有选中的sku则显示最低价sku
        Object.assign(currentSku, getLowestPriceSku())
      }
      await getItemTwoEvaList(id)
    } catch (error) {
      console.log('商品信息获取失败')
    }
  }
  /**
   * 获取商品最新两条评价
   * @param itemId
   */
  let goodsEvaluations = reactive({
    applauseRate: 0,
    defaultNum: 0,
    itemEvaluationConsumer: [],
    totalNum: 0
  }) as Goods.GoodsEvaluations
  async function getItemTwoEvaList(itemId: string) {
    try {
      const resData = await getItemTwoEva(itemId)
      const { applauseRate, defaultNum, itemEvaluationConsumer, totalNum } = resData
      goodsEvaluations.applauseRate = applauseRate
      goodsEvaluations.defaultNum = defaultNum
      goodsEvaluations.itemEvaluationConsumer = itemEvaluationConsumer
      goodsEvaluations.totalNum = totalNum
    } catch (error) {
      console.log('商品评价信息获取失败')
    }
  }

  /**
   * 初次进入页面，需要从skus中获取默认展示的sku，最低价（包含进行中的活动价）
   */
  function getLowestPriceSku(): Goods.Sku {
    const { skuVOList, itemActivityVO } = goodsDetail
    let lowestPriceSku = skuVOList[0]
    // 商品sku活动信息
    const activity = itemActivityVO && itemActivityVO[0]
    goodsDetail.skuVOList?.forEach((item: Goods.Sku) => {
      let skuPrice = 0
      // 有活动取活动价格
      if (activity && activity.itemActivityStatus === 1) {
        const actSkuInfo = activity.activitySkuVos.find((actSku) => actSku.skuId === item.skuBasicVO.id)
        skuPrice = actSkuInfo ? actSkuInfo.activityPrice : item.skuBasicVO.price
      } else {
        skuPrice = item.skuBasicVO.price
      }
      if (skuPrice < lowestPriceSku.skuBasicVO.price) {
        lowestPriceSku = item
      }
    })
    return lowestPriceSku
  }

  return {
    goodsDetail,
    currentSku,
    recommendItems,
    noMoreRecommendItems,
    refreshGoodsDetail,
    refreshRecommendItems,
    getMoreRecommendItems,
    goodsEvaluations
  }
}
