import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { ShipmentFactory } from 'test/factories/make-shipment'
import { DatabaseModule } from '../../database.module'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { ShipmentAttachmentFactory } from 'test/factories/make-shipment-attachment'
import { INestApplication } from '@nestjs/common'
import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'

describe('Prisma Shipments Repository (E2E)', () => {
  let app: INestApplication
  let shipmentsRepository: ShipmentsRepository
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let shipmentFactory: ShipmentFactory
  let attachmentFactory: AttachmentFactory
  let shipmentAttachmentFactory: ShipmentAttachmentFactory
  let cacheRepository: CacheRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        RecipientFactory,
        CourierFactory,
        ShipmentFactory,
        AttachmentFactory,
        ShipmentAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    shipmentsRepository = moduleRef.get(ShipmentsRepository)
    recipientFactory = moduleRef.get(RecipientFactory)
    courierFactory = moduleRef.get(CourierFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    shipmentAttachmentFactory = moduleRef.get(ShipmentAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })
  it('should cache shipment details.', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const courier = await courierFactory.makePrismaCourier()
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment.id,
      shipmentId: shipment.id,
    })

    const shipmentId = shipment.id.toString()

    const shipmentDetails =
      await shipmentsRepository.findDetailsById(shipmentId)

    const cached = await cacheRepository.get(`shipment:${shipmentId}:details`)

    expect(cached).toEqual(JSON.stringify(shipmentDetails))
  })
  it('should return cached shipment details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const courier = await courierFactory.makePrismaCourier()
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment.id,
      shipmentId: shipment.id,
    })

    const shipmentId = shipment.id.toString()

    await cacheRepository.set(
      `shipment:${shipmentId}:details`,
      JSON.stringify({
        empty: true,
      }),
    )

    const shipmentDetails =
      await shipmentsRepository.findDetailsById(shipmentId)

    expect(shipmentDetails).toEqual({ empty: true })
  })
  it('should reset shipment details cache when saving the shipment', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const courier = await courierFactory.makePrismaCourier()
    const shipment = await shipmentFactory.makePrismaShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    await shipmentAttachmentFactory.makePrismaShipmentAttachment({
      attachmentId: attachment.id,
      shipmentId: shipment.id,
    })

    const shipmentId = shipment.id.toString()

    await cacheRepository.set(
      `shipment:${shipmentId}:details`,
      JSON.stringify({ empty: true }),
    )

    await shipmentsRepository.save(shipment)

    const cached = await cacheRepository.get(`shipment:${shipmentId}:details`)

    expect(cached).toBeNull()
  })
})
