/**
 * 全局接口定义
 */
declare module '$dayjs'

const jWeixin: JWeixin
const wx: JWeixin
const OSS: OSS

// 空函数类型
type VoidFn = () => void

type Fn = (value: unknown | null) => void

type Fn<T> = (T) => void

// promise resolve 函数类型
type ResolveFn = (value: unknown) => void

/**
 * 动态获取图片地址
 */
interface GeneratorDynamicPicFunc<T> {
  (name: T): T
}

interface PageListInfo<T> {
  data: T[]
  total: number
  empty: boolean
}

interface HTMLEvent {
  detail?: HTMLInputElement
  target: HTMLInputElement
}

interface ScrollEvent {
  detail: {
    scrollTop: number
  }
  [key: string]: any
}

type DebounceFn<T> = (fn: Fn<T>, wait?: number, immediate?: boolean) => (T) => void

// declare module 'abnormal' {
//   export const getAbnormal: Abnormal
// }
