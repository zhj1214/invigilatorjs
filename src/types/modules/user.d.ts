declare namespace User {
  /**
   * @property displayName 用户昵称
   * @property avatarUrl 头像地址
   * @property level 当前会员等级
   * @property levelName 当前会员等级名称
   * @property percent 会员成长百分比
   * @property coverImg 当前会员等级背景图
   * @property growth 会员成长值
   * @property nextGrowth 下阶段会员需要的成长值
   * @property point 用户会员积分值
   */
  interface Info {
    mobile: string
    accountId: string
    displayName: string
    avatarUrl: string
    level?: number | undefined
    levelName: string
    percent: number
    coverImg: string
    growth: number | undefined
    nextGrowth: number | undefined
    follow: boolean
    order?: number | undefined
    followStatus?: number
    id: string
    point?: number
  }

  type GetUserInfo = () => Promise<Info>

  /**
   * @property text 城市名称
   * @property children 是否有子级
   * @property code 城市编码
   * @property id 城市id
   */
  interface CityInfo {
    name?: string
    text?: string
    children?: boolean
    code: string
    id: string
  }

  /**
   * @property id 地址id
   * @property receiverName 接收人名称
   * @property mobile 接收人手机号
   * @property province 省份
   * @property city 城市
   * @property district 区划
   * @property details 详细地址
   * @property isDefault 是否默认
   */
  interface AddressInfo {
    id?: string
    receiverName: string
    mobile: string
    province: string
    provinceCode: string
    provinceId: string
    city: string
    cityCode: string
    cityId: string
    district?: string
    districtCode?: string
    districtId?: string
    details: string
    isDefault: number
  }

  type GetUserAddress = () => Promise<AddressInfo[]>
}
