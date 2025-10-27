import { UserRole } from '@/core/enums/enum-user-role'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch shipments (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let shipmentFactory: ShipmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        CourierFactory,
        RecipientFactory,
        ShipmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /shipments', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const courier = await courierFactory.makePrismaCourier({
      name: 'Jose',
    })
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'Anderson',
    })
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .get('/shipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shipments: expect.arrayContaining([
        expect.objectContaining({
          id: shipment.id.toString(),
          courierName: 'Jose',
          recipientName: 'Anderson',
        }),
      ]),
    })
  })

  test('[GET] /shipments - should return 403 if user is not admin', async () => {
    const nonAdmin = await adminFactory.makePrismaAdmin({
      roles: [UserRole.COURIER],
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/shipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
