import { ENV } from './common'

/**
 * 静态图片oss文件路径
 */
export const OSS_STATIC_PATH = 'fe-mall-2c/static'

/**
 * 各环境oss地址
 */
export const OSS_DOMAIN = {
  dev: 'https://arena-alpha.oss-cn-hangzhou.aliyuncs.com',
  sit: 'https://alpha-sit.oss-cn-hangzhou.aliyuncs.com',
  uat: 'https://alpha-uat-public.oss-cn-hangzhou.aliyuncs.com'
}

/**
 * 当前环境oss地址
 */
export const ossUrl = OSS_DOMAIN[ENV as EnvInfo]

/**
 *动态获取图片的oss地址
 * @param name 图片名称
 * @returns 图片完整oss地址
 */
export const getGeneratorDynamicPic: GeneratorDynamicPicFunc<string | string[]> = (data: string | string[]): string | string[] => {
  if (typeof data === 'string') {
    return `${ossUrl}/${OSS_STATIC_PATH}/${data}`
  }
  return data.map((item) => `${ossUrl}/${OSS_STATIC_PATH}/${item}`)
}
