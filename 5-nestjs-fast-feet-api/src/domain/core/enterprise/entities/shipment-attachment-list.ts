import { WatchedList } from "@/core/entities/watched-list";
import { ShipmentAttachment } from "./shipment-attachment";

export class ShipmentAttachmentList extends WatchedList<ShipmentAttachment> {
  compareItems(a: ShipmentAttachment, b: ShipmentAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}