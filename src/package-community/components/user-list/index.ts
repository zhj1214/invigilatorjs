import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UserList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {}
  }
})
