import { defineComponent, ref, inject, reactive } from 'vue'
import { getContentsReject, getCommentsReject } from '@api/community'

export default defineComponent({
  name: 'AuditRejection',
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
    const auditRejectionIcon = gdp('audit-rejection.png')
    const id = ref('')
    const type = ref('')

    /**
     * 获取理由
     */
    const reason: { remark: string; createTime: string } = reactive({ remark: '', createTime: '' })
    async function getReason() {
      const { remark, createTime } = type.value === 'content' ? ((await getContentsReject(id.value)) as AnyObject) : ((await getCommentsReject(id.value)) as AnyObject)
      reason.remark = remark
      reason.createTime = createTime
    }

    return {
      id,
      type,
      auditRejectionIcon,
      getReason,
      reason
    }
  },
  onLoad(params: { id: string; type: string }) {
    this.id = params.id
    this.type = params.type
    this.getReason()
  }
})
