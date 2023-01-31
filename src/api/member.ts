import { request } from './request'

// 会员权益列表
export const getVipRights: Member.GetVipRights = (data: { systemId: string; levelId: string; pageNo: number; pageSize: number }) => {
  return request({
    url: '/web/member/account/rights',
    method: 'GET',
    domain: 'VIP',
    data
  })
}

// 任务列表查询
export const getUserTask: Member.GetUserTask = (data: { taskTypeId: string }) => {
  return request({
    url: '/web/task/tasks/records/task-type',
    method: 'GET',
    domain: 'TASK',
    data,
    needTerminal: true
  })
}

// 获取某体系下所有会员等级
export const getLevelList: Member.GetLevelList = (systemId: string) => {
  return request({
    url: '/web/member/account/levels/enable-list',
    method: 'GET',
    domain: 'VIP',
    data: { systemId }
  })
}

// 获取某体系下所有权益
export const getAllGrade: Member.GetAllGrade = (systemId: string) => {
  return request({
    url: `/web/member/account/by-system/${systemId}`,
    method: 'GET',
    domain: 'VIP'
  })
}

// 根据任务场景查询任务类型
export const getTaskType: Member.GetTaskType = (data: { taskSceneCode: string }) => {
  return request({
    url: '/web/task/tasks/task-types',
    method: 'GET',
    domain: 'TASK',
    data
  })
}
