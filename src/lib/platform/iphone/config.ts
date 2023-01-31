import { getSignature } from '@api/wechat'

const iphoneConfig = {
  config: {
    regexp: /iphone|iphone/i,
    jsSDKUrl: 'static/js-sdk/jweixin.js',
    jsSDKName: 'jWeixin',
    jsSDKListerName: 'WeixinJSBridgeReady'
  },
  initConfig: function (apiList: Array<string> = ['updateAppMessageShareData', 'updateTimelineShareData']) {
    return new Promise((resolve, reject) => {
      reject({ errMsg: '未配置SDK' })
    })
  }
}

export default iphoneConfig
