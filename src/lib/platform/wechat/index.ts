import wechatConfig from './config'
import WechatShare from './share'

const wechatPlatform = {
  config: wechatConfig,
  share: new WechatShare()
}

export default wechatPlatform
