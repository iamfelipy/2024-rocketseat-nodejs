import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Optional } from '@/core/types/optional'
import { ShipmentPhotoAttachment } from './shipment-photo-attachment'

export interface ShipmentProps {
  statusShipment: ShipmentStatus
  recipientId: UniqueEntityID
  pickupDate?: Date | null
  deliveryDate?: Date | null
  returnedDate?: Date | null
  photo?: ShipmentPhotoAttachment | null
  assignedCourierId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

// shipment → mais usado para remessas, transporte de mercadorias.
export class Shipment extends Entity<ShipmentProps> {
  get statusShipment() {
    return this.props.statusShipment
  }

  set statusShipment(statusShipment) {
    this.props.statusShipment = statusShipment
    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
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

  get photo() {
    return this.props.photo
  }

  set photo(photo) {
    this.props.photo = photo
    this.touch()
  }

  get assignedCourierId() {
    return this.props.assignedCourierId
  }

  set assignedCourierId(id) {
    this.props.assignedCourierId = id
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

  markAsDelivered(photo: ShipmentPhotoAttachment, courierId: UniqueEntityID) {
    if (this.assignedCourierId !== courierId) {
      throw new Error('Você não pode entregar essa encomenda.')
    }
    if (!photo) {
      throw new Error('Foto obrigatória para entrega.')
    }

    this.props.photo = photo
    this.props.statusShipment = ShipmentStatus.DELIVERED
    this.props.deliveryDate = new Date()
  }

  static create(
    props: Optional<ShipmentProps, 'createdAt' | 'statusShipment'>,
    id?: UniqueEntityID,
  ) {
    const shipment = new Shipment(
      {
        ...props,
        statusShipment: props.statusShipment ?? ShipmentStatus.RECEIVED_FIRST_TIME_AT_CARRIER,
        createdAt: new Date(),
      },
      id,
    )

    return shipment
  }
}
