import { UserRole } from '@/core/enums/enum-user-role'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch recipients (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /recipients', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: 'Jose',
      }),
      recipientFactory.makePrismaRecipient({
        name: 'Anderson',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({ name: 'Jose' }),
        expect.objectContaining({ name: 'Anderson' }),
      ]),
    })
  })

  test('[GET] /recipients - should return 403 if user is not admin', async () => {
    const nonAdmin = await adminFactory.makePrismaAdmin({
      roles: [UserRole.RECIPIENT],
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
