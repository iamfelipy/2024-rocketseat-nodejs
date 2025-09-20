import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer1 = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 01',
    })
    const answer2 = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 02',
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })
    const attachment2 = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer1.id,
      attachmentId: attachment1.id,
    })
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer2.id,
      attachmentId: attachment2.id,
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer 01',
          author: 'John Doe',
          attachments: [expect.objectContaining({ title: 'Some attachment' })],
        }),
        expect.objectContaining({
          content: 'Answer 02',
          author: 'John Doe',
          attachments: [expect.objectContaining({ title: 'Some attachment' })],
        }),
      ]),
    })
  })
})
