<template>
  <view class="page">
    <view class="fix">
      <!-- 搜索框 -->
      <view class="search items-center">
        <input
          v-model.trim="keyword"
          type="text"
          class="input"
          placeholder="请输入搜索关键词"
          placeholder-class="placeholder"
          confirm-type="search"
          @input="toKeywordChange"
          @focus="searchFocus"
          @confirm="search"
        />
        <image v-show="keyword" class="icon" :src="clearImg" @click="clearKeyword" />
      </view>
      <!-- 商品排序 -->
      <search-order v-if="hasSearched && goodsList.length" @change="changeOrder" />
    </view>
    <!-- 占位元素 -->
    <view class="empty-view" />
    <!-- 搜索历史 -->
    <view v-if="!keyword && historyList.length" class="history">
      <view class="header items-center justify-between">
        <text class="title">搜索历史</text>
        <text class="clear" @click="clearHistory">清空搜索</text>
      </view>
      <view class="content">
        <text v-for="text in historyList" :key="text" class="history-text ellipsis" @click="setKeyword(text)">{{ text }}</text>
      </view>
      <view class="line history-line" />
    </view>
    <!-- 热门搜索 -->
    <view v-if="!keyword && !hasSearched && hotSearchWords.length" class="recommend">
      <view class="header items-center justify-between">
        <text class="title">热门搜索</text>
      </view>
      <view class="content">
        <text v-for="text in hotSearchWords" :key="text.hotWordValue" class="recommend-text ellipsis" @click="setKeyword(text.hotWordValue)">
          {{ text.hotWordValue }}
        </text>
      </view>
      <view class="line recommend-line" />
    </view>
    <!-- 猜你想搜 -->
    <view v-if="formatedAssociateWords.length && !hasSearched" class="association">
      <view class="header items-center justify-between">猜你想搜</view>
      <view v-for="item in formatedAssociateWords" :key="item.text" class="association-item items-center" @click="setKeyword(item.originalText)">
        <image class="icon" :src="miniSearchImg" />
        <!-- #ifdef MP-WEIXIN -->
        <rich-text :nodes="item.nodes" />
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <view class="text" v-html="item.text" />
        <!-- #endif -->
      </view>
    </view>
    <!-- 搜索结果 -->
    <view v-if="hasSearched && goodsList.length" class="goods">
      <sp-recommend-goods :recommend-list="goodsList" :point-ratio="pointRatio" :has-title="false" :no-more="noMore" />
    </view>
    <!-- 搜索结果为空 -->
    <view v-if="isShowNoData" class="goods-empty flex-col items-center">
      <image class="icon" :src="searchImg" />
      <text class="text">未找到“{{ keyword }}”的相关结果</text>
      <text class="desc">您可以换个关键词试试，或随便逛一逛</text>
    </view>
  </view>
</template>

<script lang="ts" setup name="GoodsSearch">
import { inject, ref, computed } from 'vue'
import SearchOrder from './order.vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { useGoodsStore } from '@src/pinia/goods'
import { useSearchWord } from './search-word'
import { useSearchHistory } from './search-history'
import { useSearchGoods } from './search-goods'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const searchImg = gdp('group-search.png')
const miniSearchImg = gdp('icon-search.png')
const clearImg = gdp('icon-clear.png')

const goodsStore = useGoodsStore()
const { historyList, saveHistory, clearHistory } = useSearchHistory()

const { formatedAssociateWords, hotSearchWords, refreshAssociateWord, clearAssociateWords, refreshHotSearchWords } = useSearchWord()

const { goodsList, noMore, hasSearched, refreshGoods, refreshAllGoods, getMoreGoods, setOrder, resetSearchGoods } = useSearchGoods()
const isShowNoData = computed(() => keyword.value && hasSearched.value && !formatedAssociateWords.length && !goodsList.length)
// 搜索的关键字
const keyword = ref('')

// 进入页面获取热门搜索
onLoad(refreshHotSearchWords)
// 回到该页面刷新全部商品
onShow(() => {
  refreshAllGoods(keyword.value)
})
// 混动加载更多
onReachBottom(() => {
  getMoreGoods(keyword.value)
})

/**
 * 搜索关键词并存储搜索历史
 */
async function search() {
  await refreshGoods(keyword.value)
  saveHistory(keyword.value)
}

/**
 * 输入时触发
 */
async function toKeywordChange() {
  if (keyword.value === '') {
    resetSearchGoods()
    clearAssociateWords()
  } else {
    refreshAssociateWord(keyword.value)
  }
}

/**
 * 从搜索历史、热门搜索、猜你想搜设置keyword
 * @param word
 */
function setKeyword(word: string) {
  keyword.value = word
  clearAssociateWords()
  refreshGoods(keyword.value)
  saveHistory(keyword.value)
}

const pointRatio = computed(() => goodsStore.pointRatio)
goodsStore.getPointRatio()

function clearKeyword() {
  keyword.value = ''
  resetSearchGoods()
  clearAssociateWords()
}

async function searchFocus() {
  if (keyword.value !== '') {
    resetSearchGoods()
    refreshAssociateWord(keyword.value)
  }
}

function changeOrder(item: { sortKey: string; sortType: number }) {
  setOrder(item)
  refreshGoods(keyword.value)
}
</script>

<style lang="scss" scoped>
.fix {
  position: fixed;
  top: var(--window-top);
  left: 0;
  width: 100%;
  padding-top: 50rpx;
  background: #fff;
  z-index: 10;
}

.search {
  height: 112rpx;
  border-radius: 2rpx;
  border: 1rpx solid #92969a;
  padding: 0 28rpx 0 32rpx;
  margin: 0 40rpx 25rpx;

  .input {
    width: 100%;
    height: 100%;
    font-size: 30rpx;
  }

  .placeholder {
    font-size: 30rpx;
    color: #d8d8d8;
  }

  .icon {
    width: 48rpx;
    height: 48rpx;
    margin-left: 10rpx;
  }
}

.empty-view {
  width: 100%;
  height: 187rpx;
  background: #fff;
}

.history {
  padding: 0 40rpx;

  .header {
    height: 100rpx;

    .title {
      font-size: 26rpx;
      color: #292c2e;
      font-weight: bold;
    }

    .clear {
      font-size: 26rpx;
      color: #92969a;
    }
  }

  .content {
    width: 100%;

    .history-text {
      display: inline-block;
      color: #292c2e;
      margin: 0 48rpx 16rpx 0;
      max-width: 100%;
    }
  }
}

.recommend {
  padding: 0 40rpx;

  .header {
    height: 100rpx;

    .title {
      font-size: 26rpx;
      color: #292c2e;
      font-weight: bold;
    }

    .clear {
      font-size: 26rpx;
      color: #92969a;
    }
  }

  .content {
    width: 100%;

    .recommend-text {
      padding: 10rpx 28rpx;
      border-radius: 36rpx;
      display: inline-block;
      color: #292c2e;
      margin: 0 48rpx 16rpx 0;
      max-width: 100%;
      background-color: #f2f3f3;
    }
  }

  .empty {
    margin-top: 50rpx;
    color: #92969a;
    font-size: 26rpx;
  }
}

.line {
  width: 100%;
  height: 1rpx;
  background-color: #e4e7ea;
}

.history-line {
  margin: 56rpx 0;
}

.recommend-line {
  margin: 92rpx 0;
}

.association {
  padding: 0 40rpx;

  .header {
    height: 100rpx;
    font-size: 26rpx;
    color: #292c2e;
    font-weight: bold;
  }

  &-item {
    color: #292c2e;
    font-size: 28rpx;
    margin-bottom: 44rpx;

    .icon {
      width: 38rpx;
      height: 38rpx;
      margin-right: 14rpx;
    }
  }
}

.goods {
  padding-top: 132rpx;
}

.goods-empty {
  padding: 212rpx 40rpx 0;

  .icon {
    width: 144rpx;
    height: 144rpx;
    margin-bottom: 64rpx;
  }

  .text {
    color: #292c2e;
    font-size: 40rpx;
    font-weight: 500;
    margin-bottom: 16rpx;
    width: 100%;
    word-wrap: break-word;
    text-align: center;
  }

  .desc {
    color: #92969a;
    font-size: 24rpx;
  }
}
</style>
