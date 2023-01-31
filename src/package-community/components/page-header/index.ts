import { defineComponent, inject, computed } from 'vue'
import { useAppStore } from '@src/pinia/app'

export default defineComponent({
  name: 'PageHeader',
  props: {
    isTransparent: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [backIcon, iconRight, addIcon] = gdp(['icon-back.png', 'icon-right.png', 'add-btn-icon.png'])

    const statusBarHeight = computed(() => useAppStore().statusBarHeight)
    return {
      backIcon,
      iconRight,
      addIcon,
      statusBarHeight
    }
  }
})
