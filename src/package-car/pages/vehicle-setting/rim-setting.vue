<template>
  <!-- 轮圈配置 -->
  <view v-if="active === 1" class="rim-setting">
    <view class="attr">{{ rim.data.name }}</view>
    <view v-if="showPriceFlag" class="price">
      <view v-if="rimPrice">
        <text class="text1">￥</text>
        <text class="text2">{{ formatMoney(rimPrice, 0, 0) }}</text>
      </view>
      <view v-else>
        <text class="text1">价格已包含</text>
      </view>
    </view>
    <!-- 价格待定 -->
    <view v-else class="price">
      <view>
        <text class="text3">价格待定</text>
      </view>
    </view>
    <!-- 轮圈选择 -->
    <view class="rim">
      <view class="title">轮圈</view>
      <scroll-view scroll-x class="rim-list">
        <view
          v-for="(item, index) in rimList"
          :key="index"
          class="rim-item"
          :class="{ active: rim.data.name === item.name, disabled: item.disabled }"
          @click="toSelectRim(item, item.disabled)"
        >
          <view>
            <image :src="item.image" mode="asceptFit" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup name="RimSetting">
import { formatMoney } from '@util/money'
import { inject, onMounted } from 'vue'

defineProps({
  active: {
    type: Number,
    default: 0
  }
})

const { getVehicleDeatil, rim, rimList, rimPrice, showPriceFlag, toSelectRim } = inject<any>('useSetting')
onMounted(getVehicleDeatil)
</script>

<style lang="scss" scoped>
.rim-setting {
  padding: 32rpx 40rpx;

  .attr {
    height: 54rpx;
    text-align: center;
    font-size: 36rpx;
    line-height: 54rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #292c2e;
  }

  .price {
    margin-top: 12rpx;
    text-align: center;

    view {
      display: inline-block;
      height: 40rpx;
      background: #f2f3f3;
      border-radius: 20rpx;
      padding: 0 18rpx;
      line-height: 40rpx;

      text {
        line-height: 40rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #696b6c;
        font-size: 24rpx;
      }

      .text1 {
        font-size: 20rpx;
      }

      .text2 {
        font-size: 24rpx;
      }

      .text3 {
        font-size: 24rpx;
        color: #bababa;
      }
    }
  }

  .rim {
    padding: 17rpx 0 0;

    .title {
      font-size: 30rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 600;
      color: #292c2e;
    }

    .rim-list {
      padding: 32rpx 0;
      white-space: nowrap;

      .rim-item {
        display: inline-block;
        width: 128rpx;
        height: 128rpx;
        border-radius: 50%;
        background: transparent;
        margin-right: 32rpx;

        &.active {
          background: #e8ebed;
        }

        &.disabled {
          opacity: 0.2;
        }

        > view {
          margin: 12rpx;
          width: 104rpx;
          height: 104rpx;
          line-height: 96rpx;
          border-radius: 50%;
          text-align: center;
          color: #fff;
          box-shadow: 0 8rpx 12rpx #dadada;

          > image {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
