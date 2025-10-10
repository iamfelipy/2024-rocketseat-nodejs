import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouriersRepository } from '@/domain/core/application/repositories/courier-repository'
import { Courier } from '@/domain/core/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async findMany({ page }: PaginationParams): Promise<Courier[]> {
    const couriers = await this.prisma.user.findMany({
      where: {
        roles: {
          has: 'COURIER',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return couriers.map(PrismaCourierMapper.toDomain)
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({
      data,
    })
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    })
  }

  async delete(courier: Courier): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: courier.id.toString(),
      },
    })
  }
}
