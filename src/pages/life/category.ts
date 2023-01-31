import { reactive, Ref, ref } from 'vue'
import { getCategoryRoot, getCategoryItems } from '@api/goods'

export function useCategory() {
  // 当前类目id
  const frontCategoryId: Ref<string | undefined> = ref('')
  // 所有一级前台类目
  const categoryList: Goods.FrontCategory[] = reactive([])
  // 一级前台类目下的二级类目及二级类目下商品列表
  const categoryItems = reactive({} as Goods.CategoryItems)

  /**
   * 刷新一级类目
   */
  async function refreshCategory() {
    // 刷新一级类目数据
    const list = await getCategoryRoot()
    categoryList.length = 0
    categoryList.push(...list)
  }

  /**
   * 刷新二级类目及其商品
   */
  async function refreshCategoryItems(categoryId?: string) {
    if (categoryId) {
      frontCategoryId.value = categoryId
    }
    const categoryItemList = await getCategoryItems(frontCategoryId.value as string)
    // if (!categoryItemList) {
    //   throw new Error(`商品类目id: ${categoryId}已不存在`)
    // }
    if (categoryItemList.length) {
      const itemList = categoryItemList[0]
      // 若三级类目下有数据，将三级类目取出放在二级类目下
      if (itemList.leafFlag) {
        Object.assign(categoryItems, itemList)
      } else {
        itemList.children.length &&
          itemList.children.forEach((item) => {
            if (!item.leafFlag) {
              item.children.forEach((child) => {
                item.itemDTOList.push(...child.itemDTOList)
              })
              item.children = []
            }
          })
        Object.assign(categoryItems, itemList)
      }
    }
  }
  return {
    frontCategoryId,
    categoryList,
    categoryItems,
    refreshCategory,
    refreshCategoryItems
  }
}
