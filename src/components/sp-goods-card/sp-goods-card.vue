<template>
  <view class="sp-goods-card" @click="handleClickGoods">
    <image :src="itemBasicVO.mainImage" mode="scaleToFill" class="show-image" />
    <text class="title ellipsis">{{ itemBasicVO.name }}</text>
    <sp-goods-price font-size="32" :item-detail="goodsDetail" :point-ratio="pointRatio" />
  </view>
</template>

<script lang="ts" setup name="SpGoodsCard">
import { useAddressStore } from '@src/pinia/address'
import { computed, PropType } from 'vue'

const props = defineProps({
  pointRatio: {
    type: Number,
    default: 1
  },
  goodsDetail: {
    type: Object as PropType<Goods.Item>,
    default: null
  }
})
const itemBasicVO = computed(() => props.goodsDetail.itemBasicVO)
const addressStore = useAddressStore()
const handleClickGoods = () => {
  const id = itemBasicVO.value.id
  uni.navigateTo({ url: `/package-life/pages/goods-detail/index?id=${id}` })
  // 清空地址信息
  addressStore.$patch({
    selectedAddress: null,
    freightTemplate: '',
    shippingAddress: ''
  })
}
</script>

<style lang="scss" scoped>
.sp-goods-card {
  padding-bottom: 48rpx;
  width: 328rpx;

  .show-image {
    background-color: #f4f5f6;
    vertical-align: middle;
    width: 100%;
    height: 328rpx;
  }

  .title {
    display: block;
    width: 100%;
    font-size: 28rpx;
    color: #545658;
    margin: 24rpx 0 10rpx;
  }
}
</style>
