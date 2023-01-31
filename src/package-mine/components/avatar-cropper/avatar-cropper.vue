<template>
  <view class="container">
    <sp-cropper ref="cropper" :ratio="1 / 1" show-grid :image-src="url" :d-width="200">
      <!-- 你想插入的内容 -->
      <view class="btn-footer">
        <view @click="cancel">取消</view>
        <view class="confirm-btn" @click="toCrop">确认</view>
      </view>
    </sp-cropper>
  </view>
</template>
<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import spCropper from './sp-cropper.vue'

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['isOk', 'oncancel'])
const instance = getCurrentInstance()
const toCrop = () => {
  // 通过组件定义的ref调用cropper方法，返回一个promise对象
  const cropper = instance?.refs.cropper as { toCrop: () => Promise<Array<{ tempFilePath: string }>> }
  cropper.toCrop().then(([err, res]) => {
    if (!err) {
      emit('isOk', { path: res.tempFilePath })
    } else {
      console.log(err)
    }
  })
}
const cancel = () => {
  emit('oncancel')
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;

  .btn-footer {
    width: 100%;
    height: 120rpx;
    padding: 0 40rpx env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: bolder;

    .confirm-btn {
      color: #098d44;
    }
  }
}
</style>
