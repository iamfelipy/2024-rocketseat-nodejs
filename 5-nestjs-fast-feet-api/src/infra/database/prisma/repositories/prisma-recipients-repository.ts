import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
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

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = await this.prisma.user.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        roles: {
          has: 'RECIPIENT',
        },
      },
    })

    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
