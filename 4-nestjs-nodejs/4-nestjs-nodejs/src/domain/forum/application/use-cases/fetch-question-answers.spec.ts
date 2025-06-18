import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    // system under the test
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const author = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(author)

    const answer1 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: author.id,
    })
    const answer2 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: author.id,
    })

    inMemoryAnswersRepository.create(answer1)
    inMemoryAnswersRepository.create(answer2)

    const attachment1 = makeAttachment({
      title: 'Some attachment',
    })
    const attachment2 = makeAttachment({
      title: 'Some attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment1)
    inMemoryAttachmentsRepository.items.push(attachment2)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer1.id,
        attachmentId: attachment1.id,
      }),
    )

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer2.id,
        attachmentId: attachment2.id,
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(2)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          content: answer1.content,
          attachments: [
            expect.objectContaining({
              title: attachment1.title,
            }),
          ],
        }),
        expect.objectContaining({
          author: 'John Doe',
          content: answer2.content,
          attachments: [
            expect.objectContaining({
              title: attachment2.title,
            }),
          ],
        }),
      ]),
    )
  })
  it('should be able to fetch paginated question answers', async () => {
    const author = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(author)

    for (let i = 1; i <= 25; i++) {
      const answer = makeAnswer({
        questionId: new UniqueEntityID('question-1'),
        content: `Answer ${i}`,
        authorId: author.id,
      })

      inMemoryAnswersRepository.create(answer)

      const attachment = makeAttachment({
        title: `Attachment for Answer ${i}`,
      })

      inMemoryAttachmentsRepository.items.push(attachment)

      inMemoryAnswerAttachmentsRepository.items.push(
        makeAnswerAttachment({
          answerId: answer.id,
          attachmentId: attachment.id,
        }),
      )
    }

    const firstPage = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(firstPage.value?.answers).toHaveLength(20)
    expect(firstPage.value?.answers[0]).toEqual(
      expect.objectContaining({
        content: 'Answer 25',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Attachment for Answer 25',
          }),
        ],
      }),
    )

    const secondPage = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(secondPage.value?.answers).toHaveLength(5)
    expect(secondPage.value?.answers[0]).toEqual(
      expect.objectContaining({
        content: 'Answer 5',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Attachment for Answer 5',
          }),
        ],
      }),
    )
  })
})
