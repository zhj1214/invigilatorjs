/* eslint-disable max-lines */
import { request, uploadRequest } from './request'

//+++++++++++++++++++++++++++++++++++++++++++ 社群首页 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * 获取全部圈子列表
 * /web/community/groups
 * @param {*} params
 */
export const getAllGroupList = (data?: AnyObject) => {
  return request({
    url: '/web/community/groups',
    method: 'GET',
    data,
    domain: 'COMMUNITY'
  })
}

/**
 * 获取我的圈子列表
 * /web/community/groups/mine
 * @param {*} params
 * @returns
 */
export const getMyGroupList = (data: AnyObject) => {
  return request({
    url: '/web/community/groups/mine',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 我管理的圈子分页列表
 * /web/community/groups/manage-paging
 */
export const getManagePaging = (data: { pageNo: number; pageSize: number }) => {
  return request({
    url: '/web/community/groups/manage-paging',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 用户申请加入圈子
 * /web/community/groups/members/follow
 * @param {*} groupId
 */
export const toFollowGroup = (groupId: string) => {
  return request({
    url: `/web/community/groups/members/follow?groupId=${groupId}`,
    method: 'PUT',
    domain: 'COMMUNITY'
  })
}

/**
 * 用户取消加入圈子
 * /web/community/groups/members/unfollow
 * @param {*} groupId
 */
export const toUnfollowGroup = (groupId: string) => {
  return request({
    url: `/web/community/groups/members/unfollow?groupId=${groupId}`,
    method: 'PUT',
    domain: 'COMMUNITY'
  })
}

/**
 * 话题分页列表
 * /web/community/topics
 * @param {*} params
 */
export const getTopicsList = (data: AnyObject) => {
  return request({
    url: '/web/community/topics',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取广场-热门内容列表
 * /web/community/contents
 * @param {*} params
 */
export const getHotContentList = (data: AnyObject) => {
  return request({
    url: '/web/community/contents',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 内容点赞
 * /web/community/contents/${contentId}/like
 * @param {*} contentId
 */
export const setContentLike = (contentId: string) => {
  return request({
    url: `/web/community/contents/${contentId}/like`,
    method: 'POST',
    domain: 'COMMUNITY'
  })
}

/**
 * 取消内容点赞
 * /web/community/contents/${contentId}/like
 * @param {*} contentId
 */
export const toContentUnlike = (contentId: string) => {
  return request({
    url: `/web/community/contents/${contentId}/like`,
    method: 'DELETE',
    domain: 'COMMUNITY'
  })
}

/**
 * 关注用户
 * /web/community/members/follow
 */
export const toFollowUser = (data: AnyObject) => {
  return request({
    url: `/web/community/members/follow`,
    method: 'PUT',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 取消关注用户
 * /web/community/members/un-follow
 */
export const toUnfollowUser = (data: AnyObject) => {
  return request({
    url: `/web/community/members/un-follow`,
    method: 'PUT',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取内容详情
 * /web/community/contents/{id}
 * @param {*} params
 */
export const getContentDetail = (id: string) => {
  return request({
    url: `/web/community/contents/${id}`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/***
 * 获取指定发布内容的评论列表
 * /web/community/comments
 */
export const getCommentList = (data: { pageNo: number; contentId?: string; topPid?: string; like: boolean; level?: number }) => {
  return request({
    url: `/web/community/comments`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/***
 * 获取当前评论信息
 * /web/community/comments
 */
export const getCommentDetail = (id: string) => {
  return request({
    url: `/web/community/comments/${id}`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 查询个人账户详情
 * @param {*} accountId
 */
export const getUserDetail = (accountId: string) => {
  return request({
    url: `/web/community/members/${accountId}`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 评论点赞
 * /web/community/comments/{id}/like
 */
export const setCommentLike = (id: string) => {
  return request({
    url: `/web/community/comments/${id}/like`,
    method: 'POST',
    domain: 'COMMUNITY'
  })
}

/**
 * 评论取消点赞
 * /web/community/comments/{id}/like
 */
export const setCommentunLike = (id: string) => {
  return request({
    url: `/web/community/comments/${id}/like`,
    method: 'DELETE',
    domain: 'COMMUNITY'
  })
}

/**
 * 绿网文本和图片预审核
 * /web/community/common/green/check
 */
export const toGreenCheck = (data: { text: string }) => {
  return request({
    url: `/web/community/common/green/check`,
    method: 'POST',
    data,
    domain: 'COMMUNITY'
  })
}

/**
 * 敏感词预审核
 * /web/community/common/sensitive-word/check
 */
export const toSensitiveWordCheck = (data: { text: string }) => {
  return request({
    url: `/web/community/common/sensitive-word/check`,
    method: 'POST',
    data,
    domain: 'COMMUNITY'
  })
}

/**
 * 发布评论
 * /web/community/comments
 */
export const toSubmitComment = (data: { contentId: string; commentContent: string; pid?: string }) => {
  return request({
    url: `/web/community/comments`,
    data,
    method: 'POST',
    domain: 'COMMUNITY'
  })
}

/**
 * @name: 发布动态
 * @property: data
 */
export const toContentLaunch = (data: AnyObject) => {
  return request({
    url: '/web/community/contents',
    method: 'POST',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取用户上次发布内容的圈子
 * /web/community/members/un-follow
 */
export const getLastGroup = () => {
  return request({
    url: '/web/community/groups/last-group',
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

//+++++++++++++++++++++++++++++++++++++++++++ 资讯首页 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 *  获取资讯类目
 * @returns
 */
export const getNewsCategory = (data: AnyObject) => {
  return request({
    url: '/web/pgc/types',
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

/**
 * 获取推荐列表 首页推荐+今日发布资讯列表
 */
export const getContentsRecommendList = (data: AnyObject) => {
  return request({
    url: '/web/pgc/contents/recommend-list',
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

/**
 * 获取资讯feed流
 */
export const getContentsFeedlist = (data: AnyObject) => {
  return request({
    url: '/web/pgc/contents/feed-list',
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

/**
 * 获取类目下的资讯列表
 * @param {*} params
 * @returns
 */
export const getNewsList = (data: AnyObject) => {
  return request({
    url: `/web/pgc/contents`,
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

//+++++++++++++++++++++++++++++++++++++++++++ 资讯详情 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * 获取咨询详情
 * @param {*} params
 * @returns
 */
export const getNewsDetail = (data: string) => {
  return request({
    url: `/web/pgc/contents/${data}`,
    method: 'GET',
    domain: 'NEWS'
  })
}

/**
 * 阅读资讯
 * @param {*} contentId
 * @returns
 */
export const toNewsRead = (contentId: string) => {
  return request({
    url: `/web/pgc/stats/read/${contentId}`,
    method: 'POST',
    domain: 'NEWS'
  })
}

/**
 * 分享资讯
 * @param {*} contentId
 * @returns
 */
export const toNewsShared = (contentId: string) => {
  return request({
    url: `/web/pgc/stats/share/${contentId}`,
    method: 'POST',
    domain: 'NEWS'
  })
}

/**
 * 获取推荐的资讯列表Id
 * @param {*} params
 * @returns
 */
export const getRecommendIDLists = (data: AnyObject) => {
  return request({
    url: '/api/v1/recommendation/recommendations',
    method: 'GET',
    data,
    domain: 'RECOMMEND'
  })
}

/**
 * 获取推荐的资讯列表
 * @param {*} params
 * @returns
 */
export const getRecommendLists = (data: AnyObject) => {
  return request({
    url: `/web/pgc/contents/page`,
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

/**
 * 批量获取文章阅读量
 * @param {*} params
 * @returns
 */
export const getReadingQuantity = (data: { contentIds: string }) => {
  return request({
    url: '/web/pgc/contents/content-read-number',
    method: 'GET',
    data,
    domain: 'NEWS'
  })
}

//+++++++++++++++++++++++++++++++++++++++++++ 圈子首页 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * 获取圈子详情
 * /web/community/groups/{id}
 * @param {*} groupId
 */
export const getGroupDetail = (groupId: string) => {
  return request({
    url: `/web/community/groups/${groupId}`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 获取圈子的用户
 * /web/community/groups/{groupId}/members
 * @param {*} groupId
 */
export const getMemberList = (groupId: string, data: AnyObject) => {
  return request({
    url: `/web/community/groups/${groupId}/members`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取圈子类型列表
 * /web/community/group-types
 */
export const getGroupTypes = () => {
  return request({
    url: '/web/community/group-types',
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 圈子关注状态
 * /web/community/groups/follow-status
 */
export const getGroupFollowStatus = (data: { groupIds: string }) => {
  return request({
    url: '/web/community/groups/follow-status',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 提交入圈审批
 * /web/community/groups/group-approval-records
 */
export const checkSubmitApproval = (data: { groupId: string; applyReason: string }) => {
  return request({
    url: '/web/community/groups/group-approval-records',
    method: 'POST',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取某人圈子列表
 * /web/community/groups/{accountId}/list
 */
export const getGroupList = (accountId: string, data: { pageNo: number }) => {
  return request({
    url: `/web/community/groups/${accountId}/list`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取他人发布的内容列表
 * /web/community/contents/accounts/{userId}
 */
export const getContentList = (userId: string, data: object) => {
  return request({
    url: `/web/community/contents/accounts/${userId}`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取用户的关注、粉丝列表
 * 关注列表： /web/community/members/{accountId}/follower
 * 粉丝列表： /web/community/members/{accountId}/fans
 * @params {*} accountId
 */
export const getFollowList = (accountId: string, type: string, data: AnyObject) => {
  const url = type === 'follow' ? `/web/community/members/${accountId}/follower` : `/web/community/members/${accountId}/fans`
  return request({
    url,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * @name: 移出圈子
 * @property: accountId 用户id
 * @property: groupId 圈子id
 */
export const removeUser = (data: { accountId: string; groupId: string }) => {
  return request({
    url: `/web/community/groups/group-members?accountId=${data.accountId}&groupId=${data.groupId}`,
    method: 'DELETE',
    domain: 'COMMUNITY'
  })
}

/**
 * @name: 圈主加圈审核-驳回
 * @property:
 */
export const toRejected = (data: unknown) => {
  return request({
    url: '/web/community/approval/group-approval-records/rejected',
    method: 'PUT',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * @name: 加圈审核列表
 * @property:
 */
export const getGroupApprovalRecords = (data: AnyObject) => {
  return request({
    url: '/web/community/approval/group-approval-records',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * @name: 圈主加圈审核-通过
 * @property:
 */
export const toApproved = (data: AnyObject) => {
  return request({
    url: '/web/community/approval/group-approval-records/approved',
    method: 'PUT',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * @name: 我的入圈申请记录
 * @property:
 */
export const getApprovalRecord = (data: AnyObject) => {
  return request({
    url: '/web/community/groups/group-approval-records/mine',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

//+++++++++++++++++++++++++++++++++++++++++++ 话题 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * 话题详情
 * /web/community/topics/{id}
 * @param {*} id
 */
export const getTopicsDetail = (id: string) => {
  return request({
    url: `/web/community/topics/${id}`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

/**
 * 用户关注话题
 * /web/community/topics/members/{accountId}/follow
 * @param {*} accountId
 */
export const getFollowTopic = (accountId: string, topicId: string) => {
  return request({
    url: `/web/community/topics/members/${accountId}/follow?topicId=${topicId}`,
    method: 'PUT',
    domain: 'COMMUNITY'
  })
}

/**
 * 用户取消关注话题
 * /web/community/topics/members/{accountId}/unfollow
 * @param {*} accountId
 */
export const setUnfollowTopic = (accountId: string, topicId: string) => {
  return request({
    url: `/web/community/topics/members/${accountId}/unfollow?topicId=${topicId}`,
    method: 'PUT',
    domain: 'COMMUNITY'
  })
}

/**
 * 上传图片
 * /web/community/common/files/images
 * @param {}} data
 */
export const toFileUpload = (data: AnyObject) => {
  return uploadRequest({
    url: '/web/community/common/files/images',
    method: 'POST',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 查询用户关注的话题
 * /web/community/topics/members/{accountId}
 * @param {*} accountId
 */
export const getMyTopic = (accountId: string, data: { pageNo: number; pageSize: number }) => {
  return request({
    url: `/web/community/topics/members/${accountId}`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 获取我发布的内容列表
 * /web/community/contents/accounts/mine
 * @param {*} params
 */
export const getMyContentList = (data: { pageNo: number; like: boolean }) => {
  return request({
    url: '/web/community/contents/accounts/mine',
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 我的评论列表
 * /web/community/comments/accounts/mine
 */
export const getMyCommentList = (data: { pageNo: number; like: boolean }) => {
  return request({
    url: `/web/community/comments/accounts/mine`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 删除我发布的内容
 * /web/community/contents/{id}
 */
export const deleteContent = (id: string) => {
  return request({
    url: `/web/community/contents/${id}`,
    method: 'DELETE',
    domain: 'COMMUNITY'
  })
}

/**
 * 删除我发布的评论
 * /web/community/contents/{id}
 */
export const deleteComment = (id: string) => {
  return request({
    url: `/web/community/comments/${id}`,
    method: 'DELETE',
    domain: 'COMMUNITY'
  })
}

/**
 * 内容查看驳回原因
 * /web/community/contents/{id}/reject-reason
 * @param {*} id
 */
export const getContentsReject = (id: string) => {
  return request({
    url: `/web/community/contents/${id}/reject-reason`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}
/**
 * 评论查看驳回原因
 * /web/community/comments/{id}/reject-reason
 * @param {*} id
 */
export const getCommentsReject = (id: string) => {
  return request({
    url: `/web/community/comments/${id}/reject-reason`,
    method: 'GET',
    domain: 'COMMUNITY'
  })
}

//+++++++++++++++++++++++++++++++++++++++++++ 投票 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * 查询单个内容选项结果
 * /web/community/contents/option/${contentId}
 * @param {*} contentId
 */
export const getSingleVote = (data: { contentId: string }) => {
  return request({
    url: `/web/community/contents/option`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 查询多个内容选项结果
 * /web/community/contents/option/${contentIds}
 * @param {*} contentIds
 */
export const getMultiVote = (data: { contentIds: string }) => {
  return request({
    url: `/web/community/contents/options`,
    method: 'GET',
    domain: 'COMMUNITY',
    data
  })
}

/**
 * 查询多个内容选项结果
 * /web/community/contents/${contentId}/options
 * @param {*} contentId
 */
export const getSubmitVote = (contentId: string, data: number[]) => {
  return request({
    url: `/web/community/contents/${contentId}/options`,
    method: 'POST',
    domain: 'COMMUNITY',
    data
  })
}
//+++++++++++++++++++++++++++++++++++++++++++ 勋章 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * 查询勋章墙(只包含一级分类以及下面的勋章)
 * /web/medal/my/findFirstCategoryMedalWall
 */
export const getCategoryMedalWall = (data: { accountId: string }) => {
  return request({
    url: '/web/medal/my/findFirstCategoryMedalWall',
    method: 'GET',
    domain: 'MEDAL',
    data
  })
}
/**
 * 查询单个勋章详情
 * /web/medal/my/getUserMedalDetail
 */
export const getMedalDetails = (data: { medalId: string; accountId: string }) => {
  return request({
    url: '/web/medal/my/getUserMedalDetail',
    method: 'GET',
    domain: 'MEDAL',
    data
  })
}
/**
 * 查询当前用户的勋章
 * /web/medal/my/findLocalUserMedal
 */
export const toFindLocalUserMedal = () => {
  return request({
    url: '/web/medal/my/findLocalUserMedal',
    method: 'GET',
    domain: 'MEDAL'
  })
}
/**
 * 查询其他用户的勋章
 * /web/medal/my/findUserMedal
 */
export const toFindUserMedal = (data: { accountId: string }) => {
  return request({
    url: '/web/medal/my/findUserMedal',
    method: 'GET',
    domain: 'MEDAL',
    data
  })
}
