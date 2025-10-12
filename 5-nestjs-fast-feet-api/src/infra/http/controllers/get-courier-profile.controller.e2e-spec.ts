import { UserRole } from '@/core/enums/enum-user-role'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('get courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[GET] /couriers/me', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get(`/couriers/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      courier: expect.objectContaining({
        id: courier.id.toString(),
      }),
    })
  })
})
