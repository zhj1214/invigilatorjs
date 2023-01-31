/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 09:54:22
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-17 17:14:37
 */

import TraceKit from 'tracekit'

/**
 * @description: 初始化onerror捕获方法
 */
export function initOnerror() {
  // 1。window.onerror
  setOnerror()
  // 2. window.addEventListener
  setAddEventListener('error')
  // 3. 标记几种方法的调用类型
  markWindowFnName()
}

/**
 * @description: 重写onunhandledrejection方法
 */
export function setOnunhandledrejection() {
  const oldOnUnhandledRejectionHandler = window.onunhandledrejection
  window.onunhandledrejection = function (e) {
    console.log(
      'onunhandledrejection 错误:',
      e.reason.line,
      e.source,
      e.lineno,
      e.line,
      e.message,
      e.name,
      e.cause,
      e.fileName,
      e.stack
    )

    // 收集异常信息并上报
    TraceKit.report(e)

    if (oldOnUnhandledRejectionHandler) {
      return oldOnUnhandledRejectionHandler.apply(this, arguments)
    }
    return true
  }
  window.addEventListener('unhandledrejection', function (e) {
    const ddd = new Error(e)
    console.log(
      'dddddddddd',

      ddd.message,
      ddd.name,

      ddd.stack
    )
    console.log(
      '捕获到异常unhandledrejection：',
      e.reason,
      e.source,
      e.lineno,
      e.line,
      e.message,
      e.name,
      e.cause,
      e.fileName,
      e.stack
    )
    // 收集异常信息并上报
    TraceKit.report(e)
  })
}

/**
 * @description: 重写onerror方法
 */
function setOnerror() {
  // 默认上报的错误信息
  const defaults: any = {
    msg: '', //错误的具体信息
    url: '', //错误所在的url
    line: '', //错误所在的行
    col: '', //错误所在的列
    error: '' //具体的error对象
  }
  // 1. 无论之前有没有被封装，都在此包装一下
  const oldErrorHandler = window.onerror
  // 2. 重写 window.onerror
  window.onerror = function (msg, url, line, column, error) {
    // 收集异常信息并上报
    console.log('msg', msg)
    console.log('url', url)
    console.log('line', line)
    console.log('column', column)
    console.log('error', error)

    //采用异步的方式,避免阻塞
    setTimeout(function () {
      //不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
      column = column || (window.event && window.event.errorCharacter) || 0

      defaults.url = url
      defaults.line = line
      defaults.col = column

      if (error && error.stack) {
        //如果浏览器有堆栈信息，直接使用
        defaults.msg = error.stack.toString()
      } else if (arguments.callee) {
        //尝试通过callee拿堆栈信息
        let ext = []
        let fn = arguments.callee.caller
        let floor = 3 //这里只拿三层堆栈信息
        while (fn && --floor > 0) {
          ext.push(fn.toString())
          if (fn === fn.caller) {
            break //如果有环
          }
          fn = fn.caller
        }
        ext = ext.join(',')
        defaults.msg = error.stack.toString()
      }
      console.log('加工后的数据 defaults', defaults)
      // 上报错误
      // reportErrorInfo('window.onerror', defaults)
      TraceKit.report(error)
    }, 0)

    if (oldErrorHandler) {
      return oldErrorHandler.apply(this, arguments)
    }
    return false // return true，所以如果有错误信息，浏览器不会console出来，如果需要浏览器console，可以注释掉最后的return true
  }
}

/**
 * @description: 设置type类型的监听事件
 * @param {string} type
 */
function setAddEventListener(type: string) {
  window.addEventListener(
    type,
    (error) => {
      console.log('捕获到异常：', error)
    },
    true
  )
}
/**
 * @description: 用于重写setTimeout、setInterval、requestAnimationFrame
 * @author: zhj1214
 */
const setRewriteFunction = (fn: any): any => {
  return function (callback: any, delay: number) {
    const args = Array.prototype.slice.call(arguments, 2)
    const _callback = function () {
      try {
        // eslint-disable-next-line prefer-spread
        callback.apply(null, args)
      } catch (error) {
        console.log('开始上报', error)
      }
    }
    fn(_callback, delay)
  }
}

// 捕获，并标记这几类事件中的错误
function markWindowFnName() {
  window.setTimeout = setRewriteFunction(window.setTimeout)
  window.setInterval = setRewriteFunction(window.setInterval)
  window.requestAnimationFrame = setRewriteFunction(window.requestAnimationFrame)
}
