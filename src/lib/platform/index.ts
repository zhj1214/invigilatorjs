import wechatPlatform from './wechat'
import iphonePlatform from './iphone'
import miniprogramPlatform from './miniprogram'

import Platform from './platform'
class diffPlatformFeatures extends Platform {
  configs: {
    [key: string]: {
      share: any
      config: any
    }
  }

  constructor() {
    super()
    this.configs = {
      wechat: wechatPlatform,
      // iPhone: iphonePlatform,
      miniprogram: miniprogramPlatform
    }
  }

  share(shareCtx: any, apiList: any = []) {
    super.judgePlatform(this.configs)
    const key = this.matchlist[this.matchlist.length - 1]
    const config = this.configs[key] || null
    console.log('config', this.configs)
    if (!config?.share) {
      throw new Error('此平台暂无分享功能')
    }
    super.injectScript(this.configs)
    const setTimer = setTimeout(() => {
      clearTimeout(setTimer)
      config.share.startShare(shareCtx, apiList)
    }, 1000)
  }
}

const integrated = new diffPlatformFeatures()

export default integrated
