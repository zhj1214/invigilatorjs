<template>
  <view class="container">
    <!-- 头部标题栏 -->
    <view class="header padding-40 font-medium">购物结算</view>

    <!-- 订单地址 -->
    <goods-address v-if="!isVirtual" @change="changeAddress" />
    <!-- 订单地址 end -->

    <view class="wrap-buy-goods">
      <!-- 商品 -->
      <goods-item v-for="goods in goodsList" :key="goods.skuId" :goods="goods" :point-ratio="pointRatio" />
      <!-- 订单备注 -->
      <view class="add-info padding-40">
        <view class="remark-box item">
          <view class="label">备注</view>
          <view class="form-item-content">
            <input v-model="remark" class="remark-input" maxlength="15" placeholder="请输入备注信息" placeholder-class="placeholder" />
            <icon v-show="remark" type="clear" size="16" @click="remark = ''" />
          </view>
        </view>
        <template v-if="customerInfoArray.length">
          <view v-for="(item, index) in customerInfoArray" :key="index" class="item">
            <view class="label">
              <text class="required">*</text>
              <text>{{ item.name }}</text>
            </view>
            <view class="form-item-content">
              <input v-model="item.value" class="remark-input" :placeholder="item.placeholder" placeholder-class="placeholder" />
            </view>
          </view>
        </template>
      </view>
    </view>
    <order-pay :order-detail="orderDetail" @refresh="refreshPreviewOrder" @submit="toSubmit" />
  </view>
</template>

<script lang="ts" setup name="GoodsSettle">
import { computed, reactive, ref } from 'vue'
import GoodsAddress from './goods-address.vue'
import GoodsItem from './goods-item.vue'
import OrderPay from './order-pay/index.vue'
import { toCreatePreviewOrder } from '@api/order'
import { debounce } from '@src/lib/lodash'
import { useGoodsStore } from '@src/pinia/goods'
import { useOrder } from './order'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useAddressStore } from '@src/pinia/address'
import { Enum } from '@src/lib/enmu'

interface CustomInfoItem {
  key: string
  name: string
  value: string
  placeholder: string
}

type OnLoadOption<T> = Record<keyof T, string | undefined>

interface SettleOption {
  goodsType: string
  customerInfo: string
  orderChannel: string
  distributer: string
}

const addressStore = useAddressStore()
// 地址相关
const selectedAddress = computed(() => addressStore.selectedAddress)

const goodsStore = useGoodsStore()
goodsStore.getPointRatio()
const pointRatio = computed(() => goodsStore.pointRatio)

const { orderDetail, businessId, createOrder, getBisId, refreshPreviewDetail } = useOrder()
// 商品列表
const goodsList = computed(() => orderDetail?.itemList || [])

const orderGoodsList = computed(() => {
  return goodsList.value.map((item) => {
    return {
      skuId: item.skuId,
      itemId: item.itemId,
      quantity: item.quantity
    }
  })
})

// 商品详情直接下单获取的分销id
let distributer = ''
onLoad((options: OnLoadOption<SettleOption>) => {
  // 初始化参数
  const { goodsType: type, customerInfo: cinfo, orderChannel: channel, distributer: d } = options
  goodsType.value = Number(type)
  orderChannel.value = Number(channel)
  distributer = d || ''
  if (cinfo) {
    const customer = JSON.parse(cinfo)
    customerInfo = customer
    const list = Object.keys(customer).map((item: string) => {
      return {
        key: item,
        name: customer[item],
        value: '',
        placeholder: '请输入' + customer[item]
      }
    })
    customerInfoArray.push(...list)
  }
  getBisId()
  refreshPreviewDetail()
})

onShow(() => {
  // 每次进入页面都先获取地址，否则新增或者删除完地址数据不能及时更新
  addressStore.getUserAddress()
})

const isVirtual = computed(() => goodsType.value === Enum.Item.Type.Virtual)

let userAddressIdStr = ref('')
// 切换地址，需要带着userAddressId重新调用订单预览接口
function changeAddress(addressId?: string) {
  userAddressIdStr.value = addressId || ''
  orderGoodsList.value.length && refreshPreviewOrder(null)
}

const refreshPreviewOrder = debounce(async (couponAccountCode: string) => {
  try {
    let previewOrderParams = {
      itemToOrderList: orderGoodsList.value,
      vmId: 1
    } as Order.CreateOrderPreviewParams
    couponAccountCode && (previewOrderParams.couponAccountCode = couponAccountCode)
    userAddressIdStr.value && (previewOrderParams.userAddressId = userAddressIdStr.value)
    await toCreatePreviewOrder(previewOrderParams)
    refreshPreviewDetail()
  } catch (error) {}
}, 300)

const orderChannel = ref(0)

const customerInfoArray: CustomInfoItem[] = reactive([])
let customerInfo = {}

const remark = ref('')

const goodsType = ref(0)

const toVirtualSumbit = (payMethod: string, defaultPoint: number, customPoint: number, couponAccountCode: string) => {
  const customInfo: {
    [key: string]: string
  } = {}
  customerInfoArray.forEach((item) => {
    customInfo[item.key] = item.value
  })
  if (Object.values(customInfo).includes('')) {
    uni.showToast({
      icon: 'none',
      title: '请完善购买信息'
    })
    return
  }
  const data = {
    vmId: 1,
    criteria: {
      distributer: distributer,
      customerInfo
    },
    businessId: businessId.value,
    orderChannel: orderChannel.value,
    remark: remark.value,
    itemToOrderList: orderGoodsList.value,
    couponAccountCode: couponAccountCode,
    pointNum: payMethod === 'DEFAULT' ? defaultPoint : Number(customPoint)
  }
  createOrder(data)
}

const toNormalSumbit = (payMethod: string, defaultPoint: number, customPoint: number, couponAccountCode: string) => {
  if (!selectedAddress.value) {
    uni.showToast({
      icon: 'none',
      title: '请选择地址'
    })
    return
  }
  const data = {
    vmId: 1,
    criteria: {
      distributer: distributer
    },
    orderAddressId: selectedAddress.value.id,
    businessId: businessId.value,
    orderChannel: orderChannel.value,
    remark: remark.value,
    itemToOrderList: orderGoodsList.value,
    couponAccountCode: couponAccountCode,
    pointNum: payMethod === 'DEFAULT' ? defaultPoint : Number(customPoint)
  }
  createOrder(data)
}

const toSubmit = (payMethod: string, defaultPoint: number, customPoint: number, couponAccountCode: string) => {
  isVirtual.value ? toVirtualSumbit(payMethod, defaultPoint, customPoint, couponAccountCode) : toNormalSumbit(payMethod, defaultPoint, customPoint, couponAccountCode)
}
</script>

<style lang="scss" scoped>
.padding-40 {
  padding: 0 40rpx;
}

.container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: #fff;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);

  .header {
    width: 100vw;
    line-height: 132rpx;
    color: #292c2e;
    font-size: 56rpx;
    font-weight: 500;
  }
}

// 备注
.add-info {
  border-bottom: 1rpx solid #f2f3f3;

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #909ca8;
    margin: 35rpx 0;
    font-size: 28rpx;

    .label {
      width: 160rpx;
      color: #1a1a1a;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .required {
        color: red;
        padding: 0 10rpx;
      }
    }

    .form-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 24rpx;
      width: 90%;
    }
  }

  .remark-input {
    font-size: 28rpx;
    color: #1a1a1a;
    width: 480rpx;
  }

  .placeholder {
    font-size: 28rpx;
    color: #bababa;
  }
}
</style>
