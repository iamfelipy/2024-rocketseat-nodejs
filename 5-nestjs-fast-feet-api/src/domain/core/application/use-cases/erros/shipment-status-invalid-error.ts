import { UseCaseError } from "@/core/erros/use-case-error";

export class ShipmentStatusInvalidError extends Error implements UseCaseError {
  constructor() {
    super("Shipment status is invalid.")
  }
} 