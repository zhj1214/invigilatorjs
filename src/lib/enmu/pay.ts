/**
 * 支付字典
 */
export const Pay = {
  /**
   * 支付类型
   */
  Type: {
    /**
     * 现金支付 1
     */
    Cash: 1,
    /**
     * 积分支付 2
     */
    Point: 2,
    /**
     * 部分混合支付：定额积分+现金 3
     */
    PartialMixing: 3,
    /**
     * 自由混合支付：自由积分+现金 4
     */
    FreeMixing: 4
  },
  /**
   * 支付渠道
   */
  Channel: {
    /**
     * 微信 APP 04
     */
    WECHAT_APP: '04',
    /**
     * 微信公众号 05
     */
    WECHAT_JSAPI: '05',
    /**
     * 微信扫码 06
     */
    WECHAT_NATIVE: '06',
    /**
     * 微信 H5 07
     */
    WECHAT_H5: '07',
    /**
     * 微信小程序 08
     */
    WECHAT_WXA: '08',
    /**
     * 支付宝 JSAPI 12
     */
    ALIPAY_JSAPI: '12',
    /**
     * 支付宝扫码 13
     */
    ALIPAY_NATIVE: '13',
    /**
     * 支付宝 APP 14
     */
    ALIPAY_APP: '14',
    /**
     * 支付宝 H5 15
     */
    ALIPAY_H5: '15',
    /**
     * 支付宝 WEB 16
     */
    ALIPAY_WEB: '16',
    /**
     * 支付宝小程序 17
     */
    ALIPAY_WXA: '17',
    /**
     * 积分 19
     */
    POINT: '19'
  }
}
