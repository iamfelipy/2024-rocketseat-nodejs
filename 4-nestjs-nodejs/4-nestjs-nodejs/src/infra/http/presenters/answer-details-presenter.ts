import { AttachmentPresenter } from './attachment-presenter'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'

export class AnswerDetailsPresenter {
  static toHTTP(answerDetails: AnswerDetails) {
    return {
      id: answerDetails.answerId.toString(),
      authorId: answerDetails.authorId.toString(),
      questionId: answerDetails.questionId.toString(),
      author: answerDetails.author,
      content: answerDetails.content,
      attachments: answerDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: answerDetails.createdAt,
      updatedAt: answerDetails.updatedAt,
    }
  }
}
