<template>
  <view class="sp-numbox" @click.stop>
    <view class="sp-numbox-minus" @click="calcValue('minus')">
      <view class="sp-numbox-text" :class="{ 'sp-numbox-disabled': inputValue <= min || disabled }">-</view>
    </view>
    <input
      v-model="inputValue"
      :disabled="isDisabledInput"
      class="sp-input sp-numbox-value"
      type="text"
      :maxlength="max"
      confirm-type="done"
      @blur="onBlur"
      @focus="onFocus"
      @confirm="onConfirm"
    />
    <view class="sp-numbox-plus" @click="calcValue('plus')">
      <view class="sp-numbox-text" :class="{ 'sp-numbox-disabled': inputValue >= max || disabled }">+</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SpInputNumber">
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  value: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isDisabledInput: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'update:modelValue', 'error', 'input', 'confirm'])

const inputValue = ref(0)
let oldInputVal = 0
// eslint-disable-next-line vue/no-setup-props-destructure
inputValue.value = props.modelValue
// #ifdef MP-WEIXIN
// vue3 小程序 modelValue 不生效的临时方案
// eslint-disable-next-line vue/no-setup-props-destructure
inputValue.value = props.value
// #endif

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = +val
  }
)

function getDecimalScale() {
  let scale = 1
  // 浮点型
  if (~~props.step !== props.step) {
    scale = Math.pow(10, (props.step + '').split('.')[1].length)
  }
  return scale
}

function onConfirm(e: FocusEvent) {
  onBlur(e)
  nextTick(() => {
    emit('confirm')
    uni.hideKeyboard()
  })
}

function onFocus(e: FocusEvent) {
  if (!e.detail) {
    inputValue.value = oldInputVal
  } else {
    oldInputVal = +e.detail
  }
}

function onBlur(e: FocusEvent) {
  let value = Number(e.detail)
  if (!value || isNaN(value)) {
    inputValue.value = oldInputVal
    return
  }
  value = +value
  if (value > props.max) {
    emit('error', 'moreThanMax')
    value = props.max
  } else if (value < props.min) {
    emit('error', 'lessThanMin')
    value = props.min
  }
  const scale = getDecimalScale()
  inputValue.value = Number(value.toFixed(String(scale).length - 1))
  emit('change', +inputValue.value, +oldInputVal)
  emit('update:modelValue', +inputValue.value)
  // #ifdef MP-WEIXIN
  // vue3 小程序 update:modelValue 不生效的临时方案
  emit('input', +inputValue.value)
  // #endif
}

function calcValue(type: string) {
  if (props.disabled) {
    return
  }
  const scale = getDecimalScale()
  let value = inputValue.value * scale
  let step = props.step * scale
  if (type === 'minus') {
    value -= step
    if (value < props.min * scale) {
      return
    }
    if (value > props.max * scale) {
      value = props.max * scale
    }
  }
  if (type === 'plus') {
    value += step
    if (value > props.max * scale) {
      return
    }
    if (value < props.min * scale) {
      value = props.min * scale
    }
  }

  inputValue.value = Number((value / scale).toFixed(String(scale).length - 1))
  emit('change', +inputValue.value, +oldInputVal)
  emit('update:modelValue', +inputValue.value)
  // #ifdef MP-WEIXIN
  // vue3 小程序 update:modelValue 不生效的临时方案
  emit('input', +inputValue.value)
  // #endif
}
</script>

<style lang="scss" scoped>
.sp-numbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 56rpx;
  width: 168rpx;
  border: 2rpx solid #f2f3f3;
  border-radius: 56rpx;
}

.sp-numbox-value {
  width: 60rpx;
  height: 100%;
  text-align: center;
  font-size: 28rpx;
}

.sp-numbox-minus {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 100%;
  color: #4e6175;
}

.sp-numbox-plus {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 100%;
  color: #4e6175;
  line-height: 66rpx;
}

.sp-numbox-text {
  font-size: 40rpx;
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  top: -4rpx;
}

.sp-numbox-disabled {
  color: $uni-text-color-disable;
}
</style>
