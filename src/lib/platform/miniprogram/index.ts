import miniprogramConfig from './config'
import MiniprogramShare from './share'

const miniprogramPlatform = {
  config: miniprogramConfig,
  share: new MiniprogramShare()
}

export default miniprogramPlatform
