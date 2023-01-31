<template>
  <scroll-view scroll-y :style="{ height: height }" class="group-types">
    <view v-for="(item, key) in groupTypes" :key="key" class="group-types-item" :class="{ active: item.groupTypeCode == chooseTypeId }" @click="changeType(item.groupTypeCode)">
      {{ item.groupTypeName }}
    </view>
  </scroll-view>
</template>

<script>
import defineComponent from './index'
export default defineComponent
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
