<template>
  <uni-popup ref="identity" type="bottom" @change="changeVisible" @touchmove.stop.prevent="() => {}">
    <view class="pop">
      <view class="topic">
        <text>{{ title }}</text>
        <image :src="afterSaleCloseIcon" class="close" @click="close" />
      </view>
      <view class="select">
        <view>
          <text :class="{ active: selected }">{{ (selected && selected[customProps.label]) || '请选择' }}</text>
        </view>
      </view>
      <scroll-view scroll-y class="select-content">
        <view v-for="item in arrProps" :key="item[customProps.value]" @click="handleSelect(item)">
          <text :class="{ active: selected && selected[customProps.value] === item[customProps.value] }">{{ item[customProps.label] }}</text>
          <image v-if="selected && selected[customProps.value] === item[customProps.value]" :src="afterSaleCheckIcon" mode="scaleToFill" />
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup name="SpSelector">
import { watch, inject, reactive, ref, Ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  arrProps: {
    type: Array<AnyObject>,
    default: []
  },
  value: {
    type: Object,
    default: () => {
      return {}
    }
  },
  defaultValue: {
    type: Object,
    default: () => {
      return {}
    }
  },
  customProps: {
    type: Object,
    default: () => {
      return {
        value: 'value',
        label: 'label'
      }
    }
  }
})

const emit = defineEmits(['update:modelValue', 'update:value', 'getData', 'input', 'change'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [afterSaleCheckIcon, afterSaleCloseIcon] = gdp(['icon-after-sale-check.png', 'icon-after-sale-close.png'])

const selected: AnyObject = reactive({})

function handleSelect(data: AnyObject) {
  emit('getData', data)
  if (selected[props.customProps.value] !== data[props.customProps.value]) {
    emit('change', data)
    Object.assign(selected, data)
  }
  close()
}
defineExpose({
  open
})
const identity: Ref<SpPopup | null> = ref(null)
function close() {
  identity.value?.close()
}

function open() {
  identity.value?.open()
}

const changeVisible = (data: { show: boolean; type: string }) => {
  emit('update:modelValue', data.show)
}

watch(
  () => props.modelValue,
  (val) => {
    val ? open() : close()
  }
)

watch(
  () => props.defaultValue,
  (val) => {
    Object.assign(selected, val || {})
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.pop {
  background-color: #fff;
  height: 763rpx;
}

.topic {
  height: 120rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 45rpx 0 40rpx;
  border-bottom: 1rpx solid #e4e7ea;

  text {
    font-size: 34rpx;
    line-height: 50rpx;
    color: #292c2e;
  }

  .close {
    width: 48rpx;
    height: 48rpx;
  }
}

.select {
  height: 88rpx;
  margin-top: 20rpx;
  padding: 0 40rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #e4e7ea;

  view {
    display: flex;
    height: 88rpx;
    align-items: center;

    text {
      height: 88rpx;
      line-height: 88rpx;
      font-size: 30rpx;
      color: #4e6175;

      &.active {
        font-size: 30rpx;
        color: #292c2e;
        font-family: '思源黑体';
        font-weight: bold;
      }
    }

    image {
      margin: 0 16rpx;
      width: 32rpx;
      height: 32rpx;
    }
  }
}

.select-content {
  padding-left: 40rpx;
  background-color: #fff;
  height: calc(100% - 262rpx);

  view {
    height: 96rpx;
    display: flex;
    align-items: center;

    text {
      font-size: 30rpx;
      color: #292c2e;

      &.active {
        color: rgb(78 97 117 / 100%);
      }
    }

    image {
      margin-left: 8rpx;
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
