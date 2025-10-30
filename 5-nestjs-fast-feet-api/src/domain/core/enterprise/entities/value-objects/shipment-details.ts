import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'

export interface ShipmentDetailsProps {
  shipmentId: UniqueEntityID

  statusShipment: ShipmentStatus
  pickupDate?: Date | null
  deliveryDate?: Date | null
  returnedDate?: Date | null

  recipientId: UniqueEntityID
  recipientName: string

  courierId?: UniqueEntityID | null
  courierName?: string | null

  attachments: Attachment[]

  createdAt: Date
  updatedAt?: Date | null
}

// shipment → mais usado para remessas, transporte de mercadorias.
export class ShipmentDetails extends ValueObject<ShipmentDetailsProps> {
  get shipmentId() {
    return this.props.shipmentId
  }

  get statusShipment() {
    return this.props.statusShipment
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

  get recipientId() {
    return this.props.recipientId
  }

  get recipient() {
    return this.props.recipientName
  }

  get courierId() {
    return this.props.courierId
  }

  get courier() {
    return this.props.courierName
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ShipmentDetailsProps) {
    return new ShipmentDetails(props)
  }
}
