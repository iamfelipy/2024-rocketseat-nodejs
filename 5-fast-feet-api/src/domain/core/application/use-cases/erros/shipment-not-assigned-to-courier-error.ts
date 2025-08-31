import { UseCaseError } from "@/core/erros/use-case-error";

export class ShipmentNotAssignedToCourierError extends Error implements UseCaseError {
  constructor() {
    super("Shipment is not assigned to the courier.")
  }
} 