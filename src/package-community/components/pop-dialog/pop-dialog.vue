<template>
  <view class="tip">
    <view class="tip-title">{{ title }}</view>
    <view v-if="mode === 'input'" class="tip-content" style="padding: 32rpx 45rpx 72rpx">
      <textarea :placeholder="text" class="text-class" maxlength="50" :style="colorText" @focus="handleFocus" @blur="handleBlur" @input="getInputEvent" />
    </view>
    <view v-else class="tip-content" :style="mode === 'launch' ? 'padding: 32rpx 80rpx 72rpx 80rpx;' : ''">{{ content }}</view>
    <view class="tip-btns">
      <view v-if="showCancel" class="cancel" @click="onCancel">{{ cancel }}</view>
      <view class="confirm" :style="styleValue" @click="onConfirm">
        {{ confirm }}
      </view>
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
  computed: {
    styleValue: () => {
      return 'color:' + (this.reason ? '#4E6175' : this.confirmColor) + ';' + 'width:' + (this.showCancel ? '' : '100%')
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm', this.reason)
    },
    getInputEvent(e) {
      this.reason = e.detail.value
    },
    handleFocus() {
      this.colorText = 'color: #292c2e'
      this.text = ''
    },
    handleBlur() {
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

  .text-class {
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
    border-top: 1px solid rgb(0 0 0 / 10%);

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
      border-right: 1px solid rgb(0 0 0 / 10%);
    }
  }
}
</style>
