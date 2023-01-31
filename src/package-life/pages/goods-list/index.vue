<!-- 该页面暂时未使用 -->
<template>
  <view class="goods-list-page">
    <sp-header>
      <view class="header-content">
        <image class="back-img" :src="iconBackSquare" mode="scaleToFill" @click="toBack" />
        <text class="title">{{ title }}</text>
      </view>
    </sp-header>
    <view class="wrap-goods-list">
      <sp-goods-card v-for="item in goods" :key="item.id" :goods-detail="item" />
    </view>
  </view>
</template>

<script lang="ts" setup name="GoodsList">
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { reactive, inject, ref } from 'vue'

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface LoadOptions {
  id: string
  title: string
}

onLoad((options: OnLoadOption<LoadOptions>) => {
  id.value = options.id || ''
  title.value = options.title || ''
})

onReachBottom(toLower)

const id = ref('')
const title = ref('')
const goods: Goods.Item[] = reactive([])
const pageNo = ref(1)
const pageSize = ref(10)

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [iconBackSquare] = gdp(['icon-back-square.png'])

// 未完成
function getMoreGoods() {
  goods.push()
}

// 未完成
function toLower() {
  pageNo.value++
  getMoreGoods()
}

function toBack() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.goods-list-page {
  padding-top: 88rpx;

  .header-content {
    width: 100vw;
    height: 88rpx;
    text-align: center;
    position: relative;
    background-color: white;

    .back-img {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      top: 20rpx;
      left: 16rpx;
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #292c2e;
      line-height: 88rpx;
    }
  }

  .wrap-goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 32rpx;
    margin-bottom: 76rpx;
  }
}
</style>
