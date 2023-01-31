import { nextTick, ref } from 'vue'

/**
 * scroll-view滚动到顶部（最左侧）
 * @returns
 */
export function useScrollTop() {
  const scrollTop = ref(0)
  let oldScrollTop = 0

  /**
   * 滚动事件，记录滚动位置
   */
  const scroll = (e: ScrollEvent) => {
    oldScrollTop = e.detail.scrollTop
  }

  /**
   * 回到顶部（最左侧）
   */
  const goTop = () => {
    scrollTop.value = oldScrollTop
    nextTick(() => {
      scrollTop.value = 0
    })
  }

  return {
    scrollTop,
    scroll,
    goTop
  }
}
