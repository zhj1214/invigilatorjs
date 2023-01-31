/**
 * 环境变量
 */
export const ENV = import.meta.env.VITE_APP_ENV

//手机号正则
export const MOBILE_REG = /^[1]([3-9])[\d]{9}$/

/**
 * 将所有可枚举属性的值从一个源对象分配到目标对象,返回目标对象。
 * @param target 目标对象
 * @param origin 源对象
 * @param map 属性映射关系 { 目标对象属性: 源对象属性 }
 * @returns void
 */
interface PureAssignFunc {
  (target: AnyObject, origin: AnyObject, map?: AnyObject): AnyObject
}

/**
 * 将所有可枚举属性的值从一个源对象分配到目标对象,返回目标对象。
 * @param target 目标对象
 * @param origin 源对象
 * @param map 属性映射关系 { 目标对象属性: 源对象属性 }
 * @returns target
 */
export const pureAssign: PureAssignFunc = (target: AnyObject, origin: AnyObject, map?: AnyObject): AnyObject => {
  for (const key in target) {
    const val = origin[map && map[key] ? map[key] : key]
    if (val !== undefined && val !== null) {
      target[key] = val
    }
  }
  return target
}

/**
 * 验证手机号格式
 * @param mobile 手机号
 * @returns boolean
 */
export const isCorrectMobile = (mobile: string): boolean => {
  return MOBILE_REG.test(mobile)
}

/**
 * 请求平台类型
 */
// PC(1, 'PC'), H5(2, 'H5'), APP(3, 'APP'), WECHAT_APPLET(4, 'WX')
const TERMINAL_TYPE = {
  pc: 1,
  h5: 2,
  app: 3,
  'mp-weixin': 4
}

const platform = process.env.VUE_APP_PLATFORM as PlatformInfo

export const terminal = TERMINAL_TYPE[platform]

// #ifdef H5
const u = navigator.userAgent
// ios设备
export const isIos = !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X)/)
// android设备
export const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
// 微信浏览器
export const isInWechat = u.toLowerCase().indexOf('micromessenger') > -1
// #endif

/**
 * 查找两个字符串的最长连续重复字符
 * @param str1
 * @param str2
 * @returns
 */
export function matchLongestRepetString(str1: string, str2: string) {
  let targetString = ''
  let shorter = ''
  let longer = ''
  if (str1.length > str2.length) {
    shorter = str2
    longer = str1
  } else {
    shorter = str1
    longer = str2
  }
  for (let a = shorter.length; a > 0; a--) {
    for (let b = 0; a + b <= shorter.length; b++) {
      const str = shorter.substring(b, a + b)
      if (longer.indexOf(str) >= 0) {
        targetString = str
        return targetString
      }
    }
  }
  return ''
}

/**
 * @description: 生成随机英文字符串
 * @Date: 2022-05-24 14:33:57
 * @return len 字符串长度
 */
export function getRandomString(len: number) {
  len = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * @description: 判断是否为图片
 * @Date: 2022-05-24 16:24:02
 * @param {string} url 文件名
 * @return { boolean }
 */
export const isImage = (url: string) => {
  return /\.(xbm|tif|pjp|svgz|jpg|jpeg|ico|tiff|gif|svg|jfif|webp|png|bmp|pjpeg|avif)/.test(url)
}

/**
 * @description: 判断是否为视频
 * @Date: 2022-05-24 16:24:02
 * @param {string} url 文件名
 * @return { boolean }
 */
export const isVideo = (url: string) => {
  return /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|MOV)/.test(url)
}

/**
 * @description: 图片预览
 * @Date: 2022-05-25 14:33:57
 * @param {*} mediaUrlList 文件列表
 * @param {number} index
 */
export const handleImagePreview = (mediaUrlList: AnyObject, index: number) => {
  const list = mediaUrlList.map((item: { mediaUrl: string }) => item.mediaUrl)
  uni.previewImage({
    current: index, // 预览图片的下标
    urls: list // 预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
  })
}

/**
 * @description: 截取文件后缀
 * @Date: 2022-05-26 15:01:45
 * @return {*}
 */
export const getFileType = (fileName: string) => {
  const tfileName = fileName.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
  const tfileNameLen = fileName.length // 取到文件名长度
  const tfileType = fileName.substring(tfileName + 1, tfileNameLen) // 截
  return tfileType
}
/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
export const checkUpdateVersion = () => {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate((res: { hasUpdate: any }) => {
      if (res.hasUpdate) {
        // 请求完新版本信息的回调
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (res: { confirm: any }) => {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          uni.showModal({
            // 新的版本下载失败
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索进入哟~'
          })
        })
      }
    })
  } else {
    uni.showModal({
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}
