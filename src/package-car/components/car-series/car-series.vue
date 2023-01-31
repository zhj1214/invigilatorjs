<template>
  <view class="car-series" :style="{ border: seriesId === seriesData.id ? '2rpx  solid #1A1A1A' : '' }" @click="toSelectSeries">
    <view :class="['car-info-box', { type1: index % 3 === 0 }, { type2: index % 3 === 1 }, { type3: index % 3 === 2 }]">
      <view class="card" :style="{ 'background-image': `url(${seriesData.attrs.poster})` }">
        <view class="title ellipsis">{{ seriesData.attrs.title }}</view>
        <view class="desc">{{ seriesData.attrs.desc }}</view>
        <view class="price">
          <text>￥{{ formatMoney(seriesData.attrs.price, 0, 0) }}</text>
          <text style="margin-left: 4rpx">起</text>
        </view>
        <view class="detail" @click.stop="goSeriesDetail">
          <text>查看详情</text>
          <text class="arrow-right" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="CarSeries">
import { formatMoney } from '@util/money'
import { useCarStore } from '@src/pinia/car'
import { PropType } from 'vue'
const carStore = useCarStore()
const props = defineProps({
  seriesData: {
    type: Object as PropType<Car.Series>,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  seriesId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['clearModel', 'selectSeries'])
const goSeriesDetail = () => {
  carStore.setTempData(props.seriesData)
  emit('clearModel')
  uni.navigateTo({
    url: `/package-car/pages/series-detail/index?id=${props.seriesData.id}`
  })
}
const toSelectSeries = () => {
  emit('selectSeries')
}
</script>

<style lang="scss" scoped>
.car-series {
  .type1 {
    background: #dadada;

    .desc {
      color: #92969a;
    }
  }

  .type2 {
    background: #565b56;

    .title {
      color: #fff !important;
    }

    .card {
      color: #fff !important;
    }

    .desc {
      color: #999c99;
    }

    .detail {
      color: #c8c5d0;

      .arrow-right {
        border-color: #c8c5d0 !important;
      }
    }
  }

  .type3 {
    background: #acacac;

    .desc {
      color: #696b6c;
    }
  }

  margin-bottom: 32rpx;

  .car-info-box {
    height: 514rpx;
    padding: 32rpx 0 0 36rpx;

    .card {
      width: 100%;
      height: 100%;
      font-size: 24rpx;
      color: #4e6175;
      background-size: 100%;
      background-position: right bottom;
      background-repeat: no-repeat;

      .title {
        width: calc(100% - 40rpx);
        color: #213a53;
        font-size: 70rpx;
        line-height: 90rpx;
        word-break: break-all;
      }

      .price {
        line-height: 36rpx;

        & :first-child {
          font-weight: bolder;
        }
      }

      .detail {
        width: fit-content;
        margin-top: 20rpx;

        .icon-right {
          width: 30rpx;
          height: 30rpx;
          vertical-align: middle;
        }

        .arrow-right {
          border-style: solid;
          border-color: #213a53;
          border-width: 0 1rpx 1rpx 0;
          display: inline-block;
          padding: 6rpx;
          margin-left: 4rpx;
          transform: rotate(-45deg);
        }
      }
    }
  }
}
</style>
