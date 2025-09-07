import { EventHandler } from "@/core/events/events.handler";
import { RecipientsRepository } from "@/domain/core/application/repositories/recipients-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { ShipmentStatusChangedEvent } from "@/domain/core/enterprise/events/shipment-status-changed-event";

export class OnShipmentStatusChanged implements EventHandler {
  constructor(
    private recipientsRepository:RecipientsRepository, 
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }
  
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendShipmentStatusChangedNotification.bind(this),
      ShipmentStatusChangedEvent.name
    )
  }

  private async sendShipmentStatusChangedNotification({
    shipment,
    recipientId
  }: ShipmentStatusChangedEvent) {
    const recipient = await this.recipientsRepository.findById(recipientId.toString())

    if(recipient) {
      await this.sendNotification.execute({
        recipientId: recipientId.toString(),
        title: `Atualização: sua encomenda está agora como "${shipment.statusShipment}"`,
        content: `Olá ${recipient.name}, o status da sua encomenda foi alterado para "${shipment.statusShipment}".`
      })
    }
  }
}