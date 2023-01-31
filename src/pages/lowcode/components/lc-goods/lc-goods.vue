<template>
  <view class="componet-goods">
    <!-- <view class="goods-list">
      <view class="goods-item">
        <view class="goods-item-content">
          <img class="content-img" loading="lazy" src="" />
          <view class="content-desc">这里是商品描述，最多大方大师范德萨范德萨</view>
          <view class="content-tags">
            <view class="content-tags-one">限时抢购</view>
            <view class="content-tags-two">进行中</view>
          </view>
        </view>
      </view>
    </view> -->
    <view class="goods-contain">
      <sp-goods-card v-for="item in goodsList" :key="item.itemBasicVO.id" :goods-detail="item" />
    </view>
  </view>
</template>

<script lang="ts" setup name="SpSearchHeader">
import { ref, computed, inject, watch } from 'vue'
import { getGoodsList } from '@api/lowcode'

interface PropsType {
  goodsIds: Array<string>
  sortType?: string
}

const props = withDefaults(defineProps<PropsType>(), {
  goodsIds: () => [],
  sortType: '1'
})

const goodsList = ref<any>([])

const getGoodsListFn = async (ids: Array<string>) => {
  const res = await getGoodsList({ relateIds: ids, type: 2 })
  goodsList.value = res
}

watch(
  () => props.goodsIds,
  (newValue) => {
    getGoodsListFn(newValue)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.componet-goods {
  padding: 10rpx 32rpx 0 32rpx;
}

.goods-contain {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15rpx;
  .goods-item {
    flex: 1;
    padding: 0 15rpx;
    margin-bottom: 40rpx;
    .goods-item-content {
      width: 100%;
      .content-img {
        width: 100%;
        height: 0;
        padding-top: 100%;
      }
      .content-desc {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 24rpx;
        font-size: 28rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #545658;
        line-height: 1.5;
      }
      .content-tags {
        margin: 8rpx 0 12rpx 0;
        display: flex;
        .content-tags-one {
          padding: 8rpx 12rpx;
          background: #c14947;
          border-radius: 4rpx;
          font-size: 20rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          color: #ffffff;
          line-height: 22rpx;
        }
        .content-tags-two {
          padding: 8rpx 12rpx;
          border: 1px solid #c14947;
          border-radius: 4rpx;
          font-size: 20rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          color: #c14947;
          line-height: 22rpx;
          margin-left: 12rpx;
        }
      }
    }
  }
}
</style>
