import { beforeEach, describe, expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      content: 'Nova resposta',
    })

    expect(answer.content).toBeTruthy()
    expect(answer.content).toEqual('Nova resposta')
  })
})
