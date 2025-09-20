import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
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
