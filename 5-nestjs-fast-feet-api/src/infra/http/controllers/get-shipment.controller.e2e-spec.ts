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
import { ShipmentAttachmentFactory } from 'test/factories/make-shipment-attachment'

describe('get shipment by admin (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let shipmentFactory: ShipmentFactory
  let attachmentFactory: AttachmentFactory
  let shipmentAttachmentFactory: ShipmentAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        RecipientFactory,
        CourierFactory,
        ShipmentFactory,
        AttachmentFactory,
        ShipmentAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    courierFactory = moduleRef.get(CourierFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    shipmentAttachmentFactory = moduleRef.get(ShipmentAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[GET] /shipments/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'joana',
    })
    const courier = await courierFactory.makePrismaCourier({
      name: 'pedro',
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const shipment = await shipmentFactory.makePrismaShipment({
      recipientId: recipient.id,
      courierId: courier.id,
    })

    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment.id,
      shipmentId: shipment.id,
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get(`/shipments/${shipment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shipment: expect.objectContaining({
        shipmentId: shipment.id.toString(),
        courierName: 'pedro',
        recipientName: 'joana',
        attachments: [
          expect.objectContaining({
            id: attachment.id.toString(),
            url: attachment.url,
          }),
        ],
      }),
    })
  })
})
