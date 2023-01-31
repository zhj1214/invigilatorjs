import { getAssociateWord, getSearchRecommendList } from '@src/api/recommend'
import { debounce } from '@src/lib/lodash'
import { matchLongestRepetString } from '@src/util/common'
import { reactive } from 'vue'
import parser from '@src/lib/html-parser'

interface TextNode {
  originalText: string
  text: string
  nodes: AnyObject[]
}

interface HotSearchWord {
  hotWordValue: string
  hotWordCount: number
}

function toGeneratorAssociateWords(associateWords: string[], keyword: string): TextNode[] {
  return associateWords.map((text: string) => {
    const str = {
      originalText: text,
      text: '',
      nodes: []
    }
    // 计算最长匹配字符
    const repetString = matchLongestRepetString(text, keyword)
    // #ifdef H5
    str.text = text.replace(new RegExp(repetString, 'g'), `<span style="color: #909CA8;">${repetString}</span>`)
    // #endif
    // #ifdef MP-WEIXIN
    str.text = text
    str.nodes = parser('<span>' + text.replace(new RegExp(repetString, 'g'), `<span style="color: #909CA8;">${repetString}</span>`) + '</span>')
    // #endif
    return str
  })
}

export function useSearchWord() {
  // 原始关联词列表
  const associateWords: string[] = reactive([])
  // 编译后的关键词节点数据：关键词高高亮，用于显示
  const formatedAssociateWords: TextNode[] = reactive([])
  // 热门搜索
  const hotSearchWords: HotSearchWord[] = reactive([])

  /**
   * 获取热门搜索
   */
  async function refreshHotSearchWords() {
    try {
      const list = await getSearchRecommendList({ listSize: 10 })
      hotSearchWords.length = 0
      hotSearchWords.push(...list)
    } catch (error) {}
  }

  /**
   * 刷新关联词
   */
  const refreshAssociateWord = debounce(async (keyword: string) => {
    try {
      const list = await getAssociateWord(encodeURIComponent(keyword))
      clearAssociateWords()
      associateWords.push(...list)
      formatedAssociateWords.push(...toGeneratorAssociateWords(list, keyword))
    } catch (error) {}
  }, 300)
  /**
   * 清空搜索
   */
  function clearAssociateWords() {
    associateWords.length = 0
    formatedAssociateWords.length = 0
  }

  return {
    formatedAssociateWords,
    hotSearchWords,
    refreshAssociateWord,
    clearAssociateWords,
    refreshHotSearchWords
  }
}
