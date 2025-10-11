import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit recipient Profile (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[PUT] /recipients/me', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Smith',
      location: Location.create({
        address: '123 Flower Street',
        latitude: -23.55052,
        longitude: -46.633308,
      }),
    })

    const accessToken = jwt.sign({ sub: recipient.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/recipients/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jane Doe',
        address: '456 Rose Avenue',
        latitude: -22.9068,
        longitude: -43.1729,
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.user.findUnique({
      where: {
        id: recipient.id.toString(),
        name: 'Jane Doe',
        address: '456 Rose Avenue',
        latitude: -22.9068,
        longitude: -43.1729,
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
