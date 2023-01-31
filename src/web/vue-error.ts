/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 09:58:01
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-07 10:59:53
 */
export function setVueErrorHandler(app) {
  /*
   *  默认上报的错误信息
   */
  const defaults: any = {
    msg: "", //错误的具体信息
    url: "", //错误所在的url
    line: "", //错误所在的行
    col: "", //错误所在的列
    error: "", //具体的error对象
  };
  app.config.errorHandler = function (err, instance, info) {
    // 处理错误，例如：报告给一个服务
    console.log("app.config.errorHandler   err:", err);
    console.log("  err.name:", err.name);
    console.log("  err.message:", err.message);
    console.log("  err.fileName:", err.fileName);
    console.log("  err.lineNumber:", err.lineNumber);
    console.log("  err.columnNumber:", err.columnNumber);
    console.log("app.config.errorHandler   instance:", instance);
    console.log("app.config.errorHandler   info:", info);
    if (err && err.stack) {
      //如果浏览器有堆栈信息，直接使用
      defaults.msg = err.stack.toString();
    }
    console.log("setVueErrorHandler 加工后的数据 defaults", defaults);
  };
}
