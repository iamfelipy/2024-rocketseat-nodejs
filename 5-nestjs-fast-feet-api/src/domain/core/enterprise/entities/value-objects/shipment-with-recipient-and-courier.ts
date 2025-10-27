import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { ValueObject } from '@/core/entities/value-object'

export interface ShipmentWithCourierAndRecipientProps {
  id: UniqueEntityID

  statusShipment: ShipmentStatus
  pickupDate?: Date | null
  deliveryDate?: Date | null
  returnedDate?: Date | null

  recipientId: UniqueEntityID
  recipientName: string
  courierId?: UniqueEntityID | null
  courierName?: string

  createdAt: Date
  updatedAt?: Date | null
}

// shipment → mais usado para remessas, transporte de mercadorias.
export class ShipmentWithCourierAndRecipient extends ValueObject<ShipmentWithCourierAndRecipientProps> {
  get id() {
    return this.props.id
  }

  get statusShipment() {
    return this.props.statusShipment
  }

  get recipientId() {
    return this.props.recipientId
  }

  get recipient() {
    return this.props.recipientName
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  get returnedDate() {
    return this.props.returnedDate
  }

  get courierId() {
    return this.props.courierId
  }

  get courier() {
    return this.props.courierName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ShipmentWithCourierAndRecipientProps) {
    return new ShipmentWithCourierAndRecipient(props)
  }
}
