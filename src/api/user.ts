import { request, uploadRequest } from './request'

/**
 *获取用户信息
 */
export const getUserInfo: User.GetUserInfo = () => {
  return request({
    url: '/api/v1/user/current',
    method: 'GET',
    domain: 'USER'
  })
}

/**
 *获取会员体系id
 */
export const getSystemId = () => {
  return request({
    url: '/web/community/tasks/system-id',
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 获取会员用户详情
 * @param accountId 用户id
 * @param data 会员id对象
 * @returns
 */
export const getVipUser: Member.GetVipUser = (accountId: string, systemId: string) => {
  return request({
    url: `/web/member/account/${accountId}`,
    method: 'GET',
    domain: 'VIP',
    data: { systemId }
  })
}

/**
 * 获取会员用户积分
 * @param accountId 用户id
 * @param data 积分id对象
 * @returns
 */
export const getVipUserPoint = (accountId: string, systemId: string) => {
  return request({
    url: `/web/point/account/${accountId}`,
    method: 'GET',
    domain: 'VIP',
    data: { systemId }
  })
}

/**
 * 获取当前用户可用积分
 * @param params
 * @returns
 */
export const getUserUsablePoint = () => {
  return request({
    url: '/web/point/user/balance',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 获取手机验证码
 * @param clientId 应用id
 * @param data
 * @returns
 */
export const getSmsCode = (clientId: string, data: { mobile: string; template: string }) => {
  return request({
    url: `/api/v1/common/mobile/sms?client_id=${clientId}`,
    method: 'POST',
    domain: 'USER',
    data
  })
}

/**
 * 手机号验证码登录
 * @param data
 * @returns
 */
export const login = (data: { mobile: string; verificationCode: string; isCreatePassword: boolean }) => {
  return request({
    url: '/api/v1/uaa/mobile/mobile-code-login',
    method: 'POST',
    domain: 'UAA',
    data
  })
}

/**
 * 微信小程序登录
 * @param data
 * @returns
 */
export const doWxLogin = (data: { jsCode: string; encryptedData: string; iv: string; source: number }) => {
  return request({
    url: '/api/v1/thirdparty/wechat/miniprogram/login',
    method: 'POST',
    domain: 'UAA',
    data
  })
}
/**
 * @property openId 微信openid
 * @property mobile 用户手机号
 * @property captcha 验证码
 * @property clientId 应用id：bigapp
 * @property source 来源
 * @property niceName 用户昵称
 * @property avatarUrl 用户头像地址
 * @property sex 用户性别
 */
interface RegisterRequestInfo {
  openId: string
  mobile: string
  captcha: string
  clientId: string
  source: number
  niceName?: string
  avatarUrl?: string
  sex?: number
}
/**
 * 微信小程序用户注册
 */
export const register = (data: RegisterRequestInfo) => {
  return request({
    url: '/api/v1/thirdparty/wechat/miniprogram/register',
    method: 'POST',
    domain: 'UAA',
    data
  })
}

/**
 * 退出登录
 * @returns
 */
export const logout = () => {
  return request({
    url: '/api/v1/uaa/logout/token',
    method: 'GET',
    domain: 'UAA'
  })
}

/**
 * 获得当前用户收货地址列表
 * @returns
 */
export const getAddress: User.GetUserAddress = () => {
  return request({
    url: '/web/delivery-addresses',
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 获取收货地址详情
 * @param id 地址id
 * @returns
 */
export const getAddressInfo = (id: string) => {
  return request({
    url: `/web/delivery-addresses/${id}`,
    method: 'GET',
    domain: 'MALL'
  })
}

/**
 * 创建用户地址
 * @param data 用户地址信息
 * @returns
 */
export const addAddress = (data: User.AddressInfo): Promise<string> => {
  return request({
    url: '/web/delivery-addresses',
    method: 'POST',
    domain: 'MALL',
    data
  })
}

/**
 * 更新收货地址
 * @param id 地址id
 * @param data 地址信息
 * @returns
 */
export const updateAddress = (id: string, data: User.AddressInfo) => {
  return request({
    url: `/web/delivery-addresses/${id}`,
    method: 'PUT',
    domain: 'MALL',
    data
  })
}

/**
 * 设置默认收货地址
 * @param id 地址id
 * @returns
 */
export const setDefaultAddress = (id: string) => {
  return request({
    url: '/api/v1/user/address/default',
    method: 'POST',
    domain: 'USER',
    data: { id }
  })
}

/**
 * 删除收货地址
 * @param id 地址id
 * @returns
 */
export const deleteAddress = (id: string) => {
  return request({
    url: `/web/delivery-addresses/${id}`,
    method: 'DELETE',
    domain: 'MALL'
  })
}

/**
 * 获取省市区
 * @param pid 父区划id
 * @returns
 */
export const getDistrict = (code?: string) => {
  return request({
    url: `/web/districts/${code}`,
    method: 'GET',
    domain: 'MALL'
  })
}
/**
 * 获取省市区
 * @param pid 父区划id
 * @returns
 */
export const getOrgDistrict = (pid?: string) => {
  return request({
    url: '/web/test-drive/consumer/org/district',
    method: 'GET',
    domain: 'LEAD',
    data: pid
      ? {
          pid
        }
      : null
  })
}

// 修改用户信息
export const updateUserInfo = (data: AnyObject) => {
  return request({
    url: '/api/v1/user/update',
    method: 'POST',
    domain: 'USER',
    data
  })
}

export const uploadFiles = (data: Request.UploadFileDataOptions) => {
  return uploadRequest({
    data,
    url: '/api/v1/cuz/upload',
    domain: 'MALL'
  })
}
// 头像上传
export const uploadAvatar = (data: Request.UploadFileDataOptions) => {
  return uploadRequest({
    data,
    url: '/api/v1/user/avatar/upload',
    domain: 'USER'
  })
}
// 任务列表查询
export const queryUserTask = (data: number) => {
  return request({
    url: '/web/community/tasks/queryUserTask',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

// 积分流水分页
export const getPointFlow = (data: number) => {
  return request({
    url: '/web/point/account/flow',
    method: 'GET',
    domain: 'VIP',
    data
  })
}
// 根据场景号获取任务信息
export const getTaskInfoData = (sceneCode = 'signScene') => {
  return request({
    url: `/web/task/tasks/load-one?sceneCode=${sceneCode}`,
    method: 'GET',
    domain: 'TASK',
    needTerminal: true
  })
}

// 获取用户任务数据
export const getUserData = (taskId: string) => {
  return request({
    url: `/web/task/tasks/user-data?taskId=${taskId}`,
    method: 'GET',
    domain: 'TASK'
  })
}
// 任务触发接口
export const setSignInEventStart = () => {
  return request({
    url: `/web/task/tasks/event-start`,
    method: 'POST',
    domain: 'TASK',
    data: {
      eventCode: 'SJ10031'
    }
  })
}
// 多租户列表
export const getTpmTenantList = () => {
  return request({
    url: '/api/v1/openapi/tenant/list',
    method: 'GET',
    domain: 'TPM'
  })
}
