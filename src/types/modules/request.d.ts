/**
 * 网络请求模块声明
 */
declare namespace Request {
  /**
   * 请求默认配置
   */
  type DefaultOptions = UniNamespace.RequestOptions
  /**
   * 文件上传请求默认配置
   */
  type DefaultUploadOptions = UniNamespace.UploadFileOption

  /**
   * 普通请求完整配置
   * @interface Options
   * @extends {DefaultOptions}
   */
  interface Options extends DefaultOptions {
    /**
     * domain 前端配置文件配置的后台服务域名对应key
     * default ''
     */
    domain: string
    /**
     * 该请求是否携带token
     * default: false 默认携带token
     */
    withoutToken?: boolean
    /**
     * 该请求是否携带终端类型
     * default: false 默认不携带终端类型
     */
    needTerminal?: boolean
    /**
     * 请求的参数
     */
    data?: any
  }

  /**
   * 文件上传入参data
   */
  interface UploadFileDataOptions extends DefaultUploadOptions {
    /**
     * 是否隐藏上传loading
     */
    hideLoading?: boolean
    /**
     * 开发者服务器 url
     */
    url?: string
  }

  /**
   * 文件上传请求完整配置
   * @interface UploadFileOptions
   * @extends {DefaultUploadOptions}
   */
  interface UploadFileOptions extends Options {
    /**
     * 请求的参数
     */
    data: UploadFileDataOptions
  }

  /**
   * 后端返回数据对象
   */
  interface ResponseInfo<T> {
    /**
     * 后端自定义code码
     */
    code?: string
    /**
     * 后端返回的error描述
     */
    error: string
    /**
     * 后端返回数据
     */
    data: string | boolean | number | PageListInfo<T> | T
    /**
     * 后端返回提示信息
     */
    message: string
    /**
     * 接口地址, 接口异常时返回接口地址，接口正常返回时为null
     */
    path: string | null
    /**
     * 后端自定义请求状态码
     * 200 正常返回
     * 401 用户未登录，token缺失
     * 500 服务器内部错误
     * 601 用户登录状态失效，token失效
     */
    status: 200 | 401 | 500 | 601
    timestamp: string | number
  }

  /**
   * 合并请求参数
   * @param options 待合并参数
   * @param defaultOptions 默认参数
   * @param isFile 是否为文件上传请求
   */
  type MergeRequest = (options: Options, defaultOptions: DefaultOptions | DefaultUploadOptions, isFile: boolean) => Promise<Options | UploadFileOptions>

  type RequestResponseData = string | ResponseInfo<AnyObject>

  /**
   * 请求成功的response
   */
  interface RequestResponse extends UniNamespace.RequestSuccessCallbackResult {
    /**
     * 后端返回信息
     */
    message
    /**
     * 服务端返回数据
     */
    data: RequestResponseData
  }

  /**
   * 发起常规请求
   * @param options 请求参数
   */
  type Request = (options: Options) => Promise<never | T>

  /**
   * 发起文件上传请求
   * @param options 请求参数
   */
  type UploadRequest = (options: UploadFileOptions) => Promise<unknown>
}
