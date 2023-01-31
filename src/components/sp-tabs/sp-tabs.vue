<template>
  <view>
    <view class="sp-tabs" :class="{ 'show-underline': underline, 'car-list-header': carListHeader, 'assess-style': assessStyle }">
      <scroll-view scroll-x class="sp-tabs-scroll" :scroll-left="scrollLeft" @scroll="handleOnScroll">
        <view class="sp-tabs-content">
          <view class="left">
            <view
              v-for="(item, index) in menus"
              :id="activeMenu === item.value ? 'active' : ''"
              :key="index"
              class="menu-item"
              :class="activeMenu === item.value ? 'active' : ''"
              @click="toMenuChange(item.value, index)"
            >
              {{ item.name }}
            </view>
          </view>
          <view class="right">
            <slot />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts" name="SpTabs">
import { ref, watch, computed, nextTick } from 'vue'

interface Menu {
  name: string
  value: string
}

interface Props {
  activeTab?: number
  underline?: boolean
  carListHeader?: boolean
  fixed?: boolean
  initScrollPage?: boolean
  assessStyle?: boolean
  menus: Menu[]
}

const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
  underline: () => false,
  carListHeader: () => false,
  fixed: () => false,
  initScrollPage: () => false,
  assessStyle: () => false,
  activeTab: () => 0
})

const emit = defineEmits(['on-click', 'change', 'activeIndex'])

const activeMenu = ref<string>('')
const scrollLeft = computed(() => {
  return props.initScrollPage ? scrollToLeft.value : (props.activeTab - 1) * 60
})
watch(
  () => props.menus,
  (menus) => {
    activeMenu.value = menus.length ? menus[props.activeTab]?.value : ''
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.activeTab,
  (tabIndex) => {
    activeMenu.value = props.menus.length ? props.menus[tabIndex].value : ''
  },
  {
    immediate: true
  }
)
const scrollToLeft = ref(0)
const oldScrollLeft = ref(0)
const handleOnScroll = (e: AnyObject) => {
  oldScrollLeft.value = e.detail.scrollLeft
}
const goLeft = () => {
  scrollToLeft.value = oldScrollLeft.value
  nextTick(() => {
    scrollToLeft.value = 0
  })
}
const toMenuChange = (menu: string, index: number) => {
  const emitData = props.assessStyle ? index : menu
  emit('on-click', emitData)
  if (activeMenu.value !== menu) {
    activeMenu.value = menu
    emit('change', emitData)
    emit('activeIndex', index)
  }
}
defineExpose({ goLeft })
</script>

<style lang="scss" scoped>
.sp-tabs {
  width: 100%;
  padding: 26rpx 40rpx 22rpx;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: auto;
  background: #fff;

  &::-webkit-scrollbar {
    display: none;
  }

  &-scroll {
    white-space: nowrap;
  }

  .sp-tabs-content {
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  .left {
    white-space: nowrap;

    .menu-item {
      display: inline-block;
      padding-bottom: 10rpx;
      line-height: 54rpx;
      color: rgb(146 150 154);
      font-size: 30rpx;
      margin-right: 56rpx;

      &.active {
        color: rgb(41 44 46);
        font-weight: bold;
      }
    }
  }

  .right {
    .add-icon {
      width: 48rpx;
      height: 48rpx;
    }
  }

  &.show-underline {
    .menu-item.active {
      font-size: 36rpx;
      font-weight: bold;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 2px;
        margin-left: -16rpx;
        background-color: rgb(41 44 46);
        border-radius: 2rpx;
        width: 32rpx;
        height: 4rpx;
      }
    }
  }

  &.car-list-header {
    height: 110rpx;
    display: flex;
    align-items: center;

    .sp-tabs-content {
      justify-content: center;
    }

    .left {
      display: flex;

      .menu-item {
        padding: 0 34rpx 23rpx;
        line-height: 54rpx;
        color: rgb(146 150 154);
        font-size: 30rpx;
        margin-right: 0;

        &.active {
          color: rgb(78 97 117);
          font-weight: 500;
          font-size: 40rpx;

          &::after {
            left: 0;
            width: 100%;
            margin-left: 0;
            background-color: rgb(78 97 117);
          }
        }
      }
    }
  }

  &.assess-style {
    // .menu-item {
    //   color: #4e6175 !important;
    //   padding: 0 30rpx !important;
    //   height: 64rpx;
    //   line-height: 64rpx !important;
    //   border-radius: 32rpx;
    //   border: 2rpx solid #7190b0;
    //   margin-right: 16rpx !important;
    //   font-size: 26rpx;
    // }

    .active {
      color: #fff !important;
      background-color: #7190b0;
      font-size: 26rpx;
    }
  }
}
</style>
