import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'
import { ShipmentStatus } from '@/core/enums/shipment-status'
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
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'

describe('Edit Shipment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let shipmentFactory: ShipmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        AdminFactory,
        ShipmentFactory,
        CourierFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    adminFactory = moduleRef.get(AdminFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[PUT] /shipments/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient()

    const courier = await courierFactory.makePrismaCourier()

    const shipment = await shipmentFactory.makePrismaShipment({
      statusShipment: ShipmentStatus.RECEIVED_FIRST_TIME_AT_CARRIER,
      recipientId: recipient.id,
      pickupDate: new Date('2023-01-01T00:00:00Z'),
      returnedDate: new Date('2023-01-02T00:00:00Z'),
      courierId: courier.id,
    })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const updatedRecipient = await recipientFactory.makePrismaRecipient()

    const updatedCourier = await courierFactory.makePrismaCourier()

    const response = await request(app.getHttpServer())
      .put(`/shipments/${shipment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: ShipmentStatus.AWAITING_PICKUP,
        recipientId: updatedRecipient.id.toString(),
        pickupDate: new Date('2023-01-01T00:00:00Z'),
        returnedDate: new Date('2023-01-02T00:00:00Z'),
        courierId: updatedCourier.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const shipmentOnDatabase = await prisma.shipment.findUnique({
      where: {
        id: shipment.id.toString(),
        status: ShipmentStatus.AWAITING_PICKUP,
        recipientId: updatedRecipient.id.toString(),
        pickupDate: new Date('2023-01-01T00:00:00Z'),
        returnedDate: new Date('2023-01-02T00:00:00Z'),
        courierId: updatedCourier.id.toString(),
      },
    })

    expect(shipmentOnDatabase).toBeTruthy()
  })
})
