<template>
  <view class="assess-list">
    <view v-if="tabs.data.length > 0" :class="['assess-list-tab', isCarEvaluation ? 'assess-list-fixedTop' : '']">
      <sp-tabs assess-style :menus="tabs.data" :active-tab="currentTab || 0" @on-click="changeTab" />
    </view>
    <view v-if="list.data.length > 0" class="assess-list-box">
      <!-- 占位元素 -->
      <view class="placeholder-label" />
      <view class="assess-list-box-gap" />
      <view class="assess-list-box-content">
        <template v-for="(item, index) in list.data" :key="index">
          <sp-product-assess-list-item :item="item" :item-type="itemId ? 1 : 0" />
          <view v-if="index < list.data.length - 1" :key="index" class="line" />
        </template>
      </view>
    </view>
    <view v-if="list.data.length > 0 ? isNoMore && defaultEvaluationNum > 0 && currentTab === 0 : defaultEvaluationNum > 0 && currentTab === 0" class="assess-list-defalut">
      {{ defaultEvaluationNum }}位用户默认评价了该商品
    </view>
    <view v-if="isNoMore && list.data.length > 0" class="no-more">没有更多内容了</view>
    <template v-if="!isLoading && list.data.length === 0">
      <view class="no-evaluation">
        <image :src="noEvaluationImg" mode="aspectFit" />
        <text>当前无评价</text>
      </view>
    </template>
  </view>
</template>
<script setup name="SpProductAssessList" lang="ts">
import { inject, ref, Ref, reactive, watch } from 'vue'
import { getMoreEvaluationList, getEvaluationNum, getEvaDefaulCartNum, getEvaDefaultNum } from '@api/evaluation'
import { useCarStore } from '@src/pinia/car'
// 评价数量
interface Tab {
  name: string
  value: string
}
interface TabData {
  [key: string]: number
}

const props = defineProps({
  itemId: {
    type: String,
    default: ''
  },
  backCategoryId: {
    type: String,
    default: ''
  },
  isCarEvaluation: {
    type: Boolean,
    default: false
  }
})
// eslint-disable-next-line max-lines-per-function
const carStore = useCarStore()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
const noEvaluationImg = gdp('no-evaluation.png')
const pageNo = ref(1)
const isNoMore = ref(false)
const isLoading = ref(true)
const list = reactive({
  data: [] as AnyObject[]
}) as AnyObject
let queryData = reactive({})
const tabs = reactive({
  data: [] as Tab[]
})
const tab: Ref<string> = ref('')
const defaultEvaluationNum = ref(0)
const currentTab = ref(0)
const init = () => {
  pageNo.value = 1
  list.data = []
  getList()
  getAllNum()
  // 页面列表莫名上移
  uni.pageScrollTo({
    scrollTop: 0
  })
}
const getAllNum = async () => {
  const resData = await getEvaluationNum(queryData)
  const newTabs = initTabs()
  newTabs.forEach((item: Tab) => {
    const str = getDealData(resData, item.value)
    item.name = str ? `${item.name} ${str}` : ''
  })
  tabs.data = newTabs.filter((item: Tab) => item.name)
}
const getList = async () => {
  defaultEvaluationNum.value = 0
  uni.showLoading({
    title: '加载中'
  })
  isLoading.value = true
  const data = {
    pageNo: pageNo.value,
    pageSize: 10,
    itemId: props.itemId, // 配送及虚拟商品传这个
    backCategoryId: props.backCategoryId, // 整车传这个
    tab: tab.value
  }
  try {
    const resData = await getMoreEvaluationList(data)
    list.data = [...list.data, ...resData.data]
    isNoMore.value = list.data.length >= resData.total
    //backCategoryId有值说明是整车，需要处理数据
    if (props.backCategoryId) {
      list.data = carStore.getInfo(list.data, 1)
    }
    !currentTab.value && getEvaDefaultNumFn()
    isLoading.value = false
    uni.hideLoading()
  } catch {
    isLoading.value = false
    uni.hideLoading()
  }
}
// 上拉加载更多
const onloadMore = () => {
  if (isNoMore.value) {
    return
  }
  pageNo.value++
  getList()
}

defineExpose({ onloadMore })
const changeTab = (index: number) => {
  currentTab.value = index
  tab.value = tabs.data[index].value
  init()
}
const getReadingNum = (num: any) => {
  if (num >= 10000) {
    num = (Math.floor(num / 1000) / 10).toFixed(1) + 'w'
  }
  return num
}
const initTabs = () => {
  tabs.data = [
    { name: '全部', value: '' },
    { name: '有图/视频', value: '0' },
    { name: '好评', value: '1' },
    { name: '中评', value: '2' },
    { name: '差评', value: '3' }
  ] as Tab[]
  return tabs.data
}
const getDealData = (resData: AnyObject, value: string | number) => {
  const tabData: TabData = {
    '': resData.totalNum,
    '0': resData.hasMediaNum,
    '1': resData.highNum,
    '2': resData.middleNum,
    '3': resData.lowNum
  }
  return getReadingNum(tabData[value])
}
// 查询用户默认评价数
const getEvaDefaultNumFn = async () => {
  const resData = props.backCategoryId ? await getEvaDefaulCartNum(props.backCategoryId) : await getEvaDefaultNum(props.itemId)
  defaultEvaluationNum.value = resData as number
}
watch(
  () => props.itemId,
  (value) => {
    value && (queryData = { itemId: value }) && init()
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.backCategoryId,
  (value) => {
    value && (queryData = { backCategoryId: value }) && init()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.assess-list {
  &-tab {
    width: 100%;
    position: fixed;
    top: var(--window-top);
    z-index: 999;
  }

  &-fixedTop {
    top: calc(var(--window-top) + 108rpx);
  }

  &-box {
    background-color: #fff;

    .placeholder-label {
      width: 100%;
      height: 110rpx;
    }

    &-gap {
      width: 100%;
      height: 13rpx;
      background: #f2f3f3;
    }

    &-content {
      padding: 0 40rpx;

      .line {
        border-bottom: 1rpx solid #e4e7ea;
      }
    }
  }

  &-defalut {
    background: #fff;
    border-top: 1rpx solid #e4e7ea;
    padding-top: 56rpx;
    padding-bottom: 63rpx;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, 'PingFang SC';
    font-weight: 400;
    color: #909ca8;
    text-align: center;
  }

  .no-more,
  .no-assess {
    text-align: center;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, 'PingFang SC';
    font-weight: 400;
    color: #92969a;
    padding-top: 37rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: #f2f3f3;
  }

  .no-more {
    background-color: #fff;
  }

  .no-evaluation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 300rpx;

    image {
      width: 144rpx;
      height: 144rpx;
    }

    text {
      color: #909ca8;
      font-size: 26rpx;
      margin-top: 20rpx;
    }
  }
}
</style>
