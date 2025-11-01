import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Optional } from '@/core/types/optional'
import { ShipmentNotAssignedToCourierError } from '../../application/use-cases/erros/shipment-not-assigned-to-courier-error'
import { ShipmentNotInCorrectStatusError } from '../../application/use-cases/erros/shipment-not-in-correct-status-error'
import { PhotoRequiredForDeliveryError } from '../../application/use-cases/erros/photo-required-for-delivery-error'
import { left, right } from '@/core/either'
import { ShipmentAttachmentList } from './shipment-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ShipmentStatusChangedEvent } from '../events/shipment-status-changed-event'

export interface ShipmentProps {
  statusShipment: ShipmentStatus
  recipientId: UniqueEntityID
  pickupDate?: Date | null
  deliveryDate?: Date | null
  returnedDate?: Date | null
  attachments: ShipmentAttachmentList
  courierId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

// shipment → mais usado para remessas, transporte de mercadorias.
export class Shipment extends AggregateRoot<ShipmentProps> {
  static isShipmentStatus(status: string): status is ShipmentStatus {
    return Object.values(ShipmentStatus).includes(status as ShipmentStatus)
  }

  get statusShipment() {
    return this.props.statusShipment
  }

  set statusShipment(statusShipment) {
    this.addDomainEvent(new ShipmentStatusChangedEvent(this, this.recipientId))
    this.props.statusShipment = statusShipment
    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId) {
    this.props.recipientId = recipientId
    this.touch()
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  set pickupDate(date) {
    this.props.pickupDate = date
    this.touch()
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  set deliveryDate(date) {
    this.props.deliveryDate = date
    this.touch()
  }

  get returnedDate() {
    return this.props.returnedDate
  }

  set returnedDate(date) {
    this.props.returnedDate = date
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments) {
    this.props.attachments = attachments
    this.touch()
  }

  get courierId() {
    return this.props.courierId
  }

  set courierId(id) {
    this.props.courierId = id
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      ShipmentProps,
      'createdAt' | 'statusShipment' | 'attachments'
    >,
    id?: UniqueEntityID,
  ) {
    const shipment = new Shipment(
      {
        ...props,
        statusShipment:
          props.statusShipment ?? ShipmentStatus.RECEIVED_FIRST_TIME_AT_CARRIER,
        attachments: props.attachments ?? new ShipmentAttachmentList(),
        createdAt: new Date(),
      },
      id,
    )

    const isNewShipment = !id

    if (isNewShipment) {
      shipment.addDomainEvent(
        new ShipmentStatusChangedEvent(shipment, shipment.recipientId),
      )
    }

    return shipment
  }
}
