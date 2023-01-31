<template>
  <view class="tip">
    <view class="tip-title">{{ title }}</view>
    <view class="tip-content" v-if="mode === 'input'" style="padding: 32rpx 45rpx 72rpx 45rpx">
      <textarea :placeholder="text" class="textClass" maxlength="50" :style="colorText" @focus="focus" @blur="blur" @input="inputEvent"></textarea>
    </view>
    <view class="tip-content" v-else :style="mode === 'launch' ? 'padding: 32rpx 80rpx 72rpx 80rpx;' : ''">{{ content }}</view>
    <view class="tip-btns">
      <view class="cancel" @click="onCancel" v-if="showCancel">{{ cancel }}</view>
      <view
        class="confirm"
        @click="onConfirm"
        :style="'color:' + (reason ? '#4E6175' : confirmColor) + ';' + 'width:' + (showCancel ? '' : '100%')"
        >{{ confirm }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    cancel: {
      type: String,
      default: '取消'
    },
    confirm: {
      type: String,
      default: '确认'
    },
    mode: {
      type: String,
      default: 'base'
    },
    confirmColor: {
      type: String,
      default: '#292c2e'
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      reason: '',
      colorText: '',
      text: '请输入理由，50字以内'
    }
  },
  mounted() {},
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm', this.reason)
    },
    inputEvent(e) {
      this.reason = e.detail.value
    },
    focus() {
      this.colorText = 'color: #292c2e'
      this.text = ''
    },
    blur() {
      this.text = '请输入理由，50字以内'
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  width: 640rpx;
  min-height: 368rpx;
  margin: auto;
  background-color: #fff;
  text-align: center;

  &-title {
    font-size: 36rpx;
    color: #4e6175;
    font-weight: bold;
    line-height: 1.5;
    padding-top: 64rpx;
  }
  &-content {
    color: #92969a;
    font-size: 34rpx;
    line-height: 1.5;
    padding: 32rpx 0 72rpx;
  }
  .test {
    color: #bababa;
  }
  .textClass {
    width: auto;
    text-align: left;
    height: 167rpx;
    background: #f8f9fa;
    font-size: 32rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    color: #bababa;
    padding: 24rpx 32rpx;
  }
  &-btns {
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    .cancel,
    .confirm {
      width: 50%;
      flex-shrink: 0;
      height: 110rpx;
      line-height: 100rpx;
      color: #292c2e;
      font-weight: bold;
      font-size: 34rpx;
    }
    .cancel {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
