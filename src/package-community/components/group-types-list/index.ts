import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'GroupTypesList',
  props: {
    groupTypes: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  setup(props, { emit }) {
    const chooseTypeId = ref('')
    watch(
      () => props.groupTypes,
      (types: Array<any>) => {
        chooseTypeId.value = types.length && types[0].groupTypeCode
      },
      {
        deep: true
      }
    )

    async function changeType(groupTypeCode: string) {
      chooseTypeId.value = groupTypeCode
      emit('on-click', chooseTypeId.value)
    }

    return { chooseTypeId, changeType }
  }
})
