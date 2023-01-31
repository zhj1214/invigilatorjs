const requireIndex = require('requireindex')
const colors = require('colors-console')
const utils = require('./utils')

const cacheMap = new Map()

const rules = requireIndex(__dirname + '/rules')
const rulesKeys = Object.keys(rules)

function hasCommit() {
  return process.argv.some((val, index) => {
    return val === '--commit'
  })
}

function run(path = './src') {
  const allResponse = []
  rulesKeys.forEach((key) => {
    if (!cacheMap.get(key)) {
      allResponse.push(rules[key].check(path))
      if (rules[key].once) {
        cacheMap.set(key, true)
      }
    }
  })
  return allResponse
}

function runResponse(allRes) {
  try {
    if (allRes.includes(false)) {
      console.log(colors('red', 'Error: 错误信息已经输出到 lint-error.log 中'))
      process.exitCode = 1
    }
  } catch (error) {}
}

utils.clearLogContent()
if (!hasCommit()) {
  const res = run()
  runResponse(res)
} else {
  const res = []
  utils.getCommitFiles().then((files) => {
    files.forEach((file) => {
      res.push(...run(file))
    })
    runResponse(res)
  })
}
