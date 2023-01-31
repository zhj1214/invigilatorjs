// 错误解析模型
export interface ParseStack {
  errorType: string
  msg: string
  list: ParseStackItem[]
}
export interface ParseStackItem {
  url: string
  line: number
  column: number
  filename: string
}