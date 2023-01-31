import dayjs from '$dayjs'

/**
 * 格式化时间
 * @param time
 * @param formatter 需要的时间格式
 * @returns YYYY.MM.DD
 */
export const formatDate = (time: string | number, formatter?: string): string => {
  return time ? dayjs(time).format(formatter || 'YYYY.MM.DD') : ''
}

/**
 * 格式化时间
 * @param dateTime
 * @returns
 */
export function formatTime(dateTime: string) {
  const timestamp = new Date(dateTime.replace(/-/g, '/')).getTime() // 解决 IOS 转时间戳不兼容问题
  const now = new Date().getTime()
  const timer = (now - timestamp) / 1000
  let tip = ''

  if (timer <= 0) {
    tip = '刚刚'
  } else if (Math.floor(timer / 60) <= 0) {
    tip = '刚刚'
  } else if (Math.floor(timer) < 3600) {
    tip = Math.floor(timer / 60) + '分钟前'
  } else if (timer >= 3600 && timer < 86400) {
    tip = Math.floor(timer / 3600) + '小时前'
  } else if (timer / 86400 < 8) {
    tip = Math.floor(timer / 86400) + '天前'
  } else {
    tip = dateTime
  }
  return tip
}

/**
 * 格式化时间
 * @param dateTime
 * @returns
 */
export function formatCountDownTime(dateTime: string) {
  const timestamp = new Date(dateTime.replace(/-/g, '/')).getTime() // 解决 IOS 转时间戳不兼容问题
  const now = new Date().getTime()
  const timer = (timestamp - now) / 1000
  let tip = ''

  if (Math.floor(timer) < 0) {
    tip = '已结束'
  } else if (timer > 86400) {
    tip = '还有' + (timer % 86400 === 0 ? timer / 86400 : Math.floor(timer / 86400) + 1) + '天结束'
  } else if (timer >= 3600 && timer < 86400) {
    tip = '还有' + (timer % 3600 === 0 ? timer / 3600 : Math.floor(timer / 3600) + 1) + '小时结束'
  } else if (Math.floor(timer) < 3600) {
    tip = '还有' + (timer % 60 === 0 ? timer / 60 : Math.floor(timer / 60) + 1) + '分钟结束'
  }
  return tip
}
