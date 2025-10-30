import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch nearby shipments for courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let shipmentFactory: ShipmentFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, ShipmentFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /couriers/me/shipments/nearby', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const recipient = await recipientFactory.makePrismaRecipient({
      location: Location.create({
        address: 'Avenida Atlântica, 1702 - Copacabana, Rio de Janeiro, RJ',
        latitude: -22.971964,
        longitude: -43.182553,
      }),
    })
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/couriers/me/shipments/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        maxDistanceInKm: 26,
        courierLatitude: -22.74658,
        courierLongitude: -43.182553,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shipments: expect.arrayContaining([
        expect.objectContaining({
          id: shipment.id.toString(),
          statusShipment: shipment.statusShipment,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          recipientId: recipient.id.toString(),
          recipientName: recipient.name,
          recipientAddress: recipient.location.address,
          recipientLatitude: recipient.location.latitude.toString(),
          recipientLongitude: recipient.location.longitude.toString(),

          courierId: courier.id.toString(),
          courierName: courier.name,
        }),
      ]),
    })
  })
})
