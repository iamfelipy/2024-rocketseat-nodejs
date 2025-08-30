import { PaginationParams } from '@/core/repositories/pagination-params'
import { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientsRepository {
  findById(id: string): Promise<Recipient | null>
  findByCPF(cpf: string): Promise<Recipient | null>
  create(recipient: Recipient): Promise<void>
  save(recipient: Recipient): Promise<void>
  findMany(params: PaginationParams): Promise<Recipient[]>
  delete(recipient: Recipient): Promise<void>
}
