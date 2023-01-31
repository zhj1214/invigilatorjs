<template>
  <view v-for="goods in goodsList" :key="goods.id" class="item flex-row items-start" :class="hasStock(goods) ? '' : 'no-stock'">
    <!-- 勾选框 -->
    <view class="group items-center checkbox">
      <sp-checkbox round size="large" :disabled="!isManageState && !hasStock(goods)" :checked="checkedGoodsIds.includes(goods.id)" @change="$emit('changeGoodsCheck', goods.id)" />
    </view>
    <view class="flex-row right-box" @click="goToGoodsDetail(goods.itemId)">
      <!-- 商品图 -->
      <view class="group items-center">
        <image class="thumbnail" :src="goods.thumbnail" mode="scaleToFill" />
      </view>
      <!-- 商品信息 -->
      <view class="info">
        <view class="name ellipsis">{{ goods.itemName }}</view>
        <view class="items-center justify-between">
          <view class="attr items-center" @click.stop="changeSku(goods)">
            <view class="attr-text ellipsis">{{ toGeneratorSkuAttr(goods.skuAttr) }}</view>
            <image class="image" :src="bottomIcon" mode="aspectFit" />
          </view>
          <view v-if="!hasStock(goods)" class="count">x {{ goods.quantity }}</view>
        </view>
        <!-- 活动信息 -->
        <view v-if="goods.activityInfo" class="activity-info" :class="{ 'not-start': !goods.activityInfo.isActivityGoing }">
          <!-- 限时抢购 -->
          <view class="activity-type-tag">{{ goods.activityInfo.activityTypeName }}</view>
          <view v-if="goods.activityInfo.isActivityGoing" class="activity-time">{{ goods.activityInfo.endTimeFormat }} 结束</view>
          <view v-else class="activity-time">{{ goods.activityInfo.startTimeFormat }} 开始</view>
        </view>
        <!-- 商品价格 -->
        <!-- payType = 1 只显示金钱 ￥10 -->
        <!-- payType = 2 只显示积分 1000 -->
        <!-- payType = 3 显示金钱+积分 ￥10+1000 -->
        <!-- payType = 4 显示金钱（积分） ￥10（1000） -->
        <view v-if="hasStock(goods)" class="items-center justify-between">
          <!-- 库存充足显示价格 -->
          <view class="price">
            <view v-if="goods.priceInfo.fee" class="ellipsis">
              <text>￥</text>
              <text>{{ goods.priceInfo.fee }}&nbsp;</text>
            </view>
            <view v-if="goods.priceInfo.point" class="ellipsis">
              <text v-if="goods.payType === 3">+&nbsp;</text>
              <text v-if="goods.payType === 4">(</text>
              <image class="point-icon" :src="pointIcon" mode="aspectFit" />
              <text>{{ goods.priceInfo.point }}</text>
              <text v-if="goods.payType === 4">)</text>
            </view>
          </view>
          <!-- 库存充足显示数量调整 -->
          <view class="number">
            <sp-input-number
              v-if="isMotifyNumberId === goods.id"
              v-model="goods.quantity"
              :value="goods.quantity"
              :is-disabled-input="false"
              :min="1"
              :max="toGeneratorStockNumber(goods)"
              @error="handleCountError"
              @change="changeGoodsNumber(goods)"
              @confirm="$emit('update:isMotifyNumberId', 0)"
            />
            <view v-else class="text font-medium" @click.stop="$emit('update:isMotifyNumberId', goods.id)">x {{ goods.quantity }}</view>
          </view>
        </view>
        <view v-else class="items-center justify-between">
          <view class="stock-error">请重选商品规格</view>
          <!-- 库存不足显示重选 -->
          <view class="re-choose-btn" @click.stop="changeSku(goods)">重选</view>
        </view>
      </view>
    </view>
  </view>
  <!-- 选择sku弹窗 -->
  <sp-select-sku
    ref="selectSkuRef"
    :sku-id="currentSkuId"
    :goods-detail="currentGoodsDetail"
    :default-buy-number="currentBuyNumber"
    :point-ratio="pointRatio"
    :is-show-control-number="false"
    @sku-change="onSkuChange"
  />
</template>

<script lang="ts" setup>
import { getGoodsDetail } from '@src/api/goods'
import { debounce } from '@src/lib/lodash'
import { inject, PropType, reactive, Ref, ref } from 'vue'
// 解决小程序启动报错问题，若有其他方法，可删除
import SpInputNumber from '@src/components/sp-input-number/sp-input-number.vue'
import { changeNumber, hasStock, toGeneratorSkuAttr, CartGoods, toGeneratorStockNumber, changeCartSku } from './cart'
const props = defineProps({
  isManageState: {
    type: Boolean,
    default: false
  },
  goodsList: {
    type: Array as PropType<CartGoods[]>,
    default: null
  },
  pointRatio: {
    type: Number,
    default: 1
  },
  checkedGoodsIds: {
    type: Array,
    default: () => []
  },
  isMotifyNumberId: {
    type: String,
    default: '0'
  },
  refreshCart: {
    type: Function,
    default: null
  }
})
defineEmits(['refresh', 'changeGoodsCheck', 'update:isMotifyNumberId'])
// 静态图片
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const bottomIcon = gdp('icon-bottom-bg.png')
const pointIcon = gdp('icon-point.png')

const selectSkuRef: Ref<SpPopup | null> = ref(null)

const changeGoodsNumber = debounce(async (goods: Cart.Goods) => {
  try {
    await changeNumber(goods)
    props.refreshCart && props.refreshCart()
  } catch (error) {
    console.log(error)
  }
}, 500)

// 修改sku
const currentSkuId = ref('')
const currentGoodsDetail = reactive({}) as Goods.Item
const currentBuyNumber = ref(1)
async function changeSku(goods: Cart.Goods) {
  uni.showLoading({
    mask: true
  })
  try {
    currentBuyNumber.value = goods.quantity
    currentSkuId.value = goods.skuId
    const goodsDetail = await getGoodsDetail(goods.itemId)
    Object.assign(currentGoodsDetail, goodsDetail)
    uni.hideLoading()
    selectSkuRef.value?.open('changeCart')
  } catch (error) {
    uni.hideLoading()
  }
}
// sku修改后更新到购物车
const onSkuChange = async (skuId: string, skuInfo: Goods.Sku) => {
  const goods = props.goodsList.find((item) => item.skuId === currentSkuId.value) as Cart.Goods
  try {
    await changeCartSku(goods, skuInfo)
    uni.showToast({ icon: 'success', title: '编辑购物车成功' })
    props.refreshCart && props.refreshCart()
  } catch (error) {}
}

// 数量调节异常处理
function handleCountError(type: string) {
  if (type === 'moreThanMax') {
    uni.showToast({
      title: '修改数量失败，超出库存或限购数量',
      icon: 'none'
    })
  }
}

function goToGoodsDetail(id: number) {
  uni.navigateTo({
    url: '/package-life/pages/goods-detail/index?id=' + id
  })
}
</script>
<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 32rpx 40rpx;

  .group {
    height: 160rpx;
  }

  .checkbox {
    margin-right: 28rpx;
  }

  .right-box {
    width: calc(100% - 72rpx);
  }

  .thumbnail {
    width: 160rpx;
    height: 160rpx;
    background-color: #f4f5f6;
  }

  .info {
    position: relative;
    width: calc(100% - 160rpx);
    padding-left: 24rpx;
    flex-wrap: nowrap;
  }

  .name {
    width: 100%;
    margin-bottom: 16rpx;
    font-size: 28rpx;
  }

  .attr {
    display: inline-flex;
    padding: 0 2rpx 0 22rpx;
    background-color: #edeff1;
    color: #909ca8;
    font-size: 26rpx;
    max-width: 280rpx;

    .image {
      width: 48rpx;
      height: 48rpx;
    }

    .attr-text {
      max-width: 232rpx;
    }
  }

  .price {
    width: 246rpx;
    display: flex;
    font-size: 28rpx;
    flex-wrap: wrap;

    .ellipsis {
      max-width: 246rpx;
    }
  }

  .point-icon {
    width: 24rpx;
    height: 24rpx;
  }

  .number {
    .text {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 56rpx;
      padding: 0 30rpx;
      border: 2rpx solid #f2f3f3;
      border-radius: 56rpx;
      font-weight: 500;
    }
  }

  .count {
    font-size: 28rpx;
    color: #909ca8;
    padding: 10rpx 20rpx;
  }

  &.no-stock {
    .name {
      color: #909ca8;
    }
  }

  &.disabled {
    .name {
      color: #909ca8;
    }

    .attr {
      padding-right: 22rpx;
    }
  }

  .stock-error {
    font-size: 28rpx;
  }

  .re-choose-btn {
    font-size: 28rpx;
    padding: 10rpx 25rpx;
    color: #4e6175;
    border-radius: 1rpx;
    border: 2rpx solid #4e6175;
    background-color: #fff;
  }
}

.activity-info {
  display: flex;
  align-items: center;
  margin: 10rpx 0 20rpx;
  flex-wrap: wrap;

  .activity-type-tag {
    color: #fff;
    font-size: 22rpx;
    border-radius: 4rpx;
    background: #c14947;
    height: 36rpx;
    padding: 0 8rpx;
    margin-right: 12rpx;
    display: flex;
    align-items: center;
  }

  .activity-time {
    color: #c14947;
    font-size: 26rpx;
  }

  &.not-start {
    .activity-type-tag {
      background: #fff;
      border: 1rpx solid #7190b0;
      color: #7190b0;
    }

    .activity-time {
      color: #7190b0;
    }
  }
}
</style>
