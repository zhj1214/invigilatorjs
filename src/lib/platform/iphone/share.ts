interface ShareConfigs {
  title: string
  desc: string
  link: string
  imgUrl: string
  success?: () => void
}
import iphoneConfig from './config'

export default class IphoneShare {
  configs: any
  matchlist: Array<string>
  constructor() {
    this.configs = iphoneConfig.config
  }

  /**
   * 加载SDK并初始化分享配置，并配置分享内容
   * @memberof Share
   */
  startShare(shareCtx: ShareConfigs, apiList: Array<string> = ['updateAppMessageShareData', 'updateTimelineShareData']) {
    if (!iphoneConfig.config) {
      return
    }

    if (!shareCtx || !(shareCtx instanceof Object)) {
      throw new Error('自定义分享参数格式错误')
    }

    if (!Array.isArray(apiList)) {
      throw new Error('自定义jsApiList错误')
    }

    iphoneConfig
      .initConfig(apiList)
      .then((res: any) => {
        return res.updateAppMessageShareData(shareCtx)
      })
      .catch((e: any) => {
        throw new Error(e.errMsg)
      })
  }
}
