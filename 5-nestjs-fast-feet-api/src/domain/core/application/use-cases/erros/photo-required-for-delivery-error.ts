import { UseCaseError } from "@/core/erros/use-case-error";

export class PhotoRequiredForDeliveryError extends Error implements UseCaseError {
  constructor() {
    super("Photo is required for delivery confirmation.")
  }
} 