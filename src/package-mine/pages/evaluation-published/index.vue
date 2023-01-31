<template>
  <view class="evaluation-published">
    <evaluation-published-item v-for="item in list" :key="item.id" :item="item" @convert-item-assess="toDealData" />
    <evaluation-published-service ref="serviceRef" :order-type="orderType" :is-show-s-core="isShowSCore" />
    <button class="evaluation-published-button" @click="handleSubmit">提交</button>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderInfo } from '@src/api/order'
import { toEvaluationPublished } from '@src/api/evaluation'
import EvaluationPublishedItem from './evaluation-published-item.vue'
import EvaluationPublishedService from './evaluation-published-service.vue'

let orderId = ref('')
let orderType = ref(0) // 商品类型 0-整车，1-配送商品，2-虚拟商品
let productId = ref('') // 区分是单个商品评价还是批量评价的
let isShowSCore = ref(true) // 是否展示物流及服务评价的标识 若存在已评价的商品，则不展示
let list = reactive([]) as Array<Evaluation.EvaluationItem>
let itemType = ref(0) // 订单类型
let evaluationDtoParams = [] as Array<Evaluation.AssessInfo> // 参数
let evaluationDimensionDtos = [] as Array<Evaluation.AssessInfo>

interface PublishedOptions {
  orderId: string
  orderType: string
  productId: string
  itemType: string
}
type OnLoadOptionType<T> = Record<keyof T, string | undefined>
onLoad((option: OnLoadOptionType<PublishedOptions>) => {
  orderId.value = option.orderId || ''
  orderType.value = Number(option.orderType)
  productId.value = option.productId || ''
  itemType.value = Number(option.itemType)
  getOrderDetail()
})

// 获取订单详情
async function getOrderDetail() {
  try {
    const res = await getOrderInfo(orderId.value)
    const { orderItemDtoList } = res
    // 先过滤掉已评价过得订单商品
    list.push(...orderItemDtoList.filter((item) => item.assessStatus === 1))
    isShowSCore.value = orderItemDtoList.findIndex((item) => item.assessStatus === 2) === -1 // true 说明没有被评价过
    if (productId.value) {
      let tempList = list.filter((item) => item.id === productId.value)
      list.length = 0
      list.push(...tempList)
    } // 说明是单个商品评价，需要根据id筛选出此订单商品
    initEvaluationObj()
  } catch (error: any) {
    uni.showToast({
      title: error.message,
      icon: 'none'
    })
  }
}

function initEvaluationObj() {
  list.forEach((item) => {
    evaluationDimensionDtos.push({ id: item.id })
  })
}

function toDealData(assessDimensionDto: Evaluation.AssessInfo) {
  evaluationDimensionDtos.forEach((item, index) => {
    if (item.id === assessDimensionDto.orderItemId) {
      evaluationDimensionDtos[index] = assessDimensionDto
    }
  })
}
function toastFun(str: string) {
  uni.showToast({ icon: 'none', title: str })
  return false
}

const serviceRef = ref<InstanceType<typeof EvaluationPublishedService> | null>(null)

function toDealParams() {
  let flag = true
  // 当未填写评价内容时，评价文案显示为“此用户未填写评价。
  evaluationDtoParams = evaluationDimensionDtos.map((item) => {
    if (!item.content) {
      item.content = '此用户未填写评价'
    }
    return item
  })
  // 服务类型的评价不需要content，因此先对content赋值，再对服务类型的评价赋值

  if (orderType.value !== 2) {
    // 非虚拟商品
    if ((serviceRef.value?.score as number) > 0) {
      evaluationDtoParams.push({
        score: serviceRef.value?.score,
        dimension: orderType.value === 0 ? 'DELIVERY_EVALUATION' : 'LOGISTICS_EVALUATION'
      })
    } else {
      flag = isShowSCore.value ? toastFun(orderType.value === 0 ? '请对交车服务进行评分' : '请对物流服务进行评分') : true
    }
  }
  // ("ITEM_EVALUATION","商品评价")("LOGISTICS_EVALUATION","物流评价")("ONLINE_EVALUATION","线上评价")("DELIVERY_EVALUATION", "交车评价")
  if (flag) {
    if ((serviceRef.value?.onLineScore as number) > 0) {
      evaluationDtoParams.push({
        score: serviceRef.value?.onLineScore,
        dimension: 'ONLINE_EVALUATION'
      })
    } else {
      flag = isShowSCore.value ? toastFun('请对线上服务进行评分') : true
    }
  }
  return flag
}
function handleSubmit() {
  // 视频还未上传完
  if (toDealParams()) {
    // 接口改造时参数修改
    evaluationDtoParams.forEach((evaluationParams) => {
      !evaluationParams.mediaUrlList && (evaluationParams.mediaUrlList = [])
      if (evaluationParams.image?.length) {
        evaluationParams.image.forEach((imgUrl) => {
          evaluationParams.mediaUrlList.push({
            mediaType: 1,
            mediaUrl: imgUrl
          })
        })
      }
      if (evaluationParams.video) {
        evaluationParams.mediaUrlList.push({
          mediaType: 2,
          mediaUrl: evaluationParams.video
        })
      }
      delete evaluationParams.image
      delete evaluationParams.video
    })
    let data = {
      orderId: orderId.value, // 订单ID
      evaluationDimensionDtos: [...evaluationDtoParams]
    }
    toEvaluationPublished(data).then(() => {
      uni.redirectTo({
        url: `/package-mine/pages/published-successful/index?itemType=${itemType.value}`
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.evaluation-published {
  padding-bottom: env(safe-area-inset-bottom);

  &-button {
    margin: 80rpx auto 70rpx;
    width: 622rpx;
    height: 92rpx !important;
    line-height: 92rpx !important;
    background: #1a1a1a !important;
    border-radius: 1rpx !important;
    font-size: 30rpx !important;
    font-family: SourceHanSansSC-Normal, SourceHanSansSC;
    font-weight: 400;
    color: #fff !important;
    text-align: center;
    outline: none !important;
    border: none !important;

    &-active {
      background: #1a1a1a !important;
    }
  }
}
</style>
