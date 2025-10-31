import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DatabaseModule } from '@/infra/database/database.module'
import { CourierFactory } from 'test/factories/make-courier'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtService } from '@nestjs/jwt'

describe('Change password (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let bcryptHasher: BcryptHasher
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, BcryptHasher, JwtService],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    bcryptHasher = moduleRef.get(BcryptHasher)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /users/:userId/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const courier = await courierFactory.makePrismaCourier({
      password: await bcryptHasher.hash('old-password'),
    })

    const response = await request(app.getHttpServer())
      .patch(`/users/${courier.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        newPassword: 'new-password',
      })

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.user.findUnique({
      where: {
        id: courier.id.toString(),
      },
    })

    const isPasswordEqual = await bcryptHasher.compare(
      'new-password',
      // eslint-disable-next-line
      courierOnDatabase!.password,
    )

    expect(isPasswordEqual).toBe(true)
  })
})
