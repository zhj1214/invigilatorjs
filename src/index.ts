/*
 * @Description: 初始化异常sdk
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 16:17:43
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-31 17:12:40
 */
import { reportErrorInfo } from './report-info'
import { getInterceptorRequest } from './applet/index'
import { ErrorEnum } from '../types/enum'
import TraceKit, { StackTrace } from 'tracekit'
import 'miniprogram-api-typings'

// export { ParseStack, ParseStackItem } from '../types/index'  // 导出方式不行
// export * from '../types/index' // 导出方式不行
// 写在这里可以
interface ParseStack {
  errorType: string
  msg: string
  list: any
}


export class Abnormal {
  jumpPage?: any // 页面信息

  /**
   * @description: 初始化
   * @param {object} baseUrl 上报服务地址
   * @param {object} projectId 小程序AppId/项目id
   * @param {object} clientType  用于自身来区分是哪一种客户端： 'miniprogram' 、 web
   */
  constructor(param: { baseUrl: string; projectId: string; clientType: string }) {
    console.log('sdk参数：', param)

    // 1. miniprogram
    if (param.clientType === 'miniprogram') {
      // 1.1 重写页面跳转
      this.appletRefactor('navigateTo')
      this.appletRefactor('navigateBack')
      // 1.2 拦截请求错误
      getInterceptorRequest()
    } else {
      // 2. web
      TraceKit.report.subscribe((stackTrace: StackTrace) => {
        console.log('TraceKit上报错误--', stackTrace)
        reportErrorInfo({
          pagePath: stackTrace.url,
          errorType: ErrorEnum.Unhandledrejection,
          msg: stackTrace.message,
          jsCodeError: {
            line: stackTrace.stack[0].line + '',
            column: stackTrace.stack[0].column + '',
            fnName: stackTrace.stack[0].func,
            url: stackTrace.stack[0].url,
            error: stackTrace.stack[0].context
          }
        })
      })
    }
  }
  /**
   * @description: 重写小程序页面跳转，获取页面路由和名称
   * @param {string} jumpKey
   */
  appletRefactor(jumpKey: string) {
    uni[jumpKey] = (param: any) => {
      console.log('跳转页面参数：', param)
      this.jumpPage = param
      wx[jumpKey](param)
    }
  }
  /**
   * @description: 解析小程序报错(线上错误)
   * @param {string} stack 错误堆栈信息
   * @return {Array} 结果
   */
  parseStack(stack: string): ParseStack {
    if (typeof stack !== 'string')
      return {
        errorType: ErrorEnum.Unknown,
        msg: '',
        list: []
      }
    const lines = stack.split('\n')
    const linesArr: ParseStackItem[] = []
    // 1. 逐行处理
    for (const item of lines) {
      if (/.*(https?:\/\/.+):(\d+):(\d+)$/) {
        const arr = item.match(/@(https:\/\/.+):(\d+):(\d+)$/) || []
        if (arr.length === 4) {
          linesArr.push({
            url: arr[1],
            line: Number(arr[2]),
            column: Number(arr[3]),
            filename: (arr[1].match(/[^/]+$/) || [''])[0]
          })
        }
      }
    }
    return {
      errorType: '',
      msg: lines[0],
      list: linesArr
    }
  }

  /**
   * @description: 上报错误信息
   * @param {string} stack
   */
  reportError(stack: string) {
    // 1. 解析错误
    let results = this.parseStack(stack)
    console.log('解析结果：',results);

    // const resultsArr = results.list.map((element) => {
    //   return JSON.stringify(element)
    // })
    // 2. 上报错误
    if (results.list[0]) {
      reportErrorInfo({
        pagePath: this.jumpPage && (this.jumpPage.url || ''),
        errorType: ErrorEnum.Type,
        msg: stack,
        jsCodeError: {
          fileName: results[0].filename || '',
          url: results[0].url || '',
          column: results[0].column + '',
          line: results[0].line + '',
          error: results
        }
      })
    }
  }
}

// 代理实现单例模式
export const getAbnormal = (function () {
  var instance: Abnormal
  return function (param?: { baseUrl: string; projectId: string; clientType: string }): Abnormal {
    if (!instance && param) {
      instance = new Abnormal(param)
    }
    return instance
  }
})()
