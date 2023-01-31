import { getAfterSaleDetail } from '@api/after-sale'
import { ref, reactive, inject, watch } from 'vue'
import { formatDate } from '@util/date-time'
import { pureAssign } from '@util/common'
import { useCarStore } from '@src/pinia/car'

const carStore = useCarStore()

const afterSaleId = ref('')
const seconds = ref(0)
const afterSaleInfo: AfterSale.DetailInfo = reactive({
  totalAmount: 0,
  totalPointNum: 0,
  updatedAt: '',
  auditOutTime: 0,
  status: 0,
  type: 0,
  createdAt: '',
  applyDesc: '',
  reason: '',
  auditDesc: '',
  sellerAddress: ''
})
const orderItemDto = ref({} as Order.ItemDtoListInfo)

let refundInfo = reactive([
  {
    newStatus: 0,
    createdAt: '',
    fileIdList: []
  }
])
const fileIdList = ref([])

async function getDetail() {
  try {
    const data = await getAfterSaleDetail(afterSaleId.value)
    const { orderAfterSalesDto, orderItem, orderAudits } = data
    const auditOutTime = Number(orderAfterSalesDto.auditOutTime)
    const now = new Date().getTime()
    if (now <= auditOutTime) {
      const time = ((auditOutTime - now) / 1000).toString()
      seconds.value = parseInt(time)
    }
    orderAudits.forEach((item: AnyObject) => {
      item.createdAt = formatDate(item.createdAt, 'YYYY.MM.DD HH:mm:ss')
    })
    orderAfterSalesDto.totalAmount = Number(orderAfterSalesDto.totalAmount)
    orderAfterSalesDto.totalPointNum = Number(orderAfterSalesDto.totalPointNum)
    orderAfterSalesDto.createdAt = formatDate(orderAfterSalesDto.createdAt, 'YYYY.MM.DD HH:mm:ss')
    orderAfterSalesDto.updatedAt = formatDate(orderAfterSalesDto.updatedAt, 'YYYY.MM.DD HH:mm:ss')
    // orderAfterSalesDto.sellerAddress = JSON.parse(orderAfterSalesDto.sellerAddress)
    pureAssign(afterSaleInfo, orderAfterSalesDto)
    if (orderItem.itemType === '0') {
      orderItemDto.value = carStore.getInfo([orderItem], 2)[0]
    } else {
      orderItemDto.value = orderItem
    }
    refundInfo = orderAudits
    fileIdList.value = refundInfo[0].fileIdList
  } catch (error) {}
}

const options = reactive([] as Array<AnyObject>)

async function getSteps(icons: Array<string>) {
  options.length = 0
  let arr: Array<AnyObject> = []
  const { createdAt, status, type } = afterSaleInfo
  const first = { title: '提交申请', desc: createdAt }
  const second = await getStepSecondInfo(status, icons)
  arr = [
    first,
    second,
    {
      title: '商家退款',
      desc: refundInfo.find((ad) => ad.newStatus === 4)?.createdAt
    },
    {
      title: '退款成功',
      desc: refundInfo.find((ad) => ad.newStatus === 4)?.createdAt
    }
  ]
  if (type === 1) {
    arr.splice(
      2,
      0,
      {
        title: '待买家退货',
        desc: refundInfo.find((ad) => ad.newStatus === 6)?.createdAt
      },
      {
        title: '待商家收货',
        desc: refundInfo.find((ad) => ad.newStatus === 3)?.createdAt
      }
    )
  }
  options.push(...arr)
}

async function getStepSecondInfo(status: number, icons: Array<string>) {
  let second = {}
  switch (status) {
    case 7:
      second = {
        title: '审核未通过',
        desc: refundInfo.find((ad: { newStatus: number }) => ad.newStatus === 7)?.createdAt,
        img: icons[0],
        color: '#F04440'
      }
      break
    case -1:
      second = {
        title: '买家取消申请',
        desc: refundInfo.find((ad: { newStatus: number }) => ad.newStatus === -1)?.createdAt,
        img: icons[1],
        color: '#4E6175'
      }
      break
    default:
      second = {
        title: '商家审核',
        desc: refundInfo.find((ad: { newStatus: number }) => [3, 5].includes(ad.newStatus))?.createdAt
      }
      break
  }
  return second
}

const useDetail = () => {
  const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
  const [stepCancelIcon, setpErrIcon] = gdp(['icon-step-cancel.png', 'icon-step-err.png'])

  watch(
    afterSaleInfo,
    async () => {
      getSteps([stepCancelIcon, setpErrIcon])
    },
    {
      deep: true
    }
  )

  return {
    afterSaleId,
    seconds,
    afterSaleInfo,
    orderItemDto,
    fileIdList,
    options,
    getDetail
  }
}

export default useDetail
