import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest'
import { OnCommentOnAnswer } from './on-comment-on-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { waitFor } from '@/test/utils/wait-for'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sendNoticationUseCase: SendNotificationUseCase

let sendNoticationUseCaseSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNoticationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNoticationUseCaseSpy = vi.spyOn(sendNoticationUseCase, 'execute')

    new OnCommentOnAnswer(inMemoryAnswersRepository, sendNoticationUseCase)
  })
  it('should send a notification when a user comments on an answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })
    const answerComment = makeAnswerComment({
      answerId: answer.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)
    await inMemoryAnswerCommentsRepository.create(answerComment)

    console.log(inMemoryAnswerCommentsRepository.items)
    console.log(inMemoryNotificationsRepository.items)
    console.log(sendNoticationUseCaseSpy)

    await waitFor(() => {
      expect(sendNoticationUseCaseSpy).toHaveBeenCalled()
    })
  })
  it('should not send a notification when the creator of the answer is the same as the creator of the comment', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
      authorId: new UniqueEntityID('author-1'),
    })
    const answerComment = makeAnswerComment({
      answerId: answer.id,
      authorId: new UniqueEntityID('author-1'),
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNoticationUseCaseSpy).not.toHaveBeenCalled()
    })
  })
})
