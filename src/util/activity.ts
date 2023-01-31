interface ActivityTypeMap {
  [key: number]: string
}

interface ActivityStatusMap {
  [key: number]: string
}

const activityTypeMap: ActivityTypeMap = {
  5: '限时抢购'
}

const activityStatusMap: ActivityStatusMap = {
  '-1': '未开始',
  1: '进行中'
}

/**
 * 活动类型名称生成器
 * @param activityType
 * @returns 活动类型名称
 */
export function genActivityType(activityType: number) {
  return activityTypeMap[activityType] || ''
}

/**
 * 活动状态中文名生成器
 * @param activityStatus
 * @returns 活动状态名称
 */
export function genActivityStatus(activityStatus: number) {
  return activityStatusMap[activityStatus] || ''
}
