import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Shipment, ShipmentProps } from "@/domain/core/enterprise/entities/shipment";

export function makeShipment(
  override: Partial<ShipmentProps> = {},
  id?: UniqueEntityID
) {
  const shipment = Shipment.create({
    recipientId: new UniqueEntityID(),
    courierId: new UniqueEntityID(),
    ...override,
  }, id)

  return shipment
}