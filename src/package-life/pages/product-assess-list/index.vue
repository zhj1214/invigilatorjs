<template>
  <view>
    <sp-product-assess-list v-if="itemId" ref="productAssessListRef" class="pro-list" :item-id="itemId" />
  </view>
</template>

<script lang="ts" setup name="ProductAssessList">
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { Ref, ref } from 'vue'

const productAssessListRef: Ref<SpProductAssessList | null> = ref(null)
const itemId = ref('')

onLoad((options) => {
  itemId.value = options.itemId || ''
})
onReachBottom(() => {
  productAssessListRef.value?.onloadMore()
})
</script>

<style scoped lang="scss">
::v-deep .pro-list {
  .no-more {
    background-color: #fff;
  }
}
</style>
