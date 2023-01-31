<template>
  <view class="assess-car">
    <view v-if="data.carVehicleImg" class="card" :style="{ 'background-image': 'url(' + data.carVehicleImg + ')' }">
      <view class="title">
        <text class="ellipsis">{{ data.vehicleTitle }}</text>
      </view>
      <view class="text-configure">
        <view v-for="(attr, index) in (data.saleAttrs || []).slice(0, 2)" :key="index">
          {{ attr }}
        </view>
        <view>...</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="EvaluationPublishedCar">
import { reactive, watch } from 'vue'
import { useCarStore } from '@src/pinia/car'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const carStore = useCarStore()

let data = reactive({}) as Evaluation.CarEvaluationItem

watch(props.item, (v) => init(v), {
  deep: true,
  immediate: true
})

function init<T>(item: T) {
  Object.assign(data, carStore.getInfo([{ ...item }], 2)[0])
}
</script>

<style scoped lang="scss">
.assess-car {
  height: 344rpx;
  background: #f2f3f3;
  padding: 32rpx 0 0 36rpx;

  .card {
    height: 100%;
    background-size: 72%;
    background-position: right bottom;
    background-repeat: no-repeat;

    .title {
      width: 100%;
      color: #4e6175;
      font-size: 38rpx;
      line-height: 56rpx;
      display: flex;
      align-items: center;

      .text {
        width: calc(100% - 40rpx);
      }

      image {
        width: 32rpx;
        min-width: 32rpx;
        height: 32rpx;
        margin-left: 5rpx;
        vertical-align: middle;
      }
    }

    .text-configure {
      width: 35%;
      margin-top: 6rpx;
      color: #92969a;

      > view {
        font-size: 24rpx;
        line-height: 30rpx;
        margin-bottom: 12rpx;
      }
    }
  }
}
</style>
