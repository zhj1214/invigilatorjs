const mm = new Date().getMonth() + 1
const MM = mm < 9 ? '0' + mm : mm
const dd = new Date().getDate()
const DD = dd < 10 ? '0' + dd : dd
const hh = new Date().getUTCHours() + 8
const HH = hh < 10 ? '0' + hh : hh
const ver = '' + (new Date().getFullYear() - 2000) + MM + DD + HH

export default {
  name: '产研小程序cli',
  projectPath: 'dist/build/mp-weixin',
  packageJsonPath: './package.json',
  appid: 'wx9e446ca45a978f7d',
  privateKeyPath: 'scripts/private.wxbb7c62063a9ef9ff.key',
  // # 多个小程序配置的路径
  // configPath: './miniConfigList',
  // # 版本描述可选，默认会读取版本号和git commit hash 和作者
  // # 如：v1.0.0 - 4c29ae8 - by@若川
  // desc: '版本描述可选',
  // # 版本号可选，默认读取 package.json 中的 version
  // version: '1.0.0',
  version: '1.0 ' + ver,
  // 参考文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
  // 其他项目配置自定义配置，和上面配置合并
  projectOptions: {},
  // 新增上传的自定义配置
  uploadOptions: {
    // 程序中默认读取项目路径下的 project.config.json setting 配置
    setting: {
      es6: true,
      es7: true,
      minify: true,
      autoPrefixWXSS: true,
      ignoreUploadUnusedFiles: true
    }
    // uniapp taro 等压缩后的小程序一般采用以下不压缩配置
    // setting: { es6: false, es7: false, minify: false, ignoreUploadUnusedFiles: false }
  },
  // 新增下载的自定义配置
  previewOptions: {
    // 程序中默认读取项目路径下的 project.config.json setting 配置
    setting: {
      es6: true,
      es7: true,
      minify: true,
      ignoreUploadUnusedFiles: true
    }
    // uniapp taro 等压缩后的小程序一般采用以下不压缩配置
    // setting: { es6: false, es7: false, minify: false, ignoreUploadUnusedFiles: false }
  },
  // 可选配置替换 url 等
  replaceRules: [
    /**
		{
			file: './dist/build/mp-weixin/common/vendor.js',
			rules: [
				{
					search: 'wxdd3948dc1c7f95c2',
					replace: 'wxdd3948dc1c7f95c2',
				},
				{
					search: 'https://lxchuan12.gitee.io/',
					replace: 'https://lxchuan12.gitee.io/',
				},
			],
		},
		 */
  ],
  // 插件机制 可选
  plugins: [
    {
      name: '操作前',
      // 操作前
      enforce: 'pre',
      handler: (config) => {
        console.log('准备操作...', config)
      }
    },
    {
      name: '操作中',
      handler: (config) => {
        console.log('操作中...', config)
      }
    },
    {
      name: '操作后',
      enforce: 'post',
      handler: (config) => {
        console.log('操作完成...', config)
      }
    }
  ]
}
