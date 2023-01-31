export default class Platform {
  matchlist: string[]
  logprint: boolean

  constructor() {
    this.matchlist = []
    this.logprint = true
  }

  // 判断运行设备
  judgePlatform(configs: { [key: string]: { share: any; config: any } }) {
    let userAgentInfo = window.navigator.userAgent
    let agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let isPc = true
    console.log('userAgentInfo', userAgentInfo)
    for (let agent of agents) {
      // 逐一判断
      if (userAgentInfo.indexOf(agent) > -1) {
        // 手机端的某一种
        this.matchlist.push('mobile', agent)
        isPc = false
      }
    }
    console.log('this.matchlist', this.matchlist)
    isPc && this.matchlist.push('pc')
    if (configs) {
      this.generateAppPlatform(configs)
    }
  }

  /**
   * 判断软件环境
   */
  generateAppPlatform(configs: { [x: string]: { share: any; config: any } | { config: { config: any } } }) {
    Object.keys(configs).forEach((key, i) => {
      // 配置处理
      let config = configs[key].config.config
      let icon = config.regexp || key
      if (!(icon instanceof RegExp)) {
        icon = new RegExp(icon)
      }
      icon.test(window.navigator.userAgent) && this.matchlist.push(key)
    })
    console.log(`当前H5运行环境为：${this.matchlist.join(' ')}`)
  }

  // 根据当前环境匹配出相对应的SDK并注入script
  injectScript(configs: { [x: string]: { share: any; config: any } | { config: { config: null } } }) {
    let key = this.matchlist[this.matchlist.length - 1]
    let config = configs[key].config.config || null
    return new Promise((resolve, reject) => {
      if (!config || !config.jsSDKUrl) {
        return
      }

      const PLATFORM_INIT_TIMEOUT = 10000

      const jsSDKListerName = config.jsSDKListerName

      // 判断是否已经存在需要加载的SDK
      if (config.jsSDKName && (window as any)[config.jsSDKName]) {
        this.logprint && console.log(config.jsSDKName + ' 已经存在!')
        resolve(key)
      } else {
        // 若不存在SDK，则进行加载
        this.logprint && console.log(config.jsSDKName + ' sdk 开始加载...')

        // 加载方法
        this.loadScript(config.jsSDKUrl).then(() => {
          this.logprint && console.log(config.jsSDKName + ' sdk 加载成功！')
          // 进入document的监听ready事件
          this.docReady(() => {
            // 触发回调函数并清理定时器
            function onDispatchSuccess(this: any) {
              this.logprint && console.log(config.jsSDKName + ' readyEvent 触发成功!')
              clearTimer()
              resolve(key)
            }
            // ---第一部分
            // 如果已经可以监听到不同平台的自定义事件时
            if (jsSDKListerName) {
              this.logprint && console.log(jsSDKListerName + ' has added')

              document.addEventListener(jsSDKListerName, onDispatchSuccess, false)
            } else if (config.jsSDKName && (window as any)[config.jsSDKName]) {
              // 若没有不同平台的自定义事件时，但是却需要加载的SDK
              this.logprint && console.log(config.jsSDKName + ' Init Success!')
              // 清理定时器
              clearTimer()
              // 延时1mresolve
              setTimeout(() => {
                resolve(key)
              }, 1000)
            }

            // 清理定时器
            function clearTimer() {
              sdkTimer && window.clearTimeout(sdkTimer)
              sdkInterval && window.clearInterval(sdkInterval)
            }

            // ---第二部分业务主要是持续加载
            const sdkInterval = setInterval(() => {
              // 如果存在需要加载的SDK，立即移除自定义监听事件
              if (config.jsSDKName && (window as any)[config.jsSDKName]) {
                this.logprint && console.log(config.jsSDKName + ' Init in the sdkInterval!')
                clearTimer()
                // 移除自定义监听事件
                jsSDKListerName && document.removeEventListener(jsSDKListerName, onDispatchSuccess)
                this.logprint && jsSDKListerName && console.log(jsSDKListerName + ' has removed')
                resolve(key)
              }
            }, 200)

            const sdkTimer = setTimeout(() => {
              // 如果存在需要加载的SDK，立即移除自定义监听事件
              if (config.jsSDKName && (window as any)[config.jsSDKName]) {
                this.logprint && console.log(config.jsSDKName + ' Init in the setTimeout!')
                clearTimer()
                resolve(key)
              } else {
                this.logprint && console.log(config.jsSDKName + ' Init Timeout!')
                reject(new Error('加载超时！'))
              }
            }, PLATFORM_INIT_TIMEOUT)
          })
        })
      }
      return false
    })
  }

  // 加载script
  loadScript(url: string) {
    return new Promise((resolve, reject) => {
      let _head = document.getElementsByTagName('head')[0]
      let _script = document.createElement('script')
      _script.setAttribute('type', 'text/javascript')
      _script.setAttribute('src', url)
      _head.appendChild(_script)
      _script.onload = function () {
        resolve(1)
      }
      _script.onerror = function (err) {
        reject(err)
      }
    })
  }

  /**
   * document的ready事件监听
   * @param {Function} [callback] - 回调函数
   * @return {Promise} - 返回promise，completed后自动解绑
   * */
  docReady(callback: Function) {
    /* istanbul ignore else */
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      callback()
    } else {
      document.addEventListener('DOMContentLoaded', completed, false)
      window.addEventListener('load', completed, false)
    }

    /* istanbul ignore next */
    function completed() {
      document.removeEventListener('DOMContentLoaded', completed, false)
      window.removeEventListener('load', completed, false)
      callback()
    }
  }
}
