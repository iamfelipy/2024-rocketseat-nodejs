import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUSeCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUSeCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUSeCase(inMemoryQuestionsRepository)
  })
  it('should be able to edit a question', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      title: 'edit title',
      content: 'edit content',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'edit title',
      content: 'edit content',
    })
  })
  it('should not be able to edit a question of other author', async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityID('author-01') },
      new UniqueEntityID('question-01'),
    )

    inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: 'question-01',
      authorId: 'author-02',
      title: 'edit title',
      content: 'edit content',
    })

    await expect(
      await sut.execute({
        questionId: 'question-01',
        authorId: 'author-02',
        title: 'edit title',
        content: 'edit content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
