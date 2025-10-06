import { PaginationParams } from '@/core/repositories/pagination-params'
import { Courier } from '../../enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract findById(id: string): Promise<Courier | null>
  abstract findByCPF(cpf: string): Promise<Courier | null>
  abstract findMany(params: PaginationParams): Promise<Courier[]>
  abstract create(courier: Courier): Promise<void>
  abstract save(courier: Courier): Promise<void>
  abstract delete(courier: Courier): Promise<void>
}
