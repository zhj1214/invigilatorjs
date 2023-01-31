<template>
  <view class="uni-steps">
    <view class="uni-steps__row">
      <!-- 线条 -->
      <view class="uni-steps__row-container">
        <view class="uni-steps__row-line-item" v-for="(item, index) in options" :key="index">
          <view
            :class="['uni-steps__row-line', 'uni-steps__row-line--before']"
            :style="{
              backgroundColor: index <= active && index !== 0 ? activeColor : index === 0 ? 'transparent' : deactiveColor
            }"
          ></view>
          <view class="uni-steps__row-check" v-if="index < active">
            <image :src="item.img || stepSuccess" mode="asceptFit" class="img" />
          </view>
          <view
            class="uni-steps__row-circle"
            v-else
            :style="{
              backgroundColor: index === active ? activeColor : deactiveColor
            }"
          >
          </view>
          <view
            :class="['uni-steps__row-line', 'uni-steps__row-line--after']"
            :style="{
              backgroundColor:
                index + 0.5 < active && index !== options.length - 1 ? activeColor : index === options.length - 1 ? 'transparent' : deactiveColor
            }"
          ></view>
        </view>
      </view>
      <!-- 文本 -->
      <view class="uni-steps__row-text-container">
        <view v-for="(item, index) in options" :key="index" class="uni-steps__row-text">
          <text
            :style="{
              color: index <= active ? item.color || activeColor : deactiveColor
            }"
            class="uni-steps__row-title"
            >{{ item.title }}</text
          >
          <text
            :style="{
              color: deactiveColor
            }"
            class="uni-steps__row-desc"
            >{{ item.desc }}</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
export default defineComponent({
  name: 'UniSteps',
  props: {
    activeColor: {
      // 激活状态颜色
      type: String,
      default: '#292C2E'
    },
    deactiveColor: {
      // 未激活状态颜色
      type: String,
      default: '#D8D8D8'
    },
    active: {
      // 当前步骤
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
    let stepSuccess: string = gdp('step-success.png')
    return {
      stepSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.uni-steps {
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
  flex-direction: column;
}
.uni-steps__row {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}
.uni-steps__row-text-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}
.uni-steps__row-text {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  flex: 1;
  flex-direction: column;
}
.uni-steps__row-title {
  line-height: 16px;
  text-align: center;
  font-size: 26rpx;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 38rpx;
  margin-bottom: 10rpx;
}
.uni-steps__row-desc {
  text-align: center;
  font-size: 24rpx;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: #92969a;
  line-height: 30rpx;
}
.uni-steps__row-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  margin: 20rpx 0rpx;
}
.uni-steps__row-line-item {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  flex-direction: row;
  flex: 1;
  height: 14px;
  line-height: 14px;
  align-items: center;
  justify-content: center;
}
.uni-steps__row-line {
  flex: 1;
  height: 1px;
  background-color: #d8d8d8;
}
.uni-steps__row-line--after {
  transform: translateX(1px);
}
.uni-steps__row-line--before {
  transform: translateX(-1px);
}
.uni-steps__row-circle {
  width: 13rpx;
  height: 13rpx;
  border-radius: 50%;
  background-color: #d8d8d8;
}
.uni-steps__row-check {
  display: flex;
  .img {
    height: 40rpx;
    width: 40rpx;
  }
}
</style>
