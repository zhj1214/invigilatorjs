import { request } from './request'
// 获取问答列表
export const getAskEveryoneList = (itemId: string, data: { pageNo: number; pageSize: number; createEndTime?: unknown }): Promise<PageListInfo<Qa.QuestionItem>> => {
  return request({
    url: `/web/questions/${itemId}/questions`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 获取问答详情
export const getAskEveryoneDetail = (id: string, data: { pageNo: number; pageSize: number; createEndTime?: unknown }) => {
  return request({
    url: `/web/questions/${id}/question-answers`,
    method: 'GET',
    domain: 'MALL',
    data
  })
}
// 发布问题
export const publishQuestion = (data: AnyObject) => {
  return request({
    url: `/web/questions/commit`,
    method: 'POST',
    domain: 'MALL',
    data
  })
}
// 回答问题
export const answerPublished = (data: AnyObject) => {
  return request({
    url: `/web/questions/user/answer`,
    method: 'POST',
    domain: 'MALL',
    data
  })
}
// 判断是否能回答
export const answerJudge = (id: string) => {
  return request({
    url: `/web/questions/${id}/judge-answer`,
    method: 'GET',
    domain: 'MALL'
  })
}
