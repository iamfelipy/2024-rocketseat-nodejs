import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ShipmentAttachmentProps {
  shipmentId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class ShipmentAttachment extends Entity<ShipmentAttachmentProps> {
  get shipmentId() {
    return this.props.shipmentId
  }
  
  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: ShipmentAttachmentProps, id?: UniqueEntityID) {
    const photoAttachment = new ShipmentAttachment(props, id)

    return photoAttachment
  }
}
