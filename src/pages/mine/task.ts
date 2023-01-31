import { ref } from 'vue'
import { getUserData, getTaskInfoData } from '@api/user'

const taskId = ref('')
const validityFlag = ref(true)
const validityEnd = ref('')

const useTask = () => {
  const getTaskInfo = async () => {
    try {
      const resData = await getTaskInfoData()
      const { id, validityPeriodFlag, validityPeriodEnd } = resData.taskInfo
      taskId.value = id
      validityFlag.value = validityPeriodFlag
      validityEnd.value = validityPeriodEnd
      id && getUserTaskData(id)
    } catch {}
  }
  // 连续签到天数
  const continualDayNum = ref(0)
  // 今日是否已完成
  const todayCompletedFlag = ref(false)
  const getUserTaskData = async (id: string) => {
    try {
      const resData = await getUserData(id)
      const { continualDay, todayCompleted } = resData
      todayCompletedFlag.value = todayCompleted
      continualDayNum.value = continualDay
    } catch {}
  }

  return {
    taskId,
    validityFlag,
    validityEnd,
    continualDayNum,
    todayCompletedFlag,
    getTaskInfo
  }
}

export default useTask
