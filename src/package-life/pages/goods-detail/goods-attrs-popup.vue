<template>
  <uni-popup ref="popup" type="bottom">
    <view class="content">
      <view class="popup-title">产品参数</view>
      <scroll-view scroll-y class="wrap-list">
        <view class="params-list">
          <view v-for="(attr, index) in attrs" :key="index" class="item">
            <text class="attr-key">{{ attr.attrKey }}</text>
            <text class="attr-val ellipsis">{{ attr.attrVal }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="popup-btn">
        <view class="btn" @click="close">关闭</view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { PropType, ref, Ref } from 'vue'

defineProps({
  attrs: {
    type: Array as PropType<Goods.Attribute[]>,
    default: () => []
  }
})

const popup: Ref<SpPopup | null> = ref(null)
function open() {
  popup.value?.open()
}
function close() {
  popup.value?.close()
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.content {
  height: 70vh;
  background-color: white;

  .popup-title {
    height: 120rpx;
    line-height: 120rpx;
    font-size: 34rpx;
    color: #292c2e;
    text-align: center;
  }

  .wrap-list {
    // 弹窗高度 - 头 - 底部
    height: calc(70vh - 120rpx - 120rpx);

    .params-list {
      padding: 0 20px;

      > .item {
        display: flex;
        justify-content: space-between;
        height: 120rpx;
        line-height: 120rpx;
        font-size: 28rpx;
        border-bottom: 1rpx solid rgb(228 231 234 / 50%);

        .attr-key {
          margin-right: 28rpx;
          color: #909ca8;
        }

        .attr-val {
          color: #696b6c;
          flex: 3;
        }
      }

      > .item:last-child {
        border-bottom: none;
      }
    }
  }

  .popup-btn {
    width: 100%;
    background: #fff;
    height: 120rpx;
    padding: 18rpx 40rpx;

    .btn {
      background: #1a1a1a;
      font-size: 28rpx;
      color: #fff;
      text-align: center;
      height: 84rpx;
      line-height: 84rpx;
    }
  }
}
</style>
