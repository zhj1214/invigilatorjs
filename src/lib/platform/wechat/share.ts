import wechatConfig from './config'

export default class WechatShare {
  configs: any
  matchlist: Array<string> | undefined
  constructor() {
    this.configs = wechatConfig.config
  }

  /**
   * 加载SDK并初始化分享配置，并配置分享内容
   * @memberof Share
   */
  startShare(shareCtx: ShareConfigs, apiList: Array<string> = ['updateAppMessageShareData', 'updateTimelineShareData']) {
    if (!wechatConfig.config) {
      return
    }

    if (!shareCtx || !(shareCtx instanceof Object)) {
      throw new Error('自定义分享参数格式错误')
    }

    if (!Array.isArray(apiList)) {
      throw new Error('自定义jsApiList错误')
    }

    wechatConfig
      .initConfig(apiList)
      .then((res: any) => {
        console.log('res', res)
        return res.updateAppMessageShareData(shareCtx)
      })
      .catch((e: any) => {
        throw new Error(e.errMsg)
      })
  }
}
