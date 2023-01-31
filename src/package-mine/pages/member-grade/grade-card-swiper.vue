<template>
  <swiper class="swiper" previous-margin="40rpx" :current="level" @change="toSwiperChange">
    <swiper-item v-for="(item, index) in levelList" :key="index" class="swiper-item">
      <view class="item">
        <image class="back-img" :src="item.coverImg" />
        <view class="user-level">
          <view class="level-zn">{{ item.name }}</view>
        </view>
        <view class="user-growth">
          <view v-if="item.id === levelId" class="growth-value">
            <text v-if="vipInfo.nextGrowth !== null" style="color: rgb(255 255 255 / 80%)">
              {{ item.growth }}/{{ vipInfo.nextGrowth }} 还需要{{ vipInfo.nextGrowth - vipInfo.growth }}成长值，可升级为{{ levelList[index + 1].name }}
            </text>
            <text v-if="vipInfo.nextGrowth === null">
              <text style="color: rgb(255 255 255 / 80%)">成长值：{{ item.growth }}</text>
              ，您已达到最高级别
            </text>
            <image :src="iconNote" class="img-note" @click="goToGrowthRule" />
          </view>
          <view v-if="item.nextGrowth === undefined && !item.lastErcent" class="growth-value">成长值达{{ item.riseValue }}，可以升级为{{ item.name }}</view>
          <view v-if="item.lastErcent" class="growth-value">您已超越该等级</view>
          <progress
            v-if="item.id === levelId"
            :percent="item.percent ? item.percent : 0"
            stroke-width="3"
            border-radius="1"
            activeColor="#FFFFFF"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            class="progress"
          />
        </view>
        <view v-if="item.id === levelId" class="label">当前等级</view>
      </view>
    </swiper-item>
  </swiper>
</template>

<script setup lang="ts" name="GradeCardSwiper">
import { inject } from 'vue'
import { EventHandle } from 'UniApp'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const iconNote = gdp('icon-note.png')

const emit = defineEmits(['change'])

defineProps<{
  levelList: Member.LevelInfo[]
  level: number
  vipInfo: Member.CurLevelInfo
  levelId: string
}>()

function toSwiperChange(e: EventHandle) {
  emit('change', e.detail.current)
}

function goToGrowthRule() {
  uni.navigateTo({
    url: '/package-mine/pages/growth-rule/index'
  })
}
</script>

<style lang="scss" scoped>
.swiper {
  height: 430rpx;

  .swiper-item {
    .item {
      color: #fff;
      position: relative;

      // padding: 24rpx;
      .back-img {
        position: absolute;

        /* #ifdef MP-WEIXIN */
        width: 94.5%;
        /* #endif */

        /* #ifdef H5 */
        width: 89.5%;
        /* #endif */
        height: 344rpx;
        background: linear-gradient(45deg, #dce0e3 0%, #eaedf0 100%);
        box-shadow: 0 32rpx 48rpx -20rpx rgb(142 154 167 / 28%);
        border-radius: 8rpx;
      }

      .user-level {
        position: relative;
        top: 56rpx;
        left: 48rpx;

        .level-zn {
          font-size: 46rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
        }
      }

      .user-growth {
        position: relative;
        margin-top: 200rpx;
        left: 48rpx;

        .growth-value {
          font-size: 24rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;

          .img-note {
            width: 28rpx;
            height: 28rpx;
            vertical-align: text-top;
            margin-top: 3rpx;
            margin-left: 8rpx;
          }
        }

        .progress {
          width: 214rpx;
        }
      }

      .label {
        position: absolute;

        /* #ifdef MP-WEIXIN */
        right: 40rpx;
        /* #endif */

        /* #ifdef H5 */
        right: 80rpx;
        /* #endif */
        top: 42rpx;
        width: 133rpx;
        height: 46rpx;
        line-height: 46rpx;
        background: rgb(255 255 255 / 20%);
        border-radius: 23rpx 0rpx 0rpx 23rpx;
        text-align: center;
        font-size: 24rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #fff;
      }
    }
  }

  .swiper-item:nth-child(2) {
    .item {
      .back-img {
        box-shadow: 0 32rpx 48rpx -20rpx rgb(155 129 99 / 28%);
      }
    }
  }

  .swiper-item:nth-child(3) {
    .item {
      .back-img {
        box-shadow: 0 32rpx 48rpx -20rpx rgb(105 110 115 / 29%);
      }
    }
  }

  .swiper-item:nth-child(4) {
    .item {
      .back-img {
        box-shadow: 0 32rpx 48rpx -20rpx rgb(64 71 82 / 44%);
      }
    }
  }
}
</style>
