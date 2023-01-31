/*
 * @Description: 小程序捕获错误方法
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2023-01-16 16:04:00
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-31 15:55:30
 */
import { reportErrorInfo } from '../report-info'
import { getAbnormal } from '../index'

import { ErrorEnum } from '../../types/enum'

export const getInterceptorRequest = () => {
  const instance = getAbnormal()
  let errorParam: ReportError = {
    pagePath: (instance && instance.jumpPage) || '',
    errorType: ErrorEnum.Unknown,
    msg: ''
  }

  uni.addInterceptor('request', {
    invoke(args) {
      // 例子：request 触发前拼接 url
      // args.url = 'https://www.example.com/' + args.url

      // 1. 获取上报参数
      errorParam.requestError = {
        url: args.url,
        startTime: new Date().getTime(),
        request: args
      }
    },
    success(res) {
      // 请求成功后，修改code值为1
      if (res.data.code !== 10000) {
        errorParam.errorType = ErrorEnum.RequestCode
        errorParam.msg = res.data.msg
        reportErrorInfo(errorParam)
      }
    },
    fail(err) {
      console.log('request-fail', err)
      errorParam.errorType = ErrorEnum.RequestConnection
      errorParam.msg = err
      reportErrorInfo(errorParam)
    },
    complete(res) {
      console.log('request-complete', res)
    }
  })
}
