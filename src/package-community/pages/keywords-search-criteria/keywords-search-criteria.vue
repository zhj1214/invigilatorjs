<template>
  <view class="search-content-box">
    <view class="search-box">
      <uni-search-bar v-model="searchValue" bg-color="#fff" :placeholder="placeholder" :is-show-icon="false" cancel-button="none" clear-button="auto" @confirm="handleSearch" />
    </view>
    <view class="search-history">
      <view class="search-history-item">
        <text class="item-name">搜索历史</text>
        <text class="item-clear" @click="handleClearHistory">清空搜索</text>
      </view>
      <view class="search-history-keywords">
        <template v-if="historyKeywords.length > 0">
          <view v-for="(words, index) in historyKeywords" :key="index" @click="goSearchResultPage(words)">{{ words }}</view>
        </template>
        <view v-else class="search-history-noHistory">-- 暂无搜索记录 --</view>
      </view>
    </view>
    <view class="search-referral">
      <view class="search-referral-item">
        <text class="item-name">搜索推荐</text>
      </view>
      <view class="search-referral-keywords">
        <view v-for="(words, index) in referralKeywords" :key="index" class="search-referral-keywords-item" @click="goSearchResultPage(words)">
          {{ words }}
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="center" class="clearSafePadding" @touchmove.stop.prevent="() => {}">
      <pop-dialog title="确认清空" content="确认清空历史搜索吗?" @confirm="handleConfirmRelease" @cancel="closePop" />
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref } from 'vue'
import popDialog from '../../components/pop-dialog/pop-dialog.vue'

export default defineComponent({
  name: 'KeywordsSearchCriteria',
  components: {
    'pop-dialog': popDialog
  },
  // eslint-disable-next-line max-lines-per-function
  setup() {
    let searchValue = ref('')
    let placeholder = ref('请输入关键字')
    let historyKeywords = reactive([]) as Array<string>
    let referralKeywords = ['帕萨特', '奔驰', '大众', '大众', '车模型', '车载挂件']

    function handleSearch() {
      if (searchValue.value) {
        let keywordsArr = historyKeywords
        keywordsArr.unshift(searchValue.value.trim()) // 删除前后空格并插入到数组开头
        keywordsArr = [...new Set(keywordsArr)] // 去重
        keywordsArr.length > 10 && keywordsArr.pop() // 超过10条删除最后一个
        historyKeywords = keywordsArr
        // 将历史搜索存在本地
        uni.setStorageSync('historyKeywords', historyKeywords)
        toNavigateToResultPage()
        searchValue.value = '' // 清空搜索条件
      }
    }
    function toNavigateToResultPage() {
      uni.navigateTo({
        url: `/package-comunity/pages/keywords-search-result?keywords=${searchValue.value}`
      })
    }
    function goSearchResultPage(value: any) {
      searchValue = value
      toNavigateToResultPage()
    }
    const popup: Ref<SpPopup | null> = ref(null)
    // 弹框选择取消
    function closePop() {
      popup.value?.close()
    }
    function openPop() {
      popup.value?.open()
    }
    // 弹框选择确认
    function handleConfirmRelease() {
      uni.removeStorageSync('historyKeywords')
      historyKeywords = []
      closePop()
    }
    function handleClearHistory() {
      openPop()
    }
    return {
      searchValue,
      placeholder,
      historyKeywords,
      referralKeywords,
      handleSearch,
      goSearchResultPage,
      closePop,
      handleConfirmRelease,
      handleClearHistory
    }
  },

  onShow() {
    this.historyKeywords = uni.getStorageSync('historyKeywords') || []
  }
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
