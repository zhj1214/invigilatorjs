interface PlatformConfigs {
  [key: string]: {
    plticon?: RegExp
    jsSDKUrl: string
    jsSDKName: string
    jsSDKListerName: string
  }
}

interface PlatformOption {
  logprint: boolean
}

class Platform {
  logprint: boolean
  matchlist: string[]
  currentPlatForm: string
  configs: PlatformConfigs
  ready: () => Promise
  isMatch: (type: string) => boolean
  startRecongnition: () => void
  generateAppPlatform: () => void
  getCurrentFlatForm: () => void
  docReady: () => void
}

interface ShareConfigs {
  title: string
  desc: string
  link: string
  imgUrl: string
  success?: () => void
}

/**
 * @property cloudID 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据
 * @property iv 加密算法的初始向量
 * @property encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @property errMsg 获取结果信息
 * @link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
 */
interface GetPhoneNumberEventDetail {
  cloudID: string
  iv: string
  encryptedData: string
  errMsg: string
}

interface GetPhoneNumberEvent {
  detail: GetPhoneNumberEventDetail
  [key: string]: any
}

interface WxConfigOptions {
  debug: boolean // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
  appId: string // 必填，公众号的唯一标识
  timestamp: number // 必填，生成签名的时间戳
  nonceStr: string // 必填，生成签名的随机串
  signature: string // 必填，签名
  jsApiList: string[] // 必填，需要使用的JS接口列表
}

interface WxPayOptions {
  appId: string
  timestamp: number // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
  nonceStr: string // 支付签名随机串，不长于 32 位
  package: string // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
  signType: string // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
  paySign: string // 支付签名
  success: (res) => void
}

interface JWeixin {
  [x: string]: any
  updateAppMessageShareData(arg0: { title: string; desc: string; link: string; imgUrl: string; success: () => void })
  config: (option: WxConfigOptions) => void
  ready: (fn: Fn) => void
  error: (res) => void
  chooseWXPay: (option: WxPayOptions) => void
}
