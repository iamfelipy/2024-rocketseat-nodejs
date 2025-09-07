import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments";
import { describe, expect, it, vi, beforeEach, MockInstance } from "vitest";
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "@/test/repositories/in-memory-notifications-repository";
import { InMemoryShipmentAttachmentsRepository } from "@/test/repositories/in-memory-shipment-attachments-repository";
import { OnShipmentStatusChanged } from "./on-shipment-status-changed";
import { makeShipment } from "@/test/factories/make-shipment";
import { makeRecipient } from "@/test/factories/make-recipient";
import { ShipmentStatus } from "@/core/enums/shipment-status";
import { waitFor } from "@/test/utils/wait-for";
import { DomainEvents } from "@/core/events/domain-events";


let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (request: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Shipment status changed', () => {
  beforeEach(() => {
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnShipmentStatusChanged(
      inMemoryRecipientsRepository,
      sendNotificationUseCase
    )
  })
  it('should be able to send a notification when a shipment status has changed', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const shipment = makeShipment({
      recipientId: recipient.id
    })
    inMemoryShipmentsRepository.items.push(shipment)

    shipment.statusShipment = ShipmentStatus.AWAITING_PICKUP
    
    inMemoryShipmentsRepository.save(shipment)
    
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    }, 1000)
  })
})