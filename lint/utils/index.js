const fs = require('fs')
const os = require('os')
const nodePath = require('path')

function isDirectory(pathName) {
  const stat = fs.lstatSync(pathName)
  return stat.isDirectory()
}

// 获取符合 ruleCallback 规则的 路径
function getFilePaths(startPath = '/', ruleCallback = () => {}) {
  const filesPath = []
  if (ruleCallback(startPath)) {
    filesPath.push(startPath)
  }
  if (isDirectory(startPath)) {
    const paths = fs.readdirSync(startPath)
    paths.forEach((_path) => {
      const allPath = nodePath.join(startPath, _path)
      filesPath.push(...getFilePaths(allPath, ruleCallback))
    })
  }
  return filesPath
}

// 添加log
const filePath = './lint-error.log'
function appendErrorInfos(title = '', contents = []) {
  fs.appendFileSync(filePath, getCurrentDate() + ' ' + title + os.EOL)
  for (var i = 0; i < contents.length; i++) {
    fs.appendFileSync(filePath, contents[i] + os.EOL)
  }
  fs.appendFileSync(filePath, '==========end==============' + os.EOL + os.EOL + os.EOL)
}

function getCurrentDate() {
  const date = new Date()
  return `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

// 清空log
function clearLogContent() {
  fs.writeFileSync(filePath, '')
}

// 获取commit 的file
function getCommitFiles() {
  return new Promise((resolve, reject) => {
    let filesPath = []
    const exec = require('child_process').exec
    const command = 'git status -s'
    exec(command, 'utf8', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        const arr = stdout.split('\n')
        filesPath = arr.map((item) => {
          return item.replace(/^\s*[A-Z]*\s*/, '')
        })
        filesPath.pop()
        resolve(filesPath)
      }
    })
  })
}

function findAll(reg, str) {
  let match
  const matches = []
  while ((match = reg.exec(str)) !== null) {
    matches.push({ ...match })
  }
  return matches
}

module.exports = {
  isDirectory,
  getFilePaths,
  appendErrorInfos,
  getCurrentDate,
  clearLogContent,
  getCommitFiles,
  findAll
}
