import { DomainEvent } from "@/core/events/domain-event";
import { Shipment } from "../entities/shipment";
import { Recipient } from "../entities/recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class ShipmentStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date
  public shipment: Shipment
  public recipientId: UniqueEntityID
  
  constructor(shipment: Shipment, recipientId: UniqueEntityID) {
    this.shipment = shipment
    this.recipientId = recipientId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.shipment.id
  }
}