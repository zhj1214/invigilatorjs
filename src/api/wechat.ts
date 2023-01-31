import { request } from './request'

/**
 * 获取JS-SDK权限签名
 * @returns  wxd90da2cc2b3b177c
 */
export const getSignature = (url: string) => {
  return request({
    url: '/weixin/js-sdk/signature',
    method: 'GET',
    domain: 'WECHAT',
    data: { url, appId: 'wxd90da2cc2b3b177c' },
    withoutToken: true
  })
}
