import iphoneConfig from './config'
import IphoneShare from './share'

const iphonePlatform = {
  config: iphoneConfig,
  share: new IphoneShare()
}

export default iphonePlatform
