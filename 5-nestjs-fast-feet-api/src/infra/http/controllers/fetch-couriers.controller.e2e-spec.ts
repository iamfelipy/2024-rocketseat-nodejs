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
import { CourierFactory } from 'test/factories/make-courier'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch couriers (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /couriers', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    await Promise.all([
      courierFactory.makePrismaCourier({
        name: 'Jose',
      }),
      courierFactory.makePrismaCourier({
        name: 'Anderson',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      couriers: expect.arrayContaining([
        expect.objectContaining({ name: 'Jose' }),
        expect.objectContaining({ name: 'Anderson' }),
      ]),
    })
  })

  test('[GET] /couriers - should return 403 if user is not admin', async () => {
    const nonAdmin = await adminFactory.makePrismaAdmin({
      roles: [UserRole.COURIER],
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
