<template>
  <!-- 外观配置 -->
  <view v-if="active === 0" class="out-setting">
    <view class="attr">
      <text class="text1">{{ outColor.data.name }}</text>
      <text class="line" />
      <text>{{ outPainting.data.name }}</text>
    </view>
    <view v-if="showPriceFlag" class="price">
      <view v-if="outPrice">
        <text class="text1">￥</text>
        <text class="text2">{{ formatMoney(outPrice, 0, 0) }}</text>
      </view>
      <view v-else>
        <text class="text1">价格已包含</text>
      </view>
    </view>
    <!-- 价格不展示 -->
    <view v-else class="price">
      <view>
        <text class="text3">价格待定</text>
      </view>
    </view>
    <!-- 颜色选择 -->
    <view class="out-color">
      <view class="title">颜色</view>
      <scroll-view scroll-x class="color-list border-bottom-1">
        <view
          v-for="(item, index) in outColorList"
          :key="index"
          class="color-item"
          :class="{ active: outColor.data.name === item.name, disabled: item.disabled }"
          @click="toSelectOutColor(item, item.disabled)"
        >
          <view>
            <image :src="item.image" mode="asceptFit" />
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 喷漆选择 -->
    <view class="out-painting">
      <view class="title">喷漆</view>
      <scroll-view scroll-x class="painting-list">
        <view
          v-for="(item, index) in outPaintingList"
          :key="index"
          class="painting-item"
          :class="{ active: outPainting.data.name === item.name, disabled: item.disabled }"
          @click="toSelectOutPainting(item, item.disabled)"
        >
          <view>
            <image :src="item.image" mode="asceptFit" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup name="ExteriorSetting">
import { inject, onMounted, watch } from 'vue'
import { formatMoney } from '@util/money'
defineProps({
  active: {
    type: Number,
    default: 0
  }
})

const { getVehicleDeatil, outColor, outPainting, outPaintingList, outColorList, showPriceFlag, outPrice, outCarData, toSelectOutPainting, toSelectOutColor } =
  inject<any>('useSetting')
const emit = defineEmits(['setOutData'])
onMounted(getVehicleDeatil)
watch(
  () => outCarData.value,
  () => {
    emit('setOutData', outCarData.value)
  },
  {
    immediate: true
  }
)

watch(
  () => outColor,
  () => {
    if (!outColor.data.name) {
      emit('setOutData', null)
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.out-setting {
  padding: 32rpx 40rpx;

  .attr {
    height: 54rpx;

    text {
      display: inline-block;
      vertical-align: middle;
      font-size: 36rpx;
      width: calc(50vw - 58rpx);
      line-height: 54rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #292c2e;

      &.text1 {
        text-align: right;
      }
    }

    .line {
      display: inline-block;
      vertical-align: middle;
      width: 1rpx;
      height: 30rpx;
      margin: 12rpx 16rpx;
      background: #92969a;
    }
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
      }

      .text1 {
        font-size: 20rpx;
        color: #696b6c;
      }

      .text2 {
        font-size: 24rpx;
        color: #696b6c;
      }

      .text3 {
        font-size: 24rpx;
        color: #bababa;
        line-height: 36rpx;
      }
    }
  }

  .out-color {
    width: 100%;
    padding: 17rpx 0 0;

    .title {
      font-size: 30rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 600;
      color: #292c2e;
    }

    .color-list {
      white-space: nowrap;
      padding: 20rpx 0 44rpx;
      height: 168rpx;
      position: relative;

      .color-item {
        display: inline-block;
        width: 104rpx;
        height: 104rpx;
        margin-right: 28rpx;
        border-radius: 50%;
        background: transparent;

        &.active {
          background: #e8ebed;
        }

        &.disabled {
          opacity: 0.2;
        }

        > view {
          width: 76rpx;
          height: 76rpx;
          margin: 14rpx;
          border-radius: 50%;
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

  .out-painting {
    padding: 44rpx 0;

    .title {
      font-size: 30rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 600;
      color: #292c2e;
    }

    .painting-list {
      padding: 24rpx 0 44rpx;
      white-space: nowrap;

      .painting-item {
        display: inline-block;
        width: 164rpx;
        height: 116rpx;
        border-radius: 13rpx;
        margin-right: 44rpx;
        background: transparent;

        &.active {
          background: #e8ebed;
        }

        &.disabled {
          opacity: 0.2;
        }

        > view {
          margin: 10rpx;
          width: 144rpx;
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 13rpx;
          text-align: center;
          color: #fff;
          box-shadow: 0 8rpx 12rpx #dadada;

          > image {
            border-radius: 13rpx;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
