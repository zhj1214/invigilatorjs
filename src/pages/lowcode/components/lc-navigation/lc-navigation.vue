<template>
  <view :class="{'page-header': true, 'page-fixed': bgType === '2', [colorTypeMap]: bgType === '2' }" :style="bgType === '1' ? { background: bgColor } : undefined">
    <!-- 状态栏 -->
    <view class="status_bar" :style="'height:' + statusBarHeight + 'px'" />
    <!-- 导航栏 -->
    <view class="navigation">
      <view class="navigation-left">
        <image
          class="navigation-icon"
          v-for="item in leftEditsChecked"
          :key="item"
          :src="{'1': iconCarBuy, '2': iconSearch}[item]"
          mode="scaleToFill"
          @click="clickIcon(item)"
        />
      </view>
      <!-- 标题内容 -->
      <view class="navigation-center">
        <view v-if="showTitle" class="navigation-title" :style="{color: titleColor || '#262626'}">{{title}}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SpSearchHeader">
import { computed, inject, useAttrs } from 'vue'

interface PropsType {
  bgType: '1' | '2',
  bgColor?: string,
  colorType?: '1' | '2' | '3',
  titleColor?: string,
  title?: string,
  showTitle: boolean,
  leftEdits?: Array<{ label: string; value: "1" | "2"; checked: boolean }> | [],
}

// const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>

const props = withDefaults(defineProps<PropsType>(), {
  bgType: "1",
  bgColor: "",
  colorType: "1",
  titleColor: "",
  title: "",
  showTitle: true,
  leftEdits: () => [],
})
const [iconCarBuy, iconSearch] = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAAXNSR0IArs4c6QAAAZhQTFRFAAAA////gICAVVVVMzMzKlVVQEBAMzMzLi4uKkBAOzs7Nzc3MDAwLS08Kzk5NjY2MTExLCw3MzMzMTExLy8vKjMzMDAwLDMzKzIyLS0zLDIyKzExKjAwKi8vLi4zLS0yKS4uKi8vKi4yKS0xLDAwKy8vKy4uKi4xKy8vKS0wLCwwLC8vKi0wKS0wLCwvKy4uKy4xKi0wKiwvKS8vKy4uKy4xKy0wKi0wKy4uKi0vKiwvKS4uKy0wKi0vKy4wKiwvKy0vKiwvKS0wKS4wKS0vKy0vKy0vKiwuKi0vKy0vKiwuKi4vKi0vKi4vKi0vKS0vKi4vKywvKi0vKi0vKS0uKSwwKi0vKi0uKS0uKywvKi0vKi0uKiwvKS0vKSwvKS0vKiwvKi0uKi0vKiwvKi0uKS0uKiwvKS0uKS0uKS0uKiwvKS0uKS0uKS0vKi0uKSwuKiwvKS0vKiwuKi0uKSwvKi0vKSwvKi0vKSsvKSwvKSwuKiwuKiwuKi0vKS0uKSwuKSwuKiwuKi0vKi0vKS0vKSwuKSwuKSwu3kkdLQAAAId0Uk5TAAECAwUGCAoLDA0OEBESExUXGRobHiAjJCgpLzAxMjM4PD0+QEFCQ0dKS0xPUFFTVFVWV1hZWlteYWJjZWdqbXFzdnt8fX5/gYOFjI2Rk5SXnJ2eoKGjpaaoqausrrO0uLu9vsLHysvMzdDR0tPW2Nve4uPm6evv8fHy8/T09vf4+fr7/P3+G1JdrgAAAZ9JREFUOMu11VdT20AUhmFTjIFA6NUkdAjddELvvYaaAKYTeieACaFa79/mAhhrpV2hGSbn7nzzjLRNK4fj/1X02GBRqF08DJzX2cSeO4BmmzqxZg1uYm2P+xc02cY5MGEbfwbfprLWR4sFfYd1/XTp8ME7mBEd/gFZwapyeXxoKQHcCQ0Wc+qC+kBXCoMWuBy6A10aLFjgdmEfnE/sWeBxyNG1R9wGq/EqxOnaJUhW41OuDAf1m9K6NH7r+xZoU2I3zOr7PBhT4kro0/fxsGK1J7VC4ONEiafhqxBsoblUeBsihWAW3ApbaFgMh6MXqkwsJCm3oW/+AVrFvBp6BNQ7uXb8+HqavUEi/gIzJvRS5z0hhjeGa1waENf73tGOCneQeRr/jCgzRn1YDuHvu+it+qHL9t2RruGfam2RVrnpmu22uAmGTc9uu1DiIfNIIrIbm6VVGvrBP0ZCXb5pA6I8JU6ZLbgGr+EbTz2D3U8SvANQJmZzIF//K4B2MdsA+UW/CPgzxGwAoEaC45b9f74bsrCp+5sB+XKESTJnYMrPUJXaOAxQ0Q4AAAAASUVORK5CYII=",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAAXNSR0IArs4c6QAAAdpQTFRFAAAA////gICAVVVVQEBAMzMzKlVVSUlJQEBAOTk5MzMzKkBAOzs7Nzc3MzMzMDAwLS08Kzk5LCw3MzMzLy8vKjMzKTExMDAwLi4uLS01KzIyLy8vLi40LS0zLDIyKzExLi4uKjAwKi8vLi4zKzAwLi4yLS0xLDAwKzAwKi8vLDAwKy8vKy4uKi4xLCwwLC8vKi0xLCwwLC8vKy4uKi0wLC8vKy4uKi0wKiwvKS8vKy4xKy0wKi0wKiwvKS8vKy4wKi0wKiwvKy4wKS4uKi0vKiwuKS4wKy4wKy0vKi0vKS4wKS0wKy0vKi4wKS4wKi4wKi0vKiwuKi4wKS0vKy0vKy0wKiwuKywuKi0vKi0vKS0vKywwKi4vKi0vKSwuKi0vKi0vKywvKi0vKi0uKS0uKi0vKi0uKSwvKS0vKi0uKi0uKSwvKS0vKi0uKi0uKi0vKSwvKi0uKi0vKiwvKSwvKi0uKS0uKiwvKS0uKS0uKiwvKS0uKS0uKS0vKiwvKiwuKS0uKS0vKiwvKiwvKiwuKS0vKiwuKi0uKS0vKSwvKi0vKS0vKSwvKSwuKiwuKi0uKi0vKS0vKSwvKi0vKi0vKSwuKSwuKiwuKi0vKi0vKS0vKSwuKSwuKSwuMLHPDwAAAJ10Uk5TAAECAwQFBgcICQoMDQ4PEBESFxkbHh8gISIkJicoKSosMDEyNTg5Ojs8QEFCQ0VGSUtMTU9SU1VWV1laW1xdX2BiZGlsbm9wcXJ1dnd6e4CBhYaIiYmKkJKTlJaXmZudnqKjpaapq62usLGztLW2t7m8vb6/wsbJy83P0dLT1dbY2drb3N/i4+Tm6err7O3u7/Dx9PX3+Pn6+/z9/nP/jAkAAAHpSURBVBgZzcH5Q4sBAMfhb2uOdZhSTHJUqDAipUS5zyLKEUkhcqWDhEKR6BCNltrnfzWy9W7vYX7zPPpfeTf6dxescumvPHtbx/kt2HU0S05Szk1jEGrPka2aT4QFetoazt94+IGw2aZUWVrSDMy17VmuBfn1Y8CrNbLgfQrc3yCDtPoAjBfKxN0NMzWKs34YvqxTvCaY2CqTlb0w5FWsSggWy0LaINxTjGUjcFiWfJNQLKNT0CUbR6BPBsnjhPJkI/kN+LVoG3TI1n64rkVXoEq2Umf4mKSoYWa9stcJeYpw/eClHNRBmSIy4bEcHIJjisiHFjnYBRcVsRma5WAHXFZEFjyQg4NwUhHuefrl4AxUKGqUbx7Za4ctiroJpbK1dJopt6JKoVW2SuCWFnkCzKyWnWdQLoNGaJONUhhyy8D7mXm/LHnfQblinIapHFlI7oI+xXI9grfZMnG3w4RPcdJfw1iR4mR0Q+iSTNa+h+CFdBkkVY4QNn9AJhk9wEStT3+kVfYDY3dhrkwm7sYgYQNXa6srTjQ8CRLWm53UAsESmfnuhDAaKJHkug3ft8tCbt3zEAtGr+106Rd3BwQKZSmzaN/xs9X+XEUt7YSvBUqQpxcmNylBqX0wqESteMGIS4lKqfLpH/0Eos6/8t0QDzoAAAAASUVORK5CYII=",
];
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0
const colorTypeMap = computed(() => ({ '1': 'transparent', '2': 'gradient', '3': 'blurred' }[props.colorType]))
const leftEditsChecked = computed(() => props.leftEdits.filter(item => item.checked).map(item => item.value))

const emit = defineEmits(['handleBack'])

const clickIcon = (iconValue: string) => {

}
// const handleBackClick = () => {
//   if (props.customBackFn) {
//     emit('handleBack')
//     return
//   }
//   uni.navigateBack({
//     delta: 1
//   })
// }
</script>

<style lang="scss" scoped>
.page-header {
  z-index: 999;
  background: transparent;
  width: 100vw;

  .navigation {
    position: relative;
    height: 88rpx;
    display: flex;
    align-items: center;

    .navigation-left {
      position: relative;
      z-index: 99;

      .navigation-icon {
        margin: 0 20rpx;
        width: 44rpx;
        height: 44rpx;
        z-index: 1000;
        position: relative;
        &:first-child{
          margin-left: 25px;
        }
      }
    }


    .navigation-center {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .navigation-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 300rpx;
        font-weight: 500;
        color: #262626;
        font-size: 34rpx;
        text-align: center;
      }
    }
  }
}

.page-fixed {
  position: fixed;

  &.transparent {
    background: transparent;
  }

  &.gradient {
    background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  }

  &.blurred {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(14px);
  }
}
</style>
