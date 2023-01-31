/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 16:18:06
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-07 16:18:07
 */

/**
 * @description: 扩展函数获取名称的方法
 */
Function.prototype.getName = function () {
  return (
    this.name ||
    (this.toString().match(/function\s*([^(]*)\(/) &&
      this.toString().match(/function\s*([^(]*)\(/)[1]) ||
    ''
  )
}

