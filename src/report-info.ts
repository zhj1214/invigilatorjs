/*
 * @Description: 上报错误信息
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 16:02:22
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-17 15:04:15
 */

import { http } from './request'

/**
 * @description: 上报错误信息
 * @param {ReportError} val
 */
export function reportErrorInfo(val: ReportError) {
  console.log('---要上报的信息---', val)
  http.post('', {}).then((res) => {
    console.log('上报成功')
  })
}
