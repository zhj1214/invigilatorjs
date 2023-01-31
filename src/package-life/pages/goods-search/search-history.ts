import { reactive, toRaw } from 'vue'
/**
 * 搜索历史
 * @returns
 */
export function useSearchHistory() {
  // 搜索记录
  const historyList: string[] = reactive([])

  historyList.push(...(uni.getStorageSync('GoodsSearchHistory') || []))

  /**
   * 保存搜索词
   * @param keyword
   */
  function saveHistory(keyword: string) {
    if (keyword !== undefined && keyword !== null) {
      let list = toRaw(historyList)
      list.unshift(keyword)
      list = [...new Set(list)] // 去重
      list.length > 14 && list.pop() // 超过14条删除最后一个
      historyList.length = 0
      historyList.push(...list)
      uni.setStorageSync('GoodsSearchHistory', list)
    }
  }

  /**
   * 清空搜索历史
   */
  function clearHistory() {
    uni.showModal({
      title: '提示',
      content: '确认清空历史搜索吗？',
      confirmColor: '#292c2e',
      success: (res) => {
        if (res.confirm) {
          uni.removeStorageSync('GoodsSearchHistory')
          historyList.length = 0
        }
      }
    })
  }
  return {
    historyList,
    saveHistory,
    clearHistory
  }
}
