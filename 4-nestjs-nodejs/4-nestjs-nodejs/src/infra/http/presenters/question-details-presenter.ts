import { AttachmentPresenter } from './attachment-presenter'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP(QuestionDetails: QuestionDetails) {
    return {
      id: QuestionDetails.questionId.toString(),
      authorId: QuestionDetails.authorId.toString(),
      author: QuestionDetails.author,
      title: QuestionDetails.title,
      content: QuestionDetails.content,
      slug: QuestionDetails.slug,
      bestAnswerId: QuestionDetails.bestAnswerId?.toString(),
      attachments: QuestionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: QuestionDetails.createdAt,
      updatedAt: QuestionDetails.updatedAt,
    }
  }
}
