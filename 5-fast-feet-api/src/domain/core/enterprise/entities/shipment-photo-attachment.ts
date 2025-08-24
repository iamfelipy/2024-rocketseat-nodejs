import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface ShipmentPhotoAttachmentProps {
  shipmentId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class ShipmentPhotoAttachment extends Entity<ShipmentPhotoAttachmentProps> {
  get shipmentId() {
    return this.props.shipmentId
  }
  
  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: ShipmentPhotoAttachmentProps, id?: UniqueEntityID) {
    const photoAttachment = new ShipmentPhotoAttachment(props, id)

    return photoAttachment
  }
}
