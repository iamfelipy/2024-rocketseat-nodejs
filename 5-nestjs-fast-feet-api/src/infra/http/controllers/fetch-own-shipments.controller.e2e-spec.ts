import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch shipments me (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let shipmentFactory: ShipmentFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        CourierFactory,
        ShipmentFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /shipments/me by courier', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const recipient = await recipientFactory.makePrismaRecipient()
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/shipments/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shipments: expect.arrayContaining([
        expect.objectContaining({
          id: shipment.id.toString(),
          courierId: courier.id.toString(),
        }),
      ]),
    })
  })
  test('[GET] /shipments/me by recipient', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: new UniqueEntityID(''),
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({
      sub: recipient.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/shipments/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shipments: expect.arrayContaining([
        expect.objectContaining({
          id: shipment.id.toString(),
          recipientId: recipient.id.toString(),
        }),
      ]),
    })
  })
})
