import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    // system under the test
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a Answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('Answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)
    await sut.execute({
      answerId: 'Answer-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a Answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('Answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        answerId: 'Answer-1',
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
