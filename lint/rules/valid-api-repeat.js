// scr/api

const fs = require('fs')
const utils = require('../utils/index')
const nPath = require('path')

function getApiFiles(path) {
  const filePaths = utils.getFilePaths(path, (allPath) => {
    const reg = /api(\/|\\)/
    return reg.test(allPath) && !utils.isDirectory(allPath)
  })
  return filePaths
}

function getRepeat(arrStr) {
  const obj = {}

  const repeatArr = new Set()
  arrStr.forEach((str) => {
    if (obj[str]) {
      if (!repeatArr.has(str)) {
        repeatArr.add(str)
      }
    }
    obj[str] = true
  })
  return Array.from(repeatArr)
}

function getRequestFns(contexts) {
  const arr = []
  const requestFnReg = /^\s+return\s(?:request|uploadRequest)\({([\S\s]*?)}\)/gm
  contexts.forEach((str) => {
    arr.push(...utils.findAll(requestFnReg, str).map((match) => match[1]))
  })
  return arr
}

function getRequestOptionStrArr(strArr) {
  const arr = []
  const urlReg = /url:\s+(?:(?:`((?:\/(?:\${)*[a-zA-Z0-9-_\.]+}*)+)[?`])|(?:'((?:\/[a-zA-Z0-9-_]+)+)'))/g
  const domainReg = /domain:\s+(?:'([a-zA-Z0-9-_]+)')/g
  const methodReg = /method:\s+(?:'([a-zA-Z]+)')/g
  strArr.forEach((str) => {
    urlReg.lastIndex = 0
    const urlMatch = urlReg.exec(str)
    domainReg.lastIndex = 0
    const domainMatch = domainReg.exec(str)
    methodReg.lastIndex = 0
    const methodMatch = methodReg.exec(str)
    const url = urlMatch ? urlMatch[1] || urlMatch[2] : ''
    const domain = domainMatch ? domainMatch[1] : ''
    const method = methodMatch ? methodMatch[1] : ''
    if (url) {
      arr.push(`${domain}**${method}**${url}`)
    }
  })
  return arr
}

function check() {
  const path = './src/api'
  const paths = getApiFiles(path)
  const contexts = []
  paths.forEach((item) => {
    contexts.push(fs.readFileSync(nPath.resolve(item), 'utf8'))
  })
  if (!contexts.length) {
    return true
  }
  try {
    const fnStrArr = getRequestFns(contexts)
    console.log(`共 ${fnStrArr.length} 个接口请求`)
    const requestOptionArr = getRequestOptionStrArr(fnStrArr)
    const repeatArr = getRepeat(requestOptionArr)
    if (repeatArr.length) {
      utils.appendErrorInfos('接口重复', repeatArr)
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  once: true,
  check
}
