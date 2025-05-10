import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { CommentOnAnswerEvent } from '@/domain/forum/enterprise/events/comment-on-answer-event'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnCommentOnAnswer implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCommentOnAnswerNotification.bind(this),
      CommentOnAnswerEvent.name,
    )
  }

  private async sendNewCommentOnAnswerNotification({
    answerComment,
  }: CommentOnAnswerEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    const isAuthorDifferent =
      answerComment.authorId.toString() !== answer?.authorId.toString()

    if (answer && isAuthorDifferent) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: `Novo comentario na resposta "${answer.excerpt
          .substring(0, 40)
          .concat('...')}"`,
        content: answerComment.content.substring(0, 40).concat('...'),
      })
    }
  }
}
