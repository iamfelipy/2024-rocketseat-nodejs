import { UseCaseError } from "@/core/erros/use-case-error";

export class AdminAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Admin ${identifier} already exists.`)
  }
}