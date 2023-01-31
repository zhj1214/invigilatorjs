<template>
  <view class="service-assess">
    <view class="service-assess-line" />
    <template v-if="isShowSCore">
      <view v-if="orderType !== 3" class="service-assess-score">
        <view class="service-assess-score-label">{{ assessLabel }}</view>
        <view class="service-assess-score-stars">
          <uni-rate v-model="score" color="#7190B0" active-color="#7190B0" margin="6" :value="0" :model-value="0" :max="5" :is-fill="false" />
        </view>
        <view class="service-assess-score-result">{{ assessResult }}</view>
      </view>
      <view class="service-assess-score">
        <view class="service-assess-score-label">线上服务</view>
        <view class="service-assess-score-stars">
          <uni-rate v-model="onLineScore" color="#7190B0" active-color="#7190B0" margin="6" :value="0" :model-value="0" :max="5" :is-fill="false" />
        </view>
        <view class="service-assess-score-result">{{ assessResultOnline }}</view>
      </view>
    </template>
    <view v-else class="finished">已完成物流及服务评价</view>
  </view>
</template>

<script lang="ts" setup name="EvaluationPublishedService">
import { ref, computed } from 'vue'

const props = defineProps({
  isShowSCore: {
    type: Boolean,
    require: true,
    default: true
  },
  orderType: {
    type: Number,
    require: true,
    default: 1
  }
})

let onLineScore = ref(0)
let score = ref(0)

const starsObj: { [key: number]: string } = {
  1: '差评',
  2: '差评',
  3: '中评',
  4: '好评',
  5: '好评'
}

const assessLabel = computed(() => {
  const labelObj: { [key: number]: string } = {
    0: '交车服务',
    1: '物流评分',
    2: '物流评分'
  }
  return labelObj[props.orderType]
})

const assessResult = computed(() => {
  return starsObj[score.value]
})

const assessResultOnline = computed(() => {
  return starsObj[onLineScore.value]
})

defineExpose({
  score,
  onLineScore
})
</script>

<style scoped lang="scss">
.service-assess {
  padding: 0 41rpx;

  &-line {
    width: 100%;
    height: 1rpx;
    background: #e4e7ea;
    margin-top: 72rpx;
    margin-bottom: 48rpx;
  }

  &-score {
    display: flex;
    align-items: center;

    &-stars {
      margin: 0 30rpx 0 53rpx;
      position: relative;
      top: -4rpx;
    }

    &-result {
      height: 38rpx;
      font-size: 26rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #7190b0;
      line-height: 38rpx;
    }

    &-label {
      height: 45rpx;
      font-size: 30rpx;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #696b6c;
      line-height: 45rpx;
    }
  }

  .finished {
    color: #696b6c;
    font-size: 30rpx;
  }
}
</style>
