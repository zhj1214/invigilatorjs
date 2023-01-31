<template>
  <view>
    <web-view :src="src" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
let src = ref('')
export default defineComponent({
  name: 'WebView',
  setup() {
    return { src }
  },
  onLoad(options) {
    const { url } = options as AnyObject
    url && (src.value = decodeURIComponent(url))
  }
})
</script>
