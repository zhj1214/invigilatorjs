<template>
  <view class="total-wrap">
    <view class="node-container">
      <view class="node-container-left">
        <view class="tag-container">
          <view class="node-tag-container" :class="{ active: isNewest }">
            <view class="node-tag" />
          </view>
        </view>
        <view v-if="!isEnd" class="line-container">
          <view class="line" />
        </view>
      </view>
      <view class="node-container-right">
        <view class="node-desc" :class="{ active: isNewest }">{{ acceptStationFixed }}</view>
        <view class="node-time" :class="{ active: isNewest }">{{ nodeData.acceptTime }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="DeliveryTrack">
import { computed } from 'vue'

const props = defineProps({
  isNewest: {
    type: Boolean,
    default: false
  },
  isEnd: {
    type: Boolean,
    default: false
  },
  nodeData: {
    type: Object,
    default: () => ({})
  }
})
const acceptStationFixed = computed(() => (props.nodeData.acceptStation ? props.nodeData.acceptStation.replace(/(\d{3})\d{4}(\d{4})/, '') : ''))
</script>
<style lang="scss" scoped>
.total-wrap {
  width: 100%;

  .node-container {
    width: 100%;
    height: auto;
    display: flex;

    &-left {
      width: 32rpx;
      padding: 10rpx 3rpx 0;
      height: auto;

      .tag-container {
        position: relative;
        z-index: 2;
        width: 26rpx;
        height: 26rpx;

        .node-tag-container {
          width: 26rpx;
          height: 26rpx;
          padding: 6rpx;
          border-radius: 50%;
          background: #fff;

          .node-tag {
            width: 15rpx;
            height: 15rpx;
            background-color: #dcdcdc;
            border-radius: 50%;
          }

          &.active {
            padding: 4rpx;
            border: 1rpx solid #1a1a1a;

            .node-tag {
              background-color: #1a1a1a;
            }
          }
        }
      }

      .line-container {
        position: relative;
        z-index: 1;
        width: 26rpx;
        padding: 0 12rpx;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;

        .line {
          width: 0rpx;
          border-right: 2rpx dashed #d8d8d8;
          height: 100%;
          position: relative;
          top: -5rpx;
        }
      }
    }

    &-right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 0 64rpx 19rpx;

      .node-desc {
        width: 100%;
        min-height: 30rpx;
        font-size: 30rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
        line-height: 40rpx;
        word-wrap: break-word;
        word-break: normal;

        &.active {
          color: #1a1a1a;
        }
      }

      .node-time {
        margin-top: 16rpx;
        width: 100%;
        height: 34rpx;
        font-size: 24rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #92969a;
        line-height: 30rpx;

        &.active {
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>
