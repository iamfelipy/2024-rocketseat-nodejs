import { UserRole } from '@/core/enums/enum-user-role'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('edit courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[PUT] /couriers/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const courier = await courierFactory.makePrismaCourier({
      name: 'John Smith',
      location: Location.create({
        address: '123 Flower Street',
        latitude: -23.55052,
        longitude: -46.633308,
      }),
    })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/couriers/${courier.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jane Doe',
        roles: [UserRole.COURIER],
        address: '456 Rose Avenue',
        latitude: -22.9068,
        longitude: -43.1729,
      })

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.user.findUnique({
      where: {
        id: courier.id.toString(),
        name: 'Jane Doe',
        address: '456 Rose Avenue',
        latitude: -22.9068,
        longitude: -43.1729,
      },
    })

    expect(courierOnDatabase).toBeTruthy()
  })
})
