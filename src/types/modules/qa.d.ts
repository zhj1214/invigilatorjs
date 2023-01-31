/**
 * 问答类型声明
 */
declare namespace Qa {
  interface QuestionItem {
    answerVOList: AnswerVOList[]
    questionVO: QuestionVO
  }
  /**
   * 回答信息
   */
  interface AnswerVOList {
    answerId: string
    userName: string
    answerDetails: string
  }
  /**
   * 问题信息
   */
  interface QuestionVO {
    answerCount: number
    createTime: number
    itemId: string
    questionDetails: string
    questionId: string
    replyFlag: number
    showAnswerCount: number
    updateTime: number
    userAvatar: string
    userId: string
    userName: string
  }
}
