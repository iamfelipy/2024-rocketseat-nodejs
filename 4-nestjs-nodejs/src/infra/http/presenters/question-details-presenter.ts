import { AttachmentPresenter } from './attachment-presenter'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      id: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
