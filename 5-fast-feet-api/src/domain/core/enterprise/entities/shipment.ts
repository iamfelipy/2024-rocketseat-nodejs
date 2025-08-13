import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Optional } from '@/core/types/optional'

export interface ShipmentProps {
  // Unique identifier for the shipment
  id: UniqueEntityID
  // Status of the shipment (e.g., pending, delivered, returned)
  statusShipment: ShipmentStatus
  // Unique identifier for the recipient
  recipientId: UniqueEntityID
  // Delivery address
  deliveryAddress: string
  // Latitude of the delivery address
  deliveryLatitude: number
  // Longitude of the delivery address
  deliveryLongitude: number
  // Pickup date
  pickupDate?: Date | null
  // Delivery date
  deliveryDate?: Date | null
  // Returned date
  returnedDate?: Date | null
  // URL of the delivery photo
  photoId?: UniqueEntityID | null
  // Unique identifier for the assigned courier
  assignedCourierId?: UniqueEntityID | null
  // Creation date
  createdAt: Date
  // Update date
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

  get deliveryAddress() {
    return this.props.deliveryAddress
  }

  get deliveryLatitude() {
    return this.props.deliveryLatitude
  }

  set deliveryLatitude(latitude: number) {
    this.props.deliveryLatitude = latitude
    this.touch()
  }

  get deliveryLongitude() {
    return this.props.deliveryLongitude
  }

  set deliveryLongitude(longitude: number) {
    this.props.deliveryLongitude = longitude
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

  get photoId() {
    return this.props.photoId
  }

  set photoId(photoId) {
    this.props.photoId = photoId
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

  markAsDelivered(photoId: UniqueEntityID, courierId: UniqueEntityID) {
    if (this.assignedCourierId !== courierId) {
      throw new Error('Você não pode entregar essa encomenda.')
    }
    if (!photoId) {
      throw new Error('Foto obrigatória para entrega.')
    }

    this.props.photoId = photoId
    this.props.statusShipment = ShipmentStatus.DELIVERED
    this.props.deliveryDate = new Date()
  }

  static create(
    props: Optional<
      ShipmentProps,
      | 'pickupDate'
      | 'deliveryDate'
      | 'returnedDate'
      | 'photoId'
      | 'assignedCourierId'
      | 'createdAt'
    >,
    id?: UniqueEntityID,
  ) {
    const shipment = new Shipment(
      {
        ...props,
        statusShipment:
          props.statusShipment ?? ShipmentStatus.RECEIVED_FIRST_TIME_AT_CARRIER,
        createdAt: new Date(),
      },
      id,
    )

    return shipment
  }
}
