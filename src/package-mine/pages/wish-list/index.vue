<template>
  <view class="wish-list">
    <!-- 空心愿单 -->
    <view v-if="total === 0 && !loading" class="wish-list-none">
      <view class="wish-list-none-empty">
        <image class="wish-list-none-empty-img" :src="wishNone" mode="asceptFit" />
      </view>
      <view class="go-car">
        您还没有心愿单，
        <text @click="goCar">去购车</text>
      </view>
    </view>
    <!-- 有数据心愿单 -->
    <view v-else class="wish-list-data">
      <view v-for="wish in cartWishList" :key="wish.id" class="list-card">
        <view v-if="wish.status === -2" class="list-card-status">已失效</view>
        <view class="list-card-info" @click="goConfigure(wish)">
          <view class="list-card-info-title">
            <view class="text ellipsis">
              <text v-if="wish.extra.preSaleFlag" class="advance">预售·</text>
              {{ wish.extra.modelName }}
            </view>
            <view class="icon"><image class="img" :src="remove" mode="aspectFit" @click.stop="deleteWishList(wish.id)" /></view>
          </view>
          <view class="list-card-info-poster">
            <image class="img" :src="wish.extra.carPoster" mode="aspectFit" />
          </view>
          <view class="list-card-info-bottom">
            <view class="list-card-info-bottom-config">
              <view class="configure ellipsis">{{ wish.extra.saleAttrs.join(' | ') }}</view>
              <view v-if="wish.extra.showPriceFlag" class="price">
                购车总价
                <text class="price-info">￥{{ formatMoney(wish.extra.totalPrice, 0, 0) }}</text>
              </view>
              <view v-else class="price">
                购车总价
                <text class="price-info">\t\t 价格待定</text>
              </view>
            </view>
            <view class="list-card-info-bottom-btn" :class="{ color: wish.status === -2 }" @click.stop="goOrder(wish, wish.status === -2)">立即预订</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCartWishList, deleteCartWish } from '@src/api/cart-wish'
import { formatMoney } from '@util/money'
import { pureAssign } from '@src/util/common'

interface CartWish {
  skuId: number
  status: number
  id: number
  extra: {
    modelName: string
    carPoster: string
    saleAttrs: []
    totalPrice: number
    optionalPackIds: []
    preSaleFlag: boolean
    showPriceFlag: boolean
  }
}

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const wishNone = gdp('icon-wish-empty.png')
const remove = gdp('icon-wish-delete.png')
const cartWishList: CartWish[] = reactive([])
//获取心愿单列表
const total = ref(0) // 心愿单数量
const loading = ref(false)

onLoad(() => {
  getWishList()
})

async function getWishList() {
  uni.showLoading({
    title: '加载中'
  })
  cartWishList.length = 0
  loading.value = true
  try {
    const res = (await getCartWishList()) as Array<object>
    total.value = res.length
    res.map((item: object, index: number) => {
      const wishList: CartWish = {
        skuId: 0,
        status: 0,
        id: 0,
        extra: {
          modelName: '',
          carPoster: '',
          saleAttrs: [],
          optionalPackIds: [],
          totalPrice: 0,
          showPriceFlag: false,
          preSaleFlag: false
        }
      }
      pureAssign(wishList, item)
      cartWishList.push(wishList)
    })
    uni.hideLoading()
    loading.value = false
  } catch (err) {
    uni.hideLoading()
    console.log(err)
  }
}

// 删除心愿单项
function deleteWishList(id: number) {
  uni.showModal({
    title: '提示',
    content: '确认删除？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteCartWish(id)
          uni.hideLoading()
          uni.showToast({
            title: '删除成功'
          })
          getWishList()
        } catch (error) {
          uni.hideLoading()
        }
      } else if (res.cancel) {
      }
    }
  })
}

// 跳转购车页
function goCar() {
  uni.switchTab({
    url: '/pages/car/car'
  })
}
// 跳转预订页
function goOrder(wish: CartWish, disabled: boolean) {
  if (disabled) {
    return
  }
  uni.navigateTo({
    url: `/package-car/pages/purchase/index?skuId=${wish.skuId}&pkIds=${wish.extra.optionalPackIds.join(',')}&hideWish=true&cartWishId=${wish.id}`
  })
}
// 跳转配置页
function goConfigure(wish: CartWish) {
  if (wish.status === -2) {
    return
  }

  uni.navigateTo({
    url: `/package-car/pages/preview/index?skuId=${wish.skuId}&pkIds=${wish.extra.optionalPackIds.join(',')}&hideWish=true&cartWishId=${wish.id}`
  })
}
</script>

<style lang="scss" scoped>
.wish-list {
  background-color: #fafafa;
  min-height: 100vh;

  &-none {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    padding-top: 30%;

    &-empty {
      width: 144rpx;
      height: 144rpx;

      &-img {
        width: 100%;
        height: 100%;
      }
    }

    .go-car {
      margin-top: 40rpx;
      font-size: 26rpx;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #909ca8;
      line-height: 38rpx;

      text {
        color: #4e6175;
        text-decoration: underline;
      }
    }
  }

  &-data {
    padding: 40rpx 32rpx;

    .list-card {
      &-status {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
        line-height: 47rpx;
        padding: 24rpx 0;
      }

      &-info {
        height: 640rpx;
        padding: 52rpx 0 59rpx;
        background: #f2f3f3;
        margin-bottom: 40rpx;

        &-title {
          padding: 0 40rpx;
          display: flex;
          justify-content: space-between;
          font-size: 40rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #1a1a1a;
          line-height: 59rpx;
          margin-bottom: 10rpx;

          .text {
            flex: 1;

            .advance {
              color: #7190b0;
            }
          }

          .icon {
            width: 40rpx;
            height: 40rpx;

            .img {
              width: 100%;
              height: 100%;
            }
          }
        }

        &-poster {
          width: 100%;
          height: 384rpx;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        &-bottom {
          display: flex;
          justify-content: space-between;
          padding: 0 40rpx;
          margin-top: 10rpx;

          &-config {
            width: calc(100% - 200rpx);
            flex: 1;

            .configure {
              flex: 1;
              font-size: 28rpx;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: #92969a;
              line-height: 41rpx;
              margin-right: 52rpx;
            }

            .price {
              font-size: 24rpx;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: #909ca8;
              line-height: 36rpx;

              &-info {
                font-size: 30rpx;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #4e6175;
                line-height: 45rpx;
              }
            }
          }

          &-btn {
            width: 200rpx;
            height: 72rpx;
            background: #1a1a1a;
            border-radius: 1rpx;
            font-size: 24rpx;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: #fff;
            padding: 17rpx;
            line-height: 38rpx;
            text-align: center;

            &.color {
              opacity: 0.4;
            }
          }
        }
      }
    }
  }
}

uni-page-body {
  height: 100%;
}
</style>
