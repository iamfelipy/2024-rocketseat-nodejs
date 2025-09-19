import { UseCaseError } from "@/core/erros/use-case-error";

export class CourierAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Courier ${identifier} already exists.`)
  }
}