<template>
  <image :class="['sp-checkbox-icon', size]" :src="imgUrl" mode="aspectFit" @click.stop="change" />
</template>

<script lang="ts" setup name="SpCheckbox">
import { inject, computed, watch, ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: [Boolean, Number, String],
    default: false
  },
  checked: Boolean,
  disabled: Boolean,
  round: Boolean,
  size: {
    type: String,
    default: 'normal',
    validator: (size: string) => {
      return ['large', 'normal', 'small'].includes(size)
    }
  },
  trueValue: {
    type: [Boolean, Number, String],
    default: true
  },
  falseValue: {
    type: [Boolean, Number, String],
    default: false
  }
})

const emit = defineEmits(['change', 'update:modelValue', 'input'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [checkboxIcon, checkboxCheckedIcon, radioIcon, radioCheckedIcon, radioDisabledIcon] = gdp([
  'icon-checkbox.png',
  'icon-checkbox-checked.png',
  'icon-radio.png',
  'icon-radio-checked.png',
  'icon-radio-disabled.png'
])

const checked = ref(false)

checked.value = props.modelValue === props.trueValue || props.checked

watch(
  () => props.modelValue,
  (val) => {
    checked.value = val === props.trueValue
  }
)

watch(
  () => props.checked,
  (val) => {
    checked.value = val
  }
)

const imgUrl = computed(() => {
  if (props.round) {
    if (props.disabled) {
      return radioDisabledIcon
    }
    return checked.value ? radioCheckedIcon : radioIcon
  }
  return checked.value ? checkboxCheckedIcon : checkboxIcon
})

const change = () => {
  if (props.disabled) {
    return
  }
  checked.value = !checked.value
  const val = checked.value ? props.trueValue : props.falseValue
  emit('change', val, checked.value ? props.falseValue : props.trueValue)
  emit('update:modelValue', val)
  // #ifdef MP-WEIXIN
  // vue3 小程序 update:modelValue 不生效的临时方案
  emit('input', val)
  // #endif
}
</script>

<style lang="scss" scoped>
.sp-checkbox-icon {
  width: 40rpx;
  height: 40rpx;

  /*  #ifdef  MP-WEIXIN  */
  vertical-align: top;
  /*  #endif  */
  &.large {
    width: 48rpx;
    height: 48rpx;
  }

  &.small {
    width: 28rpx;
    height: 28rpx;
  }
}
</style>
