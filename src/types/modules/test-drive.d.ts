declare namespace TestDrive {
  /**
   * 预约试驾详情
   */
  interface TestDriveDetail {
    /**
     * 真实姓名
     */
    driverName: string
    id: string
    mobile: string

    /**
     * 试驾车型
     */
    modelName: string

    /**
     * 试驾门店
     */
    orgName: string

    /**
     * 试驾时间
     */
    reservationTime: number
  }

  /**
   * 新建预约试驾参数
   */

  interface ReservationParams {
    driverName: string
    mobile: string
    smsCaptcha: string
    modelCode: string
    dealerCode: string
    reservationTime: string
    source: string
  }

  /**
   * 提交预约试驾
   */
  type SetReservation = (ReservationParams) => Promise

  /**
   * 获取预约试驾详情数据
   */
  type GetTestDrive = (query: string | number | undefined) => Promise<TestDriveDetail>
}
