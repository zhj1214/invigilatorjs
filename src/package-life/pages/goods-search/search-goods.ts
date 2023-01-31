import { getSearchGoodsList } from '@src/api/recommend'
import { nextTick, reactive, Ref, ref } from 'vue'

// eslint-disable-next-line max-lines-per-function
export function useSearchGoods() {
  // 搜索出的商品列表
  const goodsList: Goods.Item[] = reactive([])
  const pageNo = ref(1)
  const noMore = ref(false)
  const sortKey = ref('')
  const sortType: Ref<number | null> = ref(null)
  const pageSize = 20
  const hasSearched = ref(false)

  async function getSearchGoods(keyword: string, page?: number, size?: number): Promise<PageListInfo<Goods.Item>> {
    uni.showLoading({
      mask: true,
      title: '努力搜索中...'
    })
    const params = {
      keyword,
      pageNo: page || pageNo.value,
      pageSize: size || pageSize
    }
    if (sortKey.value && sortType.value !== null) {
      Object.assign(params, {
        sortKey: sortKey.value,
        sortType: sortType.value
      })
    }
    const data = await getSearchGoodsList(params)
    hasSearched.value = true
    uni.hideLoading()
    return data
  }

  async function refreshGoods(keyword: string) {
    if (keyword === '') {
      return
    }
    pageNo.value = 1
    noMore.value = false
    const { data, total } = await getSearchGoods(keyword)
    goodsList.length = 0
    goodsList.push(...data)
    noMore.value = data.length === 0 || total === goodsList.length
    nextTick(() => {
      uni.pageScrollTo({
        scrollTop: 0
      })
    })
  }

  async function refreshAllGoods(keyword: string) {
    if (keyword === '') {
      return
    }
    const { data, total } = await getSearchGoods(keyword, 1, pageNo.value * pageSize)
    goodsList.length = 0
    goodsList.push(...data)
    noMore.value = data.length === 0 || total === goodsList.length
  }

  async function getMoreGoods(keyword: string) {
    if (keyword === '' || noMore.value) {
      return
    }
    pageNo.value++
    const { data, total } = await getSearchGoods(keyword)
    goodsList.push(...data)
    noMore.value = data.length === 0 || total === goodsList.length
  }

  function setOrder(order: { sortKey: string; sortType: number }) {
    sortKey.value = order.sortKey
    sortType.value = order.sortType
  }

  function resetSearchGoods() {
    goodsList.length = 0
    hasSearched.value = false
  }

  return {
    hasSearched,
    goodsList,
    noMore,
    refreshGoods,
    refreshAllGoods,
    getMoreGoods,
    setOrder,
    resetSearchGoods
  }
}
