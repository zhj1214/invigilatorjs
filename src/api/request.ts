import { useAppStore } from '@src/pinia/app'
import { useConfigStore } from '@src/pinia/config'
import { throttle } from '@src/lib/lodash'

/**
 * 请求平台类型
 */
import { terminal } from '@util/common'

/**
 * 跳转登陆页面，节流3s
 */
export const relogin = throttle(
  () => {
    uni.removeStorageSync('token')
    useAppStore().setLoginStatus(false)
    uni.navigateTo({
      url: '/pages/login/index'
    })
  },
  3000,
  {
    trailing: false
  }
)

/**
 * 合并请求参数
 * @param options
 * @param defaultOptions
 * @param isFile
 * @returns
 */
const mergeRequest: Request.MergeRequest = async function (options, defaultOptions, isFile) {
  // domain拼接完整请求地址
  // 获取当前租户的域名数据
  const feConfigInfo = await useConfigStore().getFeConfig()
  const domainKey = uni.getStorageSync('currentTenant').tenantId || feConfigInfo.deaultTanent.tenantId
  const domainConfig = feConfigInfo[domainKey] as AnyObject
  const domain = options.domain.toUpperCase()

  let url = (domainConfig[domain] || '') + options.url

  // #ifdef H5
  if (domain === 'WECHAT' && process.env.NODE_ENV === 'development') {
    url = 'http://localhost:3000/back' + options.url
  }
  // #endif

  // 获取携带 access_token
  let token = ''
  try {
    token = uni.getStorageSync('token')
  } catch (error) {
    console.log('token获取失败')
  }
  if (!options.withoutToken && token) {
    url += (url.includes('?') ? '&' : '?') + 'access_token=' + token
    // defaultOptions.header['Authorization'] = 'Bearer ' + token
  }

  const data = options.data || {}
  // 添加终端类型参数
  if (domain === 'MALL' || options.needTerminal) {
    data.terminal = terminal
  }

  let result
  if (!isFile) {
    result = Object.assign({}, defaultOptions) as Request.Options
    result.url = url
    result.method = (options as Request.Options).method
    result.data = data
  } else {
    result = Object.assign(options.data, defaultOptions) as Request.UploadFileOptions
    result.url = url
  }
  return result
}

/**
 * 请求成功处理逻辑
 * @param data 返回数据
 * @returns
 */
function handleRequestSuccess(data: Request.RequestResponseData) {
  const res = data
  if (typeof res === 'string') {
    return res
  }
  switch (res.status) {
    case 200:
      return res.data
    case 401:
      relogin()
      throw new Error('未登录')
    case 601:
      relogin()
      throw new Error('请重新登录')
    default:
      uni.showToast({
        icon: 'none',
        title: res.message || '服务器端错误'
      })
      throw new Error(res.message || '服务器端错误')
  }
}

/**
 * 发起request请求
 */
export const request: Request.Request = async function (options): Promise<unknown> {
  const defaultOptions: Request.DefaultOptions = {
    url: '',
    data: undefined,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'accept-language': 'zh-CN,zh'
    },
    timeout: 30000
  }
  try {
    const res = (await uni.request((await mergeRequest(options, defaultOptions, false)) as UniNamespace.RequestOptions)) as unknown as Request.RequestResponse
    switch (res.statusCode) {
      case 200:
        return handleRequestSuccess(res.data)
      case 401:
        relogin()
        throw new Error('未登录')
      case 601:
        relogin()
        throw new Error('请重新登录')
      default:
        uni.showToast({
          icon: 'none',
          title: res.message || '服务器端错误'
        })
        throw new Error(res.message || '服务器端错误')
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * 发起文件上传请求
 */
export const uploadRequest: Request.UploadRequest = async function (options) {
  if (!options.data.hideLoading) {
    uni.showLoading({
      title: ' ',
      mask: true
    })
  }
  const defaultOptions: Request.DefaultUploadOptions = {
    url: '',
    header: {
      Accept: '*/*',
      'accept-language': 'zh-CN,zh'
    }
  }
  try {
    const res = (await uni.uploadFile((await mergeRequest(options, defaultOptions, true)) as UniNamespace.UploadFileOption)) as unknown as Request.RequestResponse
    switch (res.statusCode) {
      case 200:
        const data = JSON.parse(res.data as string)
        return handleRequestSuccess(data)
      case 401:
        relogin()
        throw new Error('未登录')
      case 601:
        relogin()
        throw new Error('请重新登录')
      default:
        uni.showToast({
          icon: 'none',
          title: res.message || '服务器端错误'
        })
        throw new Error(res.message || '服务器端错误')
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
