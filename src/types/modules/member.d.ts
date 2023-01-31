/*
 * @Date: 2022-07-07 15:11:35
 * @author: shaner@sp0275
 * @desc:
 */
declare namespace Member {
  interface VipRightInfo {
    id: string
    logoImg: string
    rightsId: string
    rightsName: string
    description: string
  }
  interface TaskInfo {
    taskName: string
    completedTimes: number
    completeTotalTimes: number
    status: number
    taskDesc: string
    redirectUrl: string
    terminalList: { redirectUrl: string; terminalType: number }[]
    icon: string
    showFlag: boolean
    validityPeriodEnd: number
    validityPeriodFlag: boolean
  }

  interface LevelInfo {
    id: string
    coverImg: string
    description: string
    logoImg: string
    name: string
    order: number
    growth: number
    nextGrowth: number
    riseValue: number
    percent: number
    lastErcent: number
  }

  /**
   * 当前用户会员信息
   * @property growth 当前成长值
   * @property nextGrowth 到达下一等级所需成长值
   * @property levelId 当前等级id
   * @property description 等级描述
   */
  interface CurLevelInfo {
    growth: number
    nextGrowth: number | null
    levelId: string
    description: string
    order: number
    percent: number | string
  }

  /**
   * 权益详情
   * @property rightsName 权益名称
   * @property description 权益说明
   */
  interface GradeDetail {
    rightsName: string
    description: string
  }

  interface TabInfo {
    name: string
    value: string
  }

  /**
   * 会员用户详情
   * @property growth 成长值
   * @property nextGrowth 升级所需成长值
   * @property levelId 等级id
   * @property description 会员卡说明
   * @property order
   * @property percent
   * @property levelName 等级名字
   * @property coverImg 等级卡面
   */
  interface VipUserInfo {
    growth: number
    nextGrowth: number
    levelId: string
    description: string
    order: number
    percent: number
    levelName: string
    coverImg: string
  }

  /**
   * 获取会员用户详情
   */
  type GetVipUser = (accountId: string, systemId: string) => Promise<VipUserInfo>

  /**
   * 会员权益列表
   */
  type GetVipRights = ({ systemId: string, levelId: string, pageNo: number, pageSize: number }) => Promise<{
    data: VipRightInfo[]
  }>

  /**
   * 获取用户任务列表
   */
  type GetUserTask = ({ taskTypeId: string }) => Promise<TaskInfo[]>

  /**
   * 获取会员等级列表
   */
  type GetLevelList = (systemId: string) => Promise<LevelInfo[]>

  /**
   * 获取某会员登记下权益
   */
  type GetAllGrade = (systemId: string) => Promise<VipRightInfo[]>

  /**
   * 获取任务类型
   */
  type GetTaskType = ({ taskSceneCode: string }) => Promise<Array<{ id: string; name: string }>>
}
