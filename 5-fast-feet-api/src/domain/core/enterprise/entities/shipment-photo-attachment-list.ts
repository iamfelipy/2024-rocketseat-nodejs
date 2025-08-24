import { WatchedList } from "@/core/entities/watched-list";
import { ShipmentPhotoAttachment } from "./shipment-photo-attachment";

export class ShipmentPhotoAttachmentList extends WatchedList<ShipmentPhotoAttachment> {
  compareItems(a: ShipmentPhotoAttachment, b: ShipmentPhotoAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}