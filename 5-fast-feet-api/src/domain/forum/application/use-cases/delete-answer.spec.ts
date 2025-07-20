import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  it('should be able to delete a answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer of the other author', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    await expect(() => {
      return sut.execute({
        answerId: 'answer-01',
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
