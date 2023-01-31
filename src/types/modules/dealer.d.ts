declare namespace Dealer {
  /**
   * 后端接口定义经销商数据
   */
  interface BizItem extends Iteminfo {
    /**
     * 移动电话
     */
    field_6: string

    /**
     * gps纬度
     */
    gpsLatitude: number

    /**
     * gps经度
     */
    gpsLongitude: number

    /**
     * 所在省
     */
    province: string

    /**
     * 所在市
     */
    city: string

    /**
     * 所在区县
     */
    region: string

    /**
     * 街道名称
     */
    street: string

    /**
     * 详细地址
     */
    details: string
  }
  /**
   * 经销商信息
   */
  interface Iteminfo {
    id?: string
    name: string
    address: string
    image: string
    code?: string
    telephone?: string
    distance?: number | string
  }

  /**
   * 查询经销商信息参数
   */
  interface Query {
    pageNo: Number
    pageSize: Number
    cityCode: string | undefined
  }
  /**
   * 查询经销商信息
   */
  type GetDealer = (Query) => Promise<PageListInfo<BizItem>>
}
