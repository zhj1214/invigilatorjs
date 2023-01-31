/**
 * 圈子信息类型声明
 */
interface GroupInfo {
  id: string
  groupName: string
  logoUrl: string
  contentCount?: number
  peopleCount?: number
  wallpaperUrl?: string
  introduction: string
  groupLeader: GroupMemberInfo
  approvalWay: number
  approval?: number
  follow: boolean
}

/**
 * 话题信息类型声明
 */
interface TopicInfo {
  id: string
  topicName: string
  contentCount: string
  logoUrl: string
  peopleFollowCount: string | number
}

/**
 * 文章信息详情(广场热门、动态)
 */
interface ContentInfo {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  commentCount: number
  contentType: number
  createTime: string
  groupName: string
  detail: string
  likeCount: number
  like: boolean
  pictureUrls: array
  follow: boolean
  groupId: string
  topicId: string
  topicName: string
  thumbUrls: array
  releaseTime: string
  vote: VoteInfo
  title?: string
  realDeadline?: string
  approved?: boolean
  level?: number
  geoPosition?: string
  approvalStatus?: number | string
}

/**
 * 投票信息声明
 */

interface VoteInfo {
  contentId: string
  joinCount: number
  multiFlag: boolean
  options: Option[]
  visibilityFlag: boolean
  voteCount: number
  joined: boolean
}

interface Option {
  count: string
  desc: string
  index: number
  selected: boolean
  checked: boolean
}

/**
 * 资讯分类声明
 */
interface NewsTypeInfo {
  id: string
  icon: string
  name: string
  publishContentNum: string
}

/**
 * 资讯数据信息声明
 */
interface NewsInfo {
  id: string
  title: string
  labelName: string
  addressDetail: AnyObject
  contentType: number
  pictures: {
    lifeImg: string
  }
  readNum: number
  readAdjustNum: number
  originalContent: string
  componentList?: array
  publishTime: string
  author: string
  tagList: Array<AnyObject>
}

/**
 * 圈子成员信息
 */
interface GroupMemberInfo {
  id: string
  accountId: string
  accountName: string
  follow: boolean
  avatarUrl: string
  accountNamePinyin: string
  first: number | string
  groupId: string
}

/**
 * @name: 圈子审核记录
 * @property: id 记录id
 * @property: avatarUrl 圈子头像
 * @property: accountName 用户名称
 * @property: groupLogoUrl 圈子logo
 * @property: groupName 圈子名
 * @property: createTime 创建时间
 * @property: applyReason 申请原因
 * @property: approvalStatus 审核状态
 * @property: remark 驳回理由
 * @property: finalApprovalTime 通过/驳回时间
 * @property: groupStatus 圈子状态 1-上架 2-下架
 *
 */
interface GroupRecordInfo {
  id: string
  avatarUrl: string
  accountName: string
  groupLogoUrl: string
  groupName: string
  createTime: string
  applyReason: string
  approvalStatus: number
  remark: string
  finalApprovalTime: string
  groupStatus: number
}

/**
 * @name: 发布消息页面传入值
 * @property:topicName 话题名称
 * @property:topicId 话题id
 * @property:from 页面来源
 *
 */
interface ContentLaunchOption {
  topicName?: string
  groupName?: string
  groupId: string
  topicId: string
  from: string
}

/**
 * @name: 勋章列表信息声明
 * @property categoryName 类目名称
 * @property categoryNo 类目编码
 * @property id 类目id
 * @property medalList 该类目下勋章
 *
 */
interface MedalListInfo {
  categoryName: string
  categoryNo: string
  id: number
  medalList: MedalInfo[]
}
/**
 * @name: 勋章信息声明
 * @property id 勋章id
 * @property medalName 勋章名称
 * @property ifLightUp 是否点亮
 * @property medalIconUrl 勋章图片
 * @property gainTime 获得时间
 * @property description 勋章描述
 * @property gainPopupDescription 勋章获得的时候弹出的文字描述
 *
 */
interface MedalInfo {
  id: string
  medalName: string
  ifLightUp: boolean
  medalIconUrl: string
  gainTime: string
  description: string
  gainPopupDescription: string
}
