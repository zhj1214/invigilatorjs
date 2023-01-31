import { resolve } from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import Components from 'unplugin-vue-components/vite'
import { SaUiResolver, HotUniScssVitePlugin } from '@supaur-works/sa-ui/vite'
import progress from 'vite-plugin-progress'
import appletci from 'vite-applet-ci'

export default defineConfig({
  plugins: [
    uni(),
    appletci({
      appId: 'wxbb7c62063a9ef9ff',
      projectPath: 'dist/build/mp-weixin',
      privateKey: 'scripts/private.wxbb7c62063a9ef9ff.key',
      isDowloadSourceMap: true,
      baseURL: '' // 上传sourcemap服务地址
    }),
    progress(),
    VueSetupExtend(),
    Components({
      dts: false,
      resolvers: [SaUiResolver()]
    }),
    HotUniScssVitePlugin()
  ],
  base: '/',
  publicDir: 'public',
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json', '.scss'],
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@api': resolve(__dirname, 'src/api'),
      '@util': resolve(__dirname, 'src/util'),
      $dayjs: resolve(__dirname, 'node_modules/dayjs/esm/index')
    }
  },
  build: {
    sourcemap: true
  },
  server: {
    proxy: {
      '/back': {
        target: 'https://ma-wechat-biz.alpha-sit.supaur.tech',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path)
          return path.replace(/^\/back/, '')
        }
      }
    }
  }
})
