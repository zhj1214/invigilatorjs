<script lang="ts">
import { checkUpdateVersion } from './util/common'
import { getAbnormal } from 'abnormal'
let app: any

export default {
  onLaunch: function () {
    console.log('App Launch')
    app = {}
    // 初始化报错sdk
    app.abnormal = getAbnormal({
      baseUrl: '', // 上报服务地址
      projectId: '', // 小程序AppId/项目id
      clientType: 'miniprogram' // 用于自身来区分是哪一种客户端： 'miniprogram' 、 'web'
    })
    console.log(app.abnormal, '---- app.abnormal---')
  },
  onShow: function () {
    console.log('App Show')
    checkUpdateVersion()
  },
  onHide: function () {
    console.log('App Hide')
  },
  onError: function (err) {
    console.log(app, 'App onError', err)
    app.abnormal && app.abnormal.reportError(err)

    // let results = this.parseStack(err.stack) || []
    // results = results.map((element) => {
    //   return JSON.stringify(element)
    // })
    // const resultsStr = results.join('\n')
    // console.log(this.pageUrl, '---results--', resultsStr)
    // TraceKit.report(err)
  }
}
</script>

<style lang="scss">
/* 公共css */
@import './style/element.scss';
@import './style/font.scss';
@import './style/common.scss';
</style>
