import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouriersRepository } from '@/domain/core/application/repositories/courier-repository'
import { Courier } from '@/domain/core/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCourierMapper } from '../mappers/prisma-courier.mapper'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<Courier | null> {
    throw new Error('Method not implemented.')
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

  findMany(params: PaginationParams): Promise<Courier[]> {
    throw new Error('Method not implemented.')
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({
      data,
    })
  }

  save(courier: Courier): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(courier: Courier): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
