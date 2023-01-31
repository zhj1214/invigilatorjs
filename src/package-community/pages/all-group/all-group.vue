<template>
  <all-group-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AllGroupList from '@src/package-community/components/all-group-list/all-group-list.vue'

export default defineComponent({
  name: 'AllGroup',
  components: {
    AllGroupList
  },
  // #ifdef  H5
  onHide() {
    document.body.style.overflow = ''
  },
  activated() {
    document.body.style.overflow = 'hidden'
  },
  onUnload() {
    document.body.style.overflow = ''
  }
  // #endif
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
