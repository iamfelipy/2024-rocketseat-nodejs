import { UseCaseError } from "@/core/erros/use-case-error";

export class NotAuthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Not authorized to perform this action.')
  }
}