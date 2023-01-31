import { reactive, ref, computed } from 'vue'
import { useAfterSaleStore } from '@src/pinia/after-sale'
import { getCauses } from '@src/api/after-sale'
import { Enum } from '@src/lib/enmu'

interface UploadImgInfo {
  haveImg: boolean
  imgPath: string
}

// 售后类型
const afterSaleType = reactive({
  code: null,
  desc: ''
})
function toAfterSaleTypeChange(val: { code: null; desc: string }) {
  afterSaleType.code = val.code
  afterSaleType.desc = val.desc
}

// 售后原因
const afterSaleReason = reactive({
  code: null,
  desc: ''
})
function toAfterSaleReasonChange(val: { code: null; desc: string }) {
  afterSaleReason.code = val.code
  afterSaleReason.desc = val.desc
}

// 问题描述
const desc = ref('')
function getHandelValue(val: AnyObject) {
  desc.value = val.detail.value
}
//图片
const uploadImgList: UploadImgInfo[] = reactive([
  {
    haveImg: false,
    imgPath: ''
  }
])

const amount = ref(0)
const pointAmount = ref(0)
const editAble = ref(false)
function getAfterSaleAmout(customPayment: number, customPoint: number, changeAble: boolean) {
  const customPay = (customPayment * 100).toString()
  amount.value = parseInt(customPay)
  pointAmount.value = customPoint
  editAble.value = changeAble
}

const afterSaleTypeList: AfterSale.ReasonInfo[] = reactive([])
const afterSaleReasonList: AfterSale.ReasonInfo[] = reactive([])

const { Status } = Enum.Order

const useFormData = () => {
  const afterSaleStore = useAfterSaleStore()
  const afterSaleParams = computed(() => afterSaleStore.afterSaleParams)
  const { itemType, status } = afterSaleParams.value

  /**
   * @description: 售后原因列表
   * @Date: 2021-12-07 15:25:57
   * @param {*}
   * @return {*}
   */
  async function getAfterRefundCauses() {
    afterSaleReasonList.length = 0
    const data = await getCauses({ type: itemType })
    afterSaleReasonList.push(...data)
  }

  function init() {
    afterSaleTypeList.length = 0
    afterSaleType.code = null
    afterSaleType.desc = ''
    afterSaleReason.code = null
    afterSaleReason.desc = ''

    const obj = { code: 0, desc: '退款' }
    if (itemType === '2' || itemType === '0') {
      afterSaleTypeList.push(obj)
    } else if (itemType === '1') {
      if (status === Status.Paid || status === Status.ToBeShipped) {
        afterSaleTypeList.push(obj)
      }
      if (status === Status.ToBeReceived) {
        afterSaleTypeList.push(obj, { code: 1, desc: '退货退款' })
      }
      if (status === Status.IsEnd) {
        afterSaleTypeList.push(obj)
        afterSaleTypeList.push({ code: 1, desc: '退货退款' })
      }
    }
    getAfterRefundCauses()
  }

  return {
    afterSaleType,
    afterSaleReason,
    afterSaleTypeList,
    afterSaleReasonList,
    desc,
    uploadImgList,
    amount,
    pointAmount,
    editAble,
    toAfterSaleTypeChange,
    toAfterSaleReasonChange,
    getHandelValue,
    init,
    getAfterSaleAmout
  }
}

export default useFormData
