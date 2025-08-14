import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface PhotoAttachmentProps {
  photoId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class PhotoAttachment extends Entity<PhotoAttachmentProps> {
  get photoId() {
    return this.props.photoId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: PhotoAttachment, id?: UniqueEntityID) {
    const photoAttachment = new PhotoAttachment(props, id)

    return photoAttachment
  }
}
