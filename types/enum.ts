export enum ErrorEnum {
  MediaLoad = 'MediaLoadError', // 图片，视频等静态资源加载失败
  Uncaught = 'UncaughtError', // 错误基类
  Syntax = 'SyntaxError', // 语法写错了
  Reference = 'ReferenceError', // 引用错误
  Range = 'RangeError', // 使用内置对象的方法时，参数超范围
  URI = 'URIError', // URI错误
  Type = 'TypeError', // 错误的使用了类型或对象的方法时
  Eval = 'EvalError', //  Eval错误(TypeErroreval函数没有被正确执行时，会抛出EvalError错误。)
  Unexpected = 'Unexpected', //  不符合语法规范
  Vue = 'VueError', // vue前端框架报错
  RequestConnection = 'RequestConnectionError', // 接口连接服务报错
  RequestCode = 'RequestCodeError', // 接口异常Code报错
  Unhandledrejection = 'unhandledrejectionError', // Promise的reject报错
  Unknown = 'unknownError' // 未知错误
}
