/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 16:06:38
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-17 14:55:39
 */

/**
 * @description: 错误上报
 */
interface ReportError {
  pagePath?: string // 那个页面报错
  errorType: string // 哪种类型的
  msg: any // 错误的具体信息（原本的报错信息）
  jsCodeError?: JsCodeError
  requestError?: RequestError
}

/**
 * @description: 请求错误模型
 */
interface RequestError {
  url: string // 接口地址
  request?: any // 请求参数
  reponse?: any // 响应数据
  startTime: string | number // 请求开始时间
}

/**
 * @description: 代码错误模型
 */
interface JsCodeError {
  fileName?: string // 那个文件报错
  fnName?: string // 报错的函数名称
  line: string // 错误所在的行
  column: string // 错误所在的列
  url: string // 错误信息的url地址，
  error: any // 具体的error对象 （解析后的报错信息）
}

// 错误解析模型
interface ParseStack {
  errorType: string
  msg: string
  list: ParseStackItem[]
}
interface ParseStackItem {
  url: string
  line: number
  column: number
  filename: string
}
