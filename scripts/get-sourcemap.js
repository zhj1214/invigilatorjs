/*
 * @Description: 用于获取上传小程序的sourcemap文件
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2023-01-06 11:16:22
 * @LastEditors: zhj1214
 * @LastEditTime: 2023-01-06 11:29:05
 */

const ci = require('miniprogram-ci')
const appIdMap = require('./appid.json')

;(async () => {
  const project = new ci.Project({
    appid: 'wxbb7c62063a9ef9ff',
    type: 'miniProgram',
    projectPath: 'dist/build/mp-weixin',
    privateKeyPath: 'scripts/private.wxbb7c62063a9ef9ff.key',
    ignores: ['node_modules/**/*']
  })
  await ci.getDevSourceMap({
    project,
    robot: 1,
    sourceMapSavePath: 'public/sourceMap.zip'
  })
})()
