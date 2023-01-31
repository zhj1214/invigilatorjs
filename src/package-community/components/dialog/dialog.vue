<template>
  <view :class="showDialog ? 'zan-dialog-show' : ''" class="zan-dialog" catchtouchmove="true">
    <view class="zan-dialog-mask" @click="toggleDialog" />
    <view class="zan-dialog-container">
      <view class="content">
        <view class="title">{{ title }}</view>
        <view class="tip-content">
          <textarea
            :value="reason"
            maxlength="50"
            placeholder="请输入理由，50字以内"
            placeholder-style="color:#BABABA"
            class="text-class"
            @input="handleValue"
            @blur="handleValue"
          />
        </view>
      </view>
      <view class="foot">
        <view v-if="showCancel" class="cancel" @click="onCancel">取消</view>
        <view class="confirm" :style="getStyleValue" @click="onConfirm">
          {{ confirm }}
        </view>
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
      showDialog: false
    }
  },
  computed: {
    getStyleValue() {
      console.log('this.resason', this)
      return 'color:' + (this.reason ? '#4E6175' : this.confirmColor) + ';' + 'width:' + (this.showCancel ? '' : '100%')
    }
  },
  methods: {
    open() {
      this.showDialog = true
    },
    close() {
      this.showDialog = false
      this.reason = ''
    },
    handleValue(val) {
      this.reason = val.detail.value
    },
    onCancel() {
      this.close()
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm', this.reason)
    },
    handleInputEvent(e) {
      this.reason = e.detail.value
    },
    toggleDialog() {
      this.showDialog = !this.showDialog
    }
  }
}
</script>

<style lang="scss" scoped>
.zan-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgb(0 0 0 / 0%); /* 设置阴影半透明背景如： background: rgba(0, 0, 0, 0.4); */
  display: none;
  opacity: 0.5;
}

.zan-dialog-container {
  border-radius: 2px;
  position: fixed;
  width: 640rpx;
  background: #f8f8f8;
  transform: translate(-50%, -50%); /* 弹框弹出距离，与弹框布局高度有关，如300%表示弹起距离为3倍弹窗高度 */
  transition: all 0.4s ease;
  z-index: 12;
  top: 50%;
  left: 50%;
  display: none;

  .content {
    padding: 64rpx 45rpx 0;

    .title {
      font-size: 36rpx;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #4e6175;
      text-align: center;
    }

    .tip-content {
      color: #92969a;
      font-size: 34rpx;
      line-height: 1.5;
      padding: 32rpx 0 72rpx;

      .text-class {
        width: auto;
        text-align: left;
        height: 200rpx;
        background: #f8f9fa;
        font-size: 32rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #292c2e;
        overflow-y: hidden;
        padding: 24rpx 32rpx;
      }
    }
  }

  .foot {
    height: 110rpx;
    border-top: 1rpx solid #ddd;
    display: flex;
    justify-content: space-around;

    .cancel {
      font-size: 34rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      line-height: 48px;
      display: inline-block;
      border-right: 1rpx solid #ddd;
      text-align: center;
      flex: 1;
    }

    .confirm {
      font-size: 34rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: bold;
      color: #292c2e;
      line-height: 48px;
      display: inline-block;
      text-align: center;
      flex: 1;
    }
  }
}

.zan-dialog-show .zan-dialog-container {
  display: block;
}

.zan-dialog-show .zan-dialog-mask {
  display: block;
}
</style>
