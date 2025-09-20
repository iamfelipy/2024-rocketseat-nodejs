import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'

export class PrismaRecipientsRepository implements RecipientsRepository {
  findById(id: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }

  findByCPF(cpf: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }

  create(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findMany(params: PaginationParams): Promise<Recipient[]> {
    throw new Error('Method not implemented.')
  }

  delete(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
