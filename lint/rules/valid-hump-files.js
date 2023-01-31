'use strict'
const utils = require('../utils/index')

/**
 * 检测文件是否带驼峰
 * @param {string} fileName 文件名
 * @returns {boolean}
 */
function checkHump(fileName) {
  const reg = /(?!App\.vue)([A-Z][-_a-z0-9]*(.[^./\\]+)?$)/
  return reg.test(fileName)
}

function check(path) {
  const humpFilePaths = utils.getFilePaths(path, checkHump)
  if (humpFilePaths.length) {
    utils.appendErrorInfos('文件名不能使用大写', humpFilePaths)
    return false
  }
  return true
}

module.exports = {
  once: false,
  check
}
