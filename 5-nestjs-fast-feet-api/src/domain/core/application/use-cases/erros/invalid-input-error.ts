import { UseCaseError } from '@/core/erros/use-case-error'

export class InvalidInputError extends Error implements UseCaseError {
  constructor() {
    super('Input provided is invalid.')
  }
}
