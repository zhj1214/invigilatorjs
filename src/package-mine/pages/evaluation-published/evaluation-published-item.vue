<template>
  <view class="published-item">
    <evaluation-published-car v-if="item.itemType === '0'" :item="item" />
    <evaluation-published-product v-else :item="item" />
    <view class="published-item-assess">
      <view class="published-item-assess-score">
        <view class="published-item-assess-score-label">商品评分</view>
        <view class="published-item-assess-score-stars">
          <uni-rate :value="5" color="#7190B0" active-color="#7190B0" margin="6" :max="5" :is-fill="false" @change="setConvertProductScore" />
        </view>
        <view class="published-item-assess-score-result">{{ assessResult }}</view>
      </view>
      <view class="published-item-assess-content">
        <textarea
          :value="assessDimensionDto.content"
          class="published-item-assess-content-text"
          placeholder-style="color:#BABABA;"
          placeholder="请输入评价..."
          maxlength="500"
          @input="handleTextCount"
          @blur="handleTextCount"
        />
        <view class="published-item-assess-content-count">{{ textCount }}/500</view>
      </view>
      <view class="published-item-assess-media">
        <evaluation-upload :order-id="item.id" @get-video-value="handleValueConvert" @get-img-urls="getImgUrls" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup name="EvaluationPublishedItem">
import { ref, reactive, computed, onMounted } from 'vue'
import EvaluationPublishedProduct from './evaluation-published-product.vue'
import EvaluationPublishedCar from './evaluation-published-car.vue'
import EvaluationUpload from './evaluation-upload.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['convertItemAssess'])

let textCount = ref(0)
let assessDimensionDto = reactive({
  content: '',
  image: [],
  video: '',
  score: 5,
  dimension: 'ITEM_EVALUATION', // ("ITEM_EVALUATION","商品评价")("LOGISTICS_EVALUATION","物流评价")("ONLINE_EVALUATION","线上评价")("DELIVERY_EVALUATION", "交车评价")
  orderItemId: props.item.id
}) as Evaluation.AssessInfo

const assessResult = computed(() => {
  const starsMap: { [key: number]: string } = {
    1: '差评',
    2: '差评',
    3: '中评',
    4: '好评',
    5: '好评'
  }
  return starsMap[assessDimensionDto.score || 1]
})

onMounted(() => {
  setEmitConvertIteFun()
})

function setEmitConvertIteFun() {
  emit('convertItemAssess', assessDimensionDto)
}
function handleValueConvert(val: string) {
  assessDimensionDto.video = val
}
function getImgUrls(imgList: Array<string>) {
  assessDimensionDto.image = imgList
}
function handleTextCount(e: any) {
  // 将表情当做一个字处理
  const valueArray = Array.from(e.detail.value)
  textCount.value = valueArray.length
  assessDimensionDto.content = e.detail.value
  setEmitConvertIteFun()
}
function setConvertProductScore(e: { value: number }) {
  const { value } = e
  assessDimensionDto.score = value
  setEmitConvertIteFun()
}
</script>

<style scoped lang="scss">
.published-item {
  padding: 23rpx 41rpx;

  &-product {
    padding: 28rpx;
    display: flex;
    align-items: center;
    border-radius: 4rpx;
    border: 1rpx solid #e4e7ea;

    &-img {
      width: 140rpx;
      height: 140rpx;
    }

    &-info {
      flex: 1;
      margin-left: 24rpx;

      &-name {
        height: 41rpx;
        font-size: 28rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 41rpx;
      }

      &-text {
        height: 38rpx;
        font-size: 26rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #909ca8;
        line-height: 38rpx;
      }

      &-attributes {
        margin-bottom: 16rpx;
      }
    }
  }

  &-assess {
    margin-top: 60rpx;

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

    &-content {
      margin-top: 32rpx;

      &-text {
        font-size: 30rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
      }

      &-count {
        height: 36rpx;
        font-size: 24rpx;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #bababa;
        line-height: 36rpx;
      }
    }

    textarea {
      width: 100%;
    }
  }
}
</style>
