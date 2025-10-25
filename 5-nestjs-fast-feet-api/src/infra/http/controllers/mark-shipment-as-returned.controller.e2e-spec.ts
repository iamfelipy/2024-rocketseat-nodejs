import { ShipmentStatus } from '@/core/enums/shipment-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'

describe('mark shipment as returned (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let shipmentFactory: ShipmentFactory
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ShipmentFactory,
        AdminFactory,
        CourierFactory,
        AttachmentFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /shipments/:id/mark-as-returned', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const courier = await courierFactory.makePrismaCourier()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .patch(`/shipments/${shipment.id.toString()}/mark-as-returned`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const shipmentOnDatabase = await prisma.shipment.findFirst({
      where: {
        id: shipment.id.toString(),
      },
    })

    expect(shipmentOnDatabase).toMatchObject({
      status: ShipmentStatus.RETURNED,
      returnedDate: expect.any(Date),
    })
  })
})
