import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'
import { ShipmentAttachmentFactory } from 'test/factories/make-shipment-attachment'

describe('delete shipment', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
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
        ShipmentFactory,
        AttachmentFactory,
        ShipmentAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    shipmentAttachmentFactory = moduleRef.get(ShipmentAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[DELETE] /shipments/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const shipment = await shipmentFactory.makePrismaShipment({
      recipientId: recipient.id,
      courierId: new UniqueEntityID(''),
    })

    const shipmentId = shipment.id.toString()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment1.id,
      shipmentId: shipment.id,
    })
    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment2.id,
      shipmentId: shipment.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const shipmentOnDatabase = await prisma.shipment.findUnique({
      where: {
        id: shipmentId,
      },
    })

    expect(shipmentOnDatabase).toBeFalsy()

    const shipmentAttachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        shipmentId,
      },
    })

    expect(shipmentAttachmentsOnDatabase).toHaveLength(0)
  })
})
