<template>
  <view class="page font-regular" @click="isMotifyNumberId = ''">
    <empty v-if="isEmpty" />
    <template v-else-if="cartList.length">
      <!-- 顶部数量与管理 -->
      <view id="toolbar" class="toolbar items-center justify-between">
        <view class="total">
          共
          <text class="total-number">{{ total }}</text>
          件
        </view>
        <view class="manage" @click="changeManageState">{{ isManageState ? '完成' : '管理' }}</view>
      </view>
      <!-- 商品列表 -->
      <view class="goods-list">
        <!-- 正常商品 -->
        <valid-goods
          v-model:isMotifyNumberId="isMotifyNumberId"
          :goods-list="formatedGoodsList"
          :point-ratio="pointRatio"
          :is-manage-state="isManageState"
          :refresh-cart="refresh"
          :checked-goods-ids="checkedGoodsIds"
          @change-goods-check="changeGoodsCheck"
        />
        <!-- 失效商品 -->
        <view v-if="invalidCartList.length" class="invalid-title" :is-manage-state="isManageState" @change-goods-check="changeGoodsCheck">已失效</view>
        <invalid-goods :goods-list="invalidCartList" :is-manage-state="isManageState" :checked-goods-ids="checkedGoodsIds" @change-goods-check="changeGoodsCheck" />
      </view>

      <!-- 底部操作栏 -->
      <view class="footer items-center justify-between">
        <view class="footer-left items-center">
          <sp-checkbox class="checkbox" round size="large" :disabled="isAllCheckDisabled" :checked="isAllChecked" @change="checkOrUncheckAll" />
          <text v-if="isManageState" class="font-normal">全选</text>
          <view v-else class="total-price">
            <view class="text font-normal">合计:</view>
            <view class="price items-center">
              <view v-if="!totalPriceInfo.fee && !totalPriceInfo.point">￥0</view>
              <view v-if="totalPriceInfo.fee">
                <text>￥</text>
                <text>{{ totalPriceInfo.fee }}</text>
              </view>
              <text v-if="totalPriceInfo.fee && totalPriceInfo.point">+</text>
              <view v-if="totalPriceInfo.point">
                <image class="point-icon" :src="pointIcon" mode="aspectFit" />
                <text>{{ totalPriceInfo.point }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="isManageState" class="btn items-center justify-center" @click="remove">删除</view>
        <view v-else class="btn order items-center justify-center" @click="toCreateOrder">结算</view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import Empty from './empty.vue'
import ValidGoods from './valid-goods.vue'
import InvalidGoods from './invalid-goods.vue'

import { ref, reactive, computed, inject } from 'vue'
import { toCreatePreviewOrder } from '@api/order'
import { useGoodsStore } from '@src/pinia/goods'
import { useAddressStore } from '@src/pinia/address'
import { throttle } from '@src/lib/lodash'
import { useCart, hasStock, removeCartGoods, formatGoodsList } from './cart'
import { onHide, onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { Enum } from '@src/lib/enmu'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const pointIcon = gdp('icon-point.png')

const goodsStore = useGoodsStore()
const addressStore = useAddressStore()

const { cartList, validCartList, canBoughtCartList, invalidCartList, total, isEmpty, getCart } = useCart()
const formatedGoodsList = computed(() => formatGoodsList(validCartList.value, pointRatio.value))
// 已勾选的商品id
const checkedGoodsIds: string[] = reactive([])
// 积分兑换比例
const pointRatio = computed(() => goodsStore.pointRatio)
// 管理商品状态
const isManageState = ref(false)
// 处于修改数量状态的商品
const isMotifyNumberId = ref('')

onShow(() => {
  refresh()
  // #ifdef H5
  window.addEventListener('resize', resize, false)
  // #endif
})

// #ifdef H5
onHide(() => {
  window.removeEventListener('resize', resize)
})
// #endif

onPullDownRefresh(async () => {
  try {
    await refresh()
    uni.stopPullDownRefresh()
  } catch (error) {
    uni.stopPullDownRefresh()
  }
})

// 管理开关
function changeManageState() {
  isManageState.value = !isManageState.value
  if (!isManageState.value) {
    for (let index = 0; index < checkedGoodsIds.length; index++) {
      const id = checkedGoodsIds[index]
      const goods = cartList.find((item) => item.id === id) as Cart.Goods
      if (goods.status === -2 || !hasStock(goods)) {
        checkedGoodsIds.splice(index, 1)
        index--
      }
    }
  }
}

// 是否全选
const isAllChecked = computed(() => {
  if (checkedGoodsIds.length) {
    return isManageState.value ? checkedGoodsIds.length === cartList.length : checkedGoodsIds.length === canBoughtCartList.value.length
  }
  return false
})
// 全选是否禁用
const isAllCheckDisabled = computed(() => {
  return !isManageState.value && cartList.length === validCartList.value.length - canBoughtCartList.value.length + invalidCartList.value.length
})

function refreshCheckedIds() {
  checkedGoodsIds.forEach((id: string, index) => {
    if (!isManageState.value && (invalidCartList.value.find((item) => item.id === id) || !canBoughtCartList.value.find((item) => item.id === id))) {
      checkedGoodsIds.splice(index, 1)
      index--
    }
  })
}

// 总计价格
const totalPriceInfo = computed(() => {
  let fee = 0
  let point = 0
  checkedGoodsIds.forEach((id: string) => {
    const goods = formatedGoodsList.value.find((item) => item.id === id)
    const num = goods?.quantity
    if (goods?.payType !== Enum.Pay.Type.Point) {
      fee = Number(goods?.priceInfo?.fee) * Number(num) + fee
    }
    if (goods?.payType === Enum.Pay.Type.Point || goods?.payType === Enum.Pay.Type.FreeMixing) {
      point += Number(goods?.priceInfo?.point) * Number(num)
    }
  })
  return {
    fee,
    point
  }
})

// 刷新购物车
async function refresh() {
  uni.showLoading({
    mask: true
  })
  try {
    // 获取积分兑换比例
    goodsStore.getPointRatio()
    await getCart()
    uni.hideLoading()
    refreshCheckedIds()
  } catch (error) {
    uni.hideLoading()
  }
}

/**
 * 结算创建订单缓存
 */
async function toCreateOrder() {
  if (!checkedGoodsIds.length) {
    uni.showToast({
      icon: 'none',
      title: '请选择商品'
    })
    return
  }
  const itemToOrderList = checkedGoodsIds.map((id) => {
    const goods = validCartList.value.find((item) => item.id === id) as Cart.Goods
    const { skuId, itemId, quantity, dealerId, activityId } = goods
    return { skuId, itemId, quantity, dealerId, activityId }
  })
  uni.showLoading({
    mask: true
  })
  try {
    await toCreatePreviewOrder({
      cartIds: checkedGoodsIds,
      itemToOrderList,
      vmId: 1
    })
    checkedGoodsIds.length = 0
    uni.hideLoading()
    uni.navigateTo({
      url: '/package-life/pages/goods-settle/index?orderChannel=1'
    })
    addressStore.$patch({
      selectedAddress: null
    })
  } catch (error) {
    console.log(error)
  }
}

// 勾选商品
function changeGoodsCheck(id: string) {
  const index = checkedGoodsIds.findIndex((item) => item === id)
  if (index > -1) {
    checkedGoodsIds.splice(index, 1)
  } else {
    checkedGoodsIds.push(id)
  }
}

// 全选或取消全选
function checkOrUncheckAll() {
  if (isAllChecked.value) {
    checkedGoodsIds.length = 0
    return
  }
  checkedGoodsIds.length = 0
  if (isManageState.value) {
    checkedGoodsIds.push(...cartList.map((item) => item.id))
  } else {
    checkedGoodsIds.push(...canBoughtCartList.value.map((item) => item.id))
  }
}

async function remove() {
  console.log(checkedGoodsIds)
  if (!checkedGoodsIds.length) {
    return
  }
  if (await removeCartGoods(checkedGoodsIds.join(','))) {
    checkedGoodsIds.length = 0
    refresh()
  }
}
// #ifdef H5
const resize = throttle(
  () => {
    const $header = document.getElementsByClassName('uni-page-head')[0] as HTMLElement
    const top = $header.offsetHeight + $header.offsetTop
    ;(document.getElementById('toolbar') as HTMLElement).style.top = `${top}px`
  },
  300,
  {
    trailing: false
  }
)
// #endif
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
