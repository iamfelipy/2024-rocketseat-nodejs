import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminFactory } from 'test/factories/make-admin'
import { UserRole } from '@/core/enums/enum-user-role'
import { CourierFactory } from 'test/factories/make-courier'

describe('Create courier (E2E)', () => {
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
  test('[POST] /couriers', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jose',
        cpf: '12345678214',
        address: '777 Main St',
        latitude: 42.7128,
        longitude: -73.006,
        password: '99988833322',
      })

    expect(response.statusCode).toBe(201)

    const courierOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '12345678214',
      },
    })

    expect(courierOnDatabase).toBeTruthy()
  })
  test('[POST] /couriers - should return 403 if user is not admin', async () => {
    const nonAdmin = await adminFactory.makePrismaAdmin({
      roles: [UserRole.COURIER],
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Maria',
        cpf: '12345678215',
        address: '888 Main St',
        latitude: 43.7128,
        longitude: -72.006,
        password: '11122233344',
      })

    expect(response.statusCode).toBe(403)

    const courierOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '12345678215',
      },
    })

    expect(courierOnDatabase).toBeFalsy()
  })
  test('[POST] /couriers - should return 409 if courier already exists', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    // Create recipient with cpf that will be duplicated
    await courierFactory.makePrismaCourier({
      cpf: '12345678216',
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Duplicate Recipient',
        cpf: '12345678216',
        address: '2000 Main St',
        latitude: 46.7128,
        longitude: -69.006,
        password: 'anotherpassword',
      })

    expect(response.statusCode).toBe(409)
  })
})
