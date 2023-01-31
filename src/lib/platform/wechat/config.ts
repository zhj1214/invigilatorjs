import { getSignature } from '@api/wechat'

const wechatConfig = {
  config: {
    regexp: /wechat|micromessenger/i,
    jsSDKName: 'jWeixin',
    jsSDKUrl: 'static/js-sdk/jweixin.js',
    jsSDKListerName: 'WeixinJSBridgeReady'
  },
  initConfig: function (apiList: Array<string> = ['updateAppMessageShareData', 'updateTimelineShareData']) {
    return new Promise(async (resolve, reject) => {
      // const data = await getSignature(encodeURIComponent(location.href))
      const data = {
        appId: 'wxd90da2cc2b3b177c',
        nonceStr: '12ds1212dfsad',
        timestamp: 1654076544,
        signature: '80d95ff0fbe36c1ed3deb4e258477dd27231ad56'
      }
      const { appId, nonceStr, timestamp, signature } = data
      console.log('data', data)
      try {
        jWeixin.config({
          debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的 JS 接口列表
        })
        console.log('jWeixin', jWeixin)
        jWeixin.ready(function () {
          resolve(jWeixin)
          // config信息验证后会执行 ready 方法，所有接口调用都必须在 config 接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在 ready 函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在 ready 函数中。
        })
        jWeixin.error(function (e: any) {
          reject(e)
          // config信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的debug模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default wechatConfig
